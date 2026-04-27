import { X, Anchor } from 'lucide-react';
import { useMaritimeStore } from '../../store/maritimeStore';
import { formatTEU, formatCoords } from '../../utils/formatters';

export function PortDetailPanel() {
  const { selectedPort, selectPort } = useMaritimeStore();
  if (!selectedPort) return null;

  const p = selectedPort;

  const statusColor =
    p.status === 'open'
      ? '#22c55e'
      : p.status === 'congested'
      ? '#f59e0b'
      : p.status === 'restricted'
      ? '#f97316'
      : '#ef4444';

  const sizeLabel = p.size.charAt(0).toUpperCase() + p.size.slice(1);

  return (
    <div
      className="w-72 flex flex-col border-l overflow-y-auto shrink-0"
      style={{ background: '#0a1628', borderColor: '#162b54' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3 border-b" style={{ borderColor: '#162b54' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Anchor size={12} className="text-sky-400" />
            <span className="text-xs text-slate-400">{sizeLabel} Port · {p.type}</span>
          </div>
          <h2 className="text-white font-semibold text-base leading-tight">{p.name}</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            {p.country} {p.countryCode && `(${p.countryCode})`}
            {p.unlocode && ` · ${p.unlocode}`}
          </p>
        </div>
        <button onClick={() => selectPort(null)} className="text-slate-500 hover:text-white p-1 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Details</p>
          <div className="flex flex-col gap-1">
            <Row
              label="Status"
              value={
                <span className="font-medium capitalize" style={{ color: statusColor }}>
                  {p.status}
                </span>
              }
            />
            <Row label="Type" value={<span className="capitalize">{p.type}</span>} />
            <Row label="Size" value={sizeLabel} />
            <Row label="Position" value={formatCoords(p.lat, p.lon)} />
            {p.annualTEU && (
              <Row label="Throughput" value={formatTEU(p.annualTEU)} />
            )}
          </div>
        </div>

        <div
          className="rounded p-3 text-xs text-slate-400"
          style={{ background: '#050d1a' }}
        >
          <p>Click on vessels near this port to view details. Live port call data requires AIS connection.</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200 text-right">{value}</span>
    </div>
  );
}
