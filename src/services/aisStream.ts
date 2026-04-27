import { Vessel } from '../types';
import { getVesselTypeFromCode, getNavStatusFromCode, getFlagFromMMSI } from '../utils/vesselUtils';

type MessageHandler = (vessel: Vessel) => void;
type StatusHandler = (status: 'connecting' | 'live' | 'disconnected') => void;

interface AISPositionReport {
  Cog: number;
  Sog: number;
  TrueHeading: number;
  NavigationalStatus: number;
  Longitude: number;
  Latitude: number;
}

interface AISShipStaticData {
  ImoNumber?: number;
  CallSign?: string;
  Name?: string;
  Type?: number;
  MaximumStaticDraught?: number;
  Destination?: string;
  Eta?: { Month: number; Day: number; Hour: number; Minute: number };
  Dimension?: { A: number; B: number; C: number; D: number };
}

interface AISMessage {
  MessageType: string;
  MetaData: {
    MMSI: number;
    ShipName: string;
    latitude: number;
    longitude: number;
    time_utc: string;
  };
  Message: {
    PositionReport?: AISPositionReport;
    ShipStaticData?: AISShipStaticData;
  };
}

export class AISStreamService {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private onVessel: MessageHandler;
  private onStatus: StatusHandler;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true;
  private reconnectDelay = 5000;

  constructor(apiKey: string, onVessel: MessageHandler, onStatus: StatusHandler) {
    this.apiKey = apiKey;
    this.onVessel = onVessel;
    this.onStatus = onStatus;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    this.onStatus('connecting');

    this.ws = new WebSocket('wss://stream.aisstream.io/v0/stream');

    this.ws.onopen = () => {
      this.ws!.send(
        JSON.stringify({
          APIKey: this.apiKey,
          BoundingBoxes: [[[-90, -180], [90, 180]]],
          FilterMessageTypes: ['PositionReport', 'ShipStaticData'],
        })
      );
      this.onStatus('live');
      this.reconnectDelay = 5000;
    };

    this.ws.onmessage = (event) => {
      try {
        const msg: AISMessage = JSON.parse(event.data as string);
        const vessel = this.parseMessage(msg);
        if (vessel) this.onVessel(vessel);
      } catch {
        // malformed message — skip
      }
    };

    this.ws.onclose = () => {
      this.onStatus('disconnected');
      if (this.shouldReconnect) {
        this.reconnectTimer = setTimeout(() => {
          this.reconnectDelay = Math.min(this.reconnectDelay * 2, 60_000);
          this.connect();
        }, this.reconnectDelay);
      }
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  private cleanName(raw: string | undefined): string | undefined {
    if (!raw) return undefined;
    // AIS names are padded with @ and sometimes use _ instead of space
    return raw.replace(/[@_]+/g, ' ').replace(/\s+/g, ' ').trim() || undefined;
  }

  private parseMessage(msg: AISMessage): Vessel | null {
    const meta = msg.MetaData;
    const mmsi = String(meta.MMSI);
    const { flag, flagCode } = getFlagFromMMSI(mmsi);

    if (msg.MessageType === 'PositionReport' && msg.Message.PositionReport) {
      const pr = msg.Message.PositionReport;
      const typeCode = 0;
      return {
        mmsi,
        name: this.cleanName(meta.ShipName) || `Vessel ${mmsi}`,
        type: getVesselTypeFromCode(typeCode),
        typeCode,
        flag,
        flagCode,
        lat: pr.Latitude ?? meta.latitude,
        lon: pr.Longitude ?? meta.longitude,
        speed: pr.Sog ?? 0,
        heading: pr.TrueHeading ?? pr.Cog ?? 0,
        cog: pr.Cog ?? 0,
        navStatus: getNavStatusFromCode(pr.NavigationalStatus),
        lastUpdate: Date.now(),
      };
    }

    if (msg.MessageType === 'ShipStaticData' && msg.Message.ShipStaticData) {
      const sd = msg.Message.ShipStaticData;
      const typeCode = sd.Type ?? 0;
      const dim = sd.Dimension;
      return {
        mmsi,
        name: this.cleanName(sd.Name) || this.cleanName(meta.ShipName) || `Vessel ${mmsi}`,
        type: getVesselTypeFromCode(typeCode),
        typeCode,
        flag,
        flagCode,
        lat: meta.latitude,
        lon: meta.longitude,
        speed: 0,
        heading: 0,
        cog: 0,
        navStatus: 'unknown',
        destination: sd.Destination?.trim(),
        callsign: sd.CallSign?.trim(),
        imo: sd.ImoNumber ? String(sd.ImoNumber) : undefined,
        specs: {
          draft: sd.MaximumStaticDraught,
          length: dim ? dim.A + dim.B : undefined,
          beam: dim ? dim.C + dim.D : undefined,
          imo: sd.ImoNumber ? String(sd.ImoNumber) : undefined,
        },
        lastUpdate: Date.now(),
      };
    }

    return null;
  }
}
