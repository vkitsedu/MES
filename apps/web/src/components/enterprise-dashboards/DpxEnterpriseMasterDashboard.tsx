import React, { useState } from 'react';
import { Grid } from 'lucide-react';
import { 
  Dashboard1PlantOverview,
  Dashboard2SmtLineMonitor,
  Dashboard3ProductionPlanning,
  Dashboard4WorkOrderManagement,
  Dashboard5ProductionExecution,
  Dashboard6WipManagement,
  Dashboard7QualityOverall,
  Dashboard8Spi,
  Dashboard9FujiPlacement,
  Dashboard10StencilSetup,
  Dashboard11Aoi,
  Dashboard12Reflow,
  Dashboard13PcbTraceability,
  Dashboard14ComponentGenealogy,
  Dashboard15MaterialReel,
  Dashboard16FeederManagement,
  Dashboard17EquipmentMonitoring,
  Dashboard18AlarmDowntime,
  Dashboard19Maintenance,
  Dashboard20SpareParts
} from './DpxSubDashboards';
import { DpxDashboardCatalogGrid } from './DpxDashboardCatalogGrid';

export interface DpxEnterpriseMasterDashboardProps {
  initialSeq?: number;
}

export const DpxEnterpriseMasterDashboard: React.FC<DpxEnterpriseMasterDashboardProps> = ({ initialSeq = 1 }) => {
  // activeDashboard: 0 means Catalog Grid, 1..20 means specific numbered dashboard
  const [activeSeq, setActiveSeq] = useState<number>(initialSeq);

  return (
    <div className="bg-[#F0F5FA] rounded-lg border border-slate-200/80 shadow-xs flex flex-col font-sans select-none overflow-hidden">
      {/* 1. 20-DASHBOARD SEQUENCE SELECTOR RIBBON */}
      <nav className="bg-[#0D1B2A] text-slate-300 px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto border-b border-[#1E293B] shadow-inner text-xs font-mono scrollbar-none shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSeq(0)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all shrink-0 font-bold text-xs ${
              activeSeq === 0
                ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="View All 20 Dashboards in Catalog Grid"
          >
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span>ALL 20 CATALOG</span>
          </button>

          <span className="text-slate-600">|</span>

          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
            const isActive = activeSeq === num;
            return (
              <button
                key={num}
                onClick={() => setActiveSeq(num)}
                className={`px-2 py-0.5 rounded transition-all shrink-0 font-bold text-[11px] flex items-center gap-1 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs ring-1 ring-white/40'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={`Switch to Dashboard #${num}`}
              >
                <span className={`w-3.5 h-3.5 rounded text-[9px] flex items-center justify-center font-black ${
                  isActive ? 'bg-white text-blue-900' : 'bg-slate-800 text-blue-400'
                }`}>
                  {num}
                </span>
                <span className="hidden xl:inline text-[10px]">
                  {num === 1 && 'Plant Overview'}
                  {num === 2 && 'SMT Line Live'}
                  {num === 3 && 'Planning'}
                  {num === 4 && 'Work Orders'}
                  {num === 5 && 'Execution'}
                  {num === 6 && 'WIP'}
                  {num === 7 && 'Quality'}
                  {num === 8 && 'SPI'}
                  {num === 9 && 'FUJI Placement'}
                  {num === 10 && 'Stencil Setup'}
                  {num === 11 && 'AOI'}
                  {num === 12 && 'Reflow'}
                  {num === 13 && 'Traceability'}
                  {num === 14 && 'Components'}
                  {num === 15 && 'Material Reels'}
                  {num === 16 && 'Feeders'}
                  {num === 17 && 'Equipment'}
                  {num === 18 && 'Alarms'}
                  {num === 19 && 'Maintenance'}
                  {num === 20 && 'Spare Parts'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-400 shrink-0 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-bold">DPX SMT Suite [1-20]</span>
        </div>
      </nav>

      {/* 2. FULL-WIDTH RESPONSIVE CANVAS */}
      <main className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-3">
        {/* If Catalog Mode is active */}
        {activeSeq === 0 && (
          <DpxDashboardCatalogGrid onSelectDashboard={(s) => setActiveSeq(s)} />
        )}

          {/* Sub-Dashboards 1..20 */}
          {activeSeq === 1 && <Dashboard1PlantOverview />}
          {activeSeq === 2 && <Dashboard2SmtLineMonitor />}
          {activeSeq === 3 && <Dashboard3ProductionPlanning />}
          {activeSeq === 4 && <Dashboard4WorkOrderManagement />}
          {activeSeq === 5 && <Dashboard5ProductionExecution />}
          {activeSeq === 6 && <Dashboard6WipManagement />}
          {activeSeq === 7 && <Dashboard7QualityOverall />}
          {activeSeq === 8 && <Dashboard8Spi />}
          {activeSeq === 9 && <Dashboard9FujiPlacement />}
          {activeSeq === 10 && <Dashboard10StencilSetup />}
          {activeSeq === 11 && <Dashboard11Aoi />}
          {activeSeq === 12 && <Dashboard12Reflow />}
          {activeSeq === 13 && <Dashboard13PcbTraceability />}
          {activeSeq === 14 && <Dashboard14ComponentGenealogy />}
          {activeSeq === 15 && <Dashboard15MaterialReel />}
          {activeSeq === 16 && <Dashboard16FeederManagement />}
          {activeSeq === 17 && <Dashboard17EquipmentMonitoring />}
          {activeSeq === 18 && <Dashboard18AlarmDowntime />}
          {activeSeq === 19 && <Dashboard19Maintenance />}
          {activeSeq === 20 && <Dashboard20SpareParts />}
        </main>
    </div>
  );
};

export default DpxEnterpriseMasterDashboard;
