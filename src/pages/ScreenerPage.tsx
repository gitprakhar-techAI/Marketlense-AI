import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Brain, ArrowUpDown, ChevronRight, Check, Sparkles, TrendingUp, ShieldAlert, BarChart2 } from 'lucide-react';
import { getAllStocks, getAIScore, getTechnicalIndicators, getFundamentals, getPricePrediction } from '../data/mockDataProvider';

interface ScreenerPreset {
  id: string;
  name: string;
  icon: typeof Sparkles;
  description: string;
  apply: () => void;
}

export default function ScreenerPage() {
  const allStocks = useMemo(() => getAllStocks(), []);

  // Filter States
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [minAiScore, setMinAiScore] = useState<number>(0);
  const [selectedCap, setSelectedCap] = useState<string>('All'); // All, Large (>50K Cr), Mid (<50K Cr)
  const [rsiFilter, setRsiFilter] = useState<string>('All'); // All, Oversold (<35), Overbought (>65), Neutral
  const [peFilter, setPeFilter] = useState<string>('All'); // All, Low (<25), Moderate (25-45), High (>45)
  const [sortBy, setSortBy] = useState<string>('aiScore'); // aiScore, price, changePercent, marketCap, pe
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Combine stock data with AI score, technicals, fundamentals, predictions
  const enrichedStocks = useMemo(() => {
    return allStocks.map(stock => {
      const aiScore = getAIScore(stock.symbol);
      const technicals = getTechnicalIndicators(stock.symbol);
      const fundamentals = getFundamentals(stock.symbol);
      const prediction = getPricePrediction(stock.symbol);

      return {
        ...stock,
        aiScore: aiScore.overall,
        aiVerdict: aiScore.verdict,
        rsi: technicals.rsi,
        trend: technicals.trend,
        pe: fundamentals.pe,
        roe: fundamentals.roe,
        expectedReturn: prediction.expectedReturn,
        bullPrice: prediction.bull.price,
        bearPrice: prediction.bear.price,
      };
    });
  }, [allStocks]);

  // Presets definition
  const presets: ScreenerPreset[] = [
    {
      id: 'ai-top',
      name: 'AI Top Picks',
      icon: Sparkles,
      description: 'Stocks with AI Score ≥ 75 and Bullish rating',
      apply: () => {
        setSelectedSector('All');
        setMinAiScore(75);
        setSelectedCap('All');
        setRsiFilter('All');
        setPeFilter('All');
        setSortBy('aiScore');
        setSortOrder('desc');
        setActivePreset('ai-top');
      }
    },
    {
      id: 'value-quality',
      name: 'Quality Value',
      icon: BarChart2,
      description: 'PE < 30 with ROE > 15% and strong balance sheet',
      apply: () => {
        setSelectedSector('All');
        setMinAiScore(65);
        setSelectedCap('All');
        setRsiFilter('All');
        setPeFilter('Low');
        setSortBy('pe');
        setSortOrder('asc');
        setActivePreset('value-quality');
      }
    },
    {
      id: 'momentum',
      name: 'Momentum Breakout',
      icon: TrendingUp,
      description: 'Positive price action with RSI > 50 and Bullish trend',
      apply: () => {
        setSelectedSector('All');
        setMinAiScore(70);
        setSelectedCap('All');
        setRsiFilter('Overbought');
        setPeFilter('All');
        setSortBy('changePercent');
        setSortOrder('desc');
        setActivePreset('momentum');
      }
    },
    {
      id: 'oversold-rebound',
      name: 'Oversold Dip-Buy',
      icon: ShieldAlert,
      description: 'RSI < 45 with high fundamental AI rating',
      apply: () => {
        setSelectedSector('All');
        setMinAiScore(65);
        setSelectedCap('All');
        setRsiFilter('Oversold');
        setPeFilter('All');
        setSortBy('aiScore');
        setSortOrder('desc');
        setActivePreset('oversold-rebound');
      }
    }
  ];

  const resetFilters = () => {
    setSelectedSector('All');
    setMinAiScore(0);
    setSelectedCap('All');
    setRsiFilter('All');
    setPeFilter('All');
    setSortBy('aiScore');
    setSortOrder('desc');
    setSearchQuery('');
    setActivePreset(null);
  };

  // Filtered & Sorted stocks
  const filteredStocks = useMemo(() => {
    return enrichedStocks.filter(stock => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!stock.symbol.toLowerCase().includes(q) && !stock.name.toLowerCase().includes(q)) {
          return false;
        }
      }

      // Sector
      if (selectedSector !== 'All' && stock.sector !== selectedSector) {
        return false;
      }

      // AI Score
      if (stock.aiScore < minAiScore) {
        return false;
      }

      // Market Cap (in Cr: marketCap >= 500000 is Large Cap)
      if (selectedCap === 'Large' && stock.marketCap < 500000) return false;
      if (selectedCap === 'Mid' && (stock.marketCap >= 500000 || stock.marketCap < 100000)) return false;
      if (selectedCap === 'Small' && stock.marketCap >= 100000) return false;

      // RSI
      if (rsiFilter === 'Oversold' && stock.rsi > 45) return false;
      if (rsiFilter === 'Overbought' && stock.rsi < 55) return false;
      if (rsiFilter === 'Neutral' && (stock.rsi < 45 || stock.rsi > 55)) return false;

      // PE
      if (peFilter === 'Low' && stock.pe >= 25) return false;
      if (peFilter === 'Moderate' && (stock.pe < 25 || stock.pe > 40)) return false;
      if (peFilter === 'High' && stock.pe <= 40) return false;

      return true;
    }).sort((a, b) => {
      let valA: any = a[sortBy as keyof typeof a];
      let valB: any = b[sortBy as keyof typeof b];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [enrichedStocks, searchQuery, selectedSector, minAiScore, selectedCap, rsiFilter, peFilter, sortBy, sortOrder]);

  const sectors = useMemo(() => {
    const list = Array.from(new Set(allStocks.map(s => s.sector)));
    return ['All', ...list];
  }, [allStocks]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <SlidersHorizontal size={20} style={{ color: 'var(--color-accent-bright)' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>AI Stock Screener</h1>
                <span className="demo-badge">DEMO</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Filter 500+ NSE equities across AI conviction, technicals, and fundamentals
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-semibold rounded-xl transition-all"
            style={{
              background: 'var(--color-surface-3)',
              border: '1px solid var(--color-border-light)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.borderColor = 'var(--color-border-glow)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'var(--color-border-light)'; }}
          >
            Reset Filters
          </button>
          <div
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold"
            style={{
              background: 'var(--color-accent-glow)',
              border: '1px solid rgba(59,130,246,0.2)',
              color: 'var(--color-accent-bright)'
            }}
          >
            {filteredStocks.length} / {allStocks.length} stocks
          </div>
        </div>
      </div>

      {/* Preset Strategies */}
      <div className="mb-8">
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Curated AI Screeners
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map(p => {
            const isActive = activePreset === p.id;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={p.apply}
                className="p-4 rounded-2xl text-left transition-all relative overflow-hidden"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(139,92,246,0.12))'
                    : 'rgba(18,29,50,0.7)',
                  border: isActive
                    ? '1px solid rgba(59,130,246,0.4)'
                    : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 0 20px rgba(59,130,246,0.1)' : 'none',
                  backdropFilter: 'blur(12px)'
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                  }} />
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                          : 'var(--color-surface-3)'
                      }}
                    >
                      <Icon size={15} color={isActive ? '#ffffff' : 'var(--color-text-secondary)'} />
                    </div>
                    <span
                      className="text-sm font-extrabold"
                      style={{ color: isActive ? 'var(--color-accent-bright)' : 'var(--color-text-primary)' }}
                    >
                      {p.name}
                    </span>
                  </div>
                  {isActive && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.2)' }}>
                      <Check size={12} style={{ color: 'var(--color-accent-bright)' }} />
                    </div>
                  )}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-card p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} style={{ color: 'var(--color-accent)' }} />
          <h2 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Custom Filters</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Sector */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Sector</label>
            <select
              value={selectedSector}
              onChange={e => { setSelectedSector(e.target.value); setActivePreset(null); }}
              className="w-full text-xs p-2.5 rounded-lg"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
            >
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Min AI Score Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Min AI Score</label>
              <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-accent)' }}>{minAiScore}+</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minAiScore}
              onChange={e => { setMinAiScore(Number(e.target.value)); setActivePreset(null); }}
              className="w-full cursor-pointer accent-blue-500"
            />
          </div>

          {/* Market Cap */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Market Cap</label>
            <select
              value={selectedCap}
              onChange={e => { setSelectedCap(e.target.value); setActivePreset(null); }}
              className="w-full text-xs p-2.5 rounded-lg"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
            >
              <option value="All">All Caps</option>
              <option value="Large">Large Cap (&gt;₹5L Cr)</option>
              <option value="Mid">Mid Cap (₹1L – ₹5L Cr)</option>
              <option value="Small">Small Cap (&lt;₹1L Cr)</option>
            </select>
          </div>

          {/* RSI Status */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>RSI (14) Status</label>
            <select
              value={rsiFilter}
              onChange={e => { setRsiFilter(e.target.value); setActivePreset(null); }}
              className="w-full text-xs p-2.5 rounded-lg"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
            >
              <option value="All">All RSI Levels</option>
              <option value="Oversold">Oversold (&lt;45)</option>
              <option value="Neutral">Neutral (45-55)</option>
              <option value="Overbought">Momentum (&gt;55)</option>
            </select>
          </div>

          {/* Valuation PE */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Valuation (P/E)</label>
            <select
              value={peFilter}
              onChange={e => { setPeFilter(e.target.value); setActivePreset(null); }}
              className="w-full text-xs p-2.5 rounded-lg"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
            >
              <option value="All">All P/E Ranges</option>
              <option value="Low">Undervalued (&lt;25x)</option>
              <option value="Moderate">Fair (25x – 40x)</option>
              <option value="High">Premium (&gt;40x)</option>
            </select>
          </div>
        </div>

        {/* Search input in card */}
        <div className="mt-4 pt-4 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex-1 min-w-[240px] max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search filtered stocks by name or ticker..."
              className="search-input text-xs w-full"
              style={{ padding: '8px 14px', borderRadius: '8px' }}
            />
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <span>Active Sort:</span>
            <span className="font-semibold capitalize font-mono" style={{ color: 'var(--color-accent)' }}>
              {sortBy} ({sortOrder.toUpperCase()})
            </span>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="glass-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                <th className="py-3 px-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>Company</th>
                <th className="py-3 px-4 text-xs font-bold cursor-pointer" onClick={() => handleSort('price')} style={{ color: 'var(--color-text-secondary)' }}>
                  <div className="flex items-center gap-1">
                    Price (₹) <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-4 text-xs font-bold cursor-pointer" onClick={() => handleSort('changePercent')} style={{ color: 'var(--color-text-secondary)' }}>
                  <div className="flex items-center gap-1">
                    1D % <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-4 text-xs font-bold cursor-pointer" onClick={() => handleSort('aiScore')} style={{ color: 'var(--color-text-secondary)' }}>
                  <div className="flex items-center gap-1">
                    AI Score <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-4 text-xs font-bold cursor-pointer" onClick={() => handleSort('rsi')} style={{ color: 'var(--color-text-secondary)' }}>
                  <div className="flex items-center gap-1">
                    RSI (14) <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-4 text-xs font-bold cursor-pointer" onClick={() => handleSort('pe')} style={{ color: 'var(--color-text-secondary)' }}>
                  <div className="flex items-center gap-1">
                    P/E <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-4 text-xs font-bold cursor-pointer" onClick={() => handleSort('expectedReturn')} style={{ color: 'var(--color-text-secondary)' }}>
                  <div className="flex items-center gap-1">
                    ML 30D Est. <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-4 text-xs font-bold text-right" style={{ color: 'var(--color-text-secondary)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>
                    <p className="text-sm font-semibold mb-1">No stocks match your screening criteria</p>
                    <button
                      onClick={resetFilters}
                      className="text-xs font-bold underline mt-2"
                      style={{ color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredStocks.map(stock => {
                  const positive = stock.changePercent >= 0;
                  const returnPositive = stock.expectedReturn >= 0;

                  return (
                    <tr
                      key={stock.symbol}
                      className="transition-colors hover:bg-slate-800/40"
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                    >
                      {/* Company */}
                      <td className="py-3.5 px-4">
                        <Link to={`/stock/${stock.symbol}`} className="no-underline block">
                          <span className="font-bold text-sm block" style={{ color: 'var(--color-text-primary)' }}>{stock.symbol}</span>
                          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stock.name} • {stock.sector}</span>
                        </Link>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                        ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* 1D Change */}
                      <td className="py-3.5 px-4 font-mono text-sm font-semibold" style={{ color: positive ? 'var(--color-green)' : 'var(--color-red)' }}>
                        {positive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </td>

                      {/* AI Score */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs"
                            style={{
                              background: stock.aiScore >= 75 ? 'rgba(16, 185, 129, 0.15)' : stock.aiScore >= 60 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: stock.aiScore >= 75 ? 'var(--color-green)' : stock.aiScore >= 60 ? 'var(--color-accent)' : 'var(--color-red)',
                              border: `1px solid ${stock.aiScore >= 75 ? 'rgba(16, 185, 129, 0.3)' : stock.aiScore >= 60 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                            }}
                          >
                            {stock.aiScore}
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold block" style={{ color: 'var(--color-text-secondary)' }}>
                              {stock.aiVerdict}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* RSI */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span style={{
                          color: stock.rsi > 65 ? 'var(--color-red)' : stock.rsi < 35 ? 'var(--color-green)' : 'var(--color-text-secondary)',
                          fontWeight: stock.rsi > 65 || stock.rsi < 35 ? 700 : 500
                        }}>
                          {stock.rsi.toFixed(1)}
                        </span>
                      </td>

                      {/* P/E */}
                      <td className="py-3.5 px-4 font-mono text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {stock.pe.toFixed(1)}x
                      </td>

                      {/* ML 30D Expected Return */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span className="font-semibold" style={{ color: returnPositive ? 'var(--color-green)' : 'var(--color-red)' }}>
                          {returnPositive ? '+' : ''}{stock.expectedReturn.toFixed(1)}%
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/stock/${stock.symbol}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold no-underline transition-all"
                          style={{
                            background: 'var(--color-surface-3)',
                            color: 'var(--color-text-primary)',
                            border: '1px solid var(--color-border)'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-3)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                        >
                          Analyze <ChevronRight size={13} />
                        </Link>
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
