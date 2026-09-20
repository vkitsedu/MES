import React, { useState, useEffect, useRef, useMemo } from 'react';
import { NavTab, CANONICAL_STATION_ORDER, STATIONS } from '../../config/navigation';
import { useTheme } from '../../themes/ThemeProvider';
import { ThemeId, ENTERPRISE_THEMES } from '../../themes/theme-definitions';
import { 
  Search, 
  Layers, 
  Palette, 
  ArrowRight, 
  Radio, 
  FileText, 
  Network, 
  UserCheck, 
  Key, 
  Split,
  Activity,
  Cpu,
  Sliders,
  Flame,
  Truck,
  Shield,
  GitFork,
  Crosshair,
  Terminal,
  Clock,
  BarChart3
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
  onSelectLine: (line: 'LINE_01' | 'LINE_02') => void;
  currentLine: 'LINE_01' | 'LINE_02';
  onOpenThemeModal: () => void;
  onOpenFujiLinkModal: () => void;
  onExportBriefing: () => void;
  onOpenLoginModal: () => void;
}

interface CommandItem {
  id: string;
  category: 'STATIONS' | 'LINES' | 'THEMES' | 'ACTIONS';
  title: string;
  subtitle?: string;
  badge?: string;
  shortcut?: string;
  icon: any;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectLine,
  currentLine,
  onOpenThemeModal,
  onOpenFujiLinkModal,
  onExportBriefing,
  onOpenLoginModal
}) => {
  const { setThemeId, themeId } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build command catalog
  const allCommands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [];

    // 1. Cleanroom Stations
    const iconMap: Record<NavTab, any> = {
      FLEET: Split,
      SUPERVISOR: Activity,
      STUDIO: Sliders,
      NOC: Radio,
      CYBER_GRID: Layers,
      SIX_SIGMA_LAB: BarChart3,
      TACTICAL_KIOSK: Cpu,
      OPERATOR: Cpu,
      SPI: Sliders,
      SOLDER_PASTE: Layers,
      REFLOW: Flame,
      AGV_LOGISTICS: Truck,
      COMPLIANCE: Shield,
      GENEALOGY: GitFork,
      REWORK: Crosshair,
      PREDICTIVE: Activity,
      AUDIT_TRAIL: Terminal
    };

    CANONICAL_STATION_ORDER.forEach((tabId) => {
      const cfg = STATIONS[tabId];
      if (cfg) {
        items.push({
          id: `station-${tabId}`,
          category: 'STATIONS',
          title: cfg.label,
          subtitle: cfg.description,
          badge: cfg.code,
          shortcut: cfg.shortcut ? `Alt+${cfg.shortcut}` : undefined,
          icon: iconMap[tabId] || Layers,
          action: () => {
            onSelectTab(tabId);
            onClose();
          }
        });
      }
    });

    // 2. Production Lines
    items.push({
      id: 'line-01',
      category: 'LINES',
      title: 'Switch to SMT Line 01 (Fuji NXT III M6)',
      subtitle: 'Primary high-speed placement bay (4 modules, 45,000 CPH)',
      badge: currentLine === 'LINE_01' ? 'ACTIVE' : 'SELECT',
      icon: Radio,
      action: () => {
        onSelectLine('LINE_01');
        onClose();
      }
    });

    items.push({
      id: 'line-02',
      category: 'LINES',
      title: 'Switch to SMT Line 02 (DEK / Fuji Dual Lane)',
      subtitle: 'Secondary automotive ECU line (2 modules, 32,000 CPH)',
      badge: currentLine === 'LINE_02' ? 'ACTIVE' : 'SELECT',
      icon: Radio,
      action: () => {
        onSelectLine('LINE_02');
        onClose();
      }
    });

    // 3. Theme Switches
    Object.values(ENTERPRISE_THEMES).forEach((t) => {
      items.push({
        id: `theme-${t.id}`,
        category: 'THEMES',
        title: `Theme: ${t.name}`,
        subtitle: t.tagline,
        badge: themeId === t.id ? 'CURRENT' : t.category,
        icon: Palette,
        action: () => {
          setThemeId(t.id);
          onClose();
        }
      });
    });

    // 4. Cleanroom Actions
    items.push({
      id: 'action-briefing',
      category: 'ACTIONS',
      title: 'Generate Shift Handover Briefing',
      subtitle: 'Export SEMI E10 OEE & downtime Pareto to clipboard',
      badge: 'REPORT',
      icon: FileText,
      action: () => {
        onClose();
        onExportBriefing();
      }
    });

    items.push({
      id: 'action-theme-studio',
      category: 'ACTIONS',
      title: 'Open Theme & Palette Studio',
      subtitle: 'Customize substrate depth, accent luminescence, and corner radius',
      badge: 'CUSTOMIZE',
      icon: Palette,
      action: () => {
        onClose();
        onOpenThemeModal();
      }
    });

    items.push({
      id: 'action-fuji-link',
      category: 'ACTIONS',
      title: 'Configure Fuji Machine Link & OT Network',
      subtitle: 'Inspect local IP addresses, customize TCP ports, and view wire logs',
      badge: 'OT GATEWAY',
      icon: Network,
      action: () => {
        onClose();
        onOpenFujiLinkModal();
      }
    });

    items.push({
      id: 'action-auth',
      category: 'ACTIONS',
      title: 'Operator Sign-In & Role Authorization',
      subtitle: 'Switch cleanroom badge (Operator, Supervisor, Quality Lead, Admin)',
      badge: 'AUTH',
      icon: Key,
      action: () => {
        onClose();
        onOpenLoginModal();
      }
    });

    return items;
  }, [
    onSelectTab,
    onSelectLine,
    currentLine,
    themeId,
    setThemeId,
    onClose,
    onExportBriefing,
    onOpenThemeModal,
    onOpenFujiLinkModal,
    onOpenLoginModal
  ]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase().trim();
    return allCommands.filter((cmd) => {
      return (
        cmd.title.toLowerCase().includes(q) ||
        (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q)) ||
        (cmd.badge && cmd.badge.toLowerCase().includes(q)) ||
        cmd.category.toLowerCase().includes(q)
      );
    });
  }, [allCommands, query]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          selected.action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const activeEl = listEl.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/80 backdrop-blur-sm p-3 font-mono animate-in fade-in duration-100"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
      >
        {/* Search Input Bar */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center gap-2.5 shrink-0">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a station, line, theme, or cleanroom action (e.g. 'Fuji', 'Reflow', 'Theme', 'PPM')..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono tracking-wide"
          />
          <kbd className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 border border-slate-700 rounded-[var(--mes-radius)] shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No matching cleanroom commands found for "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  data-index={idx}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between gap-3 px-3 py-2 rounded-[var(--mes-radius)] cursor-pointer transition-colors text-xs font-mono ${
                    isSelected
                      ? 'bg-slate-900 border border-emerald-500/60 text-slate-100 shadow-sm'
                      : 'border border-transparent hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-cyan-400'}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold tracking-tight truncate ${isSelected ? 'text-white' : 'text-slate-100'}`}>
                          {cmd.title}
                        </span>
                        {cmd.badge && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-[var(--mes-radius)] font-bold uppercase tracking-wider shrink-0 border ${
                            isSelected 
                              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' 
                              : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}>
                            {cmd.badge}
                          </span>
                        )}
                      </div>
                      {cmd.subtitle && (
                        <span className="text-[10px] block truncate font-mono text-slate-400 mt-0.5">
                          {cmd.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.shortcut && (
                      <kbd className="text-[9.5px] px-1.5 py-0.5 rounded-[var(--mes-radius)] border border-slate-700 bg-slate-900 text-slate-400 font-mono">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className={`w-3 h-3 text-emerald-400 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hotkey Legend */}
        <div className="bg-slate-900 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 shrink-0 font-mono select-none">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tabular-nums font-bold text-slate-200">{filteredCommands.length}</span>
            <span>commands</span>
            <span>·</span>
            <span className="text-cyan-400 uppercase tracking-wider">i-MES 2.0 Command Dispatch</span>
          </div>
        </div>
      </div>
    </div>
  );
};
