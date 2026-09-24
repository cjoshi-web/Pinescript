import React, { useState } from 'react';
import { Terminal, LineChart, Code2, Globe, Github, Sparkles, BookOpen, Download, Loader2 } from 'lucide-react';
import { getMarketStatus } from '../services/marketData';
import { downloadProjectZip } from '../services/exportZip';

export type TerminalTab = 'pine-studio' | 'tradingview-pro' | 'presets' | 'guide';
export type Language = 'en' | 'gu';

interface NavbarProps {
  currentTab: TerminalTab;
  onSelectTab: (tab: TerminalTab) => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenDeployModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  onOpenDeployModal
}) => {
  const marketStatus = getMarketStatus();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('');

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      await downloadProjectZip((msg) => setDownloadMsg(msg));
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
      setDownloadMsg('');
    }
  };

  return (
    <header className="h-14 border-b border-neutral-800/80 bg-neutral-900/95 backdrop-blur px-4 flex items-center justify-between shrink-0 select-none z-30">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
            NP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white font-sans">
                NIFTY<span className="text-emerald-400">PULSE</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400 border border-neutral-800 rounded px-1.5 py-0.5">
                NSE · BSE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation Links (Single line controls) */}
      <nav className="hidden md:flex items-center gap-1 bg-neutral-950/60 p-1 rounded-lg border border-neutral-800/80">
        <button
          onClick={() => onSelectTab('pine-studio')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            currentTab === 'pine-studio'
              ? 'bg-neutral-800 text-emerald-400 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{language === 'gu' ? 'Pine Script સ્ટુડિયો' : 'Pine Script Studio'}</span>
        </button>

        <button
          onClick={() => onSelectTab('tradingview-pro')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            currentTab === 'tradingview-pro'
              ? 'bg-neutral-800 text-emerald-400 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <LineChart className="w-3.5 h-3.5" />
          <span>{language === 'gu' ? 'TradingView લાઈવ ચાર્ટ' : 'TradingView Live Pro'}</span>
        </button>

        <button
          onClick={() => onSelectTab('presets')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            currentTab === 'presets'
              ? 'bg-neutral-800 text-emerald-400 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'gu' ? 'ઇન્ડિકેટર પ્રીસેટ્સ' : 'Pine Script Library'}</span>
        </button>

        <button
          onClick={() => onSelectTab('guide')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            currentTab === 'guide'
              ? 'bg-neutral-800 text-emerald-400 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{language === 'gu' ? 'માર્ગદર્શિકા (Guide)' : 'Pine & TV Guide'}</span>
        </button>
      </nav>

      {/* Zone 3: Primary Actions & Status */}
      <div className="flex items-center gap-2.5">
        {/* Market Status indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-950/60 border border-neutral-800 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              marketStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="text-neutral-300 font-mono text-[11px] tabular-nums">
            {marketStatus.istTime}
          </span>
          <span className="text-neutral-400 text-[11px]">
            · {marketStatus.message}
          </span>
        </div>

        {/* Gujarati / English Toggle */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors border border-neutral-700/60"
          title="Switch Language / ભાષા બદલો"
        >
          <Globe className="w-3.5 h-3.5 text-neutral-400" />
          <span>{language === 'gu' ? 'English' : 'ગુજરાતી'}</span>
        </button>

        {/* Download Full Project ZIP CTA */}
        <button
          onClick={handleDownloadZip}
          disabled={isDownloading}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm whitespace-nowrap disabled:opacity-50"
          title="Download full project source code as .ZIP"
        >
          {isDownloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>
            {isDownloading
              ? (downloadMsg || (language === 'gu' ? 'ડાઉનલોડ થઈ રહ્યું છે...' : 'Downloading...'))
              : (language === 'gu' ? 'પ્રોજેક્ટ ડાઉનલોડ (.ZIP)' : 'Download Project ZIP')}
          </span>
        </button>

        {/* GitHub Deploy / Free Host Button */}
        <button
          onClick={onOpenDeployModal}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-750 border border-neutral-700/80 text-neutral-200 text-xs font-medium transition-colors whitespace-nowrap"
        >
          <Github className="w-3.5 h-3.5" />
          <span>{language === 'gu' ? 'GitHub ગાઈડ' : 'GitHub Guide'}</span>
        </button>
      </div>
    </header>
  );
};
