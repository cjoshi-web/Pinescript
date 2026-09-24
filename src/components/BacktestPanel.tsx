import React, { useState } from 'react';
import { PineExecutionResult } from '../types/market';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Terminal, BarChart2, ShieldCheck, ListOrdered } from 'lucide-react';

interface BacktestPanelProps {
  result: PineExecutionResult | null;
  language: 'en' | 'gu';
}

export const BacktestPanel: React.FC<BacktestPanelProps> = ({ result, language }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trades' | 'logs'>('overview');

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center text-xs text-neutral-500 font-mono">
        {language === 'gu'
          ? 'Pine Script રન કર્યા પછી રિઝલ્ટ અહીં દેખાશે'
          : 'Run a Pine Script to view strategy backtest performance & execution logs'}
      </div>
    );
  }

  const backtest = result.backtest;
  const isProfitable = (backtest?.netProfit || 0) >= 0;

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] rounded-lg border border-neutral-800/80 overflow-hidden">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-neutral-900/60 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-950 p-0.5 rounded-md border border-neutral-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-neutral-800 text-emerald-400 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>{language === 'gu' ? 'પરફોર્મન્સ સમરી' : 'Performance Summary'}</span>
            </button>

            {backtest && (
              <button
                onClick={() => setActiveTab('trades')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'trades'
                    ? 'bg-neutral-800 text-emerald-400 font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>
                  {language === 'gu' ? `ટ્રેડ હિસ્ટ્રી (${backtest.trades.length})` : `Trades (${backtest.trades.length})`}
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'logs'
                  ? 'bg-neutral-800 text-emerald-400 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{language === 'gu' ? 'કમ્પાઈલર લોગ્સ' : 'Console Logs'}</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
          <span>{result.isStrategy ? 'Pine Strategy' : 'Pine Indicator'}</span>
          <span>·</span>
          <span className="text-neutral-300 font-semibold">{result.title}</span>
        </div>
      </div>

      {/* Main Content View */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'overview' && (
          <div>
            {backtest ? (
              <div className="flex flex-col gap-4">
                {/* 5 Key Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {/* Net Profit */}
                  <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 flex flex-col">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">
                      {language === 'gu' ? 'નેટ પ્રોફિટ' : 'Net Profit'}
                    </span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className={`text-base font-bold font-mono tabular-nums ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfitable ? '+' : ''}₹{backtest.netProfit.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className={`text-[11px] font-mono tabular-nums ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isProfitable ? '+' : ''}{backtest.netProfitPercent}%
                    </span>
                  </div>

                  {/* Win Rate */}
                  <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 flex flex-col">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">
                      {language === 'gu' ? 'વિન રેટ' : 'Win Rate'}
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-base font-bold font-mono tabular-nums text-white">
                        {backtest.winRate}%
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {backtest.winningTrades}W / {backtest.losingTrades}L
                    </span>
                  </div>

                  {/* Total Trades */}
                  <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 flex flex-col">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">
                      {language === 'gu' ? 'કુલ ટ્રેડ્સ' : 'Total Trades'}
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-base font-bold font-mono tabular-nums text-white">
                        {backtest.totalTrades}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      Completed orders
                    </span>
                  </div>

                  {/* Profit Factor */}
                  <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 flex flex-col">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">
                      {language === 'gu' ? 'પ્રોફિટ ફેક્ટર' : 'Profit Factor'}
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-base font-bold font-mono tabular-nums text-white">
                        {backtest.profitFactor}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      Gross Win / Loss
                    </span>
                  </div>

                  {/* Max Drawdown */}
                  <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 flex flex-col">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">
                      {language === 'gu' ? 'મેક્સ ડ્રોડાઉન' : 'Max Drawdown'}
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-base font-bold font-mono tabular-nums text-rose-400">
                        -₹{backtest.maxDrawdown.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] text-rose-400 font-mono tabular-nums">
                      -{backtest.maxDrawdownPercent}%
                    </span>
                  </div>
                </div>

                {/* Strategy Notes / Summary */}
                <div className="p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/80 text-xs text-neutral-300">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {language === 'gu' ? 'Pine Script Strategy Backtest રીપોર્ટ' : 'Pine Script Strategy Backtest Verification'}
                    </span>
                  </div>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    {language === 'gu'
                      ? `આ સ્ટ્રેટેજી એ આપેલા સ્ટોક પર કુલ ${backtest.totalTrades} ટ્રેડ્સ એક્ઝિક્યુટ કર્યા છે, જેમાંથી ${backtest.winRate}% ટ્રેડ્સમાં નફો થયો છે. નેટ રિટર્ન ₹${backtest.netProfit} (${backtest.netProfitPercent}%) મળ્યું છે.`
                      : `The Pine Script strategy successfully simulated ${backtest.totalTrades} order executions on the selected candle series with a ${backtest.winRate}% win rate and a cumulative return of ₹${backtest.netProfit} (${backtest.netProfitPercent}%).`}
                  </p>
                </div>
              </div>
            ) : (
              /* Indicator Overview */
              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-lg bg-neutral-900/70 border border-neutral-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      {language === 'gu' ? 'ઇન્ડિકેટર સફળતાપૂર્વક પ્લોટ થયું' : 'Indicator Plotted Successfully'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    {language === 'gu'
                      ? `ચાર્ટ પર "${result.title}" ના ${result.plots.length} પ્લોટ અને ${result.markers.length} સિગ્નલ માર્કર્સ સેટ થયા છે.`
                      : `Applied "${result.title}" with ${result.plots.length} data series line(s) and ${result.markers.length} signal markers.`}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-1">
                    {result.plots.map((p, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-xs font-mono">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-white font-medium">{p.title}</span>
                        <span className="text-neutral-500 text-[10px]">({p.data.length} pts)</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-neutral-400 mt-2 border-t border-neutral-800/80 pt-2">
                    💡 <strong>Tip:</strong> {language === 'gu'
                      ? 'જો તમારે પ્રોફિટ અને વિન રેટ ગણવો હોય, તો indicator("...") ની જગ્યાએ strategy("...") અને strategy.entry("Long", strategy.long) વાપરો.'
                      : 'To automatically calculate win rate and backtest profits, use strategy("...") with strategy.entry("Long", strategy.long) and strategy.close("Long").'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trade Ledger Table */}
        {activeTab === 'trades' && backtest && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 text-[11px] uppercase">
                  <th className="py-2 px-2.5">#</th>
                  <th className="py-2 px-2.5">Type</th>
                  <th className="py-2 px-2.5">Entry Price</th>
                  <th className="py-2 px-2.5">Exit Price</th>
                  <th className="py-2 px-2.5 text-right">P&L (₹)</th>
                  <th className="py-2 px-2.5 text-right">Return %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {backtest.trades.map(trade => {
                  const isWin = (trade.pnl || 0) >= 0;
                  return (
                    <tr key={trade.id} className="hover:bg-neutral-900/60 transition-colors">
                      <td className="py-2 px-2.5 text-neutral-400">#{trade.id}</td>
                      <td className="py-2 px-2.5 font-bold">
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" />
                          {trade.direction}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 tabular-nums text-neutral-200">
                        ₹{trade.entryPrice.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 tabular-nums text-neutral-200">
                        {trade.exitPrice ? `₹${trade.exitPrice.toFixed(2)}` : 'Open'}
                      </td>
                      <td className={`py-2 px-2.5 tabular-nums text-right font-semibold ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isWin ? '+' : ''}₹{trade.pnl?.toFixed(2)}
                      </td>
                      <td className={`py-2 px-2.5 tabular-nums text-right font-semibold ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isWin ? '+' : ''}{trade.pnlPercent?.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Compiler Console Logs */}
        {activeTab === 'logs' && (
          <div className="font-mono text-xs bg-neutral-950 p-3 rounded-lg border border-neutral-800/80 max-h-60 overflow-y-auto space-y-1 text-neutral-300">
            {result.logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed flex items-start gap-2">
                <span className="text-neutral-500 select-none">[{idx + 1}]</span>
                <span className={log.includes('Warning') || log.includes('Error') ? 'text-amber-400' : 'text-neutral-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
