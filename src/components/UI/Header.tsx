import { Anchor, Newspaper, Menu } from 'lucide-react';
import { useMaritimeStore } from '../../store/maritimeStore';
import { SearchBar } from './SearchBar';

export function Header() {
  const { connectionStatus, liveVesselCount, sidebarOpen, setSidebarOpen, newsPanelOpen, setNewsPanelOpen } =
    useMaritimeStore();

  const statusColor =
    connectionStatus === 'live'
      ? 'bg-green-500'
      : connectionStatus === 'demo'
      ? 'bg-amber-500'
      : connectionStatus === 'connecting'
      ? 'bg-blue-400'
      : 'bg-slate-500';

  const statusLabel =
    connectionStatus === 'live'
      ? 'Live AIS'
      : connectionStatus === 'demo'
      ? 'Demo Mode'
      : connectionStatus === 'connecting'
      ? 'Connecting…'
      : 'Offline';

  return (
    <header
      className="flex items-center justify-between px-4 h-12 border-b shrink-0 z-10"
      style={{ background: '#0a1628', borderColor: '#162b54' }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={18} />
        </button>
        <Anchor size={18} className="text-sky-400" />
        <span className="font-semibold text-white tracking-wide text-sm">Maritime Monitor</span>
      </div>

      <SearchBar />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className={`w-2 h-2 rounded-full ${statusColor} ${connectionStatus === 'live' ? 'animate-pulse' : ''}`} />
          <span>{statusLabel}</span>
          {liveVesselCount > 0 && (
            <span className="text-slate-500">· {liveVesselCount.toLocaleString()} vessels</span>
          )}
        </div>

        <button
          onClick={() => setNewsPanelOpen(!newsPanelOpen)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded transition-colors ${
            newsPanelOpen
              ? 'bg-sky-500/20 text-sky-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Newspaper size={14} />
          <span>News</span>
        </button>
      </div>
    </header>
  );
}
