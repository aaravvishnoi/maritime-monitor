import { useMaritimeStore } from '../../store/maritimeStore';

export function StatusBar() {
  const { vessels } = useMaritimeStore();
  const all = Array.from(vessels.values());

  const counts = {
    cargo: all.filter((v) => v.type === 'cargo').length,
    tanker: all.filter((v) => v.type === 'tanker').length,
    passenger: all.filter((v) => v.type === 'passenger').length,
    fishing: all.filter((v) => v.type === 'fishing').length,
    other: all.filter((v) => !['cargo', 'tanker', 'passenger', 'fishing'].includes(v.type)).length,
  };

  const underway = all.filter((v) => v.navStatus === 'underway').length;
  const anchored = all.filter((v) => v.navStatus === 'anchored').length;
  const flagged = all.filter((v) => v.complianceStatus === 'non-compliant').length;

  return (
    <div
      className="flex items-center gap-6 px-4 h-8 text-xs border-t shrink-0"
      style={{ background: '#050d1a', borderColor: '#0f2040', color: '#64748b' }}
    >
      <span className="text-sky-400 font-medium">{all.length} vessels</span>
      <span>Cargo: {counts.cargo}</span>
      <span>Tanker: {counts.tanker}</span>
      <span>Passenger: {counts.passenger}</span>
      <span>Fishing: {counts.fishing}</span>
      <span>Other: {counts.other}</span>
      <span className="ml-auto">Underway: {underway}</span>
      <span>Anchored: {anchored}</span>
      {flagged > 0 && <span className="text-red-400">Non-compliant: {flagged}</span>}
    </div>
  );
}
