import React, { useState, useEffect, useCallback } from 'react';
import { StockSymbol, Candle, PineExecutionResult } from '../types/market';
import { INDIAN_STOCKS, Timeframe, generateCandles } from '../services/marketData';
import { executePineScript } from '../services/pineScriptEngine';
import { PINE_PRESETS, PinePreset } from '../services/pinePresets';
import { SymbolSelector } from './SymbolSelector';
import { PineChart } from './PineChart';
import { PineEditor } from './PineEditor';
import { BacktestPanel } from './BacktestPanel';
import { PanelLeftClose, PanelLeftOpen, Code2, ChevronDown, ChevronUp } from 'lucide-react';

interface PineStudioProps {
  language: 'en' | 'gu';
  selectedPreset?: PinePreset | null;
  onPresetLoaded?: () => void;
}

export const PineStudio: React.FC<PineStudioProps> = ({
  language,
  selectedPreset,
  onPresetLoaded
}) => {
  const [selectedStock, setSelectedStock] = useState<StockSymbol>(INDIAN_STOCKS[0]);
  const [timeframe, setTimeframe] = useState<Timeframe>('15m');
  const [code, setCode] = useState<string>(PINE_PRESETS[0].code);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [pineResult, setPineResult] = useState<PineExecutionResult | null>(null);
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [isBottomVisible, setIsBottomVisible] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Generate candles whenever stock or timeframe changes
  const refreshCandles = useCallback(() => {
    const data = generateCandles(selectedStock, timeframe, 280);
    setCandles(data);
    return data;
  }, [selectedStock, timeframe]);

  // Initial load and whenever stock or timeframe changes
  useEffect(() => {
    const freshCandles = refreshCandles();
    runScript(freshCandles);
  }, [selectedStock, timeframe]);

  // Handle external preset selection from the Presets Library tab
  useEffect(() => {
    if (selectedPreset) {
      setCode(selectedPreset.code);
      if (onPresetLoaded) onPresetLoaded();
      setTimeout(() => {
        runScript();
      }, 50);
    }
  }, [selectedPreset]);

  // Execute Pine Script
  const runScript = (candleData?: Candle[]) => {
    setIsExecuting(true);
    const targetCandles = candleData || candles;

    try {
      const result = executePineScript(code, targetCandles);
      setPineResult(result);
      setStatusMessage(
        language === 'gu'
          ? `સફળતાપૂર્વક રન થયું (${result.plots.length} લાઇન્સ, ${result.markers.length} સિગ્નલ્સ)`
          : `Compiled: ${result.plots.length} line(s), ${result.markers.length} signal(s)`
      );
    } catch (err: any) {
      console.error('Pine execution error:', err);
      setStatusMessage(`Compilation error: ${err?.message || err}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#070a10]">
      {/* Top Workspace Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 border-b border-neutral-800/80 bg-neutral-900/50 shrink-0">
        <div className="flex items-center gap-2">
          {/* Symbol Selector */}
          <SymbolSelector
            selectedStock={selectedStock}
            onSelectStock={(stock) => setSelectedStock(stock)}
            language={language}
          />

          {/* Editor Toggle */}
          <button
            onClick={() => setIsEditorVisible(!isEditorVisible)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isEditorVisible
                ? 'bg-neutral-800 border-neutral-700 text-emerald-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title={isEditorVisible ? 'Hide Pine Script Editor' : 'Show Pine Script Editor'}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isEditorVisible
                ? (language === 'gu' ? 'એડિટર છુપાવો' : 'Hide Editor')
                : (language === 'gu' ? 'Pine Script એડિટર' : 'Pine Editor')}
            </span>
          </button>
        </div>

        {/* Bottom Drawer Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBottomVisible(!isBottomVisible)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 transition-colors"
          >
            {isBottomVisible ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            <span>
              {language === 'gu' ? 'બેકટેસ્ટ પેનલ' : 'Strategy Backtest'}
            </span>
            {pineResult?.backtest && (
              <span className={`text-[10px] font-mono font-bold px-1 rounded ${
                pineResult.backtest.netProfit >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {pineResult.backtest.netProfit >= 0 ? '+' : ''}₹{pineResult.backtest.netProfit}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Upper Split: Chart + Code Editor */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 p-2 gap-2 overflow-hidden">
          {/* Chart Panel */}
          <div className="flex-1 h-full min-h-[320px] overflow-hidden">
            <PineChart
              stock={selectedStock}
              candles={candles}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              pineResult={pineResult}
              onRefreshData={() => {
                const refreshed = refreshCandles();
                runScript(refreshed);
              }}
              language={language}
            />
          </div>

          {/* Pine Script Code Editor Panel */}
          {isEditorVisible && (
            <div className="w-full lg:w-[480px] xl:w-[540px] h-[340px] lg:h-full shrink-0 overflow-hidden">
              <PineEditor
                code={code}
                onChangeCode={setCode}
                onExecute={() => runScript()}
                language={language}
                statusText={statusMessage}
                isExecuting={isExecuting}
              />
            </div>
          )}
        </div>

        {/* Lower Drawer: Strategy Backtesting & Console Panel */}
        {isBottomVisible && (
          <div className="h-56 lg:h-64 border-t border-neutral-800/80 shrink-0 p-2 pt-0 overflow-hidden">
            <BacktestPanel result={pineResult} language={language} />
          </div>
        )}
      </div>
    </div>
  );
};
