import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Search, X, Ship, Anchor } from 'lucide-react';
import { useMaritimeStore } from '../../store/maritimeStore';
import { PORTS } from '../../data/ports';
import { getVesselColorHex, vesselTypeLabel } from '../../utils/vesselUtils';
import type { Vessel, Port } from '../../types';

// Normalise AIS strings: collapse @, _, extra spaces so "AFRICAN_HERON@@@" → "african heron"
function norm(s: string | undefined): string {
  return (s ?? '').replace(/[@_]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

// Every word in the query must appear somewhere in the haystack
function wordMatch(haystack: string, query: string): boolean {
  const words = query.split(/\s+/).filter(Boolean);
  return words.every((w) => haystack.includes(w));
}

type ResultKind = 'vessel' | 'port';

interface Result {
  kind: ResultKind;
  label: string;
  sub: string;
  color: string;
  lat: number;
  lng: number;
  data: Vessel | Port;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const { vessels, flyToFn, selectVessel, selectPort } = useMaritimeStore();

  const results = useMemo<Result[]>(() => {
    const q = norm(query);
    if (!q) return [];

    const vesselResults: Result[] = Array.from(vessels.values())
      .filter((v) => {
        const haystack = [
          norm(v.name), v.mmsi, norm(v.flag),
          v.type, norm(v.callsign), norm(v.imo), norm(v.destination),
        ].join(' ');
        return wordMatch(haystack, q);
      })
      .slice(0, 6)
      .map((v) => ({
        kind: 'vessel' as const,
        label: v.name,
        sub: `${vesselTypeLabel(v.type)} · ${v.flag} · MMSI ${v.mmsi}`,
        color: getVesselColorHex(v.type),
        lat: v.lat,
        lng: v.lon,
        data: v,
      }));

    const portResults: Result[] = PORTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        (p.unlocode ?? '').toLowerCase().includes(q)
    )
      .slice(0, 6)
      .map((p) => ({
        kind: 'port' as const,
        label: p.name,
        sub: `${p.country} · ${p.size} port · ${p.status}`,
        color: p.status === 'congested' ? '#f59e0b' : '#38bdf8',
        lat: p.lat,
        lng: p.lon,
        data: p,
      }));

    return [...vesselResults, ...portResults];
  }, [query, vessels]);

  // Dismiss on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = useCallback(
    (r: Result) => {
      flyToFn?.(r.lat, r.lng);
      if (r.kind === 'vessel') selectVessel(r.data as Vessel);
      else selectPort(r.data as Port);
      setQuery('');
      setOpen(false);
    },
    [flyToFn, selectVessel, selectPort]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[highlighted]) select(results[highlighted]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: 280 }}>
      {/* Input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#0f2040',
          border: `1px solid ${open ? '#0ea5e9' : '#1e3a6e'}`,
          borderRadius: 8,
          padding: '6px 10px',
          transition: 'border-color 0.15s',
        }}
      >
        <Search size={14} style={{ color: '#64748b', flexShrink: 0 }} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlighted(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search vessels, ports…"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e2e8f0',
            fontSize: 13,
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus(); }}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#64748b', display: 'flex' }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#0a1628',
            border: '1px solid #162b54',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            zIndex: 1000,
            maxHeight: 360,
            overflowY: 'auto',
          }}
        >
          {results.map((r, i) => (
            <button
              key={`${r.kind}-${r.label}-${i}`}
              onMouseEnter={() => setHighlighted(i)}
              onMouseDown={(e) => { e.preventDefault(); select(r); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 12px',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                background: i === highlighted ? '#162b54' : 'transparent',
                borderBottom: i < results.length - 1 ? '1px solid #0f2040' : 'none',
                transition: 'background 0.1s',
              }}
            >
              {/* Icon */}
              <span style={{ color: r.color, flexShrink: 0 }}>
                {r.kind === 'vessel'
                  ? <Ship size={14} />
                  : <Anchor size={14} />
                }
              </span>

              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.label}
                </p>
                <p style={{ margin: 0, color: '#64748b', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.sub}
                </p>
              </div>

              {/* Kind badge */}
              <span style={{
                marginLeft: 'auto',
                flexShrink: 0,
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: r.color,
                background: `${r.color}22`,
                padding: '2px 6px',
                borderRadius: 4,
              }}>
                {r.kind}
              </span>
            </button>
          ))}
        </div>
      )}

      {open && query && results.length === 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          background: '#0a1628',
          border: '1px solid #162b54',
          borderRadius: 8,
          padding: '14px 12px',
          color: '#64748b',
          fontSize: 13,
          textAlign: 'center',
          zIndex: 1000,
        }}>
          No results for "{query}"
        </div>
      )}
    </div>
  );
}
