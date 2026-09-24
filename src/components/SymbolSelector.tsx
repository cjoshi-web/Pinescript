import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { StockSymbol, Exchange } from '../types/market';
import { INDIAN_STOCKS } from '../services/marketData';

interface SymbolSelectorProps {
  selectedStock: StockSymbol;
  onSelectStock: (stock: StockSymbol) => void;
  language: 'en' | 'gu';
}

export const SymbolSelector: React.FC<SymbolSelectorProps> = ({
  selectedStock,
  onSelectStock,
  language
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedExchange, setSelectedExchange] = useState<string>('All');

  const categories = ['All', 'Indices', 'Banking', 'Tech', 'Energy', 'Auto', 'FMCG', 'Metals', 'Pharma', 'Adani'];

  const filteredStocks = useMemo(() => {
    return INDIAN_STOCKS.filter(item => {
      const matchesSearch =
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchesExchange =
        selectedExchange === 'All' || item.exchange === selectedExchange;

      return matchesSearch && matchesCategory && matchesExchange;
    });
  }, [searchQuery, selectedCategory, selectedExchange]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-left transition-colors"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-white font-mono">{selectedStock.symbol}</span>
            <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
              selectedStock.exchange === 'NSE' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {selectedStock.exchange}
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 truncate max-w-[130px]">
            {selectedStock.name}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-neutral-400 ml-1 shrink-0" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown Modal */}
          <div className="absolute left-0 top-full mt-2 w-80 md:w-96 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[460px]">
            {/* Search header */}
            <div className="p-3 border-b border-neutral-800 flex flex-col gap-2 bg-neutral-950/70">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'gu' ? 'શેર શોધો (દા.ત. NIFTY, RELIANCE, TCS)...' : 'Search stock (e.g. NIFTY, RELIANCE, TCS)...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-neutral-900 border border-neutral-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/80 font-mono"
                />
              </div>

              {/* Exchange filter buttons */}
              <div className="flex items-center gap-1.5">
                {(['All', 'NSE', 'BSE'] as const).map(exch => (
                  <button
                    key={exch}
                    onClick={() => setSelectedExchange(exch)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      selectedExchange === exch
                        ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/30'
                        : 'text-neutral-400 hover:text-white bg-neutral-950'
                    }`}
                  >
                    {exch}
                  </button>
                ))}
              </div>

              {/* Category buttons */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto divide-y divide-neutral-800/60 p-1">
              {filteredStocks.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-500">
                  {language === 'gu' ? 'કોઈ શેર મળ્યો નથી' : 'No stocks found'}
                </div>
              ) : (
                filteredStocks.map(item => {
                  const isSelected = selectedStock.symbol === item.symbol;
                  return (
                    <button
                      key={`${item.exchange}-${item.symbol}`}
                      onClick={() => {
                        onSelectStock(item);
                        setIsOpen(false);
                      }}
                      className={`w-full p-2.5 flex items-center justify-between text-left hover:bg-neutral-800/70 rounded-lg transition-colors group ${
                        isSelected ? 'bg-neutral-800/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white font-mono group-hover:text-emerald-400 transition-colors">
                              {item.symbol}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {item.exchange}
                            </span>
                            <span className="text-[9px] px-1 rounded bg-neutral-800 text-neutral-300">
                              {item.category}
                            </span>
                          </div>
                          <span className="text-[11px] text-neutral-400 truncate max-w-[200px]">
                            {item.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs tabular-nums text-neutral-300 font-medium">
                          ₹{item.basePrice.toLocaleString('en-IN')}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
