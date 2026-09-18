import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Lock, Check, CornerDownLeft } from 'lucide-react';
import { 
  NavTab, 
  CANONICAL_STATION_ORDER, 
  STATIONS, 
  DOMAINS, 
  isTabAllowed 
} from '../../config/navigation';
import { OperatorProfile } from '../../services/auth.service';

interface QuickStationSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavTab;
  onSelectStation: (tab: NavTab) => void;
  operator: OperatorProfile | null;
}

export const QuickStationSwitcher: React.FC<QuickStationSwitcherProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectStation,
  operator
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Store previously focused element on open and restore on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isOpen]);

  // Filter stations based on query and permission
  const filteredStations = useMemo(() => {
    const q = query.toLowerCase().trim();
    return CANONICAL_STATION_ORDER.map(tab => {
      const station = STATIONS[tab];
      const domain = DOMAINS.find(d => d.id === station.domainId);
      const allowed = isTabAllowed(tab, operator);

      const matches = !q || 
        station.label.toLowerCase().includes(q) ||
        station.shortLabel.toLowerCase().includes(q) ||
        station.code.toLowerCase().includes(q) ||
        station.description.toLowerCase().includes(q) ||
        domain?.label.toLowerCase().includes(q);

      return {
        station,
        domain,
        allowed,
        matches
      };
    }).filter(item => item.matches);
  }, [query, operator]);

  // Keep selected index within bounds
  useEffect(() => {
    if (selectedIndex >= filteredStations.length) {
      setSelectedIndex(Math.max(0, filteredStations.length - 1));
    }
  }, [filteredStations.length, selectedIndex]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredStations.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredStations.length) % Math.max(1, filteredStations.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredStations[selectedIndex];
      if (selected && selected.allowed) {
        onSelectStation(selected.station.id);
        onClose();
      }
    }
  };

  // Focus trap inside modal
  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusable = [inputRef.current].filter(Boolean);
      if (focusable.length === 1 && document.activeElement === inputRef.current) {
        e.preventDefault();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/80 backdrop-blur-sm font-mono"
      role="dialog"
      aria-modal="true"
      aria-label="Quick Station Switcher"
      onKeyDown={handleDialogKeyDown}
    >
      <div 
        className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] max-w-xl w-full shadow-2xl overflow-hidden flex flex-col font-mono animate-in fade-in duration-100"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search instrument or station..."
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono tracking-wide"
            aria-label="Search cleanroom stations"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-100 p-1 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-700 px-1.5 py-0.5 rounded-[var(--mes-radius)]">
            ESC
          </kbd>
        </div>

        {/* Station Results List */}
        <div 
          ref={listRef} 
          className="max-h-80 overflow-y-auto p-1.5 flex flex-col gap-1 focus:outline-none"
          role="listbox"
        >
          {filteredStations.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No stations match "{query}"
            </div>
          ) : (
            filteredStations.map((item, index) => {
              const isSelected = index === selectedIndex;
              const isActive = item.station.id === activeTab;

              return (
                <div
                  key={item.station.id}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={!item.allowed}
                  onClick={() => {
                    if (item.allowed) {
                      onSelectStation(item.station.id);
                      onClose();
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2 rounded-[var(--mes-radius)] transition-colors cursor-pointer text-xs font-mono ${
                    isSelected
                      ? item.allowed 
                        ? 'bg-slate-900 text-slate-100 border border-emerald-500/50 shadow-sm' 
                        : 'bg-slate-900/50 text-slate-600 border border-transparent cursor-not-allowed'
                      : 'text-slate-300 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded-[var(--mes-radius)]">
                      {item.station.code}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100 tracking-wider uppercase">
                          {item.station.label}
                        </span>
                        {isActive && (
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded-[var(--mes-radius)] border border-emerald-500/30 flex items-center gap-1 uppercase tracking-wider">
                            <Check className="w-2.5 h-2.5" />
                            CURRENT
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {item.station.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                      {item.domain?.shortLabel}
                    </span>
                    {!item.allowed ? (
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-950/40 border border-amber-500/30 px-1.5 py-0.5 rounded-[var(--mes-radius)] flex items-center gap-1 uppercase">
                        <Lock className="w-3 h-3" />
                        <span>Requires {item.station.requiredRoles[0]}</span>
                      </span>
                    ) : isSelected ? (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
                        <span>Navigate</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-t border-slate-800 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div>
            <span>12 Cleanroom Instruments</span>
          </div>
        </div>
      </div>
    </div>
  );
};
