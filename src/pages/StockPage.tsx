import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Brain, Target, BarChart3, FileText, Shield,
  Newspaper, Activity, ChevronDown, ChevronUp, Info, Zap, AlertTriangle,
  CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, CartesianGrid, ComposedChart,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  getStock, getAIScore, getPricePrediction, getTechnicalIndicators,
  getFundamentals, getSWOT, getAnalystConsensus, getNewsSentiment,
  getBacktestResult, getHistoricalPrices
} from '../data/mockDataProvider';

// ---- Helper Components ----

function ScoreRing({ value, size = 100, label }: { value: number; size?: number; label?: string }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 80 ? '#10b981' : value >= 60 ? '#3b82f6' : value >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-surface-3)" strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div className="score-value flex flex-col items-center">
        <span style={{ fontSize: size * 0.28, color }}>{value}</span>
        {label && <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{label}</span>}
      </div>
    </div>
  );
}

function ScoreBar({ label, value, tooltip }: { label: string; value: number; tooltip?: string }) {
  const color = value >= 80 ? '#10b981' : value >= 60 ? '#3b82f6' : value >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
          {tooltip && (
            <div className="tooltip-trigger">
              <Info size={11} style={{ color: 'var(--color-text-muted)' }} />
              <div className="tooltip-content">{tooltip}</div>
            </div>
          )}
        </div>
        <span className="text-xs font-mono font-bold" style={{ color }}>{value}/100</span>
      </div>
      <div className="score-bar">
        <div className="score-bar-fill" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>
    </div>
  );
}

function SectionCard({ id, title, icon: Icon, iconColor, children, defaultOpen = true }: {
  id: string; title: string; icon: any; iconColor: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={id} className="glass-card-static overflow-hidden mb-5">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <div className="flex items-center gap-2">
          <Icon size={18} style={{ color: iconColor }} />
          <h2 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>{title}</h2>
        </div>
        {open ? <ChevronUp size={18} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--color-text-muted)' }} />}
      </button>
      {open && <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--color-border)' }}>{children}</div>}
    </div>
  );
}

// ---- Main Stock Page ----

export default function StockPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const [chartPeriod, setChartPeriod] = useState('1Y');

  const stock = useMemo(() => getStock(symbol || ''), [symbol]);
  const aiScore = useMemo(() => getAIScore(symbol || ''), [symbol]);
  const prediction = useMemo(() => symbol ? getPricePrediction(symbol) : null, [symbol]);
  const technicals = useMemo(() => symbol ? getTechnicalIndicators(symbol) : null, [symbol]);
  const fundamentals = useMemo(() => symbol ? getFundamentals(symbol) : null, [symbol]);
  const swot = useMemo(() => symbol ? getSWOT(symbol) : null, [symbol]);
  const consensus = useMemo(() => symbol ? getAnalystConsensus(symbol) : null, [symbol]);
  const news = useMemo(() => symbol ? getNewsSentiment(symbol) : null, [symbol]);
  const backtest = useMemo(() => symbol ? getBacktestResult(symbol) : null, [symbol]);
  const historicalPrices = useMemo(() => symbol ? getHistoricalPrices(symbol) : [], [symbol]);

  if (!stock || !prediction || !technicals || !fundamentals || !swot || !consensus || !news || !backtest) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Stock Not Found</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>The symbol "{symbol}" is not available in demo mode.</p>
      </div>
    );
  }

  const positive = stock.changePercent >= 0;
  const verdictColor = aiScore.verdict.includes('Bullish') ? 'var(--color-green)' : aiScore.verdict.includes('Bearish') ? 'var(--color-red)' : 'var(--color-amber)';

  const daysMap: Record<string, number> = { '1D': 1, '1W': 5, '1M': 22, '3M': 66, '6M': 132, '1Y': 252, '5Y': 1260 };
  const filteredPrices = historicalPrices.slice(-Math.min(daysMap[chartPeriod] || 252, historicalPrices.length));

  const chartData = filteredPrices.map(p => ({ date: p.date, price: p.close, volume: p.volume }));

  const radarData = [
    { metric: 'Fundamental', value: aiScore.fundamental },
    { metric: 'Technical', value: aiScore.technical },
    { metric: 'Valuation', value: aiScore.valuation },
    { metric: 'Momentum', value: aiScore.momentum },
    { metric: 'Risk', value: aiScore.risk },
    { metric: 'Sentiment', value: aiScore.sentiment },
  ];

  const totalAnalysts = consensus.buy + consensus.hold + consensus.sell;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      {/* ---- Stock Header ---- */}
      <div className="glass-card-static p-5 mb-5 animate-fade-in-up">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>{stock.symbol}</h1>
              <span className="demo-badge">DEMO</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{stock.name} · {stock.sector} · {stock.exchange}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl font-extrabold font-mono" style={{ color: 'var(--color-text-primary)' }}>₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: positive ? 'var(--color-green-soft)' : 'var(--color-red-soft)' }}>
                {positive ? <ArrowUpRight size={16} style={{ color: 'var(--color-green)' }} /> : <ArrowDownRight size={16} style={{ color: 'var(--color-red)' }} />}
                <span className="text-sm font-mono font-bold" style={{ color: positive ? 'var(--color-green)' : 'var(--color-red)' }}>
                  {positive ? '+' : ''}₹{stock.change.toFixed(2)} ({positive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Clock size={11} style={{ color: 'var(--color-text-muted)' }} />
              <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{stock.lastUpdated} · {stock.exchange}</span>
            </div>
          </div>

          {/* AI Score + Verdict */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <ScoreRing value={aiScore.overall} size={90} label="/100" />
              <p className="text-xs font-bold mt-1" style={{ color: 'var(--color-accent)' }}>AI Score</p>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold px-4 py-2 rounded-lg" style={{ background: positive ? 'var(--color-green-soft)' : aiScore.verdict.includes('Bearish') ? 'var(--color-red-soft)' : 'var(--color-amber-soft)', color: verdictColor }}>
                {aiScore.verdict}
              </div>
              <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>AI Verdict</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-5 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          {[
            { label: 'Open', value: `₹${stock.open.toLocaleString('en-IN')}` },
            { label: 'Day High', value: `₹${stock.dayHigh.toLocaleString('en-IN')}` },
            { label: 'Day Low', value: `₹${stock.dayLow.toLocaleString('en-IN')}` },
            { label: 'Prev Close', value: `₹${stock.prevClose.toLocaleString('en-IN')}` },
            { label: '52W High', value: `₹${stock.high52.toLocaleString('en-IN')}` },
            { label: '52W Low', value: `₹${stock.low52.toLocaleString('en-IN')}` },
            { label: 'Volume', value: (stock.volume / 1e6).toFixed(1) + 'M' },
            { label: 'Mkt Cap', value: stock.marketCap >= 100000 ? `₹${(stock.marketCap / 100000).toFixed(1)}L Cr` : `₹${(stock.marketCap / 1000).toFixed(0)}K Cr` },
          ].map(s => (
            <div key={s.label}>
              <p className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
              <p className="text-xs font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Two Column Layout ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-5">

          {/* AI Score Breakdown */}
          <SectionCard id="ai-score" title="AI Score Breakdown" icon={Brain} iconColor="var(--color-purple)" defaultOpen={true}>
            <div className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ScoreBar label="Fundamental" value={aiScore.fundamental} tooltip="Based on financial health: PE, ROE, profit growth, debt levels" />
                  <ScoreBar label="Technical" value={aiScore.technical} tooltip="Based on price patterns: moving averages, RSI, MACD, trend strength" />
                  <ScoreBar label="Valuation" value={aiScore.valuation} tooltip="Current valuation vs historical and peer averages" />
                  <ScoreBar label="Momentum" value={aiScore.momentum} tooltip="Price momentum across multiple timeframes" />
                  <ScoreBar label="Risk" value={aiScore.risk} tooltip="Volatility-adjusted risk assessment. Higher = Lower Risk" />
                  <ScoreBar label="Sentiment" value={aiScore.sentiment} tooltip="News & analyst sentiment analysis" />
                </div>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="var(--color-border)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                      <PolarRadiusAxis tick={false} domain={[0, 100]} axisLine={false} />
                      <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* AI Price Prediction */}
          <SectionCard id="prediction" title="AI Price Prediction" icon={Target} iconColor="var(--color-cyan)" defaultOpen={true}>
            <div className="pt-4">
              {/* Disclaimer */}
              <div className="flex items-start gap-2 p-3 rounded-lg mb-4" style={{ background: 'var(--color-amber-soft)' }}>
                <AlertTriangle size={14} style={{ color: 'var(--color-amber)', marginTop: '1px', flexShrink: 0 }} />
                <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                  Predictions are statistical estimates, not guaranteed prices. Confidence reflects model certainty, not probability of outcome. Model: {prediction.modelVersion}
                </p>
              </div>

              {/* Price Ranges */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {[
                  { label: '1 Day', data: prediction.day1 },
                  { label: '7 Days', data: prediction.day7 },
                  { label: '30 Days', data: prediction.day30 },
                  { label: '90 Days', data: prediction.day90 },
                  { label: '1 Year', data: prediction.year1 },
                ].map(p => (
                  <div key={p.label} className="p-3 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                    <p className="text-[10px] font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>{p.label}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[10px]" style={{ color: 'var(--color-red)' }}>Low</span>
                        <span className="text-xs font-mono font-semibold" style={{ color: 'var(--color-red)' }}>₹{p.data.low.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px]" style={{ color: 'var(--color-accent)' }}>Mid</span>
                        <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-accent)' }}>₹{p.data.mid.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px]" style={{ color: 'var(--color-green)' }}>High</span>
                        <span className="text-xs font-mono font-semibold" style={{ color: 'var(--color-green)' }}>₹{p.data.high.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                      <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Confidence: </span>
                      <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--color-accent)' }}>{p.data.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Expected Return (30D)</p>
                  <p className="text-lg font-bold font-mono" style={{ color: prediction.expectedReturn >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}>
                    {prediction.expectedReturn >= 0 ? '+' : ''}{prediction.expectedReturn}%
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Model Confidence</p>
                  <p className="text-lg font-bold font-mono" style={{ color: 'var(--color-accent)' }}>{prediction.confidence}%</p>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Prediction Status</p>
                  <p className="text-sm font-bold" style={{ color: verdictColor }}>{prediction.status}</p>
                </div>
              </div>

              {/* Ensemble Model Weights */}
              <div className="mb-4">
                <h4 className="text-xs font-bold mb-3" style={{ color: 'var(--color-text-secondary)' }}>Ensemble Model Weights</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {prediction.modelWeights.map(m => (
                    <div key={m.model} className="p-3 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                      <p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>{m.model}</p>
                      <p className="text-lg font-bold font-mono" style={{ color: 'var(--color-accent)' }}>{(m.weight * 100).toFixed(0)}%</p>
                      <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Accuracy: {m.accuracy}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Bull/Base/Bear Scenarios */}
          <SectionCard id="scenarios" title="Bull / Base / Bear Scenarios" icon={Activity} iconColor="var(--color-amber)" defaultOpen={true}>
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { data: prediction.bull, label: 'BULL CASE', cls: 'scenario-bull', color: 'var(--color-green)' },
                { data: prediction.base, label: 'BASE CASE', cls: 'scenario-base', color: 'var(--color-accent)' },
                { data: prediction.bear, label: 'BEAR CASE', cls: 'scenario-bear', color: 'var(--color-red)' },
              ].map(sc => (
                <div key={sc.label} className={`${sc.cls} p-4 rounded-xl`}>
                  <p className="text-[10px] font-bold tracking-wider mb-2" style={{ color: sc.color }}>{sc.label}</p>
                  <p className="text-2xl font-extrabold font-mono mb-1" style={{ color: 'var(--color-text-primary)' }}>
                    ₹{sc.data.price.toLocaleString('en-IN')}
                  </p>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono" style={{ color: sc.color }}>
                      {sc.data.returnPercent >= 0 ? '+' : ''}{sc.data.returnPercent}%
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--color-surface-3)', color: 'var(--color-text-secondary)' }}>
                      Prob: {sc.data.probability}%
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {sc.data.conditions.map((c, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: sc.color }} />
                        <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Prediction Explanation */}
          <SectionCard id="explain" title="Prediction Explanation — Why This Prediction?" icon={Zap} iconColor="var(--color-amber)" defaultOpen={true}>
            <div className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bullish Reasons */}
                <div>
                  <h4 className="text-xs font-bold mb-3 flex items-center gap-1" style={{ color: 'var(--color-green)' }}>
                    <CheckCircle2 size={14} /> Why the model is bullish
                  </h4>
                  <div className="space-y-2">
                    {prediction.bullishReasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'var(--color-green-soft)' }}>
                        <CheckCircle2 size={13} style={{ color: 'var(--color-green)', marginTop: '1px', flexShrink: 0 }} />
                        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risks */}
                <div>
                  <h4 className="text-xs font-bold mb-3 flex items-center gap-1" style={{ color: 'var(--color-red)' }}>
                    <AlertTriangle size={14} /> Risks & Concerns
                  </h4>
                  <div className="space-y-2">
                    {prediction.bearishReasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'var(--color-red-soft)' }}>
                        <AlertTriangle size={13} style={{ color: 'var(--color-red)', marginTop: '1px', flexShrink: 0 }} />
                        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature Contributions (SHAP-like) */}
              <div className="mt-6">
                <h4 className="text-xs font-bold mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                  Feature Contributions (SHAP-based)
                </h4>
                <div className="space-y-2">
                  {prediction.featureContributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)).map(f => {
                    const isPositive = f.direction === 'positive';
                    const width = Math.min(Math.abs(f.contribution) * 4, 100);
                    return (
                      <div key={f.feature} className="flex items-center gap-3">
                        <span className="text-xs w-32 shrink-0 text-right" style={{ color: 'var(--color-text-muted)' }}>{f.feature}</span>
                        <div className="flex-1 flex items-center">
                          <div className="h-5 rounded" style={{
                            width: `${width}%`,
                            background: isPositive ? 'linear-gradient(90deg, #10b98133, #10b981)' : 'linear-gradient(90deg, #ef444433, #ef4444)',
                            minWidth: '20px'
                          }} />
                          <span className="text-xs font-mono font-bold ml-2" style={{ color: isPositive ? 'var(--color-green)' : 'var(--color-red)' }}>
                            {isPositive ? '+' : ''}{f.contribution}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Technical Analysis Chart */}
          <SectionCard id="technicals" title="Technical Analysis" icon={BarChart3} iconColor="var(--color-accent)" defaultOpen={true}>
            <div className="pt-4">
              {/* Chart Period Selector */}
              <div className="tab-group mb-4 w-fit">
                {['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'].map(p => (
                  <button key={p} className={`tab-item ${chartPeriod === p ? 'active' : ''}`} onClick={() => setChartPeriod(p)}>{p}</button>
                ))}
              </div>

              {/* Price Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={d => d.slice(5)} interval="preserveStartEnd" />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => `₹${v}`} />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '12px' }}
                    labelStyle={{ color: 'var(--color-text-muted)' }}
                    formatter={(v: any) => [`₹${Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 'Price']}
                  />
                  <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fill="url(#priceGrad)" />
                </ComposedChart>
              </ResponsiveContainer>

              {/* Volume Chart */}
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={chartData}>
                  <Bar dataKey="volume" fill="var(--color-surface-4)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Technical Summary */}
              <div className="p-4 rounded-xl mt-4" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                <p className="text-xs font-bold mb-2 flex items-center gap-1" style={{ color: 'var(--color-accent)' }}>
                  <Brain size={13} /> AI Technical Summary
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{technicals.summary}</p>
              </div>

              {/* Key Indicators Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[
                  { label: 'RSI (14)', value: technicals.rsi.toFixed(1), color: technicals.rsi > 70 ? 'var(--color-red)' : technicals.rsi < 30 ? 'var(--color-green)' : 'var(--color-accent)', tooltip: 'Relative Strength Index. >70 = overbought, <30 = oversold' },
                  { label: 'MACD', value: technicals.macd.toFixed(2), color: technicals.macd > 0 ? 'var(--color-green)' : 'var(--color-red)', tooltip: 'Moving Average Convergence Divergence — momentum indicator' },
                  { label: 'ADX', value: technicals.adx.toFixed(1), color: technicals.adx > 25 ? 'var(--color-green)' : 'var(--color-amber)', tooltip: 'Average Directional Index. >25 = strong trend' },
                  { label: 'ATR', value: `₹${technicals.atr.toFixed(2)}`, color: 'var(--color-text-primary)', tooltip: 'Average True Range — measures daily volatility' },
                  { label: 'SMA 50', value: `₹${technicals.sma50.toLocaleString('en-IN')}`, color: stock.price > technicals.sma50 ? 'var(--color-green)' : 'var(--color-red)', tooltip: '50-day Simple Moving Average' },
                  { label: 'SMA 200', value: `₹${technicals.sma200.toLocaleString('en-IN')}`, color: stock.price > technicals.sma200 ? 'var(--color-green)' : 'var(--color-red)', tooltip: '200-day Simple Moving Average' },
                  { label: 'Support', value: `₹${technicals.support.toLocaleString('en-IN')}`, color: 'var(--color-green)', tooltip: 'Key support level based on price action' },
                  { label: 'Resistance', value: `₹${technicals.resistance.toLocaleString('en-IN')}`, color: 'var(--color-red)', tooltip: 'Key resistance level based on price action' },
                ].map(ind => (
                  <div key={ind.label} className="p-3 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{ind.label}</span>
                      <div className="tooltip-trigger">
                        <Info size={10} style={{ color: 'var(--color-text-muted)' }} />
                        <div className="tooltip-content">{ind.tooltip}</div>
                      </div>
                    </div>
                    <p className="text-sm font-mono font-bold" style={{ color: ind.color }}>{ind.value}</p>
                  </div>
                ))}
              </div>

              {/* Trend Badge */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Trend:</span>
                <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{
                  background: technicals.trend === 'Bullish' ? 'var(--color-green-soft)' : technicals.trend === 'Bearish' ? 'var(--color-red-soft)' : 'var(--color-amber-soft)',
                  color: technicals.trend === 'Bullish' ? 'var(--color-green)' : technicals.trend === 'Bearish' ? 'var(--color-red)' : 'var(--color-amber)',
                }}>
                  {technicals.trend}
                </span>
              </div>
            </div>
          </SectionCard>

          {/* Fundamental Analysis */}
          <SectionCard id="fundamentals" title="Fundamental Analysis" icon={FileText} iconColor="var(--color-green)" defaultOpen={false}>
            <div className="pt-4">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'PE Ratio', value: fundamentals.pe.toFixed(1) + 'x', tooltip: 'Price to Earnings ratio — how much investors pay for each ₹1 of earnings', compare: `Industry: ${fundamentals.industryPE}x` },
                  { label: 'PB Ratio', value: fundamentals.pb.toFixed(1) + 'x', tooltip: 'Price to Book Value ratio' },
                  { label: 'EPS', value: `₹${fundamentals.eps.toFixed(1)}`, tooltip: 'Earnings Per Share — profit per share' },
                  { label: 'ROE', value: fundamentals.roe.toFixed(1) + '%', tooltip: 'Return on Equity — how efficiently the company uses shareholder capital', color: fundamentals.roe > 15 ? 'var(--color-green)' : 'var(--color-amber)' },
                  { label: 'ROCE', value: fundamentals.roce.toFixed(1) + '%', tooltip: 'Return on Capital Employed', color: fundamentals.roce > 20 ? 'var(--color-green)' : 'var(--color-amber)' },
                  { label: 'Debt/Equity', value: fundamentals.debtEquity.toFixed(2), tooltip: 'Total debt relative to equity. Lower is generally better.', color: fundamentals.debtEquity < 0.5 ? 'var(--color-green)' : 'var(--color-red)' },
                  { label: 'Dividend Yield', value: fundamentals.dividendYield.toFixed(2) + '%', tooltip: 'Annual dividend as percentage of stock price' },
                  { label: 'Promoter Holding', value: fundamentals.promoterHolding.toFixed(1) + '%', tooltip: 'Percentage of shares held by company promoters' },
                ].map(m => (
                  <div key={m.label} className="p-3 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{m.label}</span>
                      <div className="tooltip-trigger">
                        <Info size={10} style={{ color: 'var(--color-text-muted)' }} />
                        <div className="tooltip-content">{m.tooltip}</div>
                      </div>
                    </div>
                    <p className="text-sm font-mono font-bold" style={{ color: (m as any).color || 'var(--color-text-primary)' }}>{m.value}</p>
                    {(m as any).compare && <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{(m as any).compare}</p>}
                  </div>
                ))}
              </div>

              {/* Revenue & Profit Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
                  <h4 className="text-xs font-bold mb-3" style={{ color: 'var(--color-text-secondary)' }}>Revenue Trend (₹ Cr)</h4>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={fundamentals.historicalRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
                  <h4 className="text-xs font-bold mb-3" style={{ color: 'var(--color-text-secondary)' }}>Net Profit Trend (₹ Cr)</h4>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={fundamentals.historicalProfit}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* EPS & ROE Trends */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
                  <h4 className="text-xs font-bold mb-3" style={{ color: 'var(--color-text-secondary)' }}>EPS Growth (₹)</h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={fundamentals.historicalEPS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                      <Tooltip contentStyle={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
                  <h4 className="text-xs font-bold mb-3" style={{ color: 'var(--color-text-secondary)' }}>ROE Trend (%)</h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={fundamentals.historicalROE}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                      <Tooltip contentStyle={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* AI SWOT Analysis */}
          <SectionCard id="swot" title="AI SWOT Analysis" icon={Shield} iconColor="var(--color-purple)" defaultOpen={false}>
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Strengths', items: swot.strengths, color: 'var(--color-green)', bg: 'var(--color-green-soft)', icon: CheckCircle2 },
                { label: 'Weaknesses', items: swot.weaknesses, color: 'var(--color-red)', bg: 'var(--color-red-soft)', icon: XCircle },
                { label: 'Opportunities', items: swot.opportunities, color: 'var(--color-accent)', bg: 'var(--color-accent-glow)', icon: ArrowUpRight },
                { label: 'Threats', items: swot.threats, color: 'var(--color-amber)', bg: 'var(--color-amber-soft)', icon: AlertTriangle },
              ].map(section => (
                <div key={section.label} className="p-4 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                  <h4 className="text-xs font-bold mb-3 flex items-center gap-1" style={{ color: section.color }}>
                    <section.icon size={14} /> {section.label}
                  </h4>
                  <div className="space-y-2">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: section.bg }}>
                        <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: section.color }} />
                        <span className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Backtest */}
          <SectionCard id="backtest" title="Walk-Forward Backtest Results" icon={Activity} iconColor="var(--color-cyan)" defaultOpen={false}>
            <div className="pt-4">
              <div className="flex items-start gap-2 p-3 rounded-lg mb-4" style={{ background: 'var(--color-amber-soft)' }}>
                <AlertTriangle size={14} style={{ color: 'var(--color-amber)', marginTop: '1px', flexShrink: 0 }} />
                <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                  Backtested results are historical simulations and do not guarantee future performance. Walk-forward validation: Train 2018–2023, Validate 2024, Test 2025.
                </p>
              </div>

              {/* Equity Curve */}
              <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--color-surface-2)' }}>
                <h4 className="text-xs font-bold mb-3" style={{ color: 'var(--color-text-secondary)' }}>Equity Curve: Model vs NIFTY 50 (₹1L initial)</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={backtest.equityCurve}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={d => d.slice(5)} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="value" name="Model" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nifty" name="NIFTY 50" stroke="#8b5cf6" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Backtest Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Strategy Return', value: `${backtest.strategyReturn.toFixed(1)}%`, color: backtest.strategyReturn > 0 ? 'var(--color-green)' : 'var(--color-red)' },
                  { label: 'NIFTY Return', value: `${backtest.niftyReturn.toFixed(1)}%`, color: backtest.niftyReturn > 0 ? 'var(--color-green)' : 'var(--color-red)' },
                  { label: 'Max Drawdown', value: `${backtest.maxDrawdown}%`, color: 'var(--color-red)' },
                  { label: 'Sharpe Ratio', value: backtest.sharpeRatio.toFixed(2), color: backtest.sharpeRatio > 1 ? 'var(--color-green)' : 'var(--color-amber)' },
                  { label: 'MAE', value: `₹${backtest.mae.toFixed(1)}`, color: 'var(--color-text-primary)' },
                  { label: 'RMSE', value: `₹${backtest.rmse.toFixed(1)}`, color: 'var(--color-text-primary)' },
                  { label: 'MAPE', value: `${backtest.mape.toFixed(2)}%`, color: 'var(--color-text-primary)' },
                  { label: 'Dir. Accuracy', value: `${backtest.directionalAccuracy.toFixed(1)}%`, color: backtest.directionalAccuracy > 55 ? 'var(--color-green)' : 'var(--color-amber)' },
                ].map(m => (
                  <div key={m.label} className="p-3 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{m.label}</p>
                    <p className="text-sm font-mono font-bold" style={{ color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">

          {/* AI Price Range Card */}
          <div className="glass-card-static p-5 animate-fade-in-up delay-100">
            <h3 className="text-xs font-bold mb-4 flex items-center gap-1" style={{ color: 'var(--color-cyan)' }}>
              <Target size={14} /> AI PRICE RANGE (30D)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--color-green)' }}>Bull</span>
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--color-green)' }}>₹{prediction.bull.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--color-accent)' }}>Base</span>
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--color-accent)' }}>₹{prediction.base.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--color-red)' }}>Bear</span>
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--color-red)' }}>₹{prediction.bear.price.toLocaleString('en-IN')}</span>
              </div>
              {/* Visual Range Bar */}
              <div className="mt-3 relative h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-3)' }}>
                <div className="absolute inset-y-0 rounded-full" style={{
                  left: '15%', right: '15%',
                  background: 'linear-gradient(90deg, #ef4444, #f59e0b, #10b981)'
                }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border-2" style={{
                  left: '48%', borderColor: 'var(--color-accent)'
                }} />
              </div>
              <div className="flex justify-between text-[9px]" style={{ color: 'var(--color-text-muted)' }}>
                <span>₹{prediction.bear.price.toLocaleString('en-IN')}</span>
                <span>Current</span>
                <span>₹{prediction.bull.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Analyst Consensus */}
          <div className="glass-card-static p-5 animate-fade-in-up delay-200">
            <h3 className="text-xs font-bold mb-4" style={{ color: 'var(--color-text-secondary)' }}>Analyst Consensus</h3>
            <div className="flex gap-1 h-6 rounded-full overflow-hidden mb-3">
              <div style={{ width: `${(consensus.buy / totalAnalysts) * 100}%`, background: 'var(--color-green)' }} className="flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">{consensus.buy}</span>
              </div>
              <div style={{ width: `${(consensus.hold / totalAnalysts) * 100}%`, background: 'var(--color-amber)' }} className="flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">{consensus.hold}</span>
              </div>
              <div style={{ width: `${(consensus.sell / totalAnalysts) * 100}%`, background: 'var(--color-red)' }} className="flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">{consensus.sell}</span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] mb-4" style={{ color: 'var(--color-text-muted)' }}>
              <span style={{ color: 'var(--color-green)' }}>Buy</span>
              <span style={{ color: 'var(--color-amber)' }}>Hold</span>
              <span style={{ color: 'var(--color-red)' }}>Sell</span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between"><span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Average Target</span><span className="text-xs font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>₹{consensus.averageTarget.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Highest</span><span className="text-xs font-mono" style={{ color: 'var(--color-green)' }}>₹{consensus.highestTarget.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Lowest</span><span className="text-xs font-mono" style={{ color: 'var(--color-red)' }}>₹{consensus.lowestTarget.toLocaleString('en-IN')}</span></div>
            </div>

            {/* AI vs Analyst Comparison */}
            <div className="p-3 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <p className="text-[10px] font-bold mb-2" style={{ color: 'var(--color-text-muted)' }}>AI vs Analyst</p>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs" style={{ color: 'var(--color-accent)' }}>AI Model</span>
                <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-accent)' }}>₹{prediction.base.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs" style={{ color: 'var(--color-purple)' }}>Analyst Avg</span>
                <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-purple)' }}>₹{consensus.averageTarget.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Difference</span>
                <span className="text-xs font-mono font-bold" style={{ color: prediction.base.price >= consensus.averageTarget ? 'var(--color-green)' : 'var(--color-red)' }}>
                  {((prediction.base.price / consensus.averageTarget - 1) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* News Sentiment */}
          <div className="glass-card-static p-5 animate-fade-in-up delay-300">
            <h3 className="text-xs font-bold mb-4 flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
              <Newspaper size={14} /> News & Sentiment
            </h3>
            {/* Sentiment Score */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Overall Sentiment:</span>
              {(() => {
                const avgScore = news.reduce((a, n) => a + n.score, 0) / news.length;
                const label = avgScore >= 0.6 ? 'Positive' : avgScore >= 0.4 ? 'Neutral' : 'Negative';
                const color = avgScore >= 0.6 ? 'var(--color-green)' : avgScore >= 0.4 ? 'var(--color-amber)' : 'var(--color-red)';
                return <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: avgScore >= 0.6 ? 'var(--color-green-soft)' : avgScore >= 0.4 ? 'var(--color-amber-soft)' : 'var(--color-red-soft)', color }}>{label} ({(avgScore * 100).toFixed(0)})</span>;
              })()}
            </div>
            <div className="space-y-3">
              {news.slice(0, 5).map((n, i) => (
                <div key={i} className="p-3 rounded-lg" style={{ background: 'var(--color-surface-2)' }}>
                  <p className="text-xs font-medium leading-relaxed mb-1.5" style={{ color: 'var(--color-text-primary)' }}>{n.headline}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{n.source}</span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>·</span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{n.time}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{
                      background: n.sentiment === 'Positive' ? 'var(--color-green-soft)' : n.sentiment === 'Negative' ? 'var(--color-red-soft)' : 'var(--color-amber-soft)',
                      color: n.sentiment === 'Positive' ? 'var(--color-green)' : n.sentiment === 'Negative' ? 'var(--color-red)' : 'var(--color-amber)'
                    }}>{n.sentiment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Transparency */}
          <div className="glass-card-static p-5 animate-fade-in-up delay-400">
            <h3 className="text-xs font-bold mb-3 flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
              <Shield size={14} style={{ color: 'var(--color-green)' }} /> Transparency
            </h3>
            <div className="space-y-2 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              <div className="flex justify-between"><span>Prediction Time</span><span className="font-mono">{prediction.timestamp}</span></div>
              <div className="flex justify-between"><span>Model Version</span><span className="font-mono">{prediction.modelVersion}</span></div>
              <div className="flex justify-between"><span>Data Source</span><span className="font-mono">DEMO (Simulated)</span></div>
              <div className="flex justify-between"><span>Confidence</span><span className="font-mono">{prediction.confidence}%</span></div>
              <div className="flex justify-between"><span>Exchange</span><span className="font-mono">{stock.exchange}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
