import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Plus, Trash2, ArrowUpRight, ArrowDownRight, Brain, AlertCircle, ShieldCheck, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { getDefaultWatchlist, getAllStocks, getAIScore, getPricePrediction } from '../data/mockDataProvider';
import type { WatchlistItem } from '../types';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem('marketlens_watchlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return getDefaultWatchlist();
  });

  const [selectedStockToAdd, setSelectedStockToAdd] = useState<string>('');
  const allStocks = useMemo(() => getAllStocks(), []);

  // Save to localStorage
  const updateWatchlist = (newList: WatchlistItem[]) => {
    setWatchlist(newList);
    try {
      localStorage.setItem('marketlens_watchlist', JSON.stringify(newList));
    } catch (e) {
      // ignore
    }
  };

  const handleAddStock = () => {
    if (!selectedStockToAdd) return;
    if (watchlist.some(item => item.symbol === selectedStockToAdd)) return;

    const stock = allStocks.find(s => s.symbol === selectedStockToAdd);
    if (!stock) return;

    const ai = getAIScore(stock.symbol);
    const pred = getPricePrediction(stock.symbol);

    const newItem: WatchlistItem = {
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      changePercent: stock.changePercent,
      aiScore: ai.overall,
      prediction: pred.expectedReturn > 0 ? 'Bullish' : 'Neutral',
      risk: ai.risk > 70 ? 'Low' : ai.risk > 45 ? 'Medium' : 'High',
      targetRange: `₹${Math.round(pred.bear.price).toLocaleString('en-IN')} – ₹${Math.round(pred.bull.price).toLocaleString('en-IN')}`,
    };

    updateWatchlist([...watchlist, newItem]);
    setSelectedStockToAdd('');
  };

  const handleRemoveStock = (symbol: string) => {
    updateWatchlist(watchlist.filter(item => item.symbol !== symbol));
  };

  // Summary Metrics
  const avgAiScore = useMemo(() => {
    if (watchlist.length === 0) return 0;
    const sum = watchlist.reduce((acc, curr) => acc + curr.aiScore, 0);
    return Math.round(sum / watchlist.length);
  }, [watchlist]);

  const bullishCount = useMemo(() => {
    return watchlist.filter(item => item.prediction === 'Bullish').length;
  }, [watchlist]);

  const topPerformer = useMemo(() => {
    if (watchlist.length === 0) return null;
    return [...watchlist].sort((a, b) => b.changePercent - a.changePercent)[0];
  }, [watchlist]);

  // Stocks not yet in watchlist
  const availableToAdd = useMemo(() => {
    const existing = new Set(watchlist.map(w => w.symbol));
    return allStocks.filter(s => !existing.has(s.symbol));
  }, [allStocks, watchlist]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Eye size={22} style={{ color: 'var(--color-accent)' }} />
            <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>AI Watchlist</h1>
            <span className="demo-badge">DEMO</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Real-time tracking with ML forecast ranges, risk classifications, and automated AI scoring.
          </p>
        </div>

        {/* Quick Add Stock dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStockToAdd}
            onChange={e => setSelectedStockToAdd(e.target.value)}
            className="text-xs p-2.5 rounded-lg min-w-[200px]"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)'
            }}
          >
            <option value="">+ Select stock to track...</option>
            {availableToAdd.map(s => (
              <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name}</option>
            ))}
          </select>
          <button
            onClick={handleAddStock}
            disabled={!selectedStockToAdd}
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-lg transition-all"
            style={{
              background: selectedStockToAdd ? 'var(--color-accent)' : 'var(--color-surface-3)',
              color: selectedStockToAdd ? '#ffffff' : 'var(--color-text-muted)',
              cursor: selectedStockToAdd ? 'pointer' : 'not-allowed'
            }}
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4">
          <span className="text-xs font-semibold block mb-1" style={{ color: 'var(--color-text-muted)' }}>Tracked Equities</span>
          <span className="text-2xl font-extrabold font-mono" style={{ color: 'var(--color-text-primary)' }}>{watchlist.length}</span>
        </div>

        <div className="glass-card p-4">
          <span className="text-xs font-semibold block mb-1" style={{ color: 'var(--color-text-muted)' }}>Avg AI Score</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold font-mono" style={{ color: avgAiScore >= 70 ? 'var(--color-green)' : 'var(--color-accent)' }}>
              {avgAiScore}/100
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ background: 'var(--color-surface-3)', color: 'var(--color-text-secondary)' }}>
              {avgAiScore >= 75 ? 'Strong' : 'Moderate'}
            </span>
          </div>
        </div>

        <div className="glass-card p-4">
          <span className="text-xs font-semibold block mb-1" style={{ color: 'var(--color-text-muted)' }}>Bullish Conviction</span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-extrabold font-mono" style={{ color: 'var(--color-green)' }}>{bullishCount}</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>of {watchlist.length} stocks</span>
          </div>
        </div>

        <div className="glass-card p-4">
          <span className="text-xs font-semibold block mb-1" style={{ color: 'var(--color-text-muted)' }}>Top Performer Today</span>
          {topPerformer ? (
            <div className="flex items-center justify-between">
              <span className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>{topPerformer.symbol}</span>
              <span className="text-sm font-mono font-bold" style={{ color: topPerformer.changePercent >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}>
                {topPerformer.changePercent >= 0 ? '+' : ''}{topPerformer.changePercent.toFixed(2)}%
              </span>
            </div>
          ) : (
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>None</span>
          )}
        </div>
      </div>

      {/* AI Intelligence Brief */}
      <div className="p-4 rounded-xl mb-8 flex items-start gap-3.5" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.08))', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-accent)' }}>
          <Sparkles size={16} color="#ffffff" />
        </div>
        <div>
          <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>AI Watchlist Intelligence Summary</h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Your watchlist maintains a constructive risk-reward profile with {bullishCount} assets displaying positive technical trends and stable earnings growth. No immediate breakdown signals detected across key moving averages.
          </p>
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="glass-card-static overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>Ticker</th>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>LTP (₹)</th>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>1D %</th>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>AI Score</th>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>AI Outlook</th>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>ML Target Range (30D)</th>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>Risk Level</th>
                <th className="py-3 px-4 text-xs font-bold text-right" style={{ color: 'var(--color-text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>
                    <p className="text-sm font-semibold mb-1">Your watchlist is currently empty</p>
                    <p className="text-xs">Add stocks using the selector above or browse the Markets & Screener pages.</p>
                  </td>
                </tr>
              ) : (
                watchlist.map(item => {
                  const positive = item.changePercent >= 0;
                  return (
                    <tr
                      key={item.symbol}
                      className="transition-colors hover:bg-slate-800/40"
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                    >
                      {/* Ticker & Name */}
                      <td className="py-4 px-4">
                        <Link to={`/stock/${item.symbol}`} className="no-underline block">
                          <span className="font-bold text-sm block" style={{ color: 'var(--color-text-primary)' }}>{item.symbol}</span>
                          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.name}</span>
                        </Link>
                      </td>

                      {/* LTP */}
                      <td className="py-4 px-4 font-mono font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                        ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* 1D Change */}
                      <td className="py-4 px-4 font-mono text-sm font-semibold" style={{ color: positive ? 'var(--color-green)' : 'var(--color-red)' }}>
                        {positive ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </td>

                      {/* AI Score */}
                      <td className="py-4 px-4">
                        <div
                          className="w-8 h-8 rounded-lg inline-flex items-center justify-center font-mono font-bold text-xs"
                          style={{
                            background: item.aiScore >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                            color: item.aiScore >= 75 ? 'var(--color-green)' : 'var(--color-accent)',
                            border: `1px solid ${item.aiScore >= 75 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                          }}
                        >
                          {item.aiScore}
                        </div>
                      </td>

                      {/* AI Outlook */}
                      <td className="py-4 px-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
                          background: item.prediction === 'Bullish' ? 'var(--color-green-soft)' : 'var(--color-amber-soft)',
                          color: item.prediction === 'Bullish' ? 'var(--color-green)' : 'var(--color-amber)',
                        }}>
                          {item.prediction}
                        </span>
                      </td>

                      {/* ML Target Range */}
                      <td className="py-4 px-4 font-mono text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {item.targetRange}
                      </td>

                      {/* Risk */}
                      <td className="py-4 px-4">
                        <span className="text-xs font-medium flex items-center gap-1" style={{
                          color: item.risk === 'Low' ? 'var(--color-green)' : item.risk === 'Medium' ? 'var(--color-amber)' : 'var(--color-red)'
                        }}>
                          <ShieldCheck size={13} /> {item.risk} Risk
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/stock/${item.symbol}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold no-underline"
                            style={{ background: 'var(--color-surface-3)', color: 'var(--color-text-primary)' }}
                          >
                            Terminal <ChevronRight size={12} />
                          </Link>
                          <button
                            onClick={() => handleRemoveStock(item.symbol)}
                            title="Remove from watchlist"
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-red)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
