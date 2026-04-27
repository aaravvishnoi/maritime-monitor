import { X, Navigation, Flag, Clock, Ship, Star, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { useMaritimeStore } from '../../store/maritimeStore';
import { getVesselColorHex, getNavStatusLabel, vesselTypeLabel } from '../../utils/vesselUtils';
import { formatSpeed, formatHeading, formatCoords, formatLastUpdate, formatETA, formatVesselDimensions, formatTonnage } from '../../utils/formatters';

export function VesselDetailPanel() {
  const { selectedVessel, selectVessel } = useMaritimeStore();
  if (!selectedVessel) return null;

  const v = selectedVessel;
  const typeColor = getVesselColorHex(v.type);

  const ComplianceIcon =
    v.complianceStatus === 'compliant'
      ? ShieldCheck
      : v.complianceStatus === 'watch'
      ? ShieldAlert
      : ShieldX;

  const complianceColor =
    v.complianceStatus === 'compliant'
      ? '#22c55e'
      : v.complianceStatus === 'watch'
      ? '#f59e0b'
      : '#ef4444';

  return (
    <div
      className="w-72 flex flex-col border-l overflow-y-auto shrink-0"
      style={{ background: '#0a1628', borderColor: '#162b54' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3 border-b" style={{ borderColor: '#162b54' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: typeColor }} />
            <span className="text-xs text-slate-400">{vesselTypeLabel(v.type)}</span>
          </div>
          <h2 className="text-white font-semibold text-base leading-tight">{v.name}</h2>
          <p className="text-slate-500 text-xs mt-0.5">MMSI {v.mmsi}{v.imo && ` · IMO ${v.imo}`}</p>
        </div>
        <button onClick={() => selectVessel(null)} className="text-slate-500 hover:text-white p-1 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* Status */}
        <Section label="Status">
          <Row label="Nav Status" value={getNavStatusLabel(v.navStatus)} />
          <Row label="Speed" value={formatSpeed(v.speed)} />
          <Row label="Heading" value={formatHeading(v.heading)} />
          <Row label="Position" value={formatCoords(v.lat, v.lon)} />
          <Row label="Last Update" value={formatLastUpdate(v.lastUpdate)} />
        </Section>

        {/* Identity */}
        <Section label="Identity">
          <Row
            label="Flag"
            value={
              <span className="flex items-center gap-1">
                <Flag size={11} className="text-slate-400" />
                {v.flag} ({v.flagCode})
              </span>
            }
          />
          {v.callsign && <Row label="Callsign" value={v.callsign} />}
          {v.destination && <Row label="Destination" value={v.destination} />}
          {v.eta && <Row label="ETA" value={formatETA(v.eta)} />}
        </Section>

        {/* Specifications */}
        {v.specs && (
          <Section label="Specifications">
            {v.specs.length !== undefined && v.specs.beam !== undefined && (
              <Row label="Dimensions" value={formatVesselDimensions(v.specs.length, v.specs.beam)} />
            )}
            {v.specs.draft !== undefined && (
              <Row label="Draft" value={`${v.specs.draft} m`} />
            )}
            {v.specs.grossTonnage !== undefined && (
              <Row label="Gross Tonnage" value={formatTonnage(v.specs.grossTonnage)} />
            )}
            {v.specs.deadweightTonnage !== undefined && (
              <Row label="DWT" value={`${(v.specs.deadweightTonnage / 1000).toFixed(0)}K t`} />
            )}
            {v.specs.built !== undefined && (
              <Row label="Built" value={String(v.specs.built)} />
            )}
          </Section>
        )}

        {/* Port Calls */}
        {v.portCalls && v.portCalls.length > 0 && (
          <Section label="Port Calls">
            {v.portCalls.map((pc, i) => (
              <div key={i} className="flex items-start gap-2 text-xs py-1">
                <span
                  className={`mt-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${
                    pc.type === 'previous' ? 'bg-slate-700 text-slate-400' : 'bg-sky-900/50 text-sky-400'
                  }`}
                >
                  {pc.type === 'previous' ? 'PREV' : 'NEXT'}
                </span>
                <div>
                  <p className="text-slate-200">{pc.port}</p>
                  <p className="text-slate-500">{pc.country}{pc.eta ? ` · ETA ${formatETA(pc.eta)}` : ''}</p>
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Rating & Compliance */}
        <Section label="Assessment">
          {v.rating !== undefined && (
            <Row
              label="Rating"
              value={
                <span className="flex items-center gap-1">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span>{v.rating.toFixed(1)} / 5.0</span>
                </span>
              }
            />
          )}
          {v.complianceStatus && (
            <Row
              label="Compliance"
              value={
                <span className="flex items-center gap-1" style={{ color: complianceColor }}>
                  <ComplianceIcon size={11} />
                  <span className="capitalize">{v.complianceStatus.replace('-', ' ')}</span>
                </span>
              }
            />
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">{label}</p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200 text-right max-w-[60%]">{value}</span>
    </div>
  );
}
