import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, TrendingUp, BarChart3, Filter, ArrowUpRight, ArrowDownRight,
  Activity, Zap, Brain, Shield, ChevronRight, Sparkles, Eye
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { getMarketIndices, searchStocks, getAllStocks, getAIScore } from '../data/mockDataProvider';
import type { MarketIndex, Stock } from '../types';

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={38}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={positive ? '#34d399' : '#f87171'}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function MarketCard({ idx, delay }: { idx: MarketIndex; delay: number }) {
  const positive = idx.change >= 0;
  return (
    <div
      className="glass-card p-4 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            {idx.name}
          </h3>
          <p className="text-xl font-extrabold font-mono mt-1" style={{ color: 'var(--color-text-primary)' }}>
            {idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: positive ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)' }}
        >
          {positive
            ? <ArrowUpRight size={16} style={{ color: 'var(--color-green-bright)' }} />
            : <ArrowDownRight size={16} style={{ color: 'var(--color-red-bright)' }} />
          }
        </div>
      </div>

      <div className="mb-2">
        <MiniSparkline data={idx.sparkline} positive={positive} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold" style={{ color: positive ? 'var(--color-green-bright)' : 'var(--color-red-bright)' }}>
            {positive ? '+' : ''}{idx.change.toFixed(2)}
          </span>
          <span
            className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
            style={{
              background: positive ? 'var(--color-green-soft)' : 'var(--color-red-soft)',
              color: positive ? 'var(--color-green-bright)' : 'var(--color-red-bright)'
            }}
          >
            {positive ? '+' : ''}{idx.changePercent.toFixed(2)}%
          </span>
        </div>
        <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{idx.lastUpdated}</span>
      </div>
    </div>
  );
}

function TopStockCard({ stock, score, rank }: { stock: Stock; score: number; rank: number }) {
  const positive = stock.changePercent >= 0;
  const rankColors = ['#f59e0b', '#94a3b8', '#b45309'];

  return (
    <Link to={`/stock/${stock.symbol}`} className="glass-card p-5 no-underline block group" style={{ animationFillMode: 'both' }}>
      {/* Rank badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black font-mono"
            style={{ background: `${rankColors[rank] || '#3b82f6'}20`, color: rankColors[rank] || 'var(--color-accent)' }}
          >
            #{rank + 1}
          </span>
          <div>
            <span className="text-sm font-extrabold block" style={{ color: 'var(--color-text-primary)' }}>{stock.symbol}</span>
            <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>{stock.sector}</span>
          </div>
        </div>
        {/* AI Score badge */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
          style={{
            background: score >= 75 ? 'rgba(52,211,153,0.12)' : 'rgba(59,130,246,0.12)',
            border: `1px solid ${score >= 75 ? 'rgba(52,211,153,0.3)' : 'rgba(59,130,246,0.3)'}`
          }}
        >
          <Brain size={11} style={{ color: score >= 75 ? 'var(--color-green-bright)' : 'var(--color-accent-bright)' }} />
          <span
            className="text-xs font-black font-mono"
            style={{ color: score >= 75 ? 'var(--color-green-bright)' : 'var(--color-accent-bright)' }}
          >
            {score}
          </span>
        </div>
      </div>

      {/* Price row */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xl font-extrabold font-mono block" style={{ color: 'var(--color-text-primary)' }}>
            ₹{stock.price.toLocaleString('en-IN')}
          </span>
          <span
            className="text-xs font-mono font-bold"
            style={{ color: positive ? 'var(--color-green-bright)' : 'var(--color-red-bright)' }}
          >
            {positive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </span>
        </div>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all group-hover:bg-blue-500/20"
          style={{ background: 'var(--color-surface-3)' }}
        >
          <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="mt-3 h-1 rounded-full" style={{ background: 'var(--color-surface-3)' }}>
        <div
          className="h-1 rounded-full transition-all"
          style={{
            width: `${score}%`,
            background: score >= 75
              ? 'linear-gradient(90deg, #10b981, #34d399)'
              : 'linear-gradient(90deg, #3b82f6, #60a5fa)'
          }}
        />
      </div>
    </Link>
  );
}

// Animated live ticker strip
function TickerStrip({ stocks }: { stocks: Stock[] }) {
  const items = [...stocks, ...stocks]; // duplicate for seamless loop
  return (
    <div className="overflow-hidden py-2.5" style={{ background: 'rgba(10,16,32,0.6)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', animation: 'ticker 35s linear infinite', width: 'max-content' }}>
        {items.map((s, i) => {
          const positive = s.changePercent >= 0;
          return (
            <div key={`${s.symbol}-${i}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '0 24px', borderRight: '1px solid var(--color-border)', whiteSpace: 'nowrap'
            }}>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {s.symbol}
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                ₹{s.price.toLocaleString('en-IN')}
              </span>
              <span style={{
                fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 600,
                color: positive ? 'var(--color-green-bright)' : 'var(--color-red-bright)'
              }}>
                {positive ? '▲' : '▼'} {positive ? '+' : ''}{s.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const indices = getMarketIndices();
  const allStocks = getAllStocks();

  useEffect(() => {
    if (query.trim()) {
      setSearchResults(searchStocks(query));
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const topStocks = allStocks
    .slice(0, 6)
    .map(s => ({ stock: s, score: getAIScore(s.symbol).overall }))
    .sort((a, b) => b.score - a.score);

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        {/* Layered gradient orbs */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: '-60px', left: '10%',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)',
            filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute', bottom: '0', right: '5%',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.14), transparent 70%)',
            filter: 'blur(70px)', animation: 'float 13s ease-in-out infinite reverse'
          }} />
          <div style={{
            position: 'absolute', top: '30%', right: '25%',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)',
            filter: 'blur(50px)', animation: 'float 8s ease-in-out 2s infinite'
          }} />
          {/* Grid lines */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)'
          }} />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-12" style={{ zIndex: 1 }}>
          <div className="text-center max-w-4xl mx-auto">

            {/* Pill badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 animate-fade-in-up"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                backdropFilter: 'blur(12px)'
              }}
            >
              <Sparkles size={13} style={{ color: '#60a5fa' }} />
              <span className="text-xs font-semibold tracking-wide" style={{ color: '#93c5fd' }}>
                AI-Powered Stock Research for Indian Markets
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: 'pulse-glow 2s infinite' }} />
            </div>

            {/* Main heading */}
            <h1
              className="font-black leading-tight mb-5 animate-fade-in-up delay-100"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)', animationFillMode: 'both' }}
            >
              <span style={{ color: 'var(--color-text-primary)', display: 'block' }}>Understand Markets.</span>
              <span className="gradient-text" style={{ display: 'block', lineHeight: '1.15' }}>Predict the Range.</span>
              <span style={{ color: 'var(--color-text-primary)', display: 'block' }}>Invest Smarter.</span>
            </h1>

            <p
              className="text-base sm:text-lg mb-8 leading-relaxed max-w-2xl mx-auto animate-fade-in-up delay-200"
              style={{ color: 'var(--color-text-secondary)', animationFillMode: 'both' }}
            >
              AI-powered research combining real market data, technical indicators, fundamentals, analyst expectations and machine learning.
            </p>

            {/* Search Bar */}
            <div ref={searchRef} className="relative max-w-xl mx-auto mb-8 animate-fade-in-up delay-300" style={{ animationFillMode: 'both' }}>
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-muted)', zIndex: 2 }}
              />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search — Reliance, TCS, Infosys, HDFC Bank..."
                className="search-input text-base"
                style={{ fontSize: '15px', paddingRight: '120px' }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    navigate(`/stock/${searchResults[0].symbol}`);
                    setShowSearch(false);
                  }
                }}
              />
              <button
                onClick={() => searchResults.length > 0 && navigate(`/stock/${searchResults[0].symbol}`)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 2px 12px rgba(59,130,246,0.4)' }}
              >
                Search
              </button>

              {showSearch && searchResults.length > 0 && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 glass-card-static overflow-hidden"
                  style={{ maxHeight: '320px', overflowY: 'auto', zIndex: 50 }}
                >
                  {searchResults.map(s => (
                    <button
                      key={s.symbol}
                      onClick={() => { navigate(`/stock/${s.symbol}`); setShowSearch(false); setQuery(''); }}
                      className="w-full flex items-center justify-between px-5 py-3 text-left transition-colors"
                      style={{ border: 'none', background: 'transparent', borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div>
                        <span className="font-bold text-sm block" style={{ color: 'var(--color-text-primary)' }}>{s.symbol}</span>
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-semibold block" style={{ color: 'var(--color-text-primary)' }}>₹{s.price.toLocaleString('en-IN')}</span>
                        <span className="text-xs font-mono" style={{ color: s.changePercent >= 0 ? 'var(--color-green-bright)' : 'var(--color-red-bright)' }}>
                          {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up delay-400" style={{ animationFillMode: 'both' }}>
              <button
                className="btn-primary"
                onClick={() => { const el = document.querySelector('.search-input') as HTMLInputElement; el?.focus(); }}
              >
                <Search size={16} /> Analyze Stock
              </button>
              <Link to="/markets" className="btn-secondary no-underline">
                <BarChart3 size={16} /> Explore Market
              </Link>
              <Link to="/screener" className="btn-secondary no-underline">
                <Filter size={16} /> AI Screener
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-8 sm:gap-14 mt-8 animate-fade-in-up delay-500" style={{ animationFillMode: 'both' }}>
              {[
                { value: '500+', label: 'NSE Stocks' },
                { value: '12', label: 'AI Models' },
                { value: '99.2%', label: 'Backtest Accuracy' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-black font-mono gradient-text">{stat.value}</div>
                  <div className="text-xs mt-1 font-medium" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TICKER STRIP ─── */}
      <TickerStrip stocks={allStocks.slice(0, 12)} />

      {/* ─── MARKET INDICES ─── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <Activity size={18} style={{ color: 'var(--color-accent-bright)' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Live Market Snapshot</h2>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>NSE / BSE major indices</p>
            </div>
            <span className="demo-badge ml-2">DEMO</span>
          </div>
          <Link
            to="/markets"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold no-underline transition-all"
            style={{ background: 'var(--color-accent-glow)', color: 'var(--color-accent-bright)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {indices.map((idx, i) => (
            <MarketCard key={idx.symbol} idx={idx} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ─── TOP AI PICKS ─── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
              <Brain size={18} style={{ color: 'var(--color-purple-bright)' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Top AI-Scored Stocks</h2>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Ranked by ensemble ML model score</p>
            </div>
          </div>
          <Link
            to="/screener"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold no-underline"
            style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--color-purple-bright)', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            Full Screener <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topStocks.map(({ stock, score }, rank) => (
            <TopStockCard key={stock.symbol} stock={stock} score={score} rank={rank} />
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-20">
        {/* Section header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <Zap size={12} style={{ color: 'var(--color-green-bright)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--color-green-bright)' }}>Institutional-Grade Tools</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Why <span className="gradient-text">MarketLens AI</span>?
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
            Built with the same tools institutional quants use — now accessible to retail investors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Brain,
              color: '#a78bfa',
              bg: 'rgba(139,92,246,0.12)',
              border: 'rgba(139,92,246,0.2)',
              title: 'Ensemble ML Models',
              desc: 'XGBoost, LightGBM, LSTM & statistical models combined with optimized weights for robust predictions.',
              tag: 'Core Engine'
            },
            {
              icon: Shield,
              color: '#34d399',
              bg: 'rgba(16,185,129,0.12)',
              border: 'rgba(16,185,129,0.2)',
              title: 'Walk-Forward Backtesting',
              desc: 'Chronological validation — never peeking into the future. Real performance metrics you can trust.',
              tag: 'Validated'
            },
            {
              icon: Zap,
              color: '#fbbf24',
              bg: 'rgba(245,158,11,0.12)',
              border: 'rgba(245,158,11,0.2)',
              title: 'Explainable AI (SHAP)',
              desc: 'SHAP-based feature contributions. Know exactly WHY the model predicts bullish or bearish.',
              tag: 'Transparent'
            },
            {
              icon: Activity,
              color: '#22d3ee',
              bg: 'rgba(6,182,212,0.12)',
              border: 'rgba(6,182,212,0.2)',
              title: 'Probability Ranges',
              desc: 'No single-point "guaranteed" targets. Bull / Base / Bear scenarios with confidence intervals.',
              tag: 'Risk-Aware'
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="glass-card p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both', border: `1px solid ${f.border}` }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: f.bg }}
              >
                <f.icon size={22} style={{ color: f.color }} />
              </div>

              {/* Tag */}
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-3 inline-block"
                style={{ background: f.bg, color: f.color }}
              >
                {f.tag}
              </span>

              <h3 className="text-sm font-extrabold mb-2" style={{ color: 'var(--color-text-primary)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{f.desc}</p>

              {/* Bottom line */}
              <div className="mt-4 h-0.5 rounded-full" style={{ background: f.bg }}>
                <div className="h-0.5 rounded-full w-2/3" style={{ background: f.color, opacity: 0.6 }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA BOTTOM STRIP ─── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-16">
        <div
          className="relative overflow-hidden rounded-3xl p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.12) 50%, rgba(6,182,212,0.08) 100%)',
            border: '1px solid rgba(59,130,246,0.2)'
          }}
        >
          {/* Orb */}
          <div style={{
            position: 'absolute', top: '-30px', right: '10%',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent)',
            filter: 'blur(40px)', pointerEvents: 'none'
          }} />

          <div className="flex items-center justify-center gap-2 mb-4">
            <Eye size={18} style={{ color: '#60a5fa' }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#93c5fd' }}>Get Started</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Start researching smarter <span className="gradient-text">today</span>
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 32px' }}>
            Access AI-driven insights for over 500 NSE-listed stocks — free during demo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/markets" className="btn-primary no-underline">
              <BarChart3 size={16} /> Explore Markets
            </Link>
            <Link to="/watchlist" className="btn-secondary no-underline">
              <Eye size={16} /> Build Watchlist
            </Link>
          </div>
        </div>
      </section>

      {/* Ticker keyframes injected inline */}
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
