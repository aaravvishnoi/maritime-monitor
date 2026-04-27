export type VesselType =
  | 'cargo'
  | 'tanker'
  | 'passenger'
  | 'fishing'
  | 'military'
  | 'tug'
  | 'pleasure'
  | 'unknown';

export type NavStatus =
  | 'underway'
  | 'anchored'
  | 'not-under-command'
  | 'restricted-maneuverability'
  | 'moored'
  | 'aground'
  | 'unknown';

export interface VesselSpecs {
  length?: number;
  beam?: number;
  draft?: number;
  grossTonnage?: number;
  deadweightTonnage?: number;
  built?: number;
  imo?: string;
}

export interface PortCall {
  port: string;
  country: string;
  eta?: string;
  type: 'previous' | 'next';
}

export interface Vessel {
  mmsi: string;
  name: string;
  type: VesselType;
  typeCode: number;
  flag: string;
  flagCode: string;
  lat: number;
  lon: number;
  speed: number;
  heading: number;
  cog: number;
  navStatus: NavStatus;
  eta?: string;
  destination?: string;
  callsign?: string;
  imo?: string;
  specs?: VesselSpecs;
  portCalls?: PortCall[];
  rating?: number;
  lastUpdate: number;
  complianceStatus?: 'compliant' | 'watch' | 'non-compliant';
}

export type PortType = 'commercial' | 'military' | 'fishing' | 'mixed';
export type PortSize = 'major' | 'large' | 'medium' | 'small';

export interface Port {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  size: PortSize;
  type: PortType;
  unlocode?: string;
  annualTEU?: number;
  status: 'open' | 'congested' | 'closed' | 'restricted';
}

export interface Chokepoint {
  id: string;
  name: string;
  lat: number;
  lon: number;
  importance: 'critical' | 'major';
  dailyTransits: number;
  riskLevel: 'low' | 'medium' | 'high';
  notes: string;
}

export type RiskLevel = 'extreme' | 'high' | 'medium' | 'low';

export interface PiracyZone {
  id: string;
  name: string;
  region: string;
  riskLevel: RiskLevel;
  coordinates: [number, number][];
  incidents?: number;
  notes: string;
}

export interface ShippingLane {
  id: string;
  name: string;
  type: 'major' | 'secondary';
  path: [number, number][];
  dailyVessels?: number;
}

export interface MaritimeNews {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: 'incident' | 'regulation' | 'trade' | 'environment' | 'piracy' | 'general';
  publishedAt: string;
  url?: string;
}

export interface MPA {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number][];
  areaSqKm?: number;
  type: 'national-park' | 'reserve' | 'sanctuary' | 'protected-zone';
}

export interface Accident {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: 'collision' | 'grounding' | 'fire' | 'sinking' | 'structural';
  severity: 'major' | 'minor' | 'incident';
  year: number;
  description: string;
}

export interface Harbor {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  type: 'fishing' | 'yacht' | 'ferry' | 'naval' | 'mixed';
}

export interface OceanLabel {
  name: string;
  lat: number;
  lon: number;
  type: 'ocean' | 'sea' | 'continent' | 'gulf' | 'strait';
}

export interface LayerVisibility {
  vessels: boolean;
  ports: boolean;
  shippingLanes: boolean;
  piracyZones: boolean;
  trafficDensity: boolean;
  chokepoints: boolean;
  mpas: boolean;
  accidents: boolean;
  harbors: boolean;
  oceanLabels: boolean;
}
