import React, { useState } from 'react';
import { BookOpen, Code2, LineChart, Cpu, CheckCircle2, Lightbulb, Download, Loader2 } from 'lucide-react';
import { downloadProjectZip } from '../services/exportZip';

interface PineGuideProps {
  language: 'en' | 'gu';
}

export const PineGuide: React.FC<PineGuideProps> = ({ language }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('');

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadProjectZip((msg) => setDownloadMsg(msg));
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
      setDownloadMsg('');
    }
  };
  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            {language === 'gu'
              ? 'Pine Script & NSE/BSE ચાર્ટિંગ ગાઈડ'
              : 'Pine Script & Indian Market Charting Guide'}
          </h1>
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          {language === 'gu'
            ? 'TradingView ની Pine Script કેવી રીતે લખવી, રન કરવી અને GitHub Pages પર મફત હોસ્ટ કરવાની સંપૂર્ણ સમજણ.'
            : 'Complete documentation on writing Pine Script v5, backtesting Indian equities, and hosting for free on GitHub Pages.'}
        </p>
      </div>

      {/* Section 1: How Pine Script runs in this application */}
      <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
          <Cpu className="w-4 h-4" />
          <span>
            {language === 'gu' ? '૧. આ એપ્લિકેશનમાં Pine Script કેવી રીતે કામ કરે છે?' : '1. How Pine Script Executes in this Terminal'}
          </span>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed">
          {language === 'gu' ? (
            <span>
              આ વેબ ટર્મિનલમાં એક ઇન-બિલ્ટ <strong>Pine Script v4/v5 કમ્પાઇલર અને એક્ઝિક્યુશન એન્જિન</strong> છે. જ્યારે તમે Pine Script કોડ લખીને <em>"Run Script"</em> બટન દબાવો છો, ત્યારે એન્જિન આપેલા NSE અથવા BSE સ્ટોકના દરેક કેન્ડલ (OHLCV ડેટા) પર બાર-બાય-બાર કેલ્ક્યુલેશન કરે છે.
            </span>
          ) : (
            <span>
              This terminal houses a native <strong>Pine Script v4/v5 execution engine</strong>. When you write or paste Pine Script and click <em>"Run Script"</em>, the engine evaluates bar-by-bar mathematical series over historical NSE/BSE candlestick data.
            </span>
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-xs">
          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="font-semibold text-white">Indicator Mode</span>
            <p className="text-neutral-400 text-[11px]">
              <code>indicator("Title", overlay=true)</code>
              <br />
              ચાર્ટ ઉપર અથવા નીચે સબપેનલમાં મુવિંગ એવરેજ, RSI, SuperTrend અને બાય/સેલ ત્રિકોણ માર્કર્સ પ્લોટ કરે છે.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="font-semibold text-white">Strategy Mode</span>
            <p className="text-neutral-400 text-[11px]">
              <code>strategy("Title", overlay=true)</code>
              <br />
              <code>strategy.entry()</code> અને <code>strategy.close()</code> વડે ઑટોમેટિક બેકટેસ્ટ કરે છે (વિન રેટ %, નેટ પ્રોફિટ ₹, અને ટ્રેડ લિસ્ટ).
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Supported Pine Script Functions */}
      <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
          <Code2 className="w-4 h-4" />
          <span>
            {language === 'gu' ? '૨. સપોર્ટેડ Pine Script ફંક્શન્સ' : '2. Supported Pine Script Functions'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border border-neutral-800">
            <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-2.5">Pine Function</th>
                <th className="p-2.5">Example Usage</th>
                <th className="p-2.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              <tr>
                <td className="p-2.5 text-emerald-400 font-semibold">ta.ema(src, len)</td>
                <td className="p-2.5"><code>ema9 = ta.ema(close, 9)</code></td>
                <td className="p-2.5">Exponential Moving Average</td>
              </tr>
              <tr>
                <td className="p-2.5 text-emerald-400 font-semibold">ta.sma(src, len)</td>
                <td className="p-2.5"><code>sma20 = ta.sma(close, 20)</code></td>
                <td className="p-2.5">Simple Moving Average</td>
              </tr>
              <tr>
                <td className="p-2.5 text-emerald-400 font-semibold">ta.rsi(src, len)</td>
                <td className="p-2.5"><code>rsi14 = ta.rsi(close, 14)</code></td>
                <td className="p-2.5">Relative Strength Index (0-100)</td>
              </tr>
              <tr>
                <td className="p-2.5 text-emerald-400 font-semibold">ta.supertrend(factor, period)</td>
                <td className="p-2.5"><code>[st, dir] = ta.supertrend(3, 10)</code></td>
                <td className="p-2.5">Dynamic ATR SuperTrend line</td>
              </tr>
              <tr>
                <td className="p-2.5 text-emerald-400 font-semibold">ta.bb(src, len, mult)</td>
                <td className="p-2.5"><code>[basis, up, low] = ta.bb(close, 20, 2)</code></td>
                <td className="p-2.5">Bollinger Bands Envelopes</td>
              </tr>
              <tr>
                <td className="p-2.5 text-emerald-400 font-semibold">ta.crossover(a, b)</td>
                <td className="p-2.5"><code>buy = ta.crossover(ema9, ema21)</code></td>
                <td className="p-2.5">Returns true when a crosses above b</td>
              </tr>
              <tr>
                <td className="p-2.5 text-emerald-400 font-semibold">ta.crossunder(a, b)</td>
                <td className="p-2.5"><code>sell = ta.crossunder(ema9, ema21)</code></td>
                <td className="p-2.5">Returns true when a crosses below b</td>
              </tr>
              <tr>
                <td className="p-2.5 text-emerald-400 font-semibold">plot(series, color, ...)</td>
                <td className="p-2.5"><code>plot(ema9, color=color.green)</code></td>
                <td className="p-2.5">Draws line on chart</td>
              </tr>
              <tr>
                <td className="p-2.5 text-emerald-400 font-semibold">plotshape(cond, ...)</td>
                <td className="p-2.5"><code>plotshape(buy, style=shape.triangleup)</code></td>
                <td className="p-2.5">Plots Buy/Sell arrow markers</td>
              </tr>
              <tr>
                <td className="p-2.5 text-emerald-400 font-semibold">strategy.entry / close</td>
                <td className="p-2.5"><code>strategy.entry("Long", strategy.long)</code></td>
                <td className="p-2.5">Simulates trade for backtesting</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: TradingView Live Pro */}
      <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
          <LineChart className="w-4 h-4" />
          <span>
            {language === 'gu' ? '૩. TradingView પ્રો ચાર્ટનો ઉપયોગ કેવી રીતે કરવો?' : '3. Using the TradingView Live Pro Tab'}
          </span>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed">
          {language === 'gu' ? (
            <span>
              ઉપરના નેવિગેશન બારમાંથી <strong>TradingView લાઈવ ચાર્ટ</strong> ટેબ ખોલીને તમે સીધા TradingView ના ઑફિશિયલ એડવાન્સ્ડ વિજેટમાં NSE અને BSE ના લાઇવ શેર્સ (જેમ કે Nifty 50, Reliance, TCS, HDFC Bank) જોઈ શકો છો. તેમાં ટ્રેડિંગવ્યૂ ના 100+ ફ્રી ઇન્ડિકેટર્સ (RSI, MACD, Bollinger Bands, Volume Profile) અને બધા જ ડ્રોઇંગ ટૂલ્સ સીધા ઉપલબ્ધ છે.
            </span>
          ) : (
            <span>
              The <strong>TradingView Live Pro</strong> tab embeds TradingView's official advanced widget covering live NSE and BSE tickers with full drawing tools, multi-timeframe analysis, and TradingView's native indicator suite.
            </span>
          )}
        </p>
      </div>

      {/* Section 4: GitHub Free Hosting & Direct Download */}
      <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'gu' ? '૪. પર્સનલ ઉપયોગ માટે GitHub Pages પર ૧૦૦% મફત હોસ્ટિંગ & ડાઉનલોડ' : '4. 100% Free Hosting on GitHub Pages & Source Code Download'}
            </span>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shrink-0 disabled:opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>
              {isDownloading
                ? (downloadMsg || (language === 'gu' ? 'ડાઉનલોડિંગ...' : 'Downloading...'))
                : (language === 'gu' ? 'આખો પ્રોજેક્ટ .ZIP ડાઉનલોડ કરો' : 'Download Project .ZIP')}
            </span>
          </button>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          {language === 'gu' ? (
            <span>
              તમે તમારા વ્યક્તિગત ઉપયોગ માટે આ વેબસાઇટને GitHub Pages પર હોસ્ટ કરી શકો છો. આ માટે કોઈ સર્વર કે ડેટાબેઝની જરૂર નથી. ઉપર આપેલા <strong>"આખો પ્રોજેક્ટ .ZIP ડાઉનલોડ કરો"</strong> બટનથી તમામ ફાઇલો મેળવી શકો છો અને તમારા કમ્પ્યુટર પર <code>npm install</code> અને <code>npm run dev</code> કરીને સીધું ચલાવી શકો છો.
            </span>
          ) : (
            <span>
              This repository is designed specifically for personal zero-cost hosting. You can download the complete source code directly as a ZIP archive with the button above, or host it permanently for free on GitHub Pages.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
