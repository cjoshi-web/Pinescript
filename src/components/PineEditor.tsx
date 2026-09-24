import React, { useState } from 'react';
import { Play, Copy, Download, RotateCcw, Check, Sparkles, ChevronDown } from 'lucide-react';
import { PINE_PRESETS, PinePreset } from '../services/pinePresets';

interface PineEditorProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  onExecute: () => void;
  language: 'en' | 'gu';
  statusText?: string;
  isExecuting?: boolean;
}

export const PineEditor: React.FC<PineEditorProps> = ({
  code,
  onChangeCode,
  onExecute,
  language,
  statusText,
  isExecuting
}) => {
  const [copied, setCopied] = useState(false);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);

  // Line numbers count
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Run on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onExecute();
      return;
    }

    // Support Tab key inside editor
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChangeCode(newCode);

      // Restore cursor position
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'strategy_or_indicator.pine';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectPreset = (preset: PinePreset) => {
    onChangeCode(preset.code);
    setPresetDropdownOpen(false);
    setTimeout(() => {
      onExecute();
    }, 50);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d111a] rounded-lg border border-neutral-800/80 overflow-hidden">
      {/* Editor Header Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-neutral-900/70 shrink-0">
        <div className="flex items-center gap-2">
          {/* Preset Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-750 text-xs font-medium text-neutral-200 border border-neutral-700/60 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'gu' ? 'પ્રીસેટ્સ પસંદ કરો' : 'Load Pine Preset'}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {presetDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setPresetDropdownOpen(false)} />
                <div className="absolute left-0 top-full mt-1.5 w-72 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50 overflow-hidden py-1">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                    {language === 'gu' ? 'તૈયાર Pine Scripts' : 'Pre-built Pine Scripts'}
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {PINE_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className="w-full px-3 py-2 text-left hover:bg-neutral-800 transition-colors flex flex-col gap-0.5 border-b border-neutral-800/40 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-white">{preset.name}</span>
                          <span className={`text-[9px] px-1 rounded ${
                            preset.category === 'Strategy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {preset.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-400 truncate">
                          {language === 'gu' ? preset.descriptionGujarati : preset.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
            //@version=5
          </span>
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Copy Pine Script"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Download .pine File"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleSelectPreset(PINE_PRESETS[0])}
            className="p-1.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Reset to default script"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Run Script Primary CTA */}
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold shadow transition-all disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{language === 'gu' ? 'ચાર્ટ પર રન કરો' : 'Run Script'}</span>
            <kbd className="hidden lg:inline text-[9px] bg-emerald-700/80 px-1 py-0.2 rounded font-mono">
              Ctrl+↵
            </kbd>
          </button>
        </div>
      </div>

      {/* Editor Main Canvas with Line Numbers */}
      <div className="flex-1 flex overflow-hidden font-mono text-xs relative bg-[#0b0e17]">
        {/* Line numbers column */}
        <div className="w-10 select-none py-3 text-right pr-2.5 text-neutral-600 border-r border-neutral-800/80 bg-[#090c14] font-mono leading-relaxed overflow-hidden">
          {lineNumbers.map(num => (
            <div key={num} className="h-5 text-[11px] leading-5">
              {num}
            </div>
          ))}
        </div>

        {/* Code Textarea */}
        <div className="flex-1 relative overflow-hidden">
          <textarea
            value={code}
            onChange={(e) => onChangeCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            placeholder="// Paste or write your TradingView Pine Script here..."
            className="w-full h-full p-3 bg-transparent text-neutral-200 placeholder-neutral-600 resize-none font-mono text-xs leading-5 focus:outline-none selection:bg-emerald-500/30 selection:text-white whitespace-pre overflow-auto"
            style={{ tabSize: 4 }}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-3 py-1.5 border-t border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between text-[11px] font-mono text-neutral-400 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span>{statusText || (language === 'gu' ? 'Pine Script તૈયાર છે' : 'Pine Script Ready')}</span>
        </div>
        <div>
          <span>{lineCount} lines · UTF-8</span>
        </div>
      </div>
    </div>
  );
};
