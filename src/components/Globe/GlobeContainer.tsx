import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { useMaritimeStore } from '../../store/maritimeStore';
import { PORTS } from '../../data/ports';
import { CHOKEPOINTS } from '../../data/chokepoints';
import { ACCIDENTS } from '../../data/accidents';
import { HARBORS } from '../../data/harbors';
import { getVesselColorHex } from '../../utils/vesselUtils';
import type { Vessel, Port } from '../../types';

interface PointDatum {
  lat: number;
  lng: number;
  color: string;
  radius: number;
  altitude: number;
  label: string;
  kind: 'port' | 'vessel' | 'chokepoint';
  payload: Port | Vessel | (typeof CHOKEPOINTS)[number];
}

function tip(title: string, sub: string): string {
  return `<div style="background:#0a1628ee;border:1px solid #1e3a6e;padding:7px 11px;border-radius:6px;font-family:system-ui,sans-serif;pointer-events:none;white-space:nowrap">
    <b style="color:#e2e8f0;font-size:12px">${title}</b><br>
    <span style="color:#94a3b8;font-size:11px">${sub}</span>
  </div>`;
}

export function GlobeContainer() {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const { vessels, layers, selectVessel, selectPort, registerFlyTo } = useMaritimeStore();


  // Track container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setSize({ w: e.contentRect.width, h: e.contentRect.height })
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onGlobeReady = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;

    // Starting view — Atlantic / global
    globe.pointOfView({ lat: 20, lng: 15, altitude: 2.2 }, 0);

    // Orbit controls
    const ctrl = globe.controls();
    ctrl.autoRotate      = true;
    ctrl.autoRotateSpeed = 0.35;   // slow constant spin (~17 min/revolution)
    ctrl.enableZoom      = true;
    ctrl.enablePan       = false;
    ctrl.minDistance     = 105;    // max zoom-in
    ctrl.maxDistance     = 700;    // max zoom-out
    ctrl.rotateSpeed     = 0.6;
    ctrl.dampingFactor   = 0.08;
    ctrl.enableDamping   = true;
    ctrl.zoomSpeed       = 1.2;

    // Make ocean surfaces slightly shiny / specular
    const mat = globe.globeMaterial() as THREE.MeshPhongMaterial;
    mat.shininess = 55;
    mat.specular  = new THREE.Color(0x226699);

    // Register fly-to so search can animate the camera
    registerFlyTo((lat, lng) => {
      globe.controls().autoRotate = false;
      globe.pointOfView({ lat, lng, altitude: 1.0 }, 900);
    });
  }, [registerFlyTo]);

  // ── point data (memoised — only recomputes when data/layers actually change) ──

  const portPoints = useMemo<PointDatum[]>(() => {
    if (!layers.ports) return [];
    return PORTS.map((p) => ({
      lat: p.lat,
      lng: p.lon,
      color:
        p.status === 'congested'  ? '#f59e0b'
      : p.status === 'restricted' ? '#f97316'
      : p.status === 'closed'     ? '#ef4444'
      : '#38bdf8',
      radius:
        p.size === 'major' ? 0.50
      : p.size === 'large' ? 0.38
      : 0.27,
      altitude: 0.006,
      label: tip(p.name, `${p.country} · ${p.status}`),
      kind: 'port' as const,
      payload: p,
    }));
  }, [layers.ports]);

  const vesselPoints = useMemo<PointDatum[]>(() => {
    if (!layers.vessels) return [];
    const all = Array.from(vessels.values());
    // Cap at 12k for rendering — keep moving vessels + most-recently-updated
    const MAX = 12_000;
    const toRender = all.length > MAX
      ? all.sort((a, b) => b.speed - a.speed || b.lastUpdate - a.lastUpdate).slice(0, MAX)
      : all;
    return toRender.map((v) => ({
      lat: v.lat,
      lng: v.lon,
      color: v.complianceStatus === 'non-compliant' ? '#ef4444' : getVesselColorHex(v.type),
      radius: 0.22,
      altitude: 0.012,
      label: tip(v.name, `${v.type} · ${v.speed.toFixed(1)} kn · ${v.flag}`),
      kind: 'vessel' as const,
      payload: v,
    }));
  }, [vessels, layers.vessels]);

  const chokepointPoints = useMemo<PointDatum[]>(() => {
    if (!layers.chokepoints) return [];
    return CHOKEPOINTS.map((c) => ({
      lat: c.lat,
      lng: c.lon,
      color: c.riskLevel === 'high' ? '#ef4444' : '#f59e0b',
      radius: 0.34,
      altitude: 0.016,
      label: tip(c.name, `${c.dailyTransits} transits/day · ${c.riskLevel} risk`),
      kind: 'chokepoint' as const,
      payload: c,
    }));
  }, [layers.chokepoints]);

  const accidentPoints = useMemo<PointDatum[]>(() => {
    if (!layers.accidents) return [];
    return ACCIDENTS.map((a) => ({
      lat: a.lat,
      lng: a.lon,
      color: a.severity === 'major' ? '#f97316' : '#fbbf24',
      radius: a.severity === 'major' ? 0.30 : 0.22,
      altitude: 0.014,
      label: tip(a.name, `${a.type} · ${a.year}`),
      kind: 'chokepoint' as const,
      payload: a as unknown as (typeof CHOKEPOINTS)[number],
    }));
  }, [layers.accidents]);

  const harborPoints = useMemo<PointDatum[]>(() => {
    if (!layers.harbors) return [];
    return HARBORS.map((h) => ({
      lat: h.lat,
      lng: h.lon,
      color: '#06b6d4',
      radius: 0.18,
      altitude: 0.006,
      label: tip(h.name, `${h.country} · ${h.type}`),
      kind: 'port' as const,
      payload: h as unknown as Port,
    }));
  }, [layers.harbors]);

  const allPoints = useMemo(
    () => [...portPoints, ...vesselPoints, ...chokepointPoints, ...accidentPoints, ...harborPoints],
    [portPoints, vesselPoints, chokepointPoints, accidentPoints, harborPoints],
  );

  const onPointClick = useCallback(
    (point: object) => {
      const p = point as PointDatum;
      if (p.kind === 'vessel')    selectVessel(p.payload as Vessel);
      else if (p.kind === 'port') selectPort(p.payload as Port);
    },
    [selectVessel, selectPort]
  );

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', background: '#020810', overflow: 'hidden' }}
    >
      <Globe
        ref={globeRef}
        width={size.w}
        height={size.h}

        // Real Earth appearance
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

        // Stars in background
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="rgba(2,8,16,0)"

        // Atmospheric limb glow
        showAtmosphere
        atmosphereColor="#3a8fc4"
        atmosphereAltitude={0.18}

        onGlobeReady={onGlobeReady}

        // Points layer
        pointsData={allPoints}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="radius"
        pointAltitude="altitude"
        pointResolution={4}
        pointLabel="label"
        onPointClick={onPointClick}
        onPointHover={(pt) => {
          document.body.style.cursor = pt ? 'pointer' : 'default';
        }}
      />
    </div>
  );
}
