import { formatDistanceToNow, parseISO } from 'date-fns';

export function formatSpeed(knots: number): string {
  return `${knots.toFixed(1)} kn`;
}

export function formatHeading(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return `${Math.round(degrees)}° ${dirs[index]}`;
}

export function formatCoords(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir} ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}

export function formatTEU(teu: number): string {
  if (teu >= 1_000_000) return `${(teu / 1_000_000).toFixed(1)}M TEU/yr`;
  if (teu >= 1_000) return `${(teu / 1_000).toFixed(0)}K TEU/yr`;
  return `${teu} TEU/yr`;
}

export function formatTonnage(gt: number): string {
  if (gt >= 1_000_000) return `${(gt / 1_000_000).toFixed(2)}M GT`;
  if (gt >= 1_000) return `${(gt / 1_000).toFixed(0)}K GT`;
  return `${gt} GT`;
}

export function formatLastUpdate(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

export function formatETA(isoString: string): string {
  try {
    const date = parseISO(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return isoString;
  }
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

export function formatVesselDimensions(length?: number, beam?: number): string {
  if (!length && !beam) return '—';
  if (length && beam) return `${length}m × ${beam}m`;
  if (length) return `${length}m`;
  return `${beam}m beam`;
}
