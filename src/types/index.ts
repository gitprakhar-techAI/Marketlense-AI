// ============================================================
// MarketLens AI — Type Definitions
// ============================================================

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  sparkline: number[];
  lastUpdated: string;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  avgVolume: number;
  high52: number;
  low52: number;
  dayHigh: number;
  dayLow: number;
  open: number;
  prevClose: number;
  exchange: string;
  lastUpdated: string;
  isDemo: boolean;
}

export interface AIScore {
  overall: number;
  fundamental: number;
  technical: number;
  valuation: number;
  momentum: number;
  risk: number;
  sentiment: number;
  verdict: 'Strongly Bullish' | 'Moderately Bullish' | 'Neutral' | 'Moderately Bearish' | 'Strongly Bearish';
}

export interface PredictionRange {
  low: number;
  mid: number;
  high: number;
  confidence: number;
}

export interface ScenarioCase {
  price: number;
  probability: number;
  returnPercent: number;
  conditions: string[];
}

export interface PricePrediction {
  currentPrice: number;
  day1: PredictionRange;
  day7: PredictionRange;
  day30: PredictionRange;
  day90: PredictionRange;
  year1: PredictionRange;
  bull: ScenarioCase;
  base: ScenarioCase;
  bear: ScenarioCase;
  expectedReturn: number;
  confidence: number;
  status: string;
  bullishReasons: string[];
  bearishReasons: string[];
  featureContributions: FeatureContribution[];
  modelWeights: ModelWeight[];
  timestamp: string;
  modelVersion: string;
}

export interface FeatureContribution {
  feature: string;
  contribution: number;
  direction: 'positive' | 'negative';
}

export interface ModelWeight {
  model: string;
  weight: number;
  accuracy: number;
}

export interface TechnicalIndicators {
  sma20: number;
  sma50: number;
  sma100: number;
  sma200: number;
  ema20: number;
  ema50: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  atr: number;
  adx: number;
  bbUpper: number;
  bbMiddle: number;
  bbLower: number;
  obv: number;
  support: number;
  resistance: number;
  trend: 'Bullish' | 'Bearish' | 'Sideways';
  summary: string;
}

export interface FundamentalData {
  pe: number;
  pb: number;
  eps: number;
  roe: number;
  roce: number;
  debtEquity: number;
  revenue: number;
  revenueGrowth: number;
  netProfit: number;
  profitGrowth: number;
  ebitda: number;
  dividendYield: number;
  freeCashFlow: number;
  bookValue: number;
  faceValue: number;
  promoterHolding: number;
  historicalRevenue: { year: string; value: number }[];
  historicalProfit: { year: string; value: number }[];
  historicalEPS: { year: string; value: number }[];
  historicalROE: { year: string; value: number }[];
  historicalDebt: { year: string; value: number }[];
  industryPE: number;
  sectorPE: number;
  niftyPE: number;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface AnalystConsensus {
  buy: number;
  hold: number;
  sell: number;
  averageTarget: number;
  highestTarget: number;
  lowestTarget: number;
}

export interface NewsSentiment {
  headline: string;
  source: string;
  time: string;
  url: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  score: number;
}

export interface BacktestResult {
  initialCapital: number;
  finalValue: number;
  strategyReturn: number;
  niftyReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  mae: number;
  rmse: number;
  mape: number;
  directionalAccuracy: number;
  r2: number;
  trades: number;
  winRate: number;
  equityCurve: { date: string; value: number; nifty: number }[];
}

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  aiScore: number;
  prediction: string;
  risk: 'Low' | 'Medium' | 'High';
  targetRange: string;
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  sector: string;
  allocation: number;
}

export interface ScreenerFilter {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
}

export interface SectorData {
  name: string;
  return1D: number;
  return1W: number;
  return1M: number;
  momentum: number;
  aiScore: number;
  breadth: number;
  stocks: string[];
}

export type Theme = 'dark' | 'light';
