import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, BarChart3, TrendingUp, Briefcase, Eye, PieChart, Menu, X, Zap } from 'lucide-react';
import { searchStocks } from '../data/mockDataProvider';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof searchStocks>>([]);
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 10); }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      setResults(searchStocks(query));
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    setQuery('');
    setShowResults(false);
    setMobileMenuOpen(false);
    navigate(`/stock/${symbol}`);
  };

  const navLinks = [
    { to: '/markets',   icon: BarChart3, label: 'Markets'   },
    { to: '/screener',  icon: Search,    label: 'Screener'  },
    { to: '/watchlist', icon: Eye,       label: 'Watchlist' },
    { to: '/portfolio', icon: PieChart,  label: 'Portfolio' },
  ];

  return (
    <nav
      className="sticky top-0 z-50 transition-all"
      style={{
        background: scrolled
          ? 'rgba(6, 10, 18, 0.92)'
          : 'rgba(6, 10, 18, 0.6)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        borderBottom: scrolled
          ? '1px solid var(--color-border-light)'
          : '1px solid var(--color-border)',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none'
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all group-hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)'
              }}
            >
              <TrendingUp size={16} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-black tracking-tight" style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              MarketLens<span style={{
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}> AI</span>
            </span>
          </Link>

          {/* ── Desktop Search ── */}
          <div ref={searchRef} className="hidden md:block relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-text-muted)', zIndex: 1 }}
            />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && results.length > 0) handleSelect(results[0].symbol);
              }}
              placeholder="Search stocks — TCS, Reliance..."
              className="search-input text-sm"
              style={{ padding: '8px 14px 8px 36px', borderRadius: '10px', fontSize: '13px' }}
            />

            {showResults && results.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 glass-card-static overflow-hidden shadow-2xl"
                style={{ maxHeight: '360px', overflowY: 'auto', zIndex: 100 }}
              >
                {results.map(s => (
                  <button
                    key={s.symbol}
                    onClick={() => handleSelect(s.symbol)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left transition-all"
                    style={{ borderBottom: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div>
                      <div className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>{s.symbol}</div>
                      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        ₹{s.price.toLocaleString('en-IN')}
                      </div>
                      <div
                        className="text-xs font-mono font-semibold"
                        style={{ color: s.changePercent >= 0 ? 'var(--color-green-bright)' : 'var(--color-red-bright)' }}
                      >
                        {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(item => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold no-underline transition-all"
                  style={{
                    color: isActive ? 'white' : 'var(--color-text-secondary)',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.15))'
                      : 'transparent',
                    border: isActive
                      ? '1px solid rgba(59,130,246,0.3)'
                      : '1px solid transparent'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.border = '1px solid var(--color-border)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.border = '1px solid transparent';
                    }
                  }}
                >
                  <item.icon
                    size={14}
                    style={{ color: isActive ? '#60a5fa' : undefined }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute', bottom: 0, left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px', height: '2px', borderRadius: '1px',
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                      }}
                    />
                  )}
                </Link>
              );
            })}

            <div className="w-px h-5 mx-1" style={{ background: 'var(--color-border-light)' }} />
            <span className="demo-badge">DEMO</span>
          </div>

          {/* ── Mobile menu button ── */}
          <button
            className="md:hidden p-2 rounded-xl transition-all"
            style={{
              color: 'var(--color-text-secondary)',
              background: mobileMenuOpen ? 'var(--color-surface-3)' : 'transparent',
              border: '1px solid ' + (mobileMenuOpen ? 'var(--color-border-light)' : 'transparent')
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileMenuOpen && (
          <div
            className="md:hidden pb-4 animate-fade-in"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            {/* Mobile search */}
            <div className="relative mt-3 mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search stocks..."
                className="search-input text-sm"
                style={{ padding: '10px 14px 10px 34px', fontSize: '14px' }}
              />
            </div>

            {showResults && results.length > 0 && (
              <div className="mb-3 glass-card-static overflow-hidden" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {results.slice(0, 4).map(s => (
                  <button
                    key={s.symbol}
                    onClick={() => handleSelect(s.symbol)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                  >
                    <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>{s.symbol}</span>
                    <span
                      className="text-sm font-mono font-semibold"
                      style={{ color: s.changePercent >= 0 ? 'var(--color-green-bright)' : 'var(--color-red-bright)' }}
                    >
                      ₹{s.price.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-1">
              {navLinks.map(item => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold no-underline transition-all"
                    style={{
                      color: isActive ? 'white' : 'var(--color-text-secondary)',
                      background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                      border: isActive ? '1px solid rgba(59,130,246,0.25)' : '1px solid transparent'
                    }}
                  >
                    <item.icon size={16} style={{ color: isActive ? '#60a5fa' : undefined }} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 px-3 flex items-center gap-2">
              <span className="demo-badge">DEMO MODE</span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Simulated Data</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
