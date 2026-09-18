import React, { useState } from 'react';
import { 
  Activity, Split, Sliders, Cpu, Layers, Flame, 
  GitFork, Terminal, Shield, Crosshair, Truck, 
  BarChart3, ChevronLeft, ChevronRight, LayoutDashboard,
  Sparkles, Wrench, ShieldAlert
} from 'lucide-react';
import { NavTab } from '../../config/navigation';

export interface CollapsibleSidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

interface NavCategory {
  category: string;
  items: {
    id: NavTab;
    label: string;
    shortLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    code: string;
  }[];
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    category: 'LINE OPERATIONS',
    items: [
      { id: 'SUPERVISOR', label: 'SMT Line Realtime Flow', shortLabel: 'Line Flow', icon: Activity, code: 'SMD-01' },
      { id: 'STUDIO', label: 'Line & Floor Studio', shortLabel: 'Line Studio', icon: Sliders, code: 'STU-01' },
      { id: 'FLEET', label: 'Fuji Nexim Monitor', shortLabel: 'Nexim', icon: Split, code: 'NEXIM' },
      { id: 'OPERATOR', label: 'Feeder Bay Cassettes', shortLabel: 'Feeders', icon: Cpu, code: 'FDR-01' },
      { id: 'SOLDER_PASTE', label: 'Paste & MSL Thaw', shortLabel: 'Paste', icon: Layers, code: 'PST-01' },
      { id: 'REFLOW', label: 'Reflow 10-Zone Oven', shortLabel: 'Reflow', icon: Flame, code: 'RFW-01' }
    ]
  },
  {
    category: 'QUALITY & INSPECTION',
    items: [
      { id: 'SPI', label: '3D SPI Inspection', shortLabel: 'SPI', icon: Sliders, code: 'SPI-01' },
      { id: 'REWORK', label: 'AOI Defect Rework', shortLabel: 'Rework', icon: Crosshair, code: 'RWK-01' },
      { id: 'PREDICTIVE', label: 'Predictive SPC & Drift', shortLabel: 'SPC Drift', icon: BarChart3, code: 'SPC-01' }
    ]
  },
  {
    category: 'LOGISTICS & TRACEABILITY',
    items: [
      { id: 'AGV_LOGISTICS', label: 'AGV Material Fleet', shortLabel: 'AGV Fleet', icon: Truck, code: 'AGV-01' },
      { id: 'GENEALOGY', label: 'Genealogy & Lot Recall', shortLabel: 'Traceability', icon: GitFork, code: 'TRC-01' }
    ]
  },
  {
    category: 'GOVERNANCE & AUDIT',
    items: [
      { id: 'AUDIT_TRAIL', label: 'CFR 11 Hash Ledger', shortLabel: 'Audit Trail', icon: Terminal, code: 'LOG-01' },
      { id: 'COMPLIANCE', label: 'Cleanroom eDHR Gate', shortLabel: 'eDHR Gate', icon: Shield, code: 'DHR-01' }
    ]
  }
];

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapsed
}) => {
  return (
    <aside
      className={`bg-[var(--mes-bg-surface)] border-r border-[var(--mes-border-subtle)] flex flex-col justify-between shrink-0 select-none transition-all duration-200 z-20 font-sans ${
        isCollapsed ? 'w-14' : 'w-56'
      }`}
      aria-label="Cleanroom Station Navigation"
    >
      {/* Top Header / Toggle */}
      <div className="p-2.5 border-b border-[var(--mes-border-subtle)] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <LayoutDashboard className="w-3.5 h-3.5 text-[var(--mes-accent-primary)] shrink-0" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--mes-text-primary)] truncate">
              Cleanroom Modules
            </span>
          </div>
        )}

        <button
          onClick={onToggleCollapsed}
          className={`p-1 rounded-[var(--mes-radius)] text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)] hover:bg-[var(--mes-bg-well)] transition-colors ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          title={isCollapsed ? 'Expand Navigation (220px)' : 'Collapse Navigation (52px)'}
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Categories & Station Items */}
      <div className="flex-1 overflow-y-auto py-2 space-y-4 scrollbar-none">
        {NAV_CATEGORIES.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-1 px-1.5">
            {!isCollapsed && (
              <div className="px-2 text-[9px] font-mono uppercase tracking-widest text-[var(--mes-text-muted)] font-semibold">
                {cat.category}
              </div>
            )}

            <div className="space-y-0.5">
              {cat.items.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center gap-2.5 rounded-[var(--mes-radius)] text-xs font-mono transition-all text-left ${
                      isCollapsed ? 'justify-center p-2' : 'px-2.5 py-1.5'
                    } ${
                      isActive
                        ? 'bg-[var(--mes-accent-muted)] text-[var(--mes-accent-primary)] font-bold border-l-2 border-[var(--mes-accent-primary)] shadow-inner'
                        : 'text-[var(--mes-text-secondary)] hover:bg-[var(--mes-bg-well)] hover:text-[var(--mes-text-primary)]'
                    }`}
                    title={`${item.label} (${item.code})`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--mes-accent-primary)]' : 'text-[var(--mes-text-muted)]'}`} />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="truncate text-[11.5px]">{item.shortLabel}</span>
                        <span className="text-[9px] text-[var(--mes-text-dim)] bg-[var(--mes-bg-well)] px-1 rounded-[1px] border border-[var(--mes-border-hairline)] ml-1">
                          {item.code}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sidebar Status Badge */}
      <div className="p-2 border-t border-[var(--mes-border-subtle)] text-center font-mono">
        {!isCollapsed ? (
          <div className="text-[10px] text-[var(--mes-text-muted)] bg-[var(--mes-bg-well)] py-1 px-2 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)] flex items-center justify-between">
            <span className="flex items-center gap-1 text-[var(--mes-status-pass)] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--mes-status-pass)] animate-pulse" />
              <span>STATIONS OK</span>
            </span>
            <span className="text-[9px] text-[var(--mes-text-dim)]">12 / 12</span>
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-[var(--mes-status-pass)] mx-auto" title="All 12 Stations Online" />
        )}
      </div>
    </aside>
  );
};
