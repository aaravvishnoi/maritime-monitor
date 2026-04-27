import { Vessel } from '../types';
import { getVesselTypeFromCode, getNavStatusFromCode } from '../utils/vesselUtils';

// DataDocked — satellite AIS global coverage
// GET https://datadocked.com/api/vessels_operations/get-vessels-by-area
//   ?latitude=<center_lat>&longitude=<center_lon>&circle_radius=<km, max 100>
// Auth: x-api-key header  |  Cost: 10 credits per call

interface DataDockedVessel {
  mmsi: string | number;
  imo?: string;
  name?: string;
  callsign?: string;
  vessel_type?: number;
  type_id?: number;
  flag?: string;
  latitude: string | number;   // returned as strings
  longitude: string | number;
  speed?: string | number | null;
  course?: string | number | null;
  heading?: string | number | null;
  nav_status?: number | null;
  destination?: string;
  eta?: string;
  length?: number;
  beam?: number;
  draught?: number;
}

type OnVessel = (v: Vessel) => void;

function num(v: string | number | null | undefined): number {
  if (v == null) return 0;
  const n = parseFloat(String(v));
  return isNaN(n) ? 0 : n;
}

function cleanName(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  return raw.replace(/[@_]+/g, ' ').replace(/\s+/g, ' ').trim() || undefined;
}

function parseVessel(raw: DataDockedVessel): Vessel | null {
  const lat = num(raw.latitude);
  const lon = num(raw.longitude);
  if (!lat && !lon) return null;

  const mmsi = String(raw.mmsi);
  const typeCode = raw.vessel_type ?? raw.type_id ?? 0;
  const course = num(raw.course);
  const heading = num(raw.heading) || course;

  return {
    mmsi,
    name: cleanName(raw.name) || `Vessel ${mmsi}`,
    type: getVesselTypeFromCode(typeCode),
    typeCode,
    flag: raw.flag ?? '',
    flagCode: raw.flag ?? '',
    lat,
    lon,
    speed: num(raw.speed),
    heading,
    cog: course,
    navStatus: getNavStatusFromCode(raw.nav_status ?? 15),
    destination: cleanName(raw.destination),
    callsign: raw.callsign?.trim(),
    imo: raw.imo,
    specs: {
      length: raw.length,
      beam: raw.beam,
      draft: raw.draught,
      imo: raw.imo,
    },
    eta: raw.eta,
    lastUpdate: Date.now(),
  };
}

// Key shipping hubs — 100 km radius each, ordered by global traffic volume
const SHIPPING_HUBS: Array<{ name: string; lat: number; lon: number }> = [
  { name: 'Singapore Strait',    lat:  1.2,  lon: 104.0 },
  { name: 'English Channel',     lat: 50.5,  lon:   1.5 },
  { name: 'Strait of Malacca',   lat:  4.0,  lon: 100.5 },
  { name: 'Suez Canal',          lat: 30.0,  lon:  32.5 },
  { name: 'Strait of Hormuz',    lat: 26.3,  lon:  56.4 },
  { name: 'Gulf of Aden',        lat: 11.5,  lon:  43.5 },
  { name: 'Rotterdam',           lat: 51.9,  lon:   4.1 },
  { name: 'New York Approach',   lat: 40.5,  lon: -73.5 },
  { name: 'Shanghai Approach',   lat: 31.0,  lon: 122.5 },
  { name: 'Gulf of Mexico',      lat: 25.0,  lon: -90.0 },
];

export class DataDockedService {
  private apiKey: string;
  private onVessel: OnVessel;
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;
  private hubIndex = 0;

  private readonly BASE = 'https://datadocked.com/api/vessels_operations';

  constructor(apiKey: string, onVessel: OnVessel) {
    this.apiKey = apiKey;
    this.onVessel = onVessel;
  }

  private async fetchHub(lat: number, lon: number, name: string): Promise<void> {
    try {
      const url =
        `${this.BASE}/get-vessels-by-area` +
        `?latitude=${lat}&longitude=${lon}&circle_radius=100`;

      const res = await fetch(url, {
        headers: { 'x-api-key': this.apiKey },
      });

      if (!res.ok) {
        console.warn(`[DataDocked] ${name}: HTTP ${res.status}`);
        return;
      }

      const rows = await res.json() as DataDockedVessel[];
      if (!Array.isArray(rows)) return;

      let count = 0;
      for (const row of rows) {
        const vessel = parseVessel(row);
        if (vessel) { this.onVessel(vessel); count++; }
      }
      console.info(`[DataDocked] ${name}: ${count} vessels`);
    } catch (err) {
      console.warn('[DataDocked] fetch error:', err);
    }
  }

  // Poll one hub per interval to spread credit usage over time
  async pollNext(): Promise<void> {
    if (!this.running) return;
    const hub = SHIPPING_HUBS[this.hubIndex % SHIPPING_HUBS.length];
    this.hubIndex++;
    await this.fetchHub(hub.lat, hub.lon, hub.name);
  }

  start(intervalMs = 10 * 60 * 1_000): void {  // one hub every 10 min
    if (this.running) return;
    this.running = true;
    // Fetch the busiest hub immediately on start
    void this.fetchHub(
      SHIPPING_HUBS[0].lat,
      SHIPPING_HUBS[0].lon,
      SHIPPING_HUBS[0].name
    );
    this.timer = setInterval(() => void this.pollNext(), intervalMs);
  }

  stop(): void {
    this.running = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
