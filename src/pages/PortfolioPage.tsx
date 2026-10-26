import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart as PieChartIcon, Plus, TrendingUp, TrendingDown,
  ShieldCheck, AlertTriangle, Sparkles, ChevronRight, Trash2,
  ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react';
import { getDefaultPortfolio, getAllStocks, getAIScore } from '../data/mockDataProvider';
import type { PortfolioHolding } from '../types';

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(() => {
    const saved = localStorage.getItem('marketlens_portfolio');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return getDefaultPortfolio();
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('TCS');
  const [newQty, setNewQty] = useState('10');
  const [newBuyPrice, setNewBuyPrice] = useState('4000');

  const allStocks = useMemo(() => getAllStocks(), []);

  const saveHoldings = (newHoldings: PortfolioHolding[]) => {
    setHoldings(newHoldings);
    try {
      localStorage.setItem('marketlens_portfolio', JSON.stringify(newHoldings));
    } catch (e) {
      // ignore
    }
  };

  // Portfolio Totals
  const totals = useMemo(() => {
    const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
    const totalCurrent = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalPnl = totalCurrent - totalInvested;
    const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
    return { totalInvested, totalCurrent, totalPnl, totalPnlPercent };
  }, [holdings]);

  // Sector Breakdown
  const sectorBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    holdings.forEach(h => {
      map[h.sector] = (map[h.sector] || 0) + h.currentValue;
    });

    const total = totals.totalCurrent || 1;
    return Object.entries(map).map(([sector, val]) => ({
      sector,
      value: val,
      percent: (val / total) * 100
    })).sort((a, b) => b.value - a.value);
  }, [holdings, totals.totalCurrent]);

  const handleAddPosition = (e: React.FormEvent) => {
    e.preventDefault();
    const stock = allStocks.find(s => s.symbol === newSymbol);
    if (!stock) return;

    const qty = parseInt(newQty) || 1;
    const buyPrice = parseFloat(newBuyPrice) || stock.price;
    const invested = qty * buyPrice;
    const current = qty * stock.price;
    const pnl = current - invested;
    const pnlPct = (pnl / invested) * 100;

    const newPosition: PortfolioHolding = {
      symbol: stock.symbol,
      name: stock.name,
      quantity: qty,
      avgBuyPrice: buyPrice,
      currentPrice: stock.price,
      investedValue: invested,
      currentValue: current,
      pnl: pnl,
      pnlPercent: pnlPct,
      sector: stock.sector,
      allocation: 0 // recalculated dynamically
    };

    const updated = [...holdings, newPosition];
    // recalculate allocation
    const newTotal = updated.reduce((s, h) => s + h.currentValue, 0);
    updated.forEach(h => {
      h.allocation = Math.round((h.currentValue / newTotal) * 1000) / 10;
    });

    saveHoldings(updated);
    setShowAddModal(false);
  };

  const handleRemove = (symbol: string) => {
    const updated = holdings.filter(h => h.symbol !== symbol);
    const newTotal = updated.reduce((s, h) => s + h.currentValue, 0) || 1;
    updated.forEach(h => {
      h.allocation = Math.round((h.currentValue / newTotal) * 1000) / 10;
    });
    saveHoldings(updated);
  };

  const getRecommendation = (symbol: string, pnlPct: number) => {
    const ai = getAIScore(symbol);
    if (ai.overall >= 80) return { label: 'Accumulate', color: 'var(--color-green)' };
    if (ai.overall >= 65) return { label: 'Hold & Monitor', color: 'var(--color-accent)' };
    if (pnlPct > 15) return { label: 'Take Profit', color: 'var(--color-amber)' };
    return { label: 'Review / Rebalance', color: 'var(--color-red)' };
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <PieChartIcon size={20} style={{ color: 'var(--color-accent-bright)' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Portfolio AI Health Check</h1>
                <span className="demo-badge">DEMO</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Track equities, sector exposures, AI conviction & rebalancing hints
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary self-start md:self-auto"
          style={{ fontSize: '13px', padding: '9px 20px' }}
        >
          <Plus size={15} /> Add Position
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Portfolio Value */}
        <div className="glass-card p-5" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Portfolio Value</span>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.12)' }}>
              <Layers size={13} style={{ color: 'var(--color-accent-bright)' }} />
            </div>
          </div>
          <span className="text-2xl font-black font-mono block" style={{ color: 'var(--color-text-primary)' }}>
            ₹{totals.totalCurrent.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span className="text-xs mt-1 block" style={{ color: 'var(--color-text-muted)' }}>Current market value</span>
        </div>

        {/* Card 2: Invested */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Invested Capital</span>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)' }}>
              <ShieldCheck size={13} style={{ color: 'var(--color-purple-bright)' }} />
            </div>
          </div>
          <span className="text-2xl font-black font-mono block" style={{ color: 'var(--color-text-primary)' }}>
            ₹{totals.totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span className="text-xs mt-1 block" style={{ color: 'var(--color-text-muted)' }}>Total cost basis</span>
        </div>

        {/* Card 3: P&L */}
        <div className="glass-card p-5" style={{ border: `1px solid ${totals.totalPnl >= 0 ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Total P&amp;L</span>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: totals.totalPnl >= 0 ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)' }}>
              {totals.totalPnl >= 0
                ? <ArrowUpRight size={13} style={{ color: 'var(--color-green-bright)' }} />
                : <ArrowDownRight size={13} style={{ color: 'var(--color-red-bright)' }} />
              }
            </div>
          </div>
          <span className="text-2xl font-black font-mono block" style={{ color: totals.totalPnl >= 0 ? 'var(--color-green-bright)' : 'var(--color-red-bright)' }}>
            {totals.totalPnl >= 0 ? '+' : ''}₹{Math.abs(totals.totalPnl).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span
            className="text-xs font-mono font-bold px-2 py-0.5 rounded mt-1 inline-block"
            style={{
              background: totals.totalPnl >= 0 ? 'var(--color-green-soft)' : 'var(--color-red-soft)',
              color: totals.totalPnl >= 0 ? 'var(--color-green-bright)' : 'var(--color-red-bright)'
            }}
          >
            {totals.totalPnl >= 0 ? '+' : ''}{totals.totalPnlPercent.toFixed(2)}%
          </span>
        </div>

        {/* Card 4: AI Health */}
        <div className="glass-card p-5" style={{ border: '1px solid rgba(52,211,153,0.2)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>AI Health Score</span>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.12)' }}>
              <Sparkles size={13} style={{ color: 'var(--color-green-bright)' }} />
            </div>
          </div>
          <span className="text-2xl font-black font-mono block" style={{ color: 'var(--color-green-bright)' }}>82/100</span>
          <span
            className="text-xs px-2 py-0.5 rounded font-bold mt-1 inline-block"
            style={{ background: 'var(--color-green-soft)', color: 'var(--color-green-bright)' }}
          >
            Optimal Health
          </span>
        </div>
      </div>

      {/* Sector Allocation Breakdown */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          <Layers size={16} style={{ color: 'var(--color-accent)' }} /> Sector Allocation Breakdown
        </h3>

        {/* Progress bar */}
        <div className="w-full h-3 rounded-full flex overflow-hidden mb-4" style={{ background: 'var(--color-surface-3)' }}>
          {sectorBreakdown.map((sec, idx) => {
            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
            const color = colors[idx % colors.length];
            return (
              <div
                key={sec.sector}
                style={{ width: `${sec.percent}%`, background: color }}
                title={`${sec.sector}: ${sec.percent.toFixed(1)}%`}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sectorBreakdown.map((sec, idx) => {
            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
            const color = colors[idx % colors.length];
            return (
              <div key={sec.sector} className="p-3 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-secondary)' }}>{sec.sector}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold font-mono" style={{ color: 'var(--color-text-primary)' }}>{sec.percent.toFixed(1)}%</span>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-muted)' }}>₹{(sec.value / 1000).toFixed(0)}K</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Holdings Table */}
      <div className="glass-card-static overflow-hidden mb-8">
        <div className="p-4 flex items-center justify-between" style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Equities ({holdings.length})</h3>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Updated dynamically based on live demo quotes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>Stock</th>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>Qty</th>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>Avg Buy Price</th>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>LTP (₹)</th>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>Current Value</th>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>P&L (₹ / %)</th>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>AI Action</th>
                <th className="py-3 px-4 text-xs font-bold text-right" style={{ color: 'var(--color-text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>
                    No holdings in portfolio. Click "Add Position" above to add stocks.
                  </td>
                </tr>
              ) : (
                holdings.map(h => {
                  const positive = h.pnl >= 0;
                  const rec = getRecommendation(h.symbol, h.pnlPercent);
                  return (
                    <tr
                      key={h.symbol}
                      className="transition-colors hover:bg-slate-800/40"
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                    >
                      <td className="py-3.5 px-4">
                        <Link to={`/stock/${h.symbol}`} className="no-underline block">
                          <span className="font-bold text-sm block" style={{ color: 'var(--color-text-primary)' }}>{h.symbol}</span>
                          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{h.name}</span>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-sm" style={{ color: 'var(--color-text-primary)' }}>{h.quantity}</td>
                      <td className="py-3.5 px-4 font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>₹{h.avgBuyPrice.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>₹{h.currentPrice.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                        ₹{h.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-sm">
                        <span className="font-bold block" style={{ color: positive ? 'var(--color-green)' : 'var(--color-red)' }}>
                          {positive ? '+' : ''}₹{h.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs" style={{ color: positive ? 'var(--color-green)' : 'var(--color-red)' }}>
                          ({positive ? '+' : ''}{h.pnlPercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{
                          background: `${rec.color}15`,
                          color: rec.color,
                          border: `1px solid ${rec.color}35`
                        }}>
                          {rec.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/stock/${h.symbol}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold no-underline"
                            style={{ background: 'var(--color-surface-3)', color: 'var(--color-text-primary)' }}
                          >
                            Details <ChevronRight size={12} />
                          </Link>
                          <button
                            onClick={() => handleRemove(h.symbol)}
                            title="Delete Position"
                            className="p-1 rounded text-slate-500 hover:text-red-400"
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                          >
                            <Trash2 size={14} />
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

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card-static w-full max-w-md p-6 relative rounded-2xl">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Add New Portfolio Holding</h3>
            <form onSubmit={handleAddPosition} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Select Stock</label>
                <select
                  value={newSymbol}
                  onChange={e => {
                    setNewSymbol(e.target.value);
                    const s = allStocks.find(st => st.symbol === e.target.value);
                    if (s) setNewBuyPrice(s.price.toString());
                  }}
                  className="w-full text-sm p-2.5 rounded-lg"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                >
                  {allStocks.map(s => (
                    <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={newQty}
                  onChange={e => setNewQty(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-lg"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Buy Price (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  value={newBuyPrice}
                  onChange={e => setNewBuyPrice(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-lg"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg"
                  style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg"
                  style={{ background: 'var(--color-accent)', color: '#ffffff', border: 'none', cursor: 'pointer' }}
                >
                  Save Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
