import { Vessel } from '../types';
import { getVesselTypeFromCode, getNavStatusFromCode, getFlagFromMMSI } from '../utils/vesselUtils';

// Compact vessel shape the relay server emits
interface RelayVessel {
  mmsi: string;
  name?: string;
  lat?: number;
  lon?: number;
  speed?: number;
  heading?: number;
  cog?: number;
  typeCode?: number;
  navStatus?: number;
  destination?: string;
  callsign?: string;
  imo?: string;
  length?: number;
  beam?: number;
  draft?: number;
  lastUpdate?: number;
}

type OnBatch  = (vessels: Vessel[]) => void;
type OnStatus = (s: 'connecting' | 'live' | 'disconnected') => void;

function toVessel(r: RelayVessel): Vessel | null {
  if (!r.lat || !r.lon) return null;
  const { flag, flagCode } = getFlagFromMMSI(r.mmsi);
  const typeCode = r.typeCode ?? 0;
  return {
    mmsi: r.mmsi,
    name: r.name || `Vessel ${r.mmsi}`,
    type: getVesselTypeFromCode(typeCode),
    typeCode,
    flag,
    flagCode,
    lat: r.lat,
    lon: r.lon,
    speed: r.speed ?? 0,
    heading: r.heading ?? 0,
    cog: r.cog ?? 0,
    navStatus: getNavStatusFromCode(r.navStatus ?? 15),
    destination: r.destination,
    callsign: r.callsign,
    imo: r.imo,
    specs: {
      length: r.length,
      beam: r.beam,
      draft: r.draft,
      imo: r.imo,
    },
    lastUpdate: r.lastUpdate ?? Date.now(),
  };
}

const FLUSH_MS = 2_000; // batch window — one store update every 2 seconds

export class RelayService {
  private ws: WebSocket | null = null;
  private onBatch: OnBatch;
  private onStatus: OnStatus;
  private shouldReconnect = true;
  private reconnectDelay = 3_000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private buffer: Vessel[] = [];

  readonly relayUrl: string;

  constructor(
    onBatch: OnBatch,
    onStatus: OnStatus,
    relayUrl = 'ws://localhost:3100',
  ) {
    this.onBatch = onBatch;
    this.onStatus = onStatus;
    this.relayUrl = relayUrl;
  }

  private flush() {
    if (this.buffer.length === 0) return;
    this.onBatch(this.buffer);
    this.buffer = [];
  }

  connect() {
    this.onStatus('connecting');
    this.ws = new WebSocket(this.relayUrl);

    this.flushTimer = setInterval(() => this.flush(), FLUSH_MS);

    this.ws.onopen = () => {
      this.onStatus('live');
      this.reconnectDelay = 3_000;
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as
          | { type: 'snapshot'; vessels: RelayVessel[] }
          | { type: 'vessel';   vessel:  RelayVessel };

        if (msg.type === 'snapshot') {
          // Snapshot goes directly — no point deferring the initial load
          const batch: Vessel[] = [];
          for (const r of msg.vessels) {
            const v = toVessel(r);
            if (v) batch.push(v);
          }
          if (batch.length) this.onBatch(batch);
        } else if (msg.type === 'vessel') {
          const v = toVessel(msg.vessel);
          if (v) this.buffer.push(v);
        }
      } catch { /* skip malformed */ }
    };

    this.ws.onclose = () => {
      this.flush();
      this.onStatus('disconnected');
      if (this.shouldReconnect) {
        this.reconnectTimer = setTimeout(() => {
          this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30_000);
          this.connect();
        }, this.reconnectDelay);
      }
    };

    this.ws.onerror = () => this.ws?.close();
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.flushTimer) clearInterval(this.flushTimer);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }
}
