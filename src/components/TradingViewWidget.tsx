import React, { useEffect, useRef } from 'react';
import { StockSymbol } from '../types/market';
import { ExternalLink, Copy, Check, Info } from 'lucide-react';

interface TradingViewWidgetProps {
  stock: StockSymbol;
  pineScriptCode?: string;
  language: 'en' | 'gu';
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  stock,
  pineScriptCode,
  language
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;

    // TV configuration for NSE/BSE
    const config = {
      autosize: true,
      symbol: stock.tvSymbol,
      interval: 'D',
      timezone: 'Asia/Kolkata',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      toolbar_bg: '#0a0d14',
      withdateranges: true,
      hide_volume: false,
      studies: [
        'STD;SMA',
        'STD;RSI'
      ]
    };

    script.innerHTML = JSON.stringify(config);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [stock.tvSymbol]);

  const handleCopyPine = async () => {
    if (!pineScriptCode) return;
    try {
      await navigator.clipboard.writeText(pineScriptCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] rounded-lg border border-neutral-800/80 overflow-hidden">
      {/* Top Banner explaining how to run Pine Script on TradingView itself */}
      <div className="px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-neutral-300">
            {language === 'gu' ? (
              <span>
                <strong>TradingView Live Pro ચાર્ટ:</strong> આ ચાર્ટમાં NSE/BSE ના બધા જ ઇન્ડિકેટર્સ અને ટૂલ્સ ઉપલબ્ધ છે. તમારા Pine Script કોડને TradingView ના નીચે આપેલા <strong>Pine Editor</strong> માં પેસ્ટ કરીને <em>"Add to chart"</em> કરી શકો છો.
              </span>
            ) : (
              <span>
                <strong>TradingView Official Live Chart:</strong> Real-time Indian NSE/BSE feed with 100+ indicators. You can also paste your Pine Script directly into TradingView's bottom <strong>Pine Editor</strong>.
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pineScriptCode && (
            <button
              onClick={handleCopyPine}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors border border-neutral-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{language === 'gu' ? 'Pine Script કોપી કરો' : 'Copy Pine Script'}</span>
            </button>
          )}

          <a
            href={`https://in.tradingview.com/chart/?symbol=${stock.tvSymbol}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
          >
            <span>TradingView.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded TradingView Chart Container */}
      <div className="flex-1 w-full h-full relative" ref={containerRef} />
    </div>
  );
};
