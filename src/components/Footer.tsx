import { TrendingUp, Shield, AlertTriangle, BarChart3, Brain, Zap, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'rgba(8,14,28,0.95)', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
      {/* Disclaimer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div
          className="glass-card-static p-4 mb-8"
          style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)' }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} style={{ color: 'var(--color-amber)', marginTop: '2px', flexShrink: 0 }} />
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-amber)' }}>Disclaimer: </strong>
              AI predictions are statistical estimates based on historical and current data. They are{' '}
              <strong>not guaranteed future prices</strong> and should not be treated as investment advice.
              Past performance does not guarantee future results. Please consult a qualified financial advisor
              before making investment decisions.
            </p>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 2px 12px rgba(59,130,246,0.3)' }}
              >
                <TrendingUp size={14} color="white" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-sm" style={{ color: 'var(--color-text-primary)' }}>MarketLens AI</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              AI-powered stock research platform for the Indian market. Ensemble ML models, explainable AI.
            </p>
          </div>

          {/* Research */}
          <div>
            <h4 className="text-xs font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Research</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Stock Analysis', to: '/' },
                { label: 'AI Screener', to: '/screener' },
                { label: 'Market Heatmap', to: '/markets' },
                { label: 'AI Predictions', to: '/' },
              ].map(item => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-xs no-underline transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-bright)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-xs font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Tools</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Watchlist', to: '/watchlist' },
                { label: 'Portfolio Analyzer', to: '/portfolio' },
                { label: 'Technical Charts', to: '/' },
                { label: 'Fundamental Data', to: '/' },
              ].map(item => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-xs no-underline transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-bright)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Trust */}
          <div>
            <h4 className="text-xs font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Trust</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { icon: Shield, label: 'Transparent Models', color: 'var(--color-green-bright)' },
                { icon: Brain,  label: 'Explainable AI',    color: 'var(--color-purple-bright)' },
                { icon: Zap,    label: 'Walk-Forward Tests', color: 'var(--color-amber-bright)' },
                { icon: Activity, label: 'Probability Ranges', color: 'var(--color-cyan-bright)' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <item.icon size={11} style={{ color: item.color, flexShrink: 0 }} />
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between py-4 gap-2"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            © 2026 MarketLens AI. For educational & research purposes only.
          </p>
          <div className="flex items-center gap-3">
            <span className="demo-badge">DEMO MODE</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Data: Simulated</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
