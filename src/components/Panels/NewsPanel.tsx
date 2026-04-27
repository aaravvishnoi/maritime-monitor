import { useEffect } from 'react';
import { X, AlertTriangle, Scale, TrendingUp, Leaf, Skull, Globe } from 'lucide-react';
import { useMaritimeStore } from '../../store/maritimeStore';
import { fetchMaritimeNews } from '../../services/newsService';
import { MaritimeNews } from '../../types';
import { formatDistanceToNow, parseISO } from 'date-fns';

const categoryIcon = (cat: MaritimeNews['category']) => {
  switch (cat) {
    case 'incident':    return <AlertTriangle size={11} className="text-red-400" />;
    case 'regulation':  return <Scale size={11} className="text-blue-400" />;
    case 'trade':       return <TrendingUp size={11} className="text-green-400" />;
    case 'environment': return <Leaf size={11} className="text-emerald-400" />;
    case 'piracy':      return <Skull size={11} className="text-red-500" />;
    default:            return <Globe size={11} className="text-slate-400" />;
  }
};

const categoryColor = (cat: MaritimeNews['category']): string => {
  switch (cat) {
    case 'incident':    return '#ef4444';
    case 'piracy':      return '#dc2626';
    case 'regulation':  return '#60a5fa';
    case 'trade':       return '#4ade80';
    case 'environment': return '#34d399';
    default:            return '#94a3b8';
  }
};

export function NewsPanel() {
  const { newsPanelOpen, setNewsPanelOpen, news, setNews } = useMaritimeStore();

  useEffect(() => {
    if (newsPanelOpen && news.length === 0) {
      fetchMaritimeNews().then(setNews);
    }
  }, [newsPanelOpen]);

  if (!newsPanelOpen) return null;

  return (
    <div
      className="w-80 flex flex-col border-l shrink-0 overflow-hidden"
      style={{ background: '#0a1628', borderColor: '#162b54' }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: '#162b54' }}
      >
        <h2 className="text-white font-semibold text-sm">Maritime Intelligence</h2>
        <button
          onClick={() => setNewsPanelOpen(false)}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        {news.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm">Loading…</div>
        ) : (
          news.map((item) => (
            <article
              key={item.id}
              className="px-4 py-3 border-b hover:bg-white/3 transition-colors cursor-default"
              style={{ borderColor: '#0f2040' }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                {categoryIcon(item.category)}
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: categoryColor(item.category) }}
                >
                  {item.category}
                </span>
                <span className="text-slate-600 text-xs ml-auto">
                  {formatDistanceToNow(parseISO(item.publishedAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-slate-200 text-sm font-medium leading-snug mb-1">{item.title}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{item.summary}</p>
              <p className="text-slate-600 text-xs mt-1.5">{item.source}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
