import { useState, useCallback } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, PathLayer, PolygonLayer, TextLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMaritimeStore } from '../../store/maritimeStore';
import { PORTS } from '../../data/ports';
import { CHOKEPOINTS } from '../../data/chokepoints';
import { PIRACY_ZONES } from '../../data/piracyZones';
import { SHIPPING_LANES } from '../../data/shippingLanes';
import { MPAS } from '../../data/mpas';
import { ACCIDENTS } from '../../data/accidents';
import { HARBORS } from '../../data/harbors';
import { OCEAN_LABELS } from '../../data/oceanLabels';
import { getVesselColor } from '../../utils/vesselUtils';
import { Vessel, Port } from '../../types';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const INITIAL_VIEW_STATE = {
  longitude: 15,
  latitude: 20,
  zoom: 2.2,
  pitch: 0,
  bearing: 0,
};

export function MapContainer() {
  const { vessels, layers, selectVessel, selectPort, selectedVessel, selectedPort } = useMaritimeStore();
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const vesselArray = Array.from(vessels.values());

  const onViewStateChange = useCallback(({ viewState: vs }: { viewState: typeof INITIAL_VIEW_STATE }) => {
    setViewState(vs);
  }, []);

  const deckLayers = [
    layers.shippingLanes &&
      new PathLayer({
        id: 'shipping-lanes',
        data: SHIPPING_LANES,
        getPath: (d) => d.path as [number, number][],
        getColor: (d) => (d.type === 'major' ? [14, 165, 233, 55] : [14, 165, 233, 28]),
        getWidth: (d) => (d.type === 'major' ? 2 : 1),
        widthUnits: 'pixels',
        pickable: false,
      }),

    layers.mpas &&
      new PolygonLayer({
        id: 'mpas',
        data: MPAS,
        getPolygon: (d) => d.coordinates as [number, number][],
        getFillColor: [34, 197, 94, 35],
        getLineColor: [34, 197, 94, 180],
        getLineWidth: 1.5,
        lineWidthUnits: 'pixels',
        stroked: true,
        filled: true,
        pickable: false,
      }),

    layers.piracyZones &&
      new PolygonLayer({
        id: 'piracy-zones',
        data: PIRACY_ZONES,
        getPolygon: (d) => d.coordinates as [number, number][],
        getFillColor: (d) => {
          const a = d.riskLevel === 'extreme' ? 70 : d.riskLevel === 'high' ? 50 : 30;
          return [239, 68, 68, a];
        },
        getLineColor: [239, 68, 68, 160],
        getLineWidth: 1,
        lineWidthUnits: 'pixels',
        stroked: true,
        filled: true,
        pickable: true,
      }),

    layers.trafficDensity && vesselArray.length > 0 &&
      new HeatmapLayer<Vessel>({
        id: 'traffic-density',
        data: vesselArray,
        getPosition: (d) => [d.lon, d.lat],
        getWeight: (d) => Math.max(d.speed, 1),
        radiusPixels: 40,
        intensity: 1,
        threshold: 0.05,
        colorRange: [
          [0, 25, 100, 0],
          [14, 165, 233, 80],
          [99, 102, 241, 140],
          [139, 92, 246, 180],
          [168, 85, 247, 220],
          [217, 70, 239, 255],
        ],
      }),

    layers.accidents &&
      new ScatterplotLayer<typeof ACCIDENTS[number]>({
        id: 'accidents',
        data: ACCIDENTS,
        getPosition: (d) => [d.lon, d.lat],
        getRadius: (d) => (d.severity === 'major' ? 9 : 6),
        getFillColor: (d) =>
          d.severity === 'major' ? [249, 115, 22, 230] : [251, 191, 36, 200],
        getLineColor: [255, 255, 255, 120],
        lineWidthMinPixels: 1,
        stroked: true,
        radiusUnits: 'pixels',
        pickable: false,
      }),

    layers.harbors &&
      new ScatterplotLayer<typeof HARBORS[number]>({
        id: 'harbors',
        data: HARBORS,
        getPosition: (d) => [d.lon, d.lat],
        getRadius: 5,
        getFillColor: [6, 182, 212, 200],
        getLineColor: [255, 255, 255, 80],
        lineWidthMinPixels: 1,
        stroked: true,
        radiusUnits: 'pixels',
        pickable: false,
      }),

    layers.ports &&
      new ScatterplotLayer<Port>({
        id: 'ports',
        data: PORTS,
        getPosition: (d) => [d.lon, d.lat],
        getRadius: (d) => (d.size === 'major' ? 10 : d.size === 'large' ? 7 : 5),
        getFillColor: (d) => {
          if (selectedPort?.id === d.id) return [255, 255, 255, 255];
          if (d.status === 'congested') return [251, 191, 36, 210];
          if (d.status === 'restricted') return [239, 68, 68, 210];
          return [56, 189, 248, 200];
        },
        getLineColor: [255, 255, 255, 80],
        lineWidthMinPixels: 1,
        stroked: true,
        radiusUnits: 'pixels',
        pickable: true,
        onClick: ({ object }) => object && selectPort(object),
        updateTriggers: { getFillColor: [selectedPort?.id] },
      }),

    layers.chokepoints &&
      new ScatterplotLayer({
        id: 'chokepoints',
        data: CHOKEPOINTS,
        getPosition: (d) => [d.lon, d.lat],
        getRadius: 7,
        getFillColor: (d) =>
          d.riskLevel === 'high' ? [239, 68, 68, 220] : [251, 191, 36, 220],
        getLineColor: [255, 255, 255, 180],
        lineWidthMinPixels: 1.5,
        stroked: true,
        radiusUnits: 'pixels',
        pickable: false,
      }),

    layers.vessels &&
      new ScatterplotLayer<Vessel>({
        id: 'vessels',
        data: vesselArray,
        getPosition: (d) => [d.lon, d.lat],
        getRadius: (d) => (d.speed < 0.5 ? 5 : 4),
        getFillColor: (d) => {
          if (selectedVessel?.mmsi === d.mmsi) return [255, 255, 255, 255];
          if (d.complianceStatus === 'non-compliant') return [239, 68, 68, 255];
          return getVesselColor(d.type);
        },
        getLineColor: (d) =>
          selectedVessel?.mmsi === d.mmsi ? [14, 165, 233, 255] : [255, 255, 255, 60],
        lineWidthMinPixels: 1,
        stroked: true,
        radiusUnits: 'pixels',
        pickable: true,
        onClick: ({ object }) => object && selectVessel(object),
        updateTriggers: {
          getFillColor: [selectedVessel?.mmsi],
          getLineColor: [selectedVessel?.mmsi],
        },
      }),

    layers.oceanLabels &&
      new TextLayer<typeof OCEAN_LABELS[number]>({
        id: 'ocean-labels',
        data: OCEAN_LABELS,
        getPosition: (d) => [d.lon, d.lat],
        getText: (d) => d.name,
        getSize: (d) => (d.type === 'ocean' ? 14 : d.type === 'continent' ? 13 : 10),
        getColor: (d) =>
          d.type === 'ocean' || d.type === 'sea' || d.type === 'gulf'
            ? [148, 163, 184, 180]
            : [203, 213, 225, 200],
        getAngle: 0,
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 600,
        pickable: false,
        sizeUnits: 'pixels',
        sizeMinPixels: 8,
        sizeMaxPixels: 18,
      }),
  ].filter(Boolean);

  return (
    <DeckGL
      viewState={viewState}
      onViewStateChange={onViewStateChange as Parameters<typeof DeckGL>[0]['onViewStateChange']}
      controller
      layers={deckLayers}
      getCursor={({ isDragging, isHovering }) =>
        isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab'
      }
      onClick={({ object }) => {
        if (!object) {
          selectVessel(null);
          selectPort(null);
        }
      }}
    >
      <Map mapStyle={MAP_STYLE} reuseMaps />
    </DeckGL>
  );
}
