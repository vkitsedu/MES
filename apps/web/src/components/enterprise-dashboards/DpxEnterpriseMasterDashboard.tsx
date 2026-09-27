import React, { useState } from 'react';
import { 
  Building2, Factory, Monitor, Sliders, Layers, FileText, CheckCircle2, 
  XCircle, Clock, Bell, User, ArrowRight, ShieldCheck, Flame, Eye,
  BarChart2, Activity, Settings, RefreshCw, ChevronRight, Check,
  Cpu, Wrench, Database, GitFork, Tag, ArrowUpRight, Maximize2,
  Grid
} from 'lucide-react';
import { 
  DpxSeqBadge,
  Dashboard1PlantOverview,
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

export const DpxEnterpriseMasterDashboard: React.FC = () => {
  // activeDashboard: 0 means Catalog Grid, 1..20 means specific numbered dashboard
  const [activeSeq, setActiveSeq] = useState<number>(2); // Default to Flagship #2 SMT Line Live Monitor
  const [activeSidebarNav, setActiveSidebarNav] = useState<string>('Dashboard');

  const sidebarItems = [
    { label: 'Dashboard', icon: Monitor, seq: 2 },
    { label: 'Production', icon: Factory, seq: 5 },
    { label: 'Plants', icon: Building2, seq: 1 },
    { label: 'Lines', icon: Sliders, seq: 17 },
    { label: 'Machines', icon: Cpu, seq: 9 },
    { label: 'Work Orders', icon: FileText, seq: 4 },
    { label: 'Traceability', icon: GitFork, seq: 13 },
    { label: 'SPI', icon: Eye, seq: 8 },
    { label: 'Placement', icon: Layers, seq: 9 },
    { label: 'Reflow', icon: Flame, seq: 12 },
    { label: 'AOI', icon: Eye, seq: 11 },
    { label: 'Quality', icon: ShieldCheck, seq: 7 },
    { label: 'OEE', icon: Activity, seq: 1 },
    { label: 'Downtime', icon: Clock, seq: 18 },
    { label: 'Materials', icon: Database, seq: 15 },
    { label: 'Reports', icon: BarChart2, seq: 3 },
    { label: 'Administration', icon: Settings, seq: 19 },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-800 flex flex-col font-sans select-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP BRAND BAR (Deep Navy matching Image 2)                  */}
      {/* ------------------------------------------------------------- */}
      <header className="bg-[#0A192F] text-white px-4 py-2.5 flex items-center justify-between shadow-md border-b border-[#1E293B] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-blue-400" />
            <span className="font-black text-sm tracking-wider font-mono">SMT MES</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-xs text-slate-300 font-medium">Plant-01</span>
          <span className="text-slate-500">|</span>
          <span className="text-xs text-slate-300 font-medium">Line-01</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
            <span>Live Production</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-300 font-medium">
            25 Sep 2026 11:42:18
          </div>
          <span className="text-slate-600">|</span>
          <button className="relative text-slate-300 hover:text-white transition-colors" title="3 Alerts">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left font-sans">
              <div className="font-bold text-[11px] leading-tight text-slate-100">Pradeep Singh</div>
              <div className="text-[9px] text-slate-400 leading-tight">Supervisor</div>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. 20-DASHBOARD SEQUENCE SELECTOR RIBBON                      */}
      {/* ------------------------------------------------------------- */}
      <nav className="bg-[#0D1B2A] text-slate-300 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto border-b border-[#1E293B] shadow-inner text-xs font-mono scrollbar-none shrink-0">
        <button
          onClick={() => setActiveSeq(0)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all shrink-0 font-bold text-xs ${
            activeSeq === 0
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="View All 20 Dashboards in Catalog Grid"
        >
          <Grid className="w-3 h-3 text-cyan-400" />
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
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-white/30'
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
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 3. MAIN WORKSPACE: SIDEBAR + CONTENT                         */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navy Left Sidebar */}
        <aside className="w-52 bg-[#0A192F] text-slate-300 p-2 flex flex-col justify-between shrink-0 border-r border-[#1E293B]">
          <div className="space-y-0.5 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSidebarNav === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveSidebarNav(item.label);
                    setActiveSeq(item.seq);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#0088FF] text-white font-bold shadow-md'
                      : 'text-slate-300 hover:bg-[#13233D] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-2 border-t border-[#1E293B] text-[10px] font-mono text-slate-400">
            <div>Tier-1 Cleanroom MES</div>
            <div className="text-slate-500">v4.2.0 • Standalone</div>
          </div>
        </aside>

        {/* Dynamic Center Canvas */}
        <main className="flex-1 overflow-y-auto p-3.5 space-y-3">
          {/* If Catalog Mode is active */}
          {activeSeq === 0 && (
            <DpxDashboardCatalogGrid onSelectDashboard={(s) => setActiveSeq(s)} />
          )}

          {/* Sub-Dashboards 1, 3..20 */}
          {activeSeq === 1 && <Dashboard1PlantOverview />}
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

          {/* --------------------------------------------------------- */}
          {/* DASHBOARD #2: FLAGSHIP SMT LINE LIVE MONITOR (IMAGE 2)    */}
          {/* --------------------------------------------------------- */}
          {activeSeq === 2 && (
            <div className="space-y-3">
              {/* Sequence header tag */}
              <DpxSeqBadge seq={2} title="SMT Line Live Monitor (Line-01)" subtitle="Single-Pane-of-Glass Operational Cockpit" />

              {/* TOP ROW: 7 VIBRANT KPI CARDS (MATCHING IMAGE 2) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {/* 1. OEE Card (Green) */}
                <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">OEE</div>
                    <div className="text-2xl font-black font-mono tracking-tight mt-0.5">86.4%</div>
                    <div className="text-[10px] text-emerald-200 mt-1">↑ 2.1% vs. yesterday</div>
                  </div>
                  <div className="w-10 h-10 rounded-full border-3 border-white/30 border-t-white flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* 2. Availability Card (Sky Blue) */}
                <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Availability</div>
                    <div className="text-2xl font-black font-mono tracking-tight mt-0.5">94.2%</div>
                    <div className="text-[10px] text-sky-200 mt-1">↑ 0.8% vs. yesterday</div>
                  </div>
                  <div className="w-9 h-9 rounded bg-white/20 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* 3. Performance Card (Amber / Orange) */}
                <div className="bg-[#D97706] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-100">Performance</div>
                    <div className="text-2xl font-black font-mono tracking-tight mt-0.5">91.7%</div>
                    <div className="text-[10px] text-amber-200 mt-1">↑ 1.5% vs. yesterday</div>
                  </div>
                  <div className="w-9 h-9 rounded bg-white/20 flex items-center justify-center">
                    <Sliders className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* 4. FPY Card (Purple) */}
                <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">FPY</div>
                    <div className="text-2xl font-black font-mono tracking-tight mt-0.5">98.8%</div>
                    <div className="text-[10px] text-purple-200 mt-1">↑ 0.4% vs. yesterday</div>
                  </div>
                  <div className="w-9 h-9 rounded bg-white/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* 5. Plan Card (Cyan) */}
                <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">Plan</div>
                    <div className="text-2xl font-black font-mono tracking-tight mt-0.5">12,000</div>
                    <div className="text-[10px] text-cyan-200 mt-1">pcs</div>
                  </div>
                  <div className="w-9 h-9 rounded bg-white/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* 6. Actual Card (Deep Ocean Blue) */}
                <div className="bg-[#1D4ED8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Actual</div>
                    <div className="text-2xl font-black font-mono tracking-tight mt-0.5">11,420</div>
                    <div className="text-[10px] text-blue-200 mt-1">pcs (95.2%)</div>
                  </div>
                  <div className="w-9 h-9 rounded bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* 7. Reject Card (Red) */}
                <div className="bg-[#DC2626] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-red-100">Reject</div>
                    <div className="text-2xl font-black font-mono tracking-tight mt-0.5">138</div>
                    <div className="text-[10px] text-red-200 mt-1">pcs (1.2%)</div>
                  </div>
                  <div className="w-9 h-9 rounded bg-white/20 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------- */}
              {/* MIDDLE SECTION: LEFT (72%) & RIGHT (28%)              */}
              {/* ----------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                {/* LEFT COLUMN (8.5 cols) */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-3">
                  {/* PRODUCTION FLOW CARD (7 STATIONS) */}
                  <div className="bg-white p-3.5 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                      <span className="font-bold text-xs text-slate-800">
                        Production Flow – Plant-01 / Line-01
                      </span>
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Running
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-500 font-bold">
                          <span className="w-2 h-2 rounded-full bg-amber-400" /> Idle
                        </span>
                        <span className="flex items-center gap-1.5 text-red-500 font-bold">
                          <span className="w-2 h-2 rounded-full bg-red-500" /> Down
                        </span>
                      </div>
                    </div>

                    {/* 7 Machines Flow Sequence */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                      {[
                        { name: 'Loader', status: 'Running', dot: 'bg-emerald-500', out: '11,820 / 12,000', ct: '8.2 sec', icon: Layers },
                        { name: 'SPI', status: 'Running', dot: 'bg-emerald-500', out: '11,700 / 12,000', ct: '6.5 sec', icon: Eye },
                        { name: 'Printer', status: 'Running', dot: 'bg-emerald-500', out: '11,650 / 12,000', ct: '7.8 sec', icon: Factory },
                        { name: 'FUJI NXT', status: 'Running', dot: 'bg-emerald-500', out: '11,520 / 12,000', ct: '12.3 sec', icon: Cpu },
                        { name: 'Reflow', status: 'Idle', dot: 'bg-amber-400', out: '11,450 / 12,000', ct: '45.0 sec', icon: Flame },
                        { name: 'AOI', status: 'Down', dot: 'bg-red-500', out: '11,420 / 12,000', ct: '10.8 sec', icon: Eye },
                        { name: 'Unloader', status: 'Running', dot: 'bg-emerald-500', out: '11,420 / 12,000', ct: '6.7 sec', icon: Layers },
                      ].map((mach, idx) => {
                        const Icon = mach.icon;
                        return (
                          <div 
                            key={mach.name}
                            className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col justify-between text-center relative group hover:border-blue-400 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-xs text-slate-800">{mach.name}</span>
                              <span className={`w-2 h-2 rounded-full ${mach.dot} shadow-xs`} title={mach.status} />
                            </div>

                            {/* Machine Illustration Graphic */}
                            <div className="h-16 bg-white rounded border border-slate-100 flex items-center justify-center p-2 mb-2 shadow-inner">
                              <div className="flex flex-col items-center">
                                <Icon className="w-7 h-7 text-slate-600 group-hover:text-blue-600 transition-colors" />
                                <div className="w-10 h-1 bg-slate-200 rounded mt-1" />
                              </div>
                            </div>

                            <div className="text-[10px] text-slate-500 font-mono">
                              <div className="text-slate-400 text-[9px] uppercase">Output</div>
                              <div className="font-bold text-slate-800">{mach.out}</div>
                              <div className="text-[9px] text-slate-400 mt-1">Cycle Time</div>
                              <div className="font-semibold text-slate-700">{mach.ct}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* THREE CHARTS ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Chart 1: Hourly Target vs Actual Dual Bar Chart */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-800">
                          Production (Target vs Actual) - Hourly
                        </span>
                        <div className="flex gap-2 text-[10px] font-mono">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#0066FF] rounded-xs" /> Target</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#10B981] rounded-xs" /> Actual</span>
                        </div>
                      </div>

                      {/* SVG Bar Chart */}
                      <div className="h-44 pt-2">
                        <svg viewBox="0 0 280 150" className="w-full h-full">
                          {/* Grid lines */}
                          <line x1="30" y1="20" x2="275" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                          <line x1="30" y1="50" x2="275" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                          <line x1="30" y1="80" x2="275" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                          <line x1="30" y1="110" x2="275" y2="110" stroke="#F1F5F9" strokeWidth="1" />
                          <line x1="30" y1="130" x2="275" y2="130" stroke="#CBD5E1" strokeWidth="1" />

                          {/* Y-Axis Labels */}
                          <text x="25" y="24" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">2,000</text>
                          <text x="25" y="54" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">1,500</text>
                          <text x="25" y="84" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">1,000</text>
                          <text x="25" y="114" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">500</text>
                          <text x="25" y="133" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">0</text>

                          {/* Dual Bars for 10 hours: 08:00 to 17:00 */}
                          {[
                            { h: '08:00', tgt: 950, act: 900 },
                            { h: '09:00', tgt: 1100, act: 980 },
                            { h: '10:00', tgt: 1200, act: 1050 },
                            { h: '11:00', tgt: 1250, act: 1100 },
                            { h: '12:00', tgt: 1350, act: 1280 },
                            { h: '13:00', tgt: 1400, act: 1350 },
                            { h: '14:00', tgt: 1550, act: 1500 },
                            { h: '15:00', tgt: 1650, act: 1600 },
                            { h: '16:00', tgt: 1700, act: 1650 },
                            { h: '17:00', tgt: 1750, act: 1720 },
                          ].map((b, idx) => {
                            const x = 38 + idx * 24;
                            const tH = (b.tgt / 2000) * 110;
                            const aH = (b.act / 2000) * 110;

                            return (
                              <g key={b.h}>
                                <rect x={x} y={130 - tH} width="8" height={tH} fill="#0066FF" rx="1" />
                                <rect x={x + 9} y={130 - aH} width="8" height={aH} fill="#10B981" rx="1" />
                                <text x={x + 8} y="142" fontSize="7" fill="#64748B" textAnchor="middle" fontFamily="monospace">
                                  {b.h.split(':')[0]}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    </div>

                    {/* Chart 2: OEE Trend (Last 8 Hours) Area Chart */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-800">
                          OEE Trend (Last 8 Hours)
                        </span>
                        <span className="text-[10px] text-blue-600 font-bold font-mono">Current: 86.4%</span>
                      </div>

                      <div className="h-44 pt-2">
                        <svg viewBox="0 0 280 150" className="w-full h-full">
                          {/* Y-axis lines */}
                          <line x1="30" y1="20" x2="275" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                          <line x1="30" y1="50" x2="275" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                          <line x1="30" y1="80" x2="275" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                          <line x1="30" y1="110" x2="275" y2="110" stroke="#F1F5F9" strokeWidth="1" />
                          <line x1="30" y1="130" x2="275" y2="130" stroke="#CBD5E1" strokeWidth="1" />

                          <text x="25" y="24" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">100%</text>
                          <text x="25" y="54" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">90%</text>
                          <text x="25" y="84" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">80%</text>
                          <text x="25" y="114" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">70%</text>
                          <text x="25" y="133" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">60%</text>

                          {/* Data points: 82.1, 83.4, 84.7, 85.6, 86.2, 86.9, 87.4, 86.4 */}
                          <defs>
                            <linearGradient id="oeeGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Line and Area paths */}
                          <path
                            d="M 40 73 L 72 69 L 105 65 L 138 62 L 171 60 L 204 58 L 237 56 L 270 59 L 270 130 L 40 130 Z"
                            fill="url(#oeeGrad)"
                          />
                          <path
                            d="M 40 73 L 72 69 L 105 65 L 138 62 L 171 60 L 204 58 L 237 56 L 270 59"
                            fill="none"
                            stroke="#2563EB"
                            strokeWidth="2.5"
                          />

                          {/* Point Dots & Callout labels */}
                          {[
                            { x: 40, y: 73, v: '82.1%', h: '04:00' },
                            { x: 72, y: 69, v: '83.4%', h: '05:00' },
                            { x: 105, y: 65, v: '84.7%', h: '06:00' },
                            { x: 138, y: 62, v: '85.6%', h: '07:00' },
                            { x: 171, y: 60, v: '86.2%', h: '08:00' },
                            { x: 204, y: 58, v: '86.9%', h: '09:00' },
                            { x: 237, y: 56, v: '87.4%', h: '10:00' },
                            { x: 270, y: 59, v: '86.4%', h: '11:00' },
                          ].map((pt) => (
                            <g key={pt.h}>
                              <circle cx={pt.x} cy={pt.y} r="3" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                              <text x={pt.x} y={pt.y - 6} fontSize="7" fill="#1E293B" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                                {pt.v}
                              </text>
                              <text x={pt.x} y="142" fontSize="7" fill="#64748B" textAnchor="middle" fontFamily="monospace">
                                {pt.h}
                              </text>
                            </g>
                          ))}
                        </svg>
                      </div>
                    </div>

                    {/* Chart 3: Downtime Pareto Horizontal Bars */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-800">Downtime Pareto</span>
                        <span className="text-[10px] text-slate-500 font-mono">Total Downtime: 2h 45m</span>
                      </div>

                      <div className="space-y-1.5 pt-1 text-xs font-mono">
                        {[
                          { mach: 'Reflow', dur: '48m (29%)', color: 'bg-[#DC2626]', w: '75%' },
                          { mach: 'AOI', dur: '42m (26%)', color: 'bg-[#EA580C]', w: '66%' },
                          { mach: 'FUJI NXT', dur: '28m (17%)', color: 'bg-[#F59E0B]', w: '44%' },
                          { mach: 'SPI', dur: '18m (11%)', color: 'bg-[#0284C7]', w: '28%' },
                          { mach: 'Printer', dur: '12m (7%)', color: 'bg-[#06B6D4]', w: '19%' },
                          { mach: 'Loader/Unloader', dur: '9m (5%)', color: 'bg-[#64748B]', w: '14%' },
                          { mach: 'Others', dur: '6m (4%)', color: 'bg-[#94A3B8]', w: '9%' },
                        ].map((d) => (
                          <div key={d.mach}>
                            <div className="flex justify-between text-[10px] mb-0.5">
                              <span className="font-sans font-medium text-slate-700">{d.mach}</span>
                              <span className="text-slate-500 font-semibold">{d.dur}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-xs h-2">
                              <div className={`${d.color} h-2 rounded-xs`} style={{ width: d.w }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ROW (SUMMARY, MATERIAL STATUS, RECENT WORK ORDERS) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* 1. Production Summary */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                      <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5 mb-2.5">
                        <BarChart2 className="w-4 h-4 text-blue-600" /> Production Summary
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <div className="text-[10px] text-slate-400 font-sans">Total Panels</div>
                          <div className="text-base font-black text-slate-800 mt-0.5">11,420</div>
                        </div>
                        <div className="bg-emerald-50/60 p-2 rounded border border-emerald-100">
                          <div className="text-[10px] text-emerald-700 font-sans">Good Panels</div>
                          <div className="text-base font-black text-emerald-600 mt-0.5">11,282 (98.8%)</div>
                        </div>
                        <div className="bg-red-50/60 p-2 rounded border border-red-100">
                          <div className="text-[10px] text-red-700 font-sans">Reject Panels</div>
                          <div className="text-base font-black text-red-600 mt-0.5">138 (1.2%)</div>
                        </div>
                        <div className="bg-blue-50/60 p-2 rounded border border-blue-100">
                          <div className="text-[10px] text-blue-700 font-sans">Rework</div>
                          <div className="text-base font-black text-blue-600 mt-0.5">56 (0.5%)</div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Material Status Progress Bars */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                      <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5 mb-2">
                        <Database className="w-4 h-4 text-indigo-600" /> Material Status
                      </div>
                      <div className="space-y-2.5 text-xs font-mono">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-sans font-medium text-slate-700">Solder Paste</span>
                            <span className="font-bold text-emerald-600">78%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '78%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-sans font-medium text-slate-700">Feeder</span>
                            <span className="font-bold text-amber-500">64%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-amber-400 h-2 rounded-full" style={{ width: '64%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-sans font-medium text-slate-700">PCB</span>
                            <span className="font-bold text-blue-600">92%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }} />
                          </div>
                        </div>
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono pt-1 text-right">
                        Auto-replenishment threshold: 20%
                      </div>
                    </div>

                    {/* 3. Recent Production (Last 5 Work Orders) */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                      <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5 mb-2">
                        <Layers className="w-4 h-4 text-blue-600" /> Recent Production <span className="text-[10px] text-slate-400 font-normal">(Last 5 Work Orders)</span>
                      </div>
                      <table className="w-full text-left font-mono text-[10.5px]">
                        <thead className="text-slate-400 border-b border-slate-100 uppercase text-[9px]">
                          <tr>
                            <th className="pb-1">WO No.</th>
                            <th className="pb-1">Product</th>
                            <th className="pb-1">Qty (Plan/Act)</th>
                            <th className="pb-1 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[
                            { wo: 'WO-2026-0925-014', prod: 'P1234', qty: '3,000 / 2,860', st: 'Running', dot: 'bg-emerald-500' },
                            { wo: 'WO-2026-0925-013', prod: 'P5678', qty: '2,000 / 1,980', st: 'Completed', dot: 'bg-blue-600' },
                            { wo: 'WO-2026-0925-012', prod: 'P9012', qty: '4,000 / 3,850', st: 'Completed', dot: 'bg-blue-600' },
                            { wo: 'WO-2026-0925-011', prod: 'P3456', qty: '2,000 / 1,730', st: 'Completed', dot: 'bg-blue-600' },
                          ].map((r) => (
                            <tr key={r.wo} className="hover:bg-slate-50">
                              <td className="py-1 text-blue-600 font-semibold">{r.wo.replace('WO-2026-', '')}</td>
                              <td className="py-1 text-slate-700">{r.prod}</td>
                              <td className="py-1 text-slate-600">{r.qty}</td>
                              <td className="py-1 text-center">
                                <span className="inline-flex items-center gap-1 text-[9.5px]">
                                  <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`} />
                                  <span>{r.st}</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (3.5 cols) - ALERTS & TRACEABILITY */}
                <div className="lg:col-span-4 xl:col-span-3 space-y-3">
                  {/* Live Alerts & Events */}
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-blue-600" /> Live Alerts & Events
                      </span>
                      <button className="text-[10px] text-blue-600 hover:text-blue-800 font-bold font-mono">
                        View All &gt;
                      </button>
                    </div>

                    <div className="space-y-2">
                      {[
                        {
                          lvl: 'HIGH',
                          lvlCol: 'bg-red-600',
                          title: 'AOI – Defect Detected',
                          time: '11:37',
                          sub: 'Panel ID: PNL-0004587 | Defect: Missing Component',
                        },
                        {
                          lvl: 'MEDIUM',
                          lvlCol: 'bg-amber-500',
                          title: 'Feeder Shortage',
                          time: '11:21',
                          sub: 'FUJI NXT – Feeder 12 (R0201)',
                        },
                        {
                          lvl: 'HIGH',
                          lvlCol: 'bg-red-600',
                          title: 'Machine Downtime',
                          time: '10:56',
                          sub: 'Reflow – Temperature not reached',
                        },
                        {
                          lvl: 'INFO',
                          lvlCol: 'bg-blue-600',
                          title: 'New Work Order Started',
                          time: '09:43',
                          sub: 'WO-2026-0925-014 | Product: P1234',
                        },
                        {
                          lvl: 'INFO',
                          lvlCol: 'bg-blue-600',
                          title: 'Material Replenished',
                          time: '08:32',
                          sub: 'Solder Paste (Lot: SP24678)',
                        },
                      ].map((al, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-100 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`${al.lvlCol} text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded`}>
                              {al.lvl}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{al.time}</span>
                          </div>
                          <div className="font-bold text-slate-800 text-[11px]">{al.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5 line-clamp-1">{al.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Traceability (Latest Panel) */}
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <GitFork className="w-3.5 h-3.5 text-blue-600" /> Traceability <span className="text-[10px] text-slate-400 font-normal">(Latest Panel)</span>
                      </span>
                      <button className="text-[10px] text-blue-600 hover:text-blue-800 font-bold font-mono">
                        View All &gt;
                      </button>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Panel ID:</span>
                        <strong className="text-blue-600 font-bold">PNL-0004587</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Array Barcode:</span>
                        <span className="text-slate-800 font-bold">A123456789012</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Product:</span>
                        <span className="text-slate-800 font-medium">P1234 (Control Board)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Work Order:</span>
                        <span className="text-slate-800">WO-2026-0925-014</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">SPI Result:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded shadow-xs">
                            PASS
                          </span>
                          <span className="text-slate-400 text-[10px]">(0.12mm)</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-500">AOI Result:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded shadow-xs">
                            PASS
                          </span>
                          <span className="text-slate-400 text-[10px]">(0 Defect)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DpxEnterpriseMasterDashboard;
