import { Vessel } from '../types';
import { getVesselTypeFromCode, getNavStatusFromCode } from '../utils/vesselUtils';

// AISHub community aggregator — 1,200+ stations globally, free with registration
// Register at https://www.aishub.net to get your username
// API docs: https://www.aishub.net/api

interface AISHubVessel {
  MMSI: number;
  TIME: string;
  LONGITUDE: number;
  LATITUDE: number;
  COG: number;
  SOG: number;
  HEADING: number;
  NAVSTAT: number;
  IMO?: number;
  NAME?: string;
  CALLSIGN?: string;
  TYPE?: number;
  A?: number;
  B?: number;
  C?: number;
  D?: number;
  DRAUGHT?: number;
  DEST?: string;
  ETA?: string;
}

type OnVessel = (v: Vessel) => void;

function cleanName(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  return raw.replace(/[@_]+/g, ' ').replace(/\s+/g, ' ').trim() || undefined;
}

function parseHubVessel(raw: AISHubVessel): Vessel | null {
  if (!raw.LATITUDE || !raw.LONGITUDE) return null;
  const mmsi = String(raw.MMSI);
  const typeCode = raw.TYPE ?? 0;
  const length = (raw.A ?? 0) + (raw.B ?? 0) || undefined;
  const beam   = (raw.C ?? 0) + (raw.D ?? 0) || undefined;

  return {
    mmsi,
    name: cleanName(raw.NAME) || `Vessel ${mmsi}`,
    type: getVesselTypeFromCode(typeCode),
    typeCode,
    flag: '',
    flagCode: '',
    lat: raw.LATITUDE,
    lon: raw.LONGITUDE,
    speed: raw.SOG ?? 0,
    heading: raw.HEADING ?? raw.COG ?? 0,
    cog: raw.COG ?? 0,
    navStatus: getNavStatusFromCode(raw.NAVSTAT ?? 15),
    destination: cleanName(raw.DEST),
    callsign: raw.CALLSIGN?.trim(),
    imo: raw.IMO ? String(raw.IMO) : undefined,
    specs: {
      length,
      beam,
      draft: raw.DRAUGHT,
      imo: raw.IMO ? String(raw.IMO) : undefined,
    },
    eta: raw.ETA,
    lastUpdate: Date.now(),
  };
}

export class AISHubService {
  private username: string;
  private onVessel: OnVessel;
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;

  constructor(username: string, onVessel: OnVessel) {
    this.username = username;
    this.onVessel = onVessel;
  }

  async poll() {
    try {
      // Query all vessels updated in the last 2 minutes
      const url =
        `https://data.aishub.net/ws.php` +
        `?username=${this.username}&format=1&output=json&compress=0&interval=2`;

      const res = await fetch(url);
      if (!res.ok) return;

      const json = await res.json() as unknown;

      // AISHub returns [[{...}, ...]] — unwrap outer array if present
      const rows: AISHubVessel[] = Array.isArray(json)
        ? Array.isArray(json[0]) ? (json[0] as AISHubVessel[]) : (json as AISHubVessel[])
        : [];

      for (const row of rows) {
        const vessel = parseHubVessel(row);
        if (vessel) this.onVessel(vessel);
      }
    } catch {
      // Network / CORS errors — fail silently
    }
  }

  start(intervalMs = 60_000) {
    if (this.running) return;
    this.running = true;
    void this.poll();
    this.timer = setInterval(() => void this.poll(), intervalMs);
  }

  stop() {
    this.running = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
