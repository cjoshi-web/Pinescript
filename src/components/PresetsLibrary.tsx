import React from 'react';
import { PINE_PRESETS, PinePreset } from '../services/pinePresets';
import { Code2, Play, Sparkles, Check } from 'lucide-react';

interface PresetsLibraryProps {
  onLoadPreset: (preset: PinePreset) => void;
  language: 'en' | 'gu';
}

export const PresetsLibrary: React.FC<PresetsLibraryProps> = ({
  onLoadPreset,
  language
}) => {
  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header banner */}
      <div className="flex flex-col gap-1.5 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            {language === 'gu' ? 'તૈયાર Pine Script લાઈબ્રેરી' : 'Pine Script Strategy & Indicator Library'}
          </h1>
        </div>
        <p className="text-xs text-neutral-400 max-w-3xl">
          {language === 'gu'
            ? 'ભારતીય બજારો (Nifty 50, Bank Nifty, Reliance, વગેરે) માટે સૌથી વધુ લોકપ્રિય Pine Scripts. કોઈપણ સ્ક્રિપ્ટ પસંદ કરીને એક ક્લિકમાં ચાર્ટ પર રન કરો અથવા બેકટેસ્ટ કરો.'
            : 'Pre-configured Pine Script algorithms optimized for Indian equity markets (NSE/BSE). Load any preset with a single click to backtest or visualize on live candlestick charts.'}
        </p>
      </div>

      {/* Grid of Presets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PINE_PRESETS.map(preset => (
          <div
            key={preset.id}
            className="flex flex-col justify-between p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{preset.name}</h3>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium ${
                    preset.category === 'Strategy'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {preset.category}
                </span>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                {language === 'gu' ? preset.descriptionGujarati : preset.description}
              </p>

              {/* Code snippet preview */}
              <div className="mt-3 p-2.5 rounded-lg bg-neutral-950 font-mono text-[11px] text-neutral-300 max-h-36 overflow-y-auto border border-neutral-800/80">
                <pre className="whitespace-pre">{preset.code}</pre>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-500">
                //@version=5 · PineScript
              </span>

              <button
                onClick={() => onLoadPreset(preset)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'gu' ? 'સ્ટુડિયોમાં લોડ કરો' : 'Load into Studio'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
