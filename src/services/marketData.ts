import { StockSymbol, Candle, Exchange } from '../types/market';

export const INDIAN_STOCKS: StockSymbol[] = [
  // Indices
  { symbol: 'NIFTY 50', name: 'NIFTY 50 Index', exchange: 'NSE', tvSymbol: 'NSE:NIFTY', category: 'Indices', basePrice: 24850 },
  { symbol: 'BANKNIFTY', name: 'Nifty Bank Index', exchange: 'NSE', tvSymbol: 'NSE:BANKNIFTY', category: 'Indices', basePrice: 53200 },
  { symbol: 'SENSEX', name: 'BSE Sensex 30', exchange: 'BSE', tvSymbol: 'BSE:SENSEX', category: 'Indices', basePrice: 81650 },
  { symbol: 'FINNIFTY', name: 'Nifty Financial Services', exchange: 'NSE', tvSymbol: 'NSE:FINNIFTY', category: 'Indices', basePrice: 24320 },
  { symbol: 'CNXIT', name: 'Nifty IT Index', exchange: 'NSE', tvSymbol: 'NSE:CNXIT', category: 'Indices', basePrice: 38450 },
  
  // Banking & Financials
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', exchange: 'NSE', tvSymbol: 'NSE:HDFCBANK', category: 'Banking', basePrice: 1680 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', exchange: 'NSE', tvSymbol: 'NSE:ICICIBANK', category: 'Banking', basePrice: 1245 },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', tvSymbol: 'NSE:SBIN', category: 'Banking', basePrice: 815 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', exchange: 'NSE', tvSymbol: 'NSE:KOTAKBANK', category: 'Banking', basePrice: 1795 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', exchange: 'NSE', tvSymbol: 'NSE:BAJFINANCE', category: 'Banking', basePrice: 7280 },
  
  // Tech
  { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', tvSymbol: 'NSE:TCS', category: 'Tech', basePrice: 4230 },
  { symbol: 'INFY', name: 'Infosys Limited', exchange: 'NSE', tvSymbol: 'NSE:INFY', category: 'Tech', basePrice: 1895 },
  { symbol: 'WIPRO', name: 'Wipro Limited', exchange: 'NSE', tvSymbol: 'NSE:WIPRO', category: 'Tech', basePrice: 540 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', exchange: 'NSE', tvSymbol: 'NSE:HCLTECH', category: 'Tech', basePrice: 1780 },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd.', exchange: 'NSE', tvSymbol: 'NSE:TECHM', category: 'Tech', basePrice: 1620 },

  // Energy & Conglomerate
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', exchange: 'NSE', tvSymbol: 'NSE:RELIANCE', category: 'Energy', basePrice: 2980 },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', exchange: 'NSE', tvSymbol: 'NSE:ONGC', category: 'Energy', basePrice: 310 },
  { symbol: 'NTPC', name: 'NTPC Limited', exchange: 'NSE', tvSymbol: 'NSE:NTPC', category: 'Energy', basePrice: 415 },
  { symbol: 'POWERGRID', name: 'Power Grid Corp', exchange: 'NSE', tvSymbol: 'NSE:POWERGRID', category: 'Energy', basePrice: 345 },

  // Auto
  { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', exchange: 'NSE', tvSymbol: 'NSE:TATAMOTORS', category: 'Auto', basePrice: 995 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', exchange: 'NSE', tvSymbol: 'NSE:MARUTI', category: 'Auto', basePrice: 12450 },
  { symbol: 'M&M', name: 'Mahindra & Mahindra', exchange: 'NSE', tvSymbol: 'NSE:M_M', category: 'Auto', basePrice: 2850 },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Limited', exchange: 'NSE', tvSymbol: 'NSE:BAJAJ_AUTO', category: 'Auto', basePrice: 11400 },

  // FMCG & Infra
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', exchange: 'NSE', tvSymbol: 'NSE:HINDUNILVR', category: 'FMCG', basePrice: 2780 },
  { symbol: 'ITC', name: 'ITC Limited', exchange: 'NSE', tvSymbol: 'NSE:ITC', category: 'FMCG', basePrice: 505 },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', exchange: 'NSE', tvSymbol: 'NSE:LT', category: 'FMCG', basePrice: 3620 },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', exchange: 'NSE', tvSymbol: 'NSE:TITAN', category: 'FMCG', basePrice: 3450 },

  // Metals & Pharma
  { symbol: 'TATASTEEL', name: 'Tata Steel Limited', exchange: 'NSE', tvSymbol: 'NSE:TATASTEEL', category: 'Metals', basePrice: 158 },
  { symbol: 'HINDALCO', name: 'Hindalco Industries', exchange: 'NSE', tvSymbol: 'NSE:HINDALCO', category: 'Metals', basePrice: 685 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Ltd.', exchange: 'NSE', tvSymbol: 'NSE:SUNPHARMA', category: 'Pharma', basePrice: 1880 },
  { symbol: 'CIPLA', name: 'Cipla Limited', exchange: 'NSE', tvSymbol: 'NSE:CIPLA', category: 'Pharma', basePrice: 1610 },

  // Adani Group
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.', exchange: 'NSE', tvSymbol: 'NSE:ADANIENT', category: 'Adani', basePrice: 3050 },
  { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ', exchange: 'NSE', tvSymbol: 'NSE:ADANIPORTS', category: 'Adani', basePrice: 1440 }
];

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '1D';

export function getTimeframeSeconds(tf: Timeframe): number {
  switch (tf) {
    case '1m': return 60;
    case '5m': return 300;
    case '15m': return 900;
    case '1h': return 3600;
    case '1D': return 86400;
    default: return 86400;
  }
}

/**
 * Generates realistic candlestick dataset for Indian markets.
 * Uses pseudo-random walk with geometric Brownian motion, volatility clustering, and realistic price swings.
 */
export function generateCandles(stock: StockSymbol, timeframe: Timeframe, count: number = 300): Candle[] {
  const candles: Candle[] = [];
  const tfSeconds = getTimeframeSeconds(timeframe);
  const now = Math.floor(Date.now() / 1000);
  const startTime = now - (count * tfSeconds);

  let currentClose = stock.basePrice;
  // Seed random deterministically from stock symbol so it has consistent characteristic patterns
  let seed = stock.symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Volatility scale based on asset category
  const volMultiplier = stock.category === 'Indices' ? 0.007 : stock.category === 'Adani' ? 0.022 : 0.012;

  let trend = 0.0002;

  for (let i = 0; i < count; i++) {
    const candleTime = startTime + (i * tfSeconds);
    
    // Cycle trends every 40 bars
    if (i % 40 === 0) {
      trend = (seededRandom() - 0.49) * 0.003;
    }

    const shock = (seededRandom() - 0.495) * volMultiplier * 2;
    const change = currentClose * (trend + shock);
    
    const open = Number(currentClose.toFixed(2));
    const close = Number(Math.max(1, open + change).toFixed(2));
    
    const upperWick = Math.abs(change) * (0.2 + seededRandom() * 0.8) + (open * volMultiplier * 0.2);
    const lowerWick = Math.abs(change) * (0.2 + seededRandom() * 0.8) + (open * volMultiplier * 0.2);

    const high = Number((Math.max(open, close) + upperWick).toFixed(2));
    const low = Number((Math.min(open, close) - lowerWick).toFixed(2));
    
    const baseVol = stock.category === 'Indices' ? 80000000 : 2500000;
    const volume = Math.floor(baseVol * (0.4 + seededRandom() * 1.2));

    candles.push({
      time: candleTime,
      open,
      high,
      low,
      close,
      volume,
    });

    currentClose = close;
  }

  return candles;
}

/**
 * Checks if the Indian stock market is currently open.
 * Trading hours: Monday to Friday, 9:15 AM to 3:30 PM IST (UTC+5:30)
 */
export function getMarketStatus(): { isOpen: boolean; message: string; istTime: string } {
  const date = new Date();
  // Get time in IST (UTC+5.5)
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (3600000 * 5.5));
  
  const day = ist.getDay(); // 0 = Sun, 6 = Sat
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const openTime = 9 * 60 + 15; // 09:15 AM IST
  const closeTime = 15 * 60 + 30; // 03:30 PM IST

  const istFormatted = ist.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (day === 0 || day === 6) {
    return {
      isOpen: false,
      message: 'Weekend (Market Closed)',
      istTime: `${istFormatted} IST`
    };
  }

  if (timeInMinutes >= openTime && timeInMinutes <= closeTime) {
    return {
      isOpen: true,
      message: 'Live Market Open',
      istTime: `${istFormatted} IST`
    };
  }

  return {
    isOpen: false,
    message: timeInMinutes < openTime ? 'Pre-Market Session' : 'Market Closed',
    istTime: `${istFormatted} IST`
  };
}
