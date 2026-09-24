import React, { useState } from 'react';
import { Navbar, TerminalTab, Language } from './components/Navbar';
import { PineStudio } from './components/PineStudio';
import { TradingViewWidget } from './components/TradingViewWidget';
import { PresetsLibrary } from './components/PresetsLibrary';
import { PineGuide } from './components/PineGuide';
import { GitHubDeployModal } from './components/GitHubDeployModal';
import { StockSymbol } from './types/market';
import { INDIAN_STOCKS } from './services/marketData';
import { PINE_PRESETS, PinePreset } from './services/pinePresets';
import { SymbolSelector } from './components/SymbolSelector';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TerminalTab>('pine-studio');
  const [language, setLanguage] = useState<Language>('gu'); // Default to Gujarati as requested by user
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [selectedPresetForStudio, setSelectedPresetForStudio] = useState<PinePreset | null>(null);
  
  // Active stock for TradingView Pro view
  const [tvStock, setTvStock] = useState<StockSymbol>(INDIAN_STOCKS[0]);
  const [currentPineCode, setCurrentPineCode] = useState<string>(PINE_PRESETS[0].code);

  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'gu' ? 'en' : 'gu'));
  };

  const handleLoadPresetFromLibrary = (preset: PinePreset) => {
    setSelectedPresetForStudio(preset);
    setCurrentPineCode(preset.code);
    setCurrentTab('pine-studio');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070a10] text-neutral-100 font-sans">
      {/* Universal Top Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Main Viewport */}
      <main className="flex-1 min-h-0 overflow-hidden relative">
        {currentTab === 'pine-studio' && (
          <PineStudio
            language={language}
            selectedPreset={selectedPresetForStudio}
            onPresetLoaded={() => setSelectedPresetForStudio(null)}
          />
        )}

        {currentTab === 'tradingview-pro' && (
          <div className="h-full flex flex-col p-2 gap-2">
            {/* Quick stock switcher for TradingView */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-medium">
                  {language === 'gu' ? 'શેર પસંદ કરો:' : 'Select Symbol:'}
                </span>
                <SymbolSelector
                  selectedStock={tvStock}
                  onSelectStock={(stock) => setTvStock(stock)}
                  language={language}
                />
              </div>

              <div className="text-xs text-neutral-400 font-mono hidden md:block">
                Exchange: <span className="text-white font-bold">{tvStock.exchange}</span> · Symbol: <span className="text-emerald-400 font-bold">{tvStock.tvSymbol}</span>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <TradingViewWidget
                stock={tvStock}
                pineScriptCode={currentPineCode}
                language={language}
              />
            </div>
          </div>
        )}

        {currentTab === 'presets' && (
          <PresetsLibrary
            onLoadPreset={handleLoadPresetFromLibrary}
            language={language}
          />
        )}

        {currentTab === 'guide' && (
          <PineGuide language={language} />
        )}
      </main>

      {/* GitHub Free Deployment Guide Modal */}
      <GitHubDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        language={language}
      />
    </div>
  );
}
