import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  ColorType,
  CandlestickSeries,
  LineSeries,
  createSeriesMarkers,
  IChartApi,
  ISeriesApi,
  Time
} from 'lightweight-charts';
import { Candle, PineExecutionResult, StockSymbol } from '../types/market';
import { Timeframe } from '../services/marketData';
import { Maximize2, RefreshCw } from 'lucide-react';

interface PineChartProps {
  stock: StockSymbol;
  candles: Candle[];
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  pineResult: PineExecutionResult | null;
  onRefreshData?: () => void;
  language: 'en' | 'gu';
}

export const PineChart: React.FC<PineChartProps> = ({
  stock,
  candles,
  timeframe,
  onTimeframeChange,
  pineResult,
  onRefreshData,
  language
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick', Time> | null>(null);

  const [hoverData, setHoverData] = useState<{
    time?: string;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    change?: number;
    changePercent?: number;
  }>({});

  const timeframes: Timeframe[] = ['1m', '5m', '15m', '1h', '1D'];

  // Latest candle values for default header display
  const latestCandle = candles[candles.length - 1];
  const firstCandle = candles[0];
  const totalChange = latestCandle && firstCandle ? latestCandle.close - firstCandle.open : 0;
  const totalChangePercent = firstCandle && firstCandle.open > 0 ? (totalChange / firstCandle.open) * 100 : 0;

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous instance
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const container = chartContainerRef.current;
    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: '#0a0d14' },
        textColor: '#94a3b8',
        fontSize: 11,
        fontFamily: "'JetBrains Mono', monospace"
      },
      grid: {
        vertLines: { color: 'rgba(30, 41, 59, 0.45)' },
        horzLines: { color: 'rgba(30, 41, 59, 0.45)' }
      },
      crosshair: {
        vertLine: {
          color: '#38bdf8',
          width: 1,
          style: 3,
          labelBackgroundColor: '#0f172a'
        },
        horzLine: {
          color: '#38bdf8',
          width: 1,
          style: 3,
          labelBackgroundColor: '#0f172a'
        }
      },
      rightPriceScale: {
        borderColor: '#1e293b',
        scaleMargins: {
          top: 0.1,
          bottom: 0.2
        }
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
        secondsVisible: false
      }
    });

    chartRef.current = chart;

    // Add Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444'
    });

    candleSeriesRef.current = candleSeries;

    const formattedCandles = candles.map(c => ({
      time: c.time as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close
    }));

    candleSeries.setData(formattedCandles);

    // Render Pine Script Plots
    if (pineResult && pineResult.plots && pineResult.plots.length > 0) {
      let subPaneCounter = 1;

      pineResult.plots.forEach(plot => {
        if (plot.data && plot.data.length > 0) {
          const isSub = !plot.overlay;
          const paneIndex = isSub ? subPaneCounter : 0;
          if (isSub) subPaneCounter++;

          try {
            const lineSeries = chart.addSeries(
              LineSeries,
              {
                color: plot.color || '#3b82f6',
                lineWidth: (plot.linewidth as any) || 2,
                title: plot.title,
                priceLineVisible: false
              },
              paneIndex
            );

            lineSeries.setData(
              plot.data.map(d => ({
                time: d.time as Time,
                value: d.value
              }))
            );
          } catch (err) {
            console.warn('Error plotting pine series:', err);
          }
        }
      });
    }

    // Render Pine Script Markers & Signals
    if (pineResult && pineResult.markers && pineResult.markers.length > 0) {
      try {
        const validMarkers = pineResult.markers.map(m => ({
          time: m.time as Time,
          position: m.position,
          color: m.color,
          shape: m.shape,
          text: m.text,
          size: m.size || 1
        }));

        createSeriesMarkers(candleSeries, validMarkers);
      } catch (err) {
        console.warn('Error applying series markers:', err);
      }
    }

    // Fit content
    chart.timeScale().fitContent();

    // Crosshair move handler
    chart.subscribeCrosshairMove(param => {
      if (!param.time || !param.seriesData) {
        setHoverData({});
        return;
      }

      const bar = param.seriesData.get(candleSeries) as any;
      if (bar) {
        const timeStr = typeof param.time === 'number'
          ? new Date(param.time * 1000).toLocaleString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : String(param.time);

        const chg = bar.close - bar.open;
        const chgPct = bar.open > 0 ? (chg / bar.open) * 100 : 0;

        setHoverData({
          time: timeStr,
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
          change: chg,
          changePercent: chgPct
        });
      }
    });

    // Resize observer
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [candles, pineResult]);

  const handleFit = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  };

  const displayOpen = hoverData.open ?? latestCandle?.open;
  const displayHigh = hoverData.high ?? latestCandle?.high;
  const displayLow = hoverData.low ?? latestCandle?.low;
  const displayClose = hoverData.close ?? latestCandle?.close;
  const displayChange = hoverData.change ?? totalChange;
  const displayChangePercent = hoverData.changePercent ?? totalChangePercent;
  const isUp = (displayChange || 0) >= 0;

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] rounded-lg border border-neutral-800/80 overflow-hidden relative">
      {/* Chart Sub-header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur shrink-0">
        {/* Left: Stock live stats */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white tracking-wide text-sm">{stock.symbol}</span>
            <span className="text-[10px] text-neutral-400 font-mono">({stock.exchange})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-bold tabular-nums text-white">
              ₹{displayClose?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-semibold tabular-nums ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isUp ? '+' : ''}{displayChange?.toFixed(2)} ({isUp ? '+' : ''}{displayChangePercent?.toFixed(2)}%)
            </span>
          </div>

          {/* OHLC figures */}
          <div className="hidden xl:flex items-center gap-3 text-[11px] text-neutral-400 pl-2 border-l border-neutral-800">
            <span>O <strong className="text-neutral-200 tabular-nums">{displayOpen?.toFixed(2)}</strong></span>
            <span>H <strong className="text-neutral-200 tabular-nums">{displayHigh?.toFixed(2)}</strong></span>
            <span>L <strong className="text-neutral-200 tabular-nums">{displayLow?.toFixed(2)}</strong></span>
            <span>C <strong className="text-neutral-200 tabular-nums">{displayClose?.toFixed(2)}</strong></span>
            {hoverData.time && (
              <span className="text-neutral-400">· {hoverData.time}</span>
            )}
          </div>
        </div>

        {/* Right: Timeframe selectors and controls */}
        <div className="flex items-center gap-1.5">
          {/* Timeframe pill tabs */}
          <div className="flex items-center bg-neutral-950 p-0.5 rounded-md border border-neutral-800">
            {timeframes.map(tf => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-neutral-800 text-emerald-400 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Fit zoom */}
          <button
            onClick={handleFit}
            className="p-1 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
            title="Reset Zoom / Auto Fit"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Refresh simulated ticks */}
          {onRefreshData && (
            <button
              onClick={onRefreshData}
              className="p-1 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              title={language === 'gu' ? 'ચાર્ટ ડેટા રિફ્રેશ કરો' : 'Refresh Market Data'}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full relative min-h-[300px]">
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>

      {/* Overlay indicator legend tags */}
      {pineResult && pineResult.plots && pineResult.plots.length > 0 && (
        <div className="absolute left-3 top-12 z-20 flex flex-wrap items-center gap-2 pointer-events-none bg-neutral-950/80 backdrop-blur px-2 py-1 rounded border border-neutral-800 text-[11px] font-mono">
          <span className="text-neutral-300 font-semibold">{pineResult.title}:</span>
          {pineResult.plots.map((p, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span className="w-2.5 h-1 rounded" style={{ backgroundColor: p.color }} />
              <span className="text-neutral-300">{p.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
