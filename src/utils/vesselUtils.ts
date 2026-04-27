import { Vessel, VesselType, NavStatus } from '../types';

export function getVesselTypeFromCode(typeCode: number): VesselType {
  if (typeCode === 30) return 'fishing';
  if (typeCode >= 31 && typeCode <= 33) return 'tug';
  if (typeCode === 35 || typeCode === 36) return 'military';
  if (typeCode === 37) return 'pleasure';
  if (typeCode >= 60 && typeCode <= 69) return 'passenger';
  if (typeCode >= 70 && typeCode <= 79) return 'cargo';
  if (typeCode >= 80 && typeCode <= 89) return 'tanker';
  if (typeCode >= 50 && typeCode <= 59) return 'tug';
  return 'unknown';
}

export function getNavStatusFromCode(code: number): NavStatus {
  switch (code) {
    case 0: return 'underway';
    case 1: return 'anchored';
    case 2: return 'not-under-command';
    case 3: return 'restricted-maneuverability';
    case 5: return 'moored';
    case 6: return 'aground';
    default: return 'unknown';
  }
}

export function getFlagFromMMSI(mmsi: string): { flag: string; flagCode: string } {
  const prefix = parseInt(mmsi.substring(0, 3));
  const lookup: Record<number, { flag: string; flagCode: string }> = {
    211: { flag: 'Germany', flagCode: 'DE' },
    219: { flag: 'Denmark', flagCode: 'DK' },
    229: { flag: 'Greece', flagCode: 'GR' },
    232: { flag: 'United Kingdom', flagCode: 'GB' },
    244: { flag: 'Netherlands', flagCode: 'NL' },
    255: { flag: 'Malta', flagCode: 'MT' },
    257: { flag: 'Norway', flagCode: 'NO' },
    311: { flag: 'Bahamas', flagCode: 'BS' },
    338: { flag: 'USA', flagCode: 'US' },
    352: { flag: 'Panama', flagCode: 'PA' },
    355: { flag: 'Panama', flagCode: 'PA' },
    416: { flag: 'Taiwan', flagCode: 'TW' },
    470: { flag: 'UAE', flagCode: 'AE' },
    477: { flag: 'Hong Kong', flagCode: 'HK' },
    525: { flag: 'Indonesia', flagCode: 'ID' },
    563: { flag: 'Singapore', flagCode: 'SG' },
    566: { flag: 'Singapore', flagCode: 'SG' },
    636: { flag: 'Liberia', flagCode: 'LR' },
    657: { flag: 'Nigeria', flagCode: 'NG' },
  };
  return lookup[prefix] ?? { flag: 'Unknown', flagCode: 'XX' };
}

export function getVesselColor(type: VesselType): [number, number, number, number] {
  switch (type) {
    case 'cargo':     return [14, 165, 233, 230];   // ocean blue
    case 'tanker':    return [249, 115, 22, 230];   // orange
    case 'passenger': return [34, 197, 94, 230];    // green
    case 'fishing':   return [234, 179, 8, 230];    // yellow
    case 'military':  return [239, 68, 68, 230];    // red
    case 'tug':       return [168, 85, 247, 230];   // purple
    case 'pleasure':  return [20, 184, 166, 230];   // teal
    default:          return [148, 163, 184, 200];  // slate
  }
}

export function getVesselColorHex(type: VesselType): string {
  switch (type) {
    case 'cargo':     return '#0ea5e9';
    case 'tanker':    return '#f97316';
    case 'passenger': return '#22c55e';
    case 'fishing':   return '#eab308';
    case 'military':  return '#ef4444';
    case 'tug':       return '#a855f7';
    case 'pleasure':  return '#14b8a6';
    default:          return '#94a3b8';
  }
}

export function getNavStatusLabel(status: NavStatus): string {
  switch (status) {
    case 'underway':                  return 'Underway';
    case 'anchored':                  return 'At Anchor';
    case 'not-under-command':         return 'Not Under Command';
    case 'restricted-maneuverability':return 'Restricted Maneuverability';
    case 'moored':                    return 'Moored';
    case 'aground':                   return 'Aground';
    default:                          return 'Unknown';
  }
}

export function isVesselStale(vessel: Vessel, maxAgeMs = 300_000): boolean {
  return Date.now() - vessel.lastUpdate > maxAgeMs;
}

export function vesselTypeLabel(type: VesselType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
