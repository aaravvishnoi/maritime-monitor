import { useMaritimeStore } from '../../store/maritimeStore';
import { LayerVisibility } from '../../types';

interface LayerRow {
  key: keyof LayerVisibility;
  label: string;
  color: string;
}

const LAYERS: LayerRow[] = [
  { key: 'vessels',       label: 'Vessels',           color: '#0ea5e9' },
  { key: 'ports',         label: 'Ports',              color: '#38bdf8' },
  { key: 'harbors',       label: 'Harbors',            color: '#06b6d4' },
  { key: 'shippingLanes', label: 'Shipping Lanes',     color: '#0284c7' },
  { key: 'trafficDensity',label: 'Traffic Density',    color: '#7c3aed' },
  { key: 'piracyZones',   label: 'Piracy Zones',       color: '#ef4444' },
  { key: 'accidents',     label: 'Accidents',          color: '#f97316' },
  { key: 'chokepoints',   label: 'Chokepoints',        color: '#f59e0b' },
  { key: 'mpas',          label: 'Marine Protected',   color: '#22c55e' },
  { key: 'oceanLabels',   label: 'Ocean & Continents', color: '#94a3b8' },
];

export function LayerControls() {
  const { layers, toggleLayer } = useMaritimeStore();

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Layers</p>
      <div className="flex flex-col gap-1">
        {LAYERS.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleLayer(key)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded text-sm text-left transition-colors hover:bg-white/5"
          >
            <span
              className="w-3 h-3 rounded-sm flex-shrink-0 transition-opacity"
              style={{
                background: color,
                opacity: layers[key] ? 1 : 0.2,
              }}
            />
            <span className={layers[key] ? 'text-slate-200' : 'text-slate-600'}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
