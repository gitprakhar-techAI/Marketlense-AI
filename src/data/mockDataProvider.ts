// ============================================================
// MarketLens AI — Mock Data Provider (DEMO MODE)
// ============================================================
// This provider supplies realistic demo data for development.
// In production, replace with real market data APIs.
// All data is clearly labeled as DEMO/simulated.
// ============================================================

import type {
  MarketIndex, Stock, AIScore, PricePrediction,
  TechnicalIndicators, FundamentalData, SWOT,
  AnalystConsensus, NewsSentiment, BacktestResult,
  HistoricalPrice, SectorData, WatchlistItem, PortfolioHolding,
  FeatureContribution, ModelWeight
} from '../types';

// ---- Market Indices ----
export function getMarketIndices(): MarketIndex[] {
  return [
    {
      name: 'NIFTY 50', symbol: 'NIFTY', value: 24856.15, change: 187.45, changePercent: 0.76,
      sparkline: [24200, 24350, 24100, 24500, 24650, 24400, 24700, 24550, 24800, 24668, 24750, 24856],
      lastUpdated: '26 Oct 2026, 10:15 AM'
    },
    {
      name: 'SENSEX', symbol: 'SENSEX', value: 81432.70, change: 612.35, changePercent: 0.76,
      sparkline: [79800, 80100, 79600, 80400, 80800, 80200, 81000, 80600, 81200, 80900, 81100, 81432],
      lastUpdated: '26 Oct 2026, 10:15 AM'
    },
    {
      name: 'BANK NIFTY', symbol: 'BANKNIFTY', value: 52145.90, change: -234.50, changePercent: -0.45,
      sparkline: [52800, 52600, 52900, 52400, 52100, 52500, 52200, 52600, 52350, 52100, 52250, 52145],
      lastUpdated: '26 Oct 2026, 10:15 AM'
    },
    {
      name: 'NIFTY IT', symbol: 'NIFTYIT', value: 38924.55, change: 456.20, changePercent: 1.19,
      sparkline: [37800, 38100, 37600, 38200, 38500, 38000, 38600, 38300, 38700, 38500, 38800, 38924],
      lastUpdated: '26 Oct 2026, 10:15 AM'
    },
    {
      name: 'NIFTY MIDCAP', symbol: 'NIFTYMIDCAP', value: 56234.80, change: 312.65, changePercent: 0.56,
      sparkline: [55400, 55700, 55200, 55900, 56100, 55600, 56200, 55800, 56300, 55900, 56100, 56234],
      lastUpdated: '26 Oct 2026, 10:15 AM'
    },
  ];
}

// ---- Stock Database ----
const stockDatabase: Record<string, Stock> = {
  TCS: {
    symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Information Technology', industry: 'IT Services',
    price: 4248.80, change: 69.95, changePercent: 1.67, marketCap: 1537000, volume: 3245000, avgVolume: 2890000,
    high52: 4592.25, low52: 3311.00, dayHigh: 4262.40, dayLow: 4178.90, open: 4185.00, prevClose: 4178.85,
    exchange: 'NSE', lastUpdated: '26 Oct 2026, 10:15 AM', isDemo: true,
  },
  RELIANCE: {
    symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', industry: 'Oil & Gas',
    price: 2734.55, change: -18.30, changePercent: -0.66, marketCap: 1852000, volume: 8456000, avgVolume: 7200000,
    high52: 3217.60, low52: 2220.30, dayHigh: 2756.00, dayLow: 2718.40, open: 2750.00, prevClose: 2752.85,
    exchange: 'NSE', lastUpdated: '26 Oct 2026, 10:15 AM', isDemo: true,
  },
  INFY: {
    symbol: 'INFY', name: 'Infosys', sector: 'Information Technology', industry: 'IT Services',
    price: 1892.45, change: 34.20, changePercent: 1.84, marketCap: 786000, volume: 5621000, avgVolume: 4800000,
    high52: 2006.45, low52: 1358.35, dayHigh: 1898.00, dayLow: 1856.30, open: 1860.00, prevClose: 1858.25,
    exchange: 'NSE', lastUpdated: '26 Oct 2026, 10:15 AM', isDemo: true,
  },
  HDFCBANK: {
    symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Financial Services', industry: 'Banking',
    price: 1756.30, change: -12.45, changePercent: -0.70, marketCap: 1340000, volume: 9823000, avgVolume: 8500000,
    high52: 1880.00, low52: 1427.05, dayHigh: 1770.00, dayLow: 1745.20, open: 1768.00, prevClose: 1768.75,
    exchange: 'NSE', lastUpdated: '26 Oct 2026, 10:15 AM', isDemo: true,
  },
  ICICIBANK: {
    symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Financial Services', industry: 'Banking',
    price: 1289.70, change: 15.80, changePercent: 1.24, marketCap: 905000, volume: 7234000, avgVolume: 6100000,
    high52: 1362.35, low52: 970.05, dayHigh: 1295.00, dayLow: 1272.50, open: 1275.00, prevClose: 1273.90,
    exchange: 'NSE', lastUpdated: '26 Oct 2026, 10:15 AM', isDemo: true,
  },
  ITC: {
    symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG', industry: 'Tobacco & FMCG',
    price: 487.25, change: 3.15, changePercent: 0.65, marketCap: 608000, volume: 12456000, avgVolume: 10500000,
    high52: 528.50, low52: 399.35, dayHigh: 489.80, dayLow: 483.20, open: 484.50, prevClose: 484.10,
    exchange: 'NSE', lastUpdated: '26 Oct 2026, 10:15 AM', isDemo: true,
  },
  WIPRO: {
    symbol: 'WIPRO', name: 'Wipro Limited', sector: 'Information Technology', industry: 'IT Services',
    price: 562.80, change: 8.45, changePercent: 1.52, marketCap: 294000, volume: 4523000, avgVolume: 3800000,
    high52: 590.30, low52: 390.55, dayHigh: 565.00, dayLow: 553.20, open: 555.00, prevClose: 554.35,
    exchange: 'NSE', lastUpdated: '26 Oct 2026, 10:15 AM', isDemo: true,
  },
  SBIN: {
    symbol: 'SBIN', name: 'State Bank of India', sector: 'Financial Services', industry: 'Banking',
    price: 812.35, change: -5.60, changePercent: -0.68, marketCap: 725000, volume: 15678000, avgVolume: 13000000,
    high52: 912.10, low52: 600.20, dayHigh: 820.00, dayLow: 808.50, open: 818.00, prevClose: 817.95,
    exchange: 'NSE', lastUpdated: '26 Oct 2026, 10:15 AM', isDemo: true,
  },
  BHARTIARTL: {
    symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', industry: 'Telecom Services',
    price: 1678.90, change: 24.55, changePercent: 1.48, marketCap: 987000, volume: 3456000, avgVolume: 2900000,
    high52: 1779.00, low52: 1200.25, dayHigh: 1685.00, dayLow: 1652.30, open: 1655.00, prevClose: 1654.35,
    exchange: 'NSE', lastUpdated: '26 Oct 2026, 10:15 AM', isDemo: true,
  },
  HINDUNILVR: {
    symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'FMCG', industry: 'FMCG',
    price: 2534.15, change: -8.90, changePercent: -0.35, marketCap: 595000, volume: 2345000, avgVolume: 2100000,
    high52: 2859.30, low52: 2172.05, dayHigh: 2548.00, dayLow: 2520.40, open: 2542.00, prevClose: 2543.05,
    exchange: 'NSE', lastUpdated: '26 Oct 2026, 10:15 AM', isDemo: true,
  },
  MARUTI: {
    symbol: 'MARUTI', name: 'Maruti Suzuki India', sector: 'Automobile', industry: 'Auto',
    price: 12456.70, change: 234.50, changePercent: 1.92, marketCap: 392000, volume: 1234000, avgVolume: 1050000,
    high52: 13680.00, low52: 9837.55, dayHigh: 12500.00, dayLow: 12210.30, open: 12225.00, prevClose: 12222.20,
    exchange: 'NSE', lastUpdated: '26 Oct 2026, 10:15 AM', isDemo: true,
  },
  TATAMOTORS: {
    symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Automobile', industry: 'Auto',
    price: 845.60, change: 12.35, changePercent: 1.48, marketCap: 312000, volume: 18234000, avgVolume: 15000000,
    high52: 1179.00, low52: 620.55, dayHigh: 850.00, dayLow: 831.20, open: 834.00, prevClose: 833.25,
    exchange: 'NSE', lastUpdated: '26 Oct 2026, 10:15 AM', isDemo: true,
  },
};

export function searchStocks(query: string): Stock[] {
  const q = query.toUpperCase().trim();
  if (!q) return Object.values(stockDatabase).slice(0, 6);
  return Object.values(stockDatabase).filter(s =>
    s.symbol.includes(q) || s.name.toUpperCase().includes(q) || s.sector.toUpperCase().includes(q)
  );
}

export function getStock(symbol: string): Stock | null {
  return stockDatabase[symbol.toUpperCase()] || null;
}

export function getAllStocks(): Stock[] {
  return Object.values(stockDatabase);
}

// ---- AI Score ----
export function getAIScore(symbol: string): AIScore {
  const scores: Record<string, AIScore> = {
    TCS: { overall: 82, fundamental: 85, technical: 78, valuation: 72, momentum: 80, risk: 75, sentiment: 84, verdict: 'Moderately Bullish' },
    RELIANCE: { overall: 68, fundamental: 78, technical: 62, valuation: 58, momentum: 55, risk: 65, sentiment: 72, verdict: 'Neutral' },
    INFY: { overall: 79, fundamental: 82, technical: 80, valuation: 70, momentum: 78, risk: 72, sentiment: 80, verdict: 'Moderately Bullish' },
    HDFCBANK: { overall: 74, fundamental: 80, technical: 68, valuation: 75, momentum: 62, risk: 78, sentiment: 76, verdict: 'Neutral' },
    ICICIBANK: { overall: 81, fundamental: 83, technical: 82, valuation: 78, momentum: 80, risk: 76, sentiment: 79, verdict: 'Moderately Bullish' },
    ITC: { overall: 72, fundamental: 76, technical: 70, valuation: 82, momentum: 65, risk: 80, sentiment: 68, verdict: 'Neutral' },
    WIPRO: { overall: 76, fundamental: 74, technical: 78, valuation: 68, momentum: 76, risk: 70, sentiment: 75, verdict: 'Moderately Bullish' },
    SBIN: { overall: 65, fundamental: 72, technical: 58, valuation: 70, momentum: 52, risk: 60, sentiment: 65, verdict: 'Neutral' },
    BHARTIARTL: { overall: 84, fundamental: 80, technical: 86, valuation: 65, momentum: 88, risk: 72, sentiment: 85, verdict: 'Moderately Bullish' },
    HINDUNILVR: { overall: 62, fundamental: 75, technical: 55, valuation: 48, momentum: 45, risk: 80, sentiment: 70, verdict: 'Moderately Bearish' },
    MARUTI: { overall: 78, fundamental: 82, technical: 76, valuation: 68, momentum: 80, risk: 70, sentiment: 78, verdict: 'Moderately Bullish' },
    TATAMOTORS: { overall: 73, fundamental: 70, technical: 75, valuation: 72, momentum: 76, risk: 62, sentiment: 74, verdict: 'Neutral' },
  };
  return scores[symbol.toUpperCase()] || { overall: 70, fundamental: 70, technical: 70, valuation: 70, momentum: 70, risk: 70, sentiment: 70, verdict: 'Neutral' };
}

// ---- Price Prediction ----
export function getPricePrediction(symbol: string): PricePrediction {
  const stock = getStock(symbol);
  if (!stock) throw new Error(`Stock ${symbol} not found`);
  const p = stock.price;

  const featureContributions: FeatureContribution[] = [
    { feature: 'Momentum (20D)', contribution: 18, direction: 'positive' },
    { feature: 'Earnings Growth', contribution: 14, direction: 'positive' },
    { feature: 'Volume Trend', contribution: 9, direction: 'positive' },
    { feature: 'RSI Signal', contribution: 6, direction: 'positive' },
    { feature: 'Sector Momentum', contribution: 5, direction: 'positive' },
    { feature: 'Valuation Premium', contribution: -8, direction: 'negative' },
    { feature: 'Market Volatility', contribution: -5, direction: 'negative' },
    { feature: 'Resistance Proximity', contribution: -3, direction: 'negative' },
  ];

  const modelWeights: ModelWeight[] = [
    { model: 'XGBoost', weight: 0.40, accuracy: 72.3 },
    { model: 'LightGBM', weight: 0.25, accuracy: 70.8 },
    { model: 'LSTM (Sequential)', weight: 0.20, accuracy: 68.5 },
    { model: 'Statistical Baseline', weight: 0.15, accuracy: 64.2 },
  ];

  const bullishReasons = [
    'Price trading above 50-day moving average',
    'RSI in positive zone (58.4) — not overbought',
    'Positive quarterly earnings growth (+12.3% YoY)',
    'Increasing delivery volume over last 5 sessions',
    'Sector (IT) momentum positive (+1.19% today)',
    'Promoter holding stable at 72.3%',
  ];

  const bearishReasons = [
    'Current PE (28.5x) above 5-year median (25.2x)',
    'Market volatility elevated (India VIX at 14.8)',
    'Approaching resistance zone near ₹' + Math.round(p * 1.04),
    'Global tech sector headwinds from rate uncertainty',
    'Revenue growth slowing from 18% to 12% YoY',
  ];

  return {
    currentPrice: p,
    day1: { low: Math.round(p * 0.988), mid: Math.round(p * 1.005), high: Math.round(p * 1.015), confidence: 72 },
    day7: { low: Math.round(p * 0.975), mid: Math.round(p * 1.018), high: Math.round(p * 1.04), confidence: 68 },
    day30: { low: Math.round(p * 0.94), mid: Math.round(p * 1.045), high: Math.round(p * 1.09), confidence: 62 },
    day90: { low: Math.round(p * 0.90), mid: Math.round(p * 1.08), high: Math.round(p * 1.15), confidence: 55 },
    year1: { low: Math.round(p * 0.82), mid: Math.round(p * 1.18), high: Math.round(p * 1.35), confidence: 42 },
    bull: {
      price: Math.round(p * 1.12),
      probability: 25,
      returnPercent: 12,
      conditions: [
        'Strong earnings beat in upcoming quarter',
        'Positive sector momentum and deal wins',
        'Breakout above key resistance with volume',
        'Favorable macro environment for IT sector',
      ],
    },
    base: {
      price: Math.round(p * 1.045),
      probability: 50,
      returnPercent: 4.5,
      conditions: [
        'Earnings in line with estimates',
        'Normal market conditions prevail',
        'Moderate institutional buying continues',
        'Stable currency environment',
      ],
    },
    bear: {
      price: Math.round(p * 0.92),
      probability: 25,
      returnPercent: -8,
      conditions: [
        'Broad market correction (5-10%)',
        'Earnings miss or guidance cut',
        'Breakdown below key support levels',
        'Global risk-off sentiment',
      ],
    },
    expectedReturn: 4.35,
    confidence: 68,
    status: 'Moderately Bullish',
    bullishReasons,
    bearishReasons,
    featureContributions,
    modelWeights,
    timestamp: '26 Oct 2026, 10:15 AM',
    modelVersion: 'v2.4.1-ensemble',
  };
}

// ---- Technical Indicators ----
export function getTechnicalIndicators(symbol: string): TechnicalIndicators {
  const stock = getStock(symbol);
  if (!stock) throw new Error(`Stock ${symbol} not found`);
  const p = stock.price;
  return {
    sma20: Math.round(p * 0.985 * 100) / 100,
    sma50: Math.round(p * 0.97 * 100) / 100,
    sma100: Math.round(p * 0.955 * 100) / 100,
    sma200: Math.round(p * 0.92 * 100) / 100,
    ema20: Math.round(p * 0.988 * 100) / 100,
    ema50: Math.round(p * 0.975 * 100) / 100,
    rsi: 58.4,
    macd: 12.35,
    macdSignal: 8.72,
    macdHistogram: 3.63,
    atr: Math.round(p * 0.018 * 100) / 100,
    adx: 28.5,
    bbUpper: Math.round(p * 1.035 * 100) / 100,
    bbMiddle: Math.round(p * 0.985 * 100) / 100,
    bbLower: Math.round(p * 0.935 * 100) / 100,
    obv: 12456000,
    support: Math.round(p * 0.965 * 100) / 100,
    resistance: Math.round(p * 1.04 * 100) / 100,
    trend: 'Bullish',
    summary: `Short-term trend is bullish with price above key moving averages. RSI at 58.4 indicates positive momentum without being overbought. MACD histogram is positive and expanding. The stock is approaching resistance near ₹${Math.round(p * 1.04)} — a breakout could signal further upside. Support is strong near ₹${Math.round(p * 0.965)}.`,
  };
}

// ---- Fundamental Data ----
export function getFundamentals(symbol: string): FundamentalData {
  const fundamentals: Record<string, FundamentalData> = {
    TCS: {
      pe: 28.5, pb: 13.2, eps: 149.1, roe: 47.8, roce: 58.2, debtEquity: 0.04,
      revenue: 240000, revenueGrowth: 12.3, netProfit: 46500, profitGrowth: 9.8,
      ebitda: 64000, dividendYield: 1.42, freeCashFlow: 38000, bookValue: 321.5,
      faceValue: 1, promoterHolding: 72.3,
      historicalRevenue: [
        { year: 'FY22', value: 191000 }, { year: 'FY23', value: 210000 },
        { year: 'FY24', value: 225000 }, { year: 'FY25', value: 235000 }, { year: 'FY26E', value: 240000 },
      ],
      historicalProfit: [
        { year: 'FY22', value: 38300 }, { year: 'FY23', value: 40500 },
        { year: 'FY24', value: 42800 }, { year: 'FY25', value: 44200 }, { year: 'FY26E', value: 46500 },
      ],
      historicalEPS: [
        { year: 'FY22', value: 105.2 }, { year: 'FY23', value: 111.3 },
        { year: 'FY24', value: 121.8 }, { year: 'FY25', value: 135.5 }, { year: 'FY26E', value: 149.1 },
      ],
      historicalROE: [
        { year: 'FY22', value: 42.5 }, { year: 'FY23', value: 45.2 },
        { year: 'FY24', value: 46.8 }, { year: 'FY25', value: 47.1 }, { year: 'FY26E', value: 47.8 },
      ],
      historicalDebt: [
        { year: 'FY22', value: 0.05 }, { year: 'FY23', value: 0.04 },
        { year: 'FY24', value: 0.04 }, { year: 'FY25', value: 0.04 }, { year: 'FY26E', value: 0.04 },
      ],
      industryPE: 25.8, sectorPE: 26.2, niftyPE: 22.5,
    },
  };

  const defaultFundamentals: FundamentalData = {
    pe: 24.5, pb: 5.8, eps: 85.2, roe: 22.4, roce: 28.6, debtEquity: 0.35,
    revenue: 120000, revenueGrowth: 10.5, netProfit: 18500, profitGrowth: 8.2,
    ebitda: 32000, dividendYield: 1.8, freeCashFlow: 14000, bookValue: 245.0,
    faceValue: 2, promoterHolding: 55.0,
    historicalRevenue: [
      { year: 'FY22', value: 90000 }, { year: 'FY23', value: 100000 },
      { year: 'FY24', value: 108000 }, { year: 'FY25', value: 115000 }, { year: 'FY26E', value: 120000 },
    ],
    historicalProfit: [
      { year: 'FY22', value: 14000 }, { year: 'FY23', value: 15200 },
      { year: 'FY24', value: 16500 }, { year: 'FY25', value: 17800 }, { year: 'FY26E', value: 18500 },
    ],
    historicalEPS: [
      { year: 'FY22', value: 62.5 }, { year: 'FY23', value: 68.2 },
      { year: 'FY24', value: 74.5 }, { year: 'FY25', value: 80.1 }, { year: 'FY26E', value: 85.2 },
    ],
    historicalROE: [
      { year: 'FY22', value: 18.5 }, { year: 'FY23', value: 19.8 },
      { year: 'FY24', value: 20.5 }, { year: 'FY25', value: 21.6 }, { year: 'FY26E', value: 22.4 },
    ],
    historicalDebt: [
      { year: 'FY22', value: 0.42 }, { year: 'FY23', value: 0.40 },
      { year: 'FY24', value: 0.38 }, { year: 'FY25', value: 0.36 }, { year: 'FY26E', value: 0.35 },
    ],
    industryPE: 22.0, sectorPE: 23.5, niftyPE: 22.5,
  };

  return fundamentals[symbol.toUpperCase()] || defaultFundamentals;
}

// ---- AI SWOT ----
export function getSWOT(symbol: string): SWOT {
  const swots: Record<string, SWOT> = {
    TCS: {
      strengths: [
        'ROE has remained above 42% for the last 5 years — industry-leading profitability',
        'Near-zero debt with debt/equity ratio of 0.04 — strongest balance sheet in sector',
        'Consistent dividend payer with 5-year average yield of 1.3%',
        'Largest IT services company by market cap with diversified client base across 46 countries',
        'Strong deal pipeline with $12.5B TCV in trailing 12 months',
      ],
      weaknesses: [
        'Current PE of 28.5x is above its 5-year median PE of 25.2x — valuation premium',
        'Revenue growth has decelerated from 18% to 12% over the past two years',
        'High attrition in mid-level management (14.2% LTM) impacting project delivery',
        'Geographic concentration — 52% revenue from North America',
      ],
      opportunities: [
        'AI/GenAI services opportunity estimated at $150B+ TAM by 2028',
        'Cloud migration deals accelerating — 35% of new deals include cloud transformation',
        'Market share gains in European market with recent large deal wins',
        'Government digitization projects in India providing new revenue streams',
      ],
      threats: [
        'US H-1B visa policy uncertainty could increase delivery costs',
        'Rising competition from global capability centers (GCCs) of large enterprises',
        'Potential slowdown in discretionary IT spending amid macro uncertainty',
        'Rupee appreciation risk impacting margins (every 1% appreciation = 40bps margin impact)',
      ],
    },
  };

  return swots[symbol.toUpperCase()] || {
    strengths: [
      'Strong market position in its segment',
      'Consistent revenue growth over the past 3 years',
      'Healthy balance sheet with manageable debt levels',
      'Experienced management team with proven track record',
    ],
    weaknesses: [
      'Valuation above historical average suggesting limited margin of safety',
      'Margin pressure from rising input costs',
      'Dependence on domestic market for majority of revenue',
      'Working capital cycle longer than industry average',
    ],
    opportunities: [
      'Expansion into adjacent market segments',
      'Digital transformation initiatives driving efficiency',
      'Government policy support for the sector',
      'Export market potential remains largely untapped',
    ],
    threats: [
      'Intensifying competition from domestic and international players',
      'Regulatory changes could impact operating model',
      'Currency fluctuation risk on imported inputs',
      'Rising interest rates increasing cost of capital',
    ],
  };
}

// ---- Analyst Consensus ----
export function getAnalystConsensus(symbol: string): AnalystConsensus {
  const stock = getStock(symbol);
  if (!stock) throw new Error(`Stock ${symbol} not found`);
  const p = stock.price;
  const consensusData: Record<string, AnalystConsensus> = {
    TCS: { buy: 18, hold: 12, sell: 4, averageTarget: Math.round(p * 1.08), highestTarget: Math.round(p * 1.18), lowestTarget: Math.round(p * 0.92) },
    RELIANCE: { buy: 24, hold: 8, sell: 2, averageTarget: Math.round(p * 1.12), highestTarget: Math.round(p * 1.25), lowestTarget: Math.round(p * 0.95) },
    INFY: { buy: 22, hold: 10, sell: 3, averageTarget: Math.round(p * 1.10), highestTarget: Math.round(p * 1.20), lowestTarget: Math.round(p * 0.94) },
    HDFCBANK: { buy: 28, hold: 6, sell: 1, averageTarget: Math.round(p * 1.14), highestTarget: Math.round(p * 1.22), lowestTarget: Math.round(p * 0.96) },
  };
  return consensusData[symbol.toUpperCase()] || {
    buy: 15, hold: 10, sell: 5, averageTarget: Math.round(p * 1.06), highestTarget: Math.round(p * 1.15), lowestTarget: Math.round(p * 0.90)
  };
}

// ---- News Sentiment ----
export function getNewsSentiment(symbol: string): NewsSentiment[] {
  const stock = getStock(symbol);
  if (!stock) return [];
  return [
    { headline: `${stock.name} reports strong Q2 results, beats street estimates on revenue`, source: 'Economic Times', time: '2 hours ago', url: '#', sentiment: 'Positive', score: 0.82 },
    { headline: `${stock.name} wins $500M deal from Fortune 500 client — analysts bullish`, source: 'Moneycontrol', time: '5 hours ago', url: '#', sentiment: 'Positive', score: 0.75 },
    { headline: `${stock.sector} sector outlook: Mixed signals from global markets weigh on sentiment`, source: 'LiveMint', time: '8 hours ago', url: '#', sentiment: 'Neutral', score: 0.48 },
    { headline: `${stock.name}: Promoter stake steady at ${getFundamentals(symbol).promoterHolding}% — institutional interest rises`, source: 'Business Standard', time: '1 day ago', url: '#', sentiment: 'Positive', score: 0.68 },
    { headline: `Margin pressure concerns for ${stock.sector} companies amid rising costs`, source: 'CNBC-TV18', time: '1 day ago', url: '#', sentiment: 'Negative', score: 0.32 },
    { headline: `${stock.name} announces Rs 18/share interim dividend — record date set`, source: 'Economic Times', time: '2 days ago', url: '#', sentiment: 'Positive', score: 0.72 },
  ];
}

// ---- Backtest Results ----
export function getBacktestResult(symbol: string): BacktestResult {
  const baseEquity = 100000;
  const equityCurve = [];
  let modelVal = baseEquity;
  let niftyVal = baseEquity;
  const startDate = new Date('2024-01-01');

  for (let i = 0; i < 52; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * 7);
    const modelGrowth = 1 + (Math.sin(i / 8) * 0.015 + 0.004 + (Math.random() - 0.45) * 0.008);
    const niftyGrowth = 1 + (Math.sin(i / 10) * 0.01 + 0.003 + (Math.random() - 0.48) * 0.006);
    modelVal *= modelGrowth;
    niftyVal *= niftyGrowth;
    equityCurve.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(modelVal),
      nifty: Math.round(niftyVal),
    });
  }

  return {
    initialCapital: baseEquity,
    finalValue: Math.round(modelVal),
    strategyReturn: Math.round((modelVal / baseEquity - 1) * 10000) / 100,
    niftyReturn: Math.round((niftyVal / baseEquity - 1) * 10000) / 100,
    maxDrawdown: -8.45,
    sharpeRatio: 1.42,
    mae: 42.3,
    rmse: 68.7,
    mape: 2.18,
    directionalAccuracy: 64.2,
    r2: 0.72,
    trades: 156,
    winRate: 58.3,
    equityCurve,
  };
}

// ---- Historical Prices ----
export function getHistoricalPrices(symbol: string, days: number = 365): HistoricalPrice[] {
  const stock = getStock(symbol);
  if (!stock) return [];
  const prices: HistoricalPrice[] = [];
  let price = stock.price * 0.78;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const volatility = price * 0.018;
    const drift = (stock.price - price * 0.78) / days * 0.001;
    const change = (Math.random() - 0.48) * volatility + drift;
    price = Math.max(price + change, price * 0.95);

    const dayRange = price * (0.012 + Math.random() * 0.012);
    const open = price + (Math.random() - 0.5) * dayRange * 0.4;
    const high = Math.max(price, open) + Math.random() * dayRange * 0.5;
    const low = Math.min(price, open) - Math.random() * dayRange * 0.5;

    prices.push({
      date: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(price * 100) / 100,
      volume: Math.round(stock.avgVolume * (0.6 + Math.random() * 0.8)),
    });
  }
  return prices;
}

// ---- Sector Data ----
export function getSectorData(): SectorData[] {
  return [
    { name: 'Information Technology', return1D: 1.19, return1W: 2.45, return1M: 4.82, momentum: 78, aiScore: 80, breadth: 72, stocks: ['TCS', 'INFY', 'WIPRO'] },
    { name: 'Financial Services', return1D: -0.45, return1W: 0.82, return1M: 2.15, momentum: 62, aiScore: 74, breadth: 58, stocks: ['HDFCBANK', 'ICICIBANK', 'SBIN'] },
    { name: 'Energy', return1D: -0.66, return1W: -1.23, return1M: -0.85, momentum: 45, aiScore: 65, breadth: 42, stocks: ['RELIANCE'] },
    { name: 'FMCG', return1D: 0.35, return1W: 0.92, return1M: 1.48, momentum: 55, aiScore: 68, breadth: 52, stocks: ['ITC', 'HINDUNILVR'] },
    { name: 'Automobile', return1D: 1.65, return1W: 3.12, return1M: 5.85, momentum: 82, aiScore: 76, breadth: 75, stocks: ['MARUTI', 'TATAMOTORS'] },
    { name: 'Telecom', return1D: 1.48, return1W: 2.85, return1M: 6.24, momentum: 85, aiScore: 82, breadth: 78, stocks: ['BHARTIARTL'] },
    { name: 'Pharma', return1D: 0.52, return1W: 1.15, return1M: 3.42, momentum: 65, aiScore: 72, breadth: 62, stocks: [] },
    { name: 'Metal', return1D: -1.25, return1W: -2.45, return1M: -3.82, momentum: 35, aiScore: 52, breadth: 32, stocks: [] },
    { name: 'Realty', return1D: 2.15, return1W: 4.52, return1M: 8.95, momentum: 88, aiScore: 70, breadth: 80, stocks: [] },
    { name: 'Infrastructure', return1D: 0.85, return1W: 1.78, return1M: 4.12, momentum: 70, aiScore: 68, breadth: 65, stocks: [] },
  ];
}

// ---- Default Watchlist ----
export function getDefaultWatchlist(): WatchlistItem[] {
  return [
    { symbol: 'TCS', name: 'TCS', price: 4248.80, changePercent: 1.67, aiScore: 82, prediction: 'Bullish', risk: 'Low', targetRange: '₹4,000 – ₹4,760' },
    { symbol: 'RELIANCE', name: 'Reliance', price: 2734.55, changePercent: -0.66, aiScore: 68, prediction: 'Neutral', risk: 'Medium', targetRange: '₹2,515 – ₹3,060' },
    { symbol: 'INFY', name: 'Infosys', price: 1892.45, changePercent: 1.84, aiScore: 79, prediction: 'Bullish', risk: 'Low', targetRange: '₹1,740 – ₹2,175' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1756.30, changePercent: -0.70, aiScore: 74, prediction: 'Neutral', risk: 'Low', targetRange: '₹1,615 – ₹2,005' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1289.70, changePercent: 1.24, aiScore: 81, prediction: 'Bullish', risk: 'Low', targetRange: '₹1,185 – ₹1,480' },
  ];
}

// ---- Default Portfolio ----
export function getDefaultPortfolio(): PortfolioHolding[] {
  return [
    { symbol: 'TCS', name: 'Tata Consultancy Services', quantity: 10, avgBuyPrice: 3850.00, currentPrice: 4248.80, investedValue: 38500, currentValue: 42488, pnl: 3988, pnlPercent: 10.36, sector: 'IT', allocation: 28.5 },
    { symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 15, avgBuyPrice: 2580.00, currentPrice: 2734.55, investedValue: 38700, currentValue: 41018.25, pnl: 2318.25, pnlPercent: 5.99, sector: 'Energy', allocation: 27.5 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', quantity: 20, avgBuyPrice: 1680.00, currentPrice: 1756.30, investedValue: 33600, currentValue: 35126, pnl: 1526, pnlPercent: 4.54, sector: 'Banking', allocation: 23.6 },
    { symbol: 'ITC', name: 'ITC Limited', quantity: 60, avgBuyPrice: 445.00, currentPrice: 487.25, investedValue: 26700, currentValue: 29235, pnl: 2535, pnlPercent: 9.49, sector: 'FMCG', allocation: 19.6 },
    { symbol: 'INFY', name: 'Infosys', quantity: 5, avgBuyPrice: 1750.00, currentPrice: 1892.45, investedValue: 8750, currentValue: 9462.25, pnl: 712.25, pnlPercent: 8.14, sector: 'IT', allocation: 0.8 },
  ];
}
