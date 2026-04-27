import { Shield, Anchor, Navigation } from 'lucide-react';
import { LayerControls } from './LayerControls';
import { useMaritimeStore } from '../../store/maritimeStore';
import { CHOKEPOINTS } from '../../data/chokepoints';
import { PIRACY_ZONES } from '../../data/piracyZones';

export function Sidebar() {
  const { sidebarOpen, vessels } = useMaritimeStore();

  if (!sidebarOpen) return null;

  const vesselArr = Array.from(vessels.values());
  const highRisk = PIRACY_ZONES.filter((z) => z.riskLevel === 'extreme' || z.riskLevel === 'high');

  return (
    <aside
      className="w-56 flex flex-col gap-5 p-3 border-r overflow-y-auto shrink-0"
      style={{ background: '#0a1628', borderColor: '#162b54' }}
    >
      {/* Layer controls */}
      <LayerControls />

      {/* Chokepoint status */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
          Chokepoints
        </p>
        <div className="flex flex-col gap-1">
          {CHOKEPOINTS.map((cp) => (
            <div key={cp.id} className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-300 truncate">{cp.name}</span>
              <span
                className={`ml-2 flex-shrink-0 font-medium ${
                  cp.riskLevel === 'high'
                    ? 'text-red-400'
                    : cp.riskLevel === 'medium'
                    ? 'text-amber-400'
                    : 'text-green-400'
                }`}
              >
                {cp.riskLevel.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* High-risk piracy zones */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1">
          <Shield size={11} /> Piracy Alerts
        </p>
        <div className="flex flex-col gap-1.5">
          {highRisk.map((z) => (
            <div
              key={z.id}
              className="rounded px-2 py-1.5 text-xs"
              style={{ background: '#1a0a0a', borderLeft: '2px solid #ef4444' }}
            >
              <p className="text-red-300 font-medium">{z.name}</p>
              <p className="text-slate-500 mt-0.5">{z.incidents} incidents · {z.region}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1">
          <Navigation size={11} /> Fleet Snapshot
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'Total', value: vesselArr.length, color: '#38bdf8' },
            { label: 'Underway', value: vesselArr.filter((v) => v.navStatus === 'underway').length, color: '#22c55e' },
            { label: 'Anchored', value: vesselArr.filter((v) => v.navStatus === 'anchored').length, color: '#f59e0b' },
            { label: 'Flagged', value: vesselArr.filter((v) => v.complianceStatus === 'non-compliant').length, color: '#ef4444' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded p-2 text-center"
              style={{ background: '#050d1a' }}
            >
              <p className="text-lg font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1">
          <Anchor size={11} /> Vessel Types
        </p>
        <div className="flex flex-col gap-1">
          {[
            { label: 'Cargo', color: '#0ea5e9' },
            { label: 'Tanker', color: '#f97316' },
            { label: 'Passenger', color: '#22c55e' },
            { label: 'Fishing', color: '#eab308' },
            { label: 'Military', color: '#ef4444' },
            { label: 'Tug / Other', color: '#a855f7' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
