import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Brain, Activity } from 'lucide-react';
import { getSectorData, getAllStocks, getAIScore, getMarketIndices } from '../data/mockDataProvider';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

function getHeatColor(value: number): string {
  if (value > 3)  return '#34d399';
  if (value > 1)  return '#10b981';
  if (value > 0)  return '#6ee7b7';
  if (value > -1) return '#fbbf24';
  if (value > -3) return '#f87171';
  return '#ef4444';
}

function getHeatBg(value: number): string {
  if (value > 3)  return 'rgba(52,211,153,0.14)';
  if (value > 1)  return 'rgba(16,185,129,0.12)';
  if (value > 0)  return 'rgba(110,231,183,0.09)';
  if (value > -1) return 'rgba(251,191,36,0.12)';
  if (value > -3) return 'rgba(248,113,113,0.12)';
  return 'rgba(239,68,68,0.15)';
}

export default function MarketsPage() {
  const sectors = getSectorData();
  const stocks = getAllStocks();
  const indices = getMarketIndices();

  const topGainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const topLosers  = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">

      {/* ── Page Header ── */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
          <BarChart3 size={20} style={{ color: 'var(--color-accent-bright)' }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Markets</h1>
            <span className="demo-badge">DEMO</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>NSE / BSE real-time overview</p>
        </div>
      </div>

      {/* ── Market Indices ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {indices.map((idx, i) => {
          const positive = idx.change >= 0;
          const chartData = idx.sparkline.map((v, j) => ({ j, v }));
          return (
            <div key={idx.symbol} className="glass-card p-4 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}>
              <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>{idx.name}</p>
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: positive ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)' }}
                >
                  {positive
                    ? <ArrowUpRight size={13} style={{ color: 'var(--color-green-bright)' }} />
                    : <ArrowDownRight size={13} style={{ color: 'var(--color-red-bright)' }} />
                  }
                </div>
              </div>
              <p className="text-xl font-extrabold font-mono mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <ResponsiveContainer width="100%" height={34}>
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="v" stroke={positive ? '#34d399' : '#f87171'} strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className="text-xs font-mono font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: positive ? 'var(--color-green-soft)' : 'var(--color-red-soft)',
                    color: positive ? 'var(--color-green-bright)' : 'var(--color-red-bright)'
                  }}
                >
                  {positive ? '+' : ''}{idx.change.toFixed(2)} ({positive ? '+' : ''}{idx.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Sector Heatmap ── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)' }}>
            <Activity size={17} style={{ color: 'var(--color-purple-bright)' }} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Sector Heatmap</h2>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>1-day sector performance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {sectors.map((s, i) => (
            <div
              key={s.name}
              className="heatmap-cell animate-fade-in-up"
              style={{
                background: getHeatBg(s.return1D),
                border: `1px solid ${getHeatColor(s.return1D)}35`,
                animationDelay: `${i * 40}ms`,
                animationFillMode: 'both'
              }}
            >
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{s.name}</p>
                <p className="text-2xl font-black font-mono" style={{ color: getHeatColor(s.return1D) }}>
                  {s.return1D >= 0 ? '+' : ''}{s.return1D.toFixed(2)}%
                </p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1">
                  <Brain size={11} style={{ color: 'var(--color-accent-bright)' }} />
                  <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--color-accent-bright)' }}>{s.aiScore}</span>
                </div>
                <span className="text-[10px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
                  1M: {s.return1M >= 0 ? '+' : ''}{s.return1M.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Top Gainers & Losers ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Gainers */}
        <div className="glass-card-static overflow-hidden">
          <div className="p-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <TrendingUp size={16} style={{ color: 'var(--color-green-bright)' }} />
            <h3 className="text-sm font-extrabold" style={{ color: 'var(--color-green-bright)' }}>Top Gainers</h3>
          </div>
          <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as any}>
            {topGainers.map((s, i) => (
              <Link
                to={`/stock/${s.symbol}`}
                key={s.symbol}
                className="flex items-center justify-between px-4 py-3 no-underline transition-all"
                style={{ display: 'flex' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(52,211,153,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black font-mono"
                    style={{ background: 'rgba(52,211,153,0.1)', color: 'var(--color-green-bright)' }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <span className="text-sm font-bold block" style={{ color: 'var(--color-text-primary)' }}>{s.symbol}</span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{s.sector}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    ₹{s.price.toLocaleString('en-IN')}
                  </span>
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg"
                    style={{ background: 'var(--color-green-soft)', color: 'var(--color-green-bright)' }}
                  >
                    +{s.changePercent.toFixed(2)}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Losers */}
        <div className="glass-card-static overflow-hidden">
          <div className="p-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <TrendingDown size={16} style={{ color: 'var(--color-red-bright)' }} />
            <h3 className="text-sm font-extrabold" style={{ color: 'var(--color-red-bright)' }}>Top Losers</h3>
          </div>
          <div>
            {topLosers.map((s, i) => (
              <Link
                to={`/stock/${s.symbol}`}
                key={s.symbol}
                className="flex items-center justify-between px-4 py-3 no-underline transition-all"
                style={{ borderBottom: i < topLosers.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black font-mono"
                    style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--color-red-bright)' }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <span className="text-sm font-bold block" style={{ color: 'var(--color-text-primary)' }}>{s.symbol}</span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{s.sector}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    ₹{s.price.toLocaleString('en-IN')}
                  </span>
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg"
                    style={{ background: 'var(--color-red-soft)', color: 'var(--color-red-bright)' }}
                  >
                    {s.changePercent.toFixed(2)}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── All Stocks Table ── */}
      <div>
        <h2 className="text-lg font-extrabold mb-4" style={{ color: 'var(--color-text-primary)' }}>All Stocks</h2>
        <div className="glass-card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(18,29,50,0.6)', borderBottom: '1px solid var(--color-border-light)' }}>
                  {['Stock', 'Sector', 'Price', 'Change', 'Mkt Cap', 'Volume', 'AI Score'].map(h => (
                    <th
                      key={h}
                      className="text-left px-4 py-3.5"
                      style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stocks.map(s => {
                  const score    = getAIScore(s.symbol).overall;
                  const positive = s.changePercent >= 0;
                  return (
                    <tr
                      key={s.symbol}
                      style={{ borderBottom: '1px solid rgba(22,32,56,0.6)', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-4 py-3.5">
                        <Link to={`/stock/${s.symbol}`} className="no-underline">
                          <span className="text-sm font-extrabold block" style={{ color: 'var(--color-text-primary)' }}>{s.symbol}</span>
                          <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{s.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="text-xs px-2 py-0.5 rounded-md font-medium"
                          style={{ background: 'var(--color-surface-3)', color: 'var(--color-text-secondary)' }}
                        >
                          {s.sector}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        ₹{s.price.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg"
                          style={{
                            background: positive ? 'var(--color-green-soft)' : 'var(--color-red-soft)',
                            color: positive ? 'var(--color-green-bright)' : 'var(--color-red-bright)'
                          }}
                        >
                          {positive ? '+' : ''}{s.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                        {s.marketCap >= 100000 ? `₹${(s.marketCap / 100000).toFixed(1)}L Cr` : `₹${(s.marketCap / 1000).toFixed(0)}K Cr`}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                        {(s.volume / 1e6).toFixed(1)}M
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-mono font-black px-2 py-0.5 rounded-lg"
                            style={{
                              background: score >= 75
                                ? 'rgba(52,211,153,0.12)'
                                : score >= 60
                                  ? 'rgba(59,130,246,0.12)'
                                  : 'rgba(245,158,11,0.12)',
                              color: score >= 75
                                ? 'var(--color-green-bright)'
                                : score >= 60
                                  ? 'var(--color-accent-bright)'
                                  : 'var(--color-amber-bright)'
                            }}
                          >
                            {score}
                          </span>
                          {/* Mini score bar */}
                          <div className="w-14 h-1 rounded-full" style={{ background: 'var(--color-surface-4)' }}>
                            <div
                              className="h-1 rounded-full"
                              style={{
                                width: `${score}%`,
                                background: score >= 75
                                  ? 'var(--color-green-bright)'
                                  : score >= 60
                                    ? 'var(--color-accent-bright)'
                                    : 'var(--color-amber-bright)'
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
