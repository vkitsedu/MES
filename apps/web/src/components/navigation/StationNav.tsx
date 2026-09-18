import React from 'react';
import { 
  Split, Activity, Tablet, Sliders, Layers, 
  Flame, Truck, Shield, GitFork, Crosshair, 
  Terminal, Lock 
} from 'lucide-react';
import { 
  NavTab, 
  DomainId, 
  getStationsForDomain, 
  isTabAllowed 
} from '../../config/navigation';
import { OperatorProfile } from '../../services/auth.service';

interface StationNavProps {
  activeDomain: DomainId;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  operator: OperatorProfile | null;
}

const STATION_ICONS: Record<NavTab, React.ComponentType<{ className?: string }>> = {
  FLEET: Split,
  SUPERVISOR: Activity,
  STUDIO: Sliders,
  OPERATOR: Tablet,
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

export const StationNav: React.FC<StationNavProps> = ({
  activeDomain,
  activeTab,
  onSelectTab,
  operator
}) => {
  const stations = getStationsForDomain(activeDomain);

  return (
    <div 
      className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none font-mono"
      role="tablist"
      aria-label="Cleanroom Stations Sub-Navigation"
    >
      {stations.map(station => {
        const Icon = STATION_ICONS[station.id] || Tablet;
        const isActive = activeTab === station.id;
        const allowed = isTabAllowed(station.id, operator);

        return (
          <button
            key={station.id}
            role="tab"
            aria-selected={isActive}
            aria-disabled={!allowed}
            onClick={() => onSelectTab(station.id)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--mes-radius)] text-xs font-mono shrink-0 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50 ${
              isActive
                ? 'bg-slate-900 text-emerald-400 font-bold border border-emerald-500/40 shadow-sm'
                : allowed
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                  : 'text-slate-600 border border-transparent hover:text-slate-400 cursor-pointer'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${
              isActive ? 'text-emerald-400' : allowed ? 'text-cyan-400' : 'text-slate-600'
            }`} />
            
            <span className="text-[10px] text-slate-500 font-normal">
              {station.code}
            </span>

            <span className="font-mono text-xs font-medium tracking-wider uppercase">
              {station.shortLabel}
            </span>

            {!allowed && (
              <span className="text-[9px] font-mono text-amber-300 bg-amber-950/40 border border-amber-500/30 px-1 py-0.2 rounded-[var(--mes-radius)] flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" />
                <span>LOCK</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
