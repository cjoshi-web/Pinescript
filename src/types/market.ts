export type Exchange = 'NSE' | 'BSE';

export interface StockSymbol {
  symbol: string;
  name: string;
  exchange: Exchange;
  tvSymbol: string;
  category: 'Indices' | 'Banking' | 'Tech' | 'Energy' | 'Auto' | 'FMCG' | 'Metals' | 'Pharma' | 'Adani';
  basePrice: number;
  lotSize?: number;
}

export interface Candle {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PinePlot {
  id: string;
  title: string;
  color: string;
  linewidth: number;
  overlay: boolean;
  data: Array<{ time: number; value: number }>;
}

export interface PineMarker {
  time: number;
  position: 'aboveBar' | 'belowBar' | 'inBar';
  color: string;
  shape: 'circle' | 'square' | 'arrowUp' | 'arrowDown';
  text: string;
  size?: number;
}

export interface PineHline {
  price: number;
  title: string;
  color: string;
}

export interface PineTrade {
  id: number;
  direction: 'LONG' | 'SHORT';
  entryTime: number;
  entryPrice: number;
  exitTime?: number;
  exitPrice?: number;
  pnl?: number;
  pnlPercent?: number;
  barsHeld?: number;
  status: 'OPEN' | 'CLOSED';
}

export interface BacktestResult {
  netProfit: number;
  netProfitPercent: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  trades: PineTrade[];
}

export interface PineExecutionResult {
  isIndicator: boolean;
  isStrategy: boolean;
  title: string;
  overlay: boolean;
  plots: PinePlot[];
  markers: PineMarker[];
  hlines: PineHline[];
  backtest?: BacktestResult;
  logs: string[];
  error?: string;
}
