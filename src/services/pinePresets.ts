export interface PinePreset {
  id: string;
  name: string;
  category: 'Strategy' | 'Indicator';
  description: string;
  descriptionGujarati: string;
  code: string;
}

export const PINE_PRESETS: PinePreset[] = [
  {
    id: 'nifty-ema-cross',
    name: 'Nifty 9 & 21 EMA Cross Strategy',
    category: 'Strategy',
    description: 'Classic intraday trend following strategy using 9 EMA and 21 EMA crossover on Indian indices.',
    descriptionGujarati: 'Nifty & Bank Nifty mate 9 ane 21 EMA Crossover strategy. Buy & Sell signals ane profit backtest kare che.',
    code: `//@version=5
strategy("Nifty 9 & 21 EMA Cross", overlay=true)

// Input Parameters
fastLen = input.int(9, "Fast EMA")
slowLen = input.int(21, "Slow EMA")

// Indicators Calculation
emaFast = ta.ema(close, fastLen)
emaSlow = ta.ema(close, slowLen)

// Plot Lines
plot(emaFast, title="EMA 9 (Fast)", color=color.green, linewidth=2)
plot(emaSlow, title="EMA 21 (Slow)", color=color.red, linewidth=2)

// Signals
buySignal = ta.crossover(emaFast, emaSlow)
sellSignal = ta.crossunder(emaFast, emaSlow)

// Visual Shapes on Chart
plotshape(buySignal, title="Buy Alert", style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small)
plotshape(sellSignal, title="Sell Alert", style=shape.triangledown, location=location.abovebar, color=color.red, size=size.small)

// Strategy Execution Orders
if (buySignal)
    strategy.entry("Long", strategy.long)

if (sellSignal)
    strategy.close("Long")
`
  },
  {
    id: 'supertrend-indicator',
    name: 'SuperTrend Trendline (10, 3)',
    category: 'Indicator',
    description: 'Standard SuperTrend indicator with ATR factor 3.0 and period 10 used across NSE F&O stocks.',
    descriptionGujarati: 'Indian stock market ma sauthi vadhare vapraatu SuperTrend indicator. Green ma buy ane Red ma sell.',
    code: `//@version=5
indicator("SuperTrend Trendline", overlay=true)

// Inputs
period = input.int(10, "ATR Period")
factor = input.float(3.0, "ATR Factor")

// Calculate SuperTrend
[st, dir] = ta.supertrend(factor, period)

// Plot SuperTrend dynamic line
plot(st, title="SuperTrend", color=dir == 1 ? color.green : color.red, linewidth=2)
`
  },
  {
    id: 'rsi-reversal',
    name: 'RSI 14 Oversold/Overbought Strategy',
    category: 'Strategy',
    description: 'Trades mean-reversion entries when RSI dips below 30 and exits when RSI crosses 70.',
    descriptionGujarati: 'RSI 30 thi niche aave tyare buy kare ane 70 thi upar jaay tyare sell kare.',
    code: `//@version=5
strategy("RSI 14 Mean Reversion", overlay=false)

length = input.int(14, "RSI Length")
overbought = input.int(70, "Overbought Level")
oversold = input.int(30, "Oversold Level")

rsiVal = ta.rsi(close, length)

// Plot Subpanel RSI
plot(rsiVal, title="RSI", color=color.purple, linewidth=2)
hline(70, title="Overbought", color=color.red)
hline(30, title="Oversold", color=color.green)

buy = ta.crossover(rsiVal, 30)
sell = ta.crossunder(rsiVal, 70)

if (buy)
    strategy.entry("Long", strategy.long)

if (sell)
    strategy.close("Long")
`
  },
  {
    id: 'bollinger-bands',
    name: 'Bollinger Bands Squeeze (20, 2)',
    category: 'Indicator',
    description: 'Bollinger Bands with 20 SMA basis and 2 standard deviation upper and lower envelopes.',
    descriptionGujarati: '20 SMA ane 2 Standard Deviation na Bollinger Bands. Volatility ane breakout pakadva mate.',
    code: `//@version=5
indicator("Bollinger Bands (20, 2)", overlay=true)

length = input.int(20, "Length")
mult = input.float(2.0, "StdDev")

[basis, upper, lower] = ta.bb(close, length, mult)

plot(basis, title="Basis (SMA 20)", color=color.orange, linewidth=1)
plot(upper, title="Upper Band", color=color.blue, linewidth=2)
plot(lower, title="Lower Band", color=color.blue, linewidth=2)
`
  },
  {
    id: 'triple-ema-ribbon',
    name: 'Triple EMA Ribbon (20, 50, 200)',
    category: 'Indicator',
    description: 'Swing trading trend filter using Short (20), Medium (50), and Long Term (200) EMAs.',
    descriptionGujarati: 'Short term (20), Medium term (50) ane Long term (200) EMA. Motu trend jova mate.',
    code: `//@version=5
indicator("Triple EMA Ribbon", overlay=true)

ema20 = ta.ema(close, 20)
ema50 = ta.ema(close, 50)
ema200 = ta.ema(close, 200)

plot(ema20, title="EMA 20", color=color.green, linewidth=2)
plot(ema50, title="EMA 50", color=color.orange, linewidth=2)
plot(ema200, title="EMA 200", color=color.red, linewidth=2)

goldenCross = ta.crossover(ema50, ema200)
plotshape(goldenCross, title="Golden Cross", style=shape.triangleup, location=location.belowbar, color=color.yellow, size=size.normal)
`
  },
  {
    id: 'blank-template',
    name: 'Blank Custom Pine Script',
    category: 'Indicator',
    description: 'Empty starter template to paste your own TradingView Pine Script v4 or v5.',
    descriptionGujarati: 'Tamaro potano TradingView Pine Script code paste karva mate blank template.',
    code: `//@version=5
indicator("My Custom Pine Script", overlay=true)

// Enter your Pine Script here:
// Examples:
// ma = ta.sma(close, 20)
// plot(ma, color=color.blue, linewidth=2)
`
  }
];
