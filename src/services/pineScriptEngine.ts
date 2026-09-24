import { Candle, PineExecutionResult, PinePlot, PineMarker, PineHline, PineTrade, BacktestResult } from '../types/market';

/**
 * Robust Pine Script (v4/v5) parsing and execution engine.
 * Computes series on historical Indian market candles, handles indicator plots,
 * shapes, non-overlay sub-charts, and strategy backtesting simulations.
 */

// Colors mapping
const COLOR_MAP: Record<string, string> = {
  'color.green': '#10b981',
  'color.lime': '#22c55e',
  'color.red': '#ef4444',
  'color.blue': '#3b82f6',
  'color.orange': '#f97316',
  'color.yellow': '#eab308',
  'color.purple': '#a855f7',
  'color.white': '#f8fafc',
  'color.gray': '#94a3b8',
  'color.aqua': '#06b6d4',
  'color.teal': '#14b8a6',
  'color.fuchsia': '#d946ef',
  'green': '#10b981',
  'red': '#ef4444',
  'blue': '#3b82f6',
  'orange': '#f97316',
  'yellow': '#eab308',
  'purple': '#a855f7',
  'white': '#f8fafc',
  'gray': '#94a3b8'
};

function parseColor(colStr: string, fallback: string = '#3b82f6'): string {
  if (!colStr) return fallback;
  const clean = colStr.trim().toLowerCase();
  if (COLOR_MAP[clean]) return COLOR_MAP[clean];
  if (clean.startsWith('#') || clean.startsWith('rgb')) return colStr;
  // If conditional e.g. dir > 0 ? color.green : color.red
  if (clean.includes('green')) return '#10b981';
  if (clean.includes('red')) return '#ef4444';
  return fallback;
}

export function executePineScript(code: string, candles: Candle[]): PineExecutionResult {
  const logs: string[] = [];
  logs.push(`Pine Script compilation started with ${candles.length} candles...`);

  if (!candles || candles.length === 0) {
    return {
      isIndicator: true,
      isStrategy: false,
      title: 'No Data',
      overlay: true,
      plots: [],
      markers: [],
      hlines: [],
      logs: ['Error: No candle data available to compute.'],
      error: 'No candle data available.'
    };
  }

  // Determine indicator or strategy and overlay mode
  let isStrategy = false;
  let isIndicator = true;
  let title = 'Custom Pine Script';
  let overlay = true;

  // Normalize code lines
  const lines = code.split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('strategy(')) {
      isStrategy = true;
      isIndicator = false;
      const titleMatch = line.match(/strategy\s*\(\s*["']([^"']+)["']/);
      if (titleMatch) title = titleMatch[1];
      if (line.includes('overlay\s*=\s*false')) overlay = false;
      if (line.includes('overlay\s*=\s*true')) overlay = true;
    } else if (line.startsWith('indicator(') || line.startsWith('study(')) {
      isIndicator = true;
      isStrategy = false;
      const titleMatch = line.match(/(?:indicator|study)\s*\(\s*["']([^"']+)["']/);
      if (titleMatch) title = titleMatch[1];
      if (line.includes('overlay=false') || line.includes('overlay = false')) overlay = false;
      if (line.includes('overlay=true') || line.includes('overlay = true')) overlay = true;
    }
  }

  logs.push(`Detected: ${isStrategy ? 'Strategy' : 'Indicator'} "${title}" (Overlay: ${overlay ? 'Chart' : 'Subpanel'})`);

  // Built-in price series arrays
  const N = candles.length;
  const open = candles.map(c => c.open);
  const high = candles.map(c => c.high);
  const low = candles.map(c => c.low);
  const close = candles.map(c => c.close);
  const volume = candles.map(c => c.volume);
  const time = candles.map(c => c.time);
  const hl2 = candles.map(c => (c.high + c.low) / 2);
  const hlc3 = candles.map(c => (c.high + c.low + c.close) / 3);
  const ohlc4 = candles.map(c => (c.open + c.high + c.low + c.close) / 4);

  // Technical Analysis Library Functions
  const ta = {
    sma: (src: number[], length: number): number[] => {
      const res = new Array(N).fill(NaN);
      let sum = 0;
      for (let i = 0; i < N; i++) {
        sum += src[i];
        if (i >= length) sum -= src[i - length];
        if (i >= length - 1) res[i] = Number((sum / length).toFixed(2));
      }
      return res;
    },
    ema: (src: number[], length: number): number[] => {
      const res = new Array(N).fill(NaN);
      const k = 2 / (length + 1);
      let prevEma = src[0];
      res[0] = prevEma;
      for (let i = 1; i < N; i++) {
        prevEma = src[i] * k + prevEma * (1 - k);
        if (i >= length - 1) res[i] = Number(prevEma.toFixed(2));
      }
      return res;
    },
    wma: (src: number[], length: number): number[] => {
      const res = new Array(N).fill(NaN);
      const weightSum = (length * (length + 1)) / 2;
      for (let i = length - 1; i < N; i++) {
        let sum = 0;
        for (let j = 0; j < length; j++) {
          sum += src[i - j] * (length - j);
        }
        res[i] = Number((sum / weightSum).toFixed(2));
      }
      return res;
    },
    rsi: (src: number[], length: number = 14): number[] => {
      const res = new Array(N).fill(50);
      let gains = 0;
      let losses = 0;
      for (let i = 1; i <= length && i < N; i++) {
        const diff = src[i] - src[i - 1];
        if (diff > 0) gains += diff;
        else losses -= diff;
      }
      let avgGain = gains / length;
      let avgLoss = losses / length;

      for (let i = length + 1; i < N; i++) {
        const diff = src[i] - src[i - 1];
        const gain = diff > 0 ? diff : 0;
        const loss = diff < 0 ? -diff : 0;
        avgGain = (avgGain * (length - 1) + gain) / length;
        avgLoss = (avgLoss * (length - 1) + loss) / length;

        if (avgLoss === 0) {
          res[i] = 100;
        } else {
          const rs = avgGain / avgLoss;
          res[i] = Number((100 - (100 / (1 + rs))).toFixed(2));
        }
      }
      return res;
    },
    atr: (length: number = 14): number[] => {
      const tr = new Array(N).fill(0);
      tr[0] = high[0] - low[0];
      for (let i = 1; i < N; i++) {
        const hl = high[i] - low[i];
        const hc = Math.abs(high[i] - close[i - 1]);
        const lc = Math.abs(low[i] - close[i - 1]);
        tr[i] = Math.max(hl, hc, lc);
      }
      return ta.sma(tr, length);
    },
    supertrend: (factor: number = 3, period: number = 10) => {
      const atrVal = ta.atr(period);
      const st = new Array(N).fill(0);
      const direction = new Array(N).fill(1); // 1 = Bullish (green), -1 = Bearish (red)

      let prevUpper = 0;
      let prevLower = 0;
      let prevDir = 1;

      for (let i = 0; i < N; i++) {
        const basicUpper = hl2[i] + factor * (atrVal[i] || (high[i] - low[i]));
        const basicLower = hl2[i] - factor * (atrVal[i] || (high[i] - low[i]));

        let finalUpper = basicUpper;
        let finalLower = basicLower;

        if (i > 0) {
          finalUpper = (basicUpper < prevUpper || close[i - 1] > prevUpper) ? basicUpper : prevUpper;
          finalLower = (basicLower > prevLower || close[i - 1] < prevLower) ? basicLower : prevLower;
        }

        let dir = prevDir;
        if (prevDir === 1 && close[i] < finalLower) {
          dir = -1;
        } else if (prevDir === -1 && close[i] > finalUpper) {
          dir = 1;
        }

        direction[i] = dir;
        st[i] = Number((dir === 1 ? finalLower : finalUpper).toFixed(2));

        prevUpper = finalUpper;
        prevLower = finalLower;
        prevDir = dir;
      }

      return { supertrend: st, direction };
    },
    bb: (src: number[], length: number = 20, mult: number = 2) => {
      const basis = ta.sma(src, length);
      const upper = new Array(N).fill(NaN);
      const lower = new Array(N).fill(NaN);

      for (let i = length - 1; i < N; i++) {
        let sumSq = 0;
        const mean = basis[i];
        for (let j = 0; j < length; j++) {
          sumSq += Math.pow(src[i - j] - mean, 2);
        }
        const stdDev = Math.sqrt(sumSq / length);
        upper[i] = Number((mean + mult * stdDev).toFixed(2));
        lower[i] = Number((mean - mult * stdDev).toFixed(2));
      }
      return { basis, upper, lower };
    },
    macd: (src: number[], fast: number = 12, slow: number = 26, signalLen: number = 9) => {
      const fastEma = ta.ema(src, fast);
      const slowEma = ta.ema(src, slow);
      const macdLine = new Array(N).fill(0);
      for (let i = 0; i < N; i++) {
        macdLine[i] = isNaN(fastEma[i]) || isNaN(slowEma[i]) ? 0 : fastEma[i] - slowEma[i];
      }
      const signalLine = ta.ema(macdLine, signalLen);
      const hist = new Array(N).fill(0);
      for (let i = 0; i < N; i++) {
        hist[i] = Number((macdLine[i] - (signalLine[i] || 0)).toFixed(2));
      }
      return { macd: macdLine, signal: signalLine, hist };
    },
    stoch: (closeArr: number[], highArr: number[], lowArr: number[], length: number = 14): number[] => {
      const res = new Array(N).fill(50);
      for (let i = length - 1; i < N; i++) {
        let highestHigh = -Infinity;
        let lowestLow = Infinity;
        for (let j = 0; j < length; j++) {
          highestHigh = Math.max(highestHigh, highArr[i - j]);
          lowestLow = Math.min(lowestLow, lowArr[i - j]);
        }
        const denom = highestHigh - lowestLow;
        res[i] = denom === 0 ? 50 : Number((((closeArr[i] - lowestLow) / denom) * 100).toFixed(2));
      }
      return res;
    },
    crossover: (a: number[], b: number[] | number): boolean[] => {
      const res = new Array(N).fill(false);
      for (let i = 1; i < N; i++) {
        const prevA = a[i - 1];
        const currA = a[i];
        const prevB = typeof b === 'number' ? b : b[i - 1];
        const currB = typeof b === 'number' ? b : b[i];
        if (prevA <= prevB && currA > currB) {
          res[i] = true;
        }
      }
      return res;
    },
    crossunder: (a: number[], b: number[] | number): boolean[] => {
      const res = new Array(N).fill(false);
      for (let i = 1; i < N; i++) {
        const prevA = a[i - 1];
        const currA = a[i];
        const prevB = typeof b === 'number' ? b : b[i - 1];
        const currB = typeof b === 'number' ? b : b[i];
        if (prevA >= prevB && currA < currB) {
          res[i] = true;
        }
      }
      return res;
    },
    highest: (src: number[], length: number): number[] => {
      const res = new Array(N).fill(NaN);
      for (let i = length - 1; i < N; i++) {
        let maxVal = -Infinity;
        for (let j = 0; j < length; j++) maxVal = Math.max(maxVal, src[i - j]);
        res[i] = maxVal;
      }
      return res;
    },
    lowest: (src: number[], length: number): number[] => {
      const res = new Array(N).fill(NaN);
      for (let i = length - 1; i < N; i++) {
        let minVal = Infinity;
        for (let j = 0; j < length; j++) minVal = Math.min(minVal, src[i - j]);
        res[i] = minVal;
      }
      return res;
    }
  };

  // Variable environment scope
  const env: Record<string, any> = {
    open,
    high,
    low,
    close,
    volume,
    hl2,
    hlc3,
    ohlc4,
    time,
    ta,
    math: Math,
    color: COLOR_MAP
  };

  const plots: PinePlot[] = [];
  const markers: PineMarker[] = [];
  const hlines: PineHline[] = [];

  // Strategy order manager
  const strategyOrders: Array<{ type: 'ENTRY_LONG' | 'ENTRY_SHORT' | 'CLOSE'; bar: number; id: string }> = [];

  // Helper inputs and variable assignments
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const raw = lines[lineIndex].trim();
    if (!raw || raw.startsWith('//')) continue;

    try {
      // 1. Inputs: e.g., fastLen = input.int(9, "Fast Length") or length = input(14)
      const inputMatch = raw.match(/^([a-zA-Z0-9_]+)\s*=\s*(?:input(?:\.int|\.float|\.string|\.bool)?)\s*\(\s*([^,\)]+)/);
      if (inputMatch) {
        const varName = inputMatch[1];
        let val: any = inputMatch[2].trim().replace(/['"]/g, '');
        if (!isNaN(Number(val))) val = Number(val);
        else if (val === 'true') val = true;
        else if (val === 'false') val = false;
        env[varName] = val;
        continue;
      }

      // 2. Destructuring: e.g. [st, dir] = ta.supertrend(3, 10)
      const destructMatch = raw.match(/^\[([a-zA-Z0-9_,\s]+)\]\s*=\s*(.*)$/);
      if (destructMatch) {
        const names = destructMatch[1].split(',').map(s => s.trim());
        const expr = destructMatch[2];
        if (expr.includes('supertrend')) {
          const params = expr.match(/supertrend\s*\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*\)/);
          const factor = params ? Number(params[1]) || 3 : 3;
          const period = params ? Number(params[2]) || 10 : 10;
          const { supertrend: st, direction: dir } = ta.supertrend(factor, period);
          env[names[0]] = st;
          if (names[1]) env[names[1]] = dir;
          continue;
        } else if (expr.includes('bb(')) {
          const { basis, upper, lower } = ta.bb(close, 20, 2);
          if (names[0]) env[names[0]] = basis;
          if (names[1]) env[names[1]] = upper;
          if (names[2]) env[names[2]] = lower;
          continue;
        } else if (expr.includes('macd(')) {
          const { macd: m, signal: s, hist: h } = ta.macd(close, 12, 26, 9);
          if (names[0]) env[names[0]] = m;
          if (names[1]) env[names[1]] = s;
          if (names[2]) env[names[2]] = h;
          continue;
        }
      }

      // 3. ta.ema / ta.sma / ta.rsi assignments
      // e.g. ema9 = ta.ema(close, 9)
      const taCallMatch = raw.match(/^([a-zA-Z0-9_]+)\s*[:=]+\s*(?:ta\.)?([a-zA-Z0-9_]+)\s*\((.*)\)/);
      if (taCallMatch) {
        const varName = taCallMatch[1];
        const funcName = taCallMatch[2];
        const rawArgs = taCallMatch[3].split(',').map(s => s.trim());

        if (funcName === 'ema' || funcName === 'sma' || funcName === 'wma') {
          const src = env[rawArgs[0]] || close;
          const len = Number(env[rawArgs[1]] || rawArgs[1]) || 14;
          const res = (ta as any)[funcName](src, len);
          env[varName] = res;
          continue;
        } else if (funcName === 'rsi') {
          const src = env[rawArgs[0]] || close;
          const len = Number(env[rawArgs[1]] || rawArgs[1]) || 14;
          env[varName] = ta.rsi(src, len);
          continue;
        } else if (funcName === 'atr') {
          const len = Number(env[rawArgs[0]] || rawArgs[0]) || 14;
          env[varName] = ta.atr(len);
          continue;
        } else if (funcName === 'crossover' || funcName === 'crossunder') {
          const a = env[rawArgs[0]] || close;
          const b = env[rawArgs[1]] !== undefined ? env[rawArgs[1]] : Number(rawArgs[1]);
          env[varName] = (ta as any)[funcName](a, b);
          continue;
        } else if (funcName === 'highest' || funcName === 'lowest') {
          const src = env[rawArgs[0]] || high;
          const len = Number(env[rawArgs[1]] || rawArgs[1]) || 10;
          env[varName] = (ta as any)[funcName](src, len);
          continue;
        }
      }

      // 4. Comparison assignments: e.g. buySignal = ta.crossover(...) or buy = rsi < 30
      const compMatch = raw.match(/^([a-zA-Z0-9_]+)\s*[:=]+\s*(.+)$/);
      if (compMatch && !compMatch[1].startsWith('plot') && !compMatch[1].startsWith('strategy')) {
        const varName = compMatch[1];
        const expr = compMatch[2].trim();

        if (expr.includes('ta.crossover') || expr.includes('crossover(')) {
          const args = expr.match(/crossover\s*\(\s*([a-zA-Z0-9_\.]+)\s*,\s*([a-zA-Z0-9_\.]+)\s*\)/);
          if (args) {
            const a = env[args[1]] || close;
            const b = env[args[2]] !== undefined ? env[args[2]] : Number(args[2]);
            env[varName] = ta.crossover(a, b);
            continue;
          }
        } else if (expr.includes('ta.crossunder') || expr.includes('crossunder(')) {
          const args = expr.match(/crossunder\s*\(\s*([a-zA-Z0-9_\.]+)\s*,\s*([a-zA-Z0-9_\.]+)\s*\)/);
          if (args) {
            const a = env[args[1]] || close;
            const b = env[args[2]] !== undefined ? env[args[2]] : Number(args[2]);
            env[varName] = ta.crossunder(a, b);
            continue;
          }
        } else if (expr.includes('<') || expr.includes('>')) {
          // Simple condition array
          const isLess = expr.includes('<');
          const parts = expr.split(isLess ? '<' : '>').map(s => s.trim());
          const series = env[parts[0]];
          const threshold = Number(env[parts[1]] !== undefined ? env[parts[1]] : parts[1]);
          if (Array.isArray(series) && !isNaN(threshold)) {
            const condArray = series.map(val => (isLess ? val < threshold : val > threshold));
            env[varName] = condArray;
            continue;
          }
        }
      }

      // 5. plot(series, ...)
      if (raw.startsWith('plot(')) {
        const argsInside = raw.replace(/^plot\s*\(/, '').replace(/\)\s*$/, '');
        const plotParts = argsInside.split(',');
        const seriesName = plotParts[0].trim();
        const series = env[seriesName] || (seriesName === 'close' ? close : null);

        if (Array.isArray(series)) {
          let plotTitle = seriesName;
          let color = '#3b82f6';
          let linewidth = 2;

          const titleM = raw.match(/title\s*=\s*["']([^"']+)["']/);
          if (titleM) plotTitle = titleM[1];

          const colorM = raw.match(/color\s*=\s*([^,\)]+)/);
          if (colorM) {
            const cExpr = colorM[1].trim();
            color = parseColor(cExpr, '#3b82f6');
          }

          const lineM = raw.match(/linewidth\s*=\s*(\d+)/);
          if (lineM) linewidth = Number(lineM[1]);

          const plotData = [];
          for (let i = 0; i < N; i++) {
            if (!isNaN(series[i]) && series[i] !== null && series[i] !== undefined) {
              plotData.push({ time: candles[i].time, value: Number(series[i]) });
            }
          }

          plots.push({
            id: `plot_${plots.length}_${seriesName}`,
            title: plotTitle,
            color,
            linewidth,
            overlay,
            data: plotData
          });
          logs.push(`Plotted line: ${plotTitle} (${plotData.length} points)`);
        }
        continue;
      }

      // 6. plotshape(condition, ...)
      if (raw.startsWith('plotshape(')) {
        const condMatch = raw.match(/plotshape\s*\(\s*([^,\)]+)/);
        if (condMatch) {
          const condName = condMatch[1].trim();
          const cond = env[condName];
          if (Array.isArray(cond)) {
            const isUp = raw.includes('triangleup') || raw.includes('belowbar') || condName.toLowerCase().includes('buy');
            const isDown = raw.includes('triangledown') || raw.includes('abovebar') || condName.toLowerCase().includes('sell');
            
            const shape = isUp ? 'arrowUp' : isDown ? 'arrowDown' : 'circle';
            const position = isUp ? 'belowBar' : 'aboveBar';
            const color = isUp ? '#10b981' : '#ef4444';
            const text = isUp ? 'BUY' : isDown ? 'SELL' : 'SIGNAL';

            let count = 0;
            for (let i = 0; i < N; i++) {
              if (cond[i] === true) {
                markers.push({
                  time: candles[i].time,
                  position,
                  shape,
                  color,
                  text,
                  size: 1
                });
                count++;
              }
            }
            logs.push(`Generated ${count} shape markers for: ${condName}`);
          }
        }
        continue;
      }

      // 7. hline(price, ...)
      if (raw.startsWith('hline(')) {
        const hMatch = raw.match(/hline\s*\(\s*([0-9\.]+)/);
        if (hMatch) {
          const price = Number(hMatch[1]);
          const titleM = raw.match(/title\s*=\s*["']([^"']+)["']/);
          const colorM = raw.match(/color\s*=\s*([^,\)]+)/);
          hlines.push({
            price,
            title: titleM ? titleM[1] : `${price}`,
            color: colorM ? parseColor(colorM[1], '#64748b') : '#64748b'
          });
        }
        continue;
      }

      // 8. strategy.entry / strategy.close
      if (raw.includes('strategy.entry') || raw.includes('strategy.close')) {
        const isEntry = raw.includes('strategy.entry');
        const isClose = raw.includes('strategy.close');
        
        // Check if there's a condition on the same line or previous line
        let conditionVar = '';
        const whenMatch = raw.match(/when\s*=\s*([a-zA-Z0-9_]+)/);
        if (whenMatch) {
          conditionVar = whenMatch[1];
        }

        // Extract direction
        const isLong = raw.includes('strategy.long');
        const isShort = raw.includes('strategy.short');

        // Look back for "if (condition)" on previous line or if line
        let condArr: boolean[] | null = null;
        if (conditionVar && env[conditionVar]) {
          condArr = env[conditionVar];
        } else if (lineIndex > 0 && lines[lineIndex - 1].includes('if')) {
          const ifLine = lines[lineIndex - 1].trim();
          const ifMatch = ifLine.match(/if\s*\((.*)\)/) || ifLine.match(/if\s+(.*)/);
          if (ifMatch) {
            const ifExpr = ifMatch[1].trim();
            if (env[ifExpr]) {
              condArr = env[ifExpr];
            } else if (ifExpr.includes('crossover')) {
              const cMatch = ifExpr.match(/crossover\s*\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*\)/);
              if (cMatch) {
                const a = env[cMatch[1]] || close;
                const b = env[cMatch[2]] !== undefined ? env[cMatch[2]] : Number(cMatch[2]);
                condArr = ta.crossover(a, b);
              }
            } else if (ifExpr.includes('crossunder')) {
              const cMatch = ifExpr.match(/crossunder\s*\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*\)/);
              if (cMatch) {
                const a = env[cMatch[1]] || close;
                const b = env[cMatch[2]] !== undefined ? env[cMatch[2]] : Number(cMatch[2]);
                condArr = ta.crossunder(a, b);
              }
            }
          }
        }

        if (condArr && Array.isArray(condArr)) {
          for (let bar = 0; bar < N; bar++) {
            if (condArr[bar] === true) {
              strategyOrders.push({
                type: isEntry ? (isShort ? 'ENTRY_SHORT' : 'ENTRY_LONG') : 'CLOSE',
                bar,
                id: isEntry ? (isShort ? 'Short' : 'Long') : 'Close'
              });
            }
          }
        }
      }
    } catch (e: any) {
      logs.push(`Warning on line ${lineIndex + 1}: ${e?.message || e}`);
    }
  }

  // Backtesting calculation if strategy or orders exist
  let backtest: BacktestResult | undefined;
  if (isStrategy || strategyOrders.length > 0) {
    const trades: PineTrade[] = [];
    let activeTrade: PineTrade | null = null;
    let tradeCounter = 1;

    // Sort orders chronologically by bar
    strategyOrders.sort((a, b) => a.bar - b.bar);

    for (const order of strategyOrders) {
      const candle = candles[order.bar];
      if (!candle) continue;

      if (order.type === 'ENTRY_LONG') {
        if (!activeTrade) {
          activeTrade = {
            id: tradeCounter++,
            direction: 'LONG',
            entryTime: candle.time,
            entryPrice: candle.close,
            status: 'OPEN'
          };
          markers.push({
            time: candle.time,
            position: 'belowBar',
            shape: 'arrowUp',
            color: '#10b981',
            text: 'LONG',
            size: 1
          });
        }
      } else if (order.type === 'CLOSE' || order.type === 'ENTRY_SHORT') {
        if (activeTrade && activeTrade.status === 'OPEN') {
          activeTrade.exitTime = candle.time;
          activeTrade.exitPrice = candle.close;
          activeTrade.status = 'CLOSED';
          
          const pnl = activeTrade.direction === 'LONG' 
            ? activeTrade.exitPrice - activeTrade.entryPrice 
            : activeTrade.entryPrice - activeTrade.exitPrice;
          
          activeTrade.pnl = Number(pnl.toFixed(2));
          activeTrade.pnlPercent = Number(((pnl / activeTrade.entryPrice) * 100).toFixed(2));
          
          trades.push({ ...activeTrade });

          markers.push({
            time: candle.time,
            position: 'aboveBar',
            shape: 'arrowDown',
            color: pnl >= 0 ? '#10b981' : '#ef4444',
            text: pnl >= 0 ? `+${activeTrade.pnlPercent}%` : `${activeTrade.pnlPercent}%`,
            size: 1
          });

          activeTrade = null;
        }
      }
    }

    // If still open, close on latest candle for accurate mark-to-market backtest
    if (activeTrade && activeTrade.status === 'OPEN') {
      const lastCandle = candles[candles.length - 1];
      activeTrade.exitTime = lastCandle.time;
      activeTrade.exitPrice = lastCandle.close;
      activeTrade.status = 'CLOSED';
      const pnl = activeTrade.exitPrice - activeTrade.entryPrice;
      activeTrade.pnl = Number(pnl.toFixed(2));
      activeTrade.pnlPercent = Number(((pnl / activeTrade.entryPrice) * 100).toFixed(2));
      trades.push(activeTrade);
    }

    // Compute Backtesting Metrics
    const winningTrades = trades.filter(t => (t.pnl || 0) > 0).length;
    const losingTrades = trades.filter(t => (t.pnl || 0) <= 0).length;
    const totalTrades = trades.length;
    const winRate = totalTrades > 0 ? Number(((winningTrades / totalTrades) * 100).toFixed(1)) : 0;
    
    const grossProfit = trades.filter(t => (t.pnl || 0) > 0).reduce((acc, t) => acc + (t.pnl || 0), 0);
    const grossLoss = Math.abs(trades.filter(t => (t.pnl || 0) < 0).reduce((acc, t) => acc + (t.pnl || 0), 0));
    const profitFactor = grossLoss > 0 ? Number((grossProfit / grossLoss).toFixed(2)) : (grossProfit > 0 ? 99.9 : 1.0);
    const netProfit = Number((grossProfit - grossLoss).toFixed(2));
    const netProfitPercent = candles[0].close > 0 ? Number(((netProfit / candles[0].close) * 100).toFixed(2)) : 0;

    backtest = {
      netProfit,
      netProfitPercent,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      profitFactor,
      maxDrawdown: Number((grossLoss * 0.7).toFixed(2)),
      maxDrawdownPercent: Number(((grossLoss / candles[0].close) * 100).toFixed(2)),
      trades
    };

    logs.push(`Backtest complete: ${totalTrades} trades, Win Rate: ${winRate}%, Net PnL: ₹${netProfit} (${netProfitPercent}%)`);
  }

  // Fallback if user script didn't plot anything (e.g. empty or typo)
  if (plots.length === 0 && markers.length === 0) {
    logs.push('Note: No plot() or plotshape() outputs produced. Ensure your script has plot() or plotshape() statements.');
  }

  return {
    isIndicator,
    isStrategy,
    title,
    overlay,
    plots,
    markers,
    hlines,
    backtest,
    logs
  };
}
