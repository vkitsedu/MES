import React, { useState, useEffect, useCallback } from 'react';
import { 
  FujiManagementMonitorLineSummary, 
  FujiNozzleErrorRanking, 
  FujiSlotErrorRanking, 
  SmtMachineFlowItem, 
  MounterDropRatePpm, 
  ShiftDropMatrixItem 
} from '@mes/shared';
import { 
  Clock, RefreshCw, Cpu, Crosshair, Sliders, Shield, Filter, Download,
  Building2, CheckCircle2, AlertTriangle, TrendingUp, Bell, Activity,
  FileText, ArrowRight, BarChart2, Calendar, ShieldCheck, Layers, ArrowUpRight
} from 'lucide-react';
import { authService } from '../services/auth.service';
import { ArcGaugeOee } from './common/ArcGaugeOee';
import { SmtLineFlowStrip } from './common/SmtLineFlowStrip';
import { MounterDropAnalysisCard } from './common/MounterDropAnalysisCard';
import { ShiftGanttTimeline } from './common/ShiftGanttTimeline';

interface DiagnosticsData {
  nozzleRankings: FujiNozzleErrorRanking[];
  slotRankings: FujiSlotErrorRanking[];
  dropRatePpm: MounterDropRatePpm;
  shiftMatrix: ShiftDropMatrixItem[];
  refDesPareto: Array<{ refDes: string; partNumber: string; defectRatePct: number }>;
}

const FALLBACK_FLEET: FujiManagementMonitorLineSummary[] = [
  {
    lineId: 'LINE_01',
    lineName: 'SMD_01 (Fuji NXT III M6)',
    productName: 'Smart Energy Meter 4G (PCB-SM-TOP)',
    jobName: 'JOB1-A$MODEL1$prod-A_T',
    progressCompleted: 892,
    progressTarget: 1200,
    currentPbr: 88.4,
    optimizedPbr: 92.7,
    statusState: 'RUN',
    statusLabel: 'Placement',
    statusDurationSeconds: 420,
    oee: 88.4,
    availability: 91.2,
    performance: 99.6,
    quality: 98.4,
    spiYieldPct: 98.6,
    firstAoiYieldPct: 97.4,
    secondAoiYieldPct: 98.4,
    estimatedEndTime: '17:45',
    deadline: '18:30',
    deadlineAlert: false
  },
  {
    lineId: 'LINE_02',
    lineName: 'SMD_02 (Fuji AIMEX IIIc)',
    productName: 'Automotive Gateway ECU (ECU-GW-V3)',
    jobName: 'JOB2-A$MODEL1$prod-B_T',
    progressCompleted: 430,
    progressTarget: 800,
    currentPbr: 84.2,
    optimizedPbr: 89.0,
    statusState: 'WAIT_PREV',
    statusLabel: 'Starved Upstream',
    statusDurationSeconds: 195,
    oee: 82.1,
    availability: 86.4,
    performance: 97.2,
    quality: 97.8,
    spiYieldPct: 97.2,
    firstAoiYieldPct: 96.1,
    secondAoiYieldPct: 97.5,
    estimatedEndTime: '19:10',
    deadline: '19:00',
    deadlineAlert: true
  }
];

const FALLBACK_DIAGNOSTICS: DiagnosticsData = {
  nozzleRankings: [
    { nozzleAddress: 'H01-N04 (0402)', machineId: 'NXT-01', headId: 'H01', mispickCount: 14, errorRatePct: 0.057 },
    { nozzleAddress: 'H02-N08 (0201)', machineId: 'NXT-01', headId: 'H02', mispickCount: 9, errorRatePct: 0.049 },
    { nozzleAddress: 'H01-N02 (QFP)', machineId: 'NXT-01', headId: 'H01', mispickCount: 3, errorRatePct: 0.034 }
  ],
  slotRankings: [
    { slotAddress: 'SLOT-04-L', feederId: 'FDR-04', partNumber: 'CAP-0402-100NF', mispickCount: 18, errorRatePct: 0.117 },
    { slotAddress: 'SLOT-12-R', feederId: 'FDR-12', partNumber: 'RES-0201-10K', mispickCount: 12, errorRatePct: 0.057 },
    { slotAddress: 'SLOT-22-L', feederId: 'FDR-22', partNumber: 'IC-STM32-LQFP', mispickCount: 4, errorRatePct: 0.065 }
  ],
  dropRatePpm: {
    targetPpm: 310,
    actualPpm: 288,
    status: 'PASS',
    totalPickups: 1280450,
    totalErrors: 368,
    recogErrors: 144,
    pickupErrors: 224,
    recogDropRatePpm: 112,
    pickupDropRatePpm: 175
  },
  shiftMatrix: [
    { shiftCode: '1 Shift (Morning)', pickups: 1245000, pickupErrors: 224, recogErrors: 144, totalErrors: 368, dropRatePpm: 295, recogDropRatePpm: 115, pickupDropRatePpm: 180 },
    { shiftCode: '2 Shift (Evening)', pickups: 845200, pickupErrors: 142, recogErrors: 98, totalErrors: 240, dropRatePpm: 284, recogDropRatePpm: 116, pickupDropRatePpm: 168 },
    { shiftCode: '3 Shift (Night)', pickups: 654000, pickupErrors: 110, recogErrors: 78, totalErrors: 188, dropRatePpm: 287, recogDropRatePpm: 119, pickupDropRatePpm: 168 }
  ],
  refDesPareto: [
    { refDes: 'C104', partNumber: 'CAP-0402-100NF', defectRatePct: 0.082 },
    { refDes: 'R12', partNumber: 'RES-0201-10K', defectRatePct: 0.045 },
    { refDes: 'U3', partNumber: 'IC-STM32-LQFP', defectRatePct: 0.031 }
  ]
};

const FALLBACK_FLOW: SmtMachineFlowItem[] = [
  { id: 'm1', name: 'DEK NeoHorizon', equipmentCode: 'PRN-01', type: 'PRINTER', towerLamp: 'RUN', cycleTimeSec: 14.2, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false },
  { id: 'm2', name: 'Koh Young SPI', equipmentCode: 'SPI-01', type: 'SPI', towerLamp: 'RUN', cycleTimeSec: 12.0, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false },
  { id: 'm4', name: 'NXT III (Mod 1)', equipmentCode: 'MNT-01', type: 'MOUNTER', towerLamp: 'RUN', cycleTimeSec: 21.0, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false },
  { id: 'm5', name: 'NXT III (Mod 2)', equipmentCode: 'MNT-02', type: 'MOUNTER', towerLamp: 'RUN', cycleTimeSec: 21.4, stopCount: 1, stopTimeMin: 1.1, nozzleBypass: false },
  { id: 'm6', name: 'NXT III (Mod 3)', equipmentCode: 'MNT-03', type: 'MOUNTER', towerLamp: 'RUN', cycleTimeSec: 21.8, stopCount: 2, stopTimeMin: 1.8, nozzleBypass: false },
  { id: 'm7', name: 'Reflow 10-Zone', equipmentCode: 'RFW-01', type: 'REFLOW', towerLamp: 'RUN', cycleTimeSec: 18.0, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false },
  { id: 'm8', name: '3D AOI Post', equipmentCode: 'AOI-01', type: 'AOI_POST', towerLamp: 'RUN', cycleTimeSec: 15.1, stopCount: 1, stopTimeMin: 0.5, nozzleBypass: false }
];

export const FujiManagementMonitor: React.FC = () => {
  const [fleet, setFleet] = useState<FujiManagementMonitorLineSummary[]>(FALLBACK_FLEET);
  const [selectedLineId, setSelectedLineId] = useState<string>('LINE_01');
  const [diagnostics, setDiagnostics] = useState<DiagnosticsData>(FALLBACK_DIAGNOSTICS);
  const [machineFlow, setMachineFlow] = useState<SmtMachineFlowItem[]>(FALLBACK_FLOW);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'COCKPIT' | 'FLOW_AND_DROP'>('COCKPIT');
  const [selectedModule, setSelectedModule] = useState<'all' | 'LINE_01' | 'LINE_02' | 'LINE_03'>('all');
  const [activeTab, setActiveTab] = useState<'feeders' | 'events' | 'alerts'>('feeders');
  const [bottomTableMode, setBottomTableMode] = useState<'FLEET' | 'EVENTS'>('FLEET');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [nightMode, setNightMode] = useState<boolean>(false);

  // Dynamic Theme Styling
  const containerBg = nightMode ? 'bg-[#070D19]' : 'bg-[#F0F5FA]';
  const cardBg = nightMode ? 'bg-[#0B1528] border-slate-700/60 text-slate-100' : 'bg-white border-slate-200/80 text-slate-800';
  const tableHeaderBg = nightMode ? 'bg-slate-800/90 text-slate-300' : 'bg-slate-50 text-slate-500';
  const tableRowHover = nightMode ? 'hover:bg-slate-800/40 text-slate-200' : 'hover:bg-slate-50/80 text-slate-700';
  const subtextMuted = nightMode ? 'text-slate-400' : 'text-slate-500';

  const fetchFleet = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await authService.authFetch('/api/v1/smt/management-monitor/fleet').catch(() => null);
      if (res && res.ok) {
        const json = await res.json();
        const data: FujiManagementMonitorLineSummary[] = Array.isArray(json) ? json : json?.data;
        if (Array.isArray(data) && data.length > 0) {
          setFleet(data);
          if (!data.some(d => d.lineId === selectedLineId)) {
            setSelectedLineId(data[0].lineId);
          }
        }
      }
    } catch (err) {
      console.warn('Using simulation fallback for Fuji fleet data', err);
    } finally {
      setRefreshing(false);
    }
  }, [selectedLineId]);

  const fetchLineDetails = useCallback(async (lineId: string) => {
    try {
      const [diagRes, flowRes] = await Promise.all([
        authService.authFetch(`/api/v1/smt/management-monitor/line/${encodeURIComponent(lineId)}/diagnostics`).catch(() => null),
        authService.authFetch(`/api/v1/smt/management-monitor/line/${encodeURIComponent(lineId)}/flow`).catch(() => null)
      ]);

      if (diagRes && diagRes.ok) {
        const json = await diagRes.json();
        const d = json?.data ?? json;
        if (d && d.nozzleRankings) setDiagnostics(d);
      }
      if (flowRes && flowRes.ok) {
        const json = await flowRes.json();
        const f = Array.isArray(json) ? json : json?.data;
        if (Array.isArray(f) && f.length > 0) setMachineFlow(f);
      }
    } catch (err) {
      console.warn(`Using simulation fallback for ${lineId}`, err);
    }
  }, []);

  useEffect(() => {
    fetchFleet();
    fetchLineDetails(selectedLineId);

    const interval = setInterval(() => {
      fetchFleet();
      fetchLineDetails(selectedLineId);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedLineId, fetchFleet, fetchLineDetails]);

  const selectedLine = fleet.find(f => f.lineId === selectedLineId) || fleet[0];

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`${containerBg} p-3 rounded font-sans transition-colors duration-200 space-y-3`}>
      {/* 1. TOP ENTERPRISE GATEWAY SUB-HEADER BAR */}
      <div className={`${cardBg} p-2.5 rounded-xl border shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs`}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs tracking-tight">Fuji Next Technologies Pvt. Ltd.</span>
            <span className={`${subtextMuted} font-mono text-[11px] ml-2 hidden sm:inline`}>
              | Main Enterprise Placement Gateway
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All Systems OK
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Multi-Module Tabs */}
          <div className="flex rounded-lg p-0.5 bg-slate-200/60 dark:bg-slate-800 font-medium text-[11px]">
            <button
              onClick={() => { setSelectedModule('all'); setSelectedLineId('LINE_01'); }}
              className={`px-2.5 py-1 rounded-md transition-all ${selectedModule === 'all' ? 'bg-[#1E50ED] text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              All Sites (3)
            </button>
            <button
              onClick={() => { setSelectedModule('LINE_01'); setSelectedLineId('LINE_01'); }}
              className={`px-2.5 py-1 rounded-md transition-all ${selectedModule === 'LINE_01' ? 'bg-[#1E50ED] text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              SMD_01 (NXT M6)
            </button>
            <button
              onClick={() => { setSelectedModule('LINE_02'); setSelectedLineId('LINE_02'); }}
              className={`px-2.5 py-1 rounded-md transition-all ${selectedModule === 'LINE_02' ? 'bg-[#1E50ED] text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              SMD_02 (AIMEX III)
            </button>
            <button
              onClick={() => { setSelectedModule('LINE_03'); }}
              className={`px-2.5 py-1 rounded-md transition-all ${selectedModule === 'LINE_03' ? 'bg-[#1E50ED] text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              SMD_03 (NXT M3)
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-lg p-0.5 bg-slate-200/60 dark:bg-slate-800 font-mono text-[10.5px]">
            <button
              onClick={() => setViewMode('COCKPIT')}
              className={`px-2 py-1 rounded-md transition-all ${viewMode === 'COCKPIT' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              TWO-PANE MONITOR
            </button>
            <button
              onClick={() => setViewMode('FLOW_AND_DROP')}
              className={`px-2 py-1 rounded-md transition-all ${viewMode === 'FLOW_AND_DROP' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              LINE FLOW & DROP
            </button>
          </div>

          {/* Time Filter */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>Last 1 Hour ▼</span>
          </div>

          {/* Theme Palette Toggle */}
          <button
            onClick={() => setNightMode(!nightMode)}
            className="text-[11px] font-bold px-2 py-1 rounded-md border border-blue-400/40 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 transition-colors"
            title="Toggle between Cleanroom Light and Cyber Night Themes"
          >
            {nightMode ? '☀ Cleanroom Theme' : '🌙 Cyber Night Theme'}
          </button>
        </div>
      </div>

      {viewMode === 'COCKPIT' ? (
        <>
          {/* 2. TOP ROW: 5 VIBRANT SATURATED HERO CARDS (EXACT PALETTE FROM 20 DASHBOARDS) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {/* Card 1: Total Feeders */}
            <div className="bg-[#0284C7] text-white p-3.5 rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div className="z-10">
                <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Total Feeders</div>
                <div className="text-2xl font-black font-mono tracking-tight mt-0.5">142</div>
                <div className="text-[10px] text-sky-200 mt-1 flex items-center gap-1 font-mono">
                  <TrendingUp className="w-3 h-3" /> ↑ +2% vs last hour
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 z-10">
                <Cpu className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Card 2: Online Feeders */}
            <div className="bg-[#059669] text-white p-3.5 rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div className="z-10 w-full pr-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Online Feeders</div>
                <div className="text-2xl font-black font-mono tracking-tight mt-0.5">138</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-20 bg-emerald-800/40 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-300 h-1.5 rounded-full" style={{ width: '97.2%' }} />
                  </div>
                  <span className="text-[10px] text-emerald-100 font-mono font-bold">97.2%</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 z-10">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Card 3: Offline Feeders */}
            <div className="bg-[#DC2626] text-white p-3.5 rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div className="z-10 w-full pr-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-red-100">Offline / Starved</div>
                <div className="text-2xl font-black font-mono tracking-tight mt-0.5">4</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-20 bg-red-900/40 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-red-300 h-1.5 rounded-full" style={{ width: '28%' }} />
                  </div>
                  <span className="text-[10px] text-red-200 font-mono font-bold">2.8%</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 z-10">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Card 4: Total Events (1h) */}
            <div className="bg-[#7C3AED] text-white p-3.5 rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div className="z-10">
                <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Total Events (1h)</div>
                <div className="text-2xl font-black font-mono tracking-tight mt-0.5">2,847</div>
                <div className="text-[10px] text-purple-200 mt-1 flex items-center gap-1 font-mono">
                  <TrendingUp className="w-3 h-3" /> ↑ +12% vs prev hour
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 z-10">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Card 5: Active Alerts */}
            <div className="bg-[#EA580C] text-white p-3.5 rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden col-span-2 sm:col-span-1">
              <div className="z-10">
                <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Active Alerts</div>
                <div className="text-2xl font-black font-mono tracking-tight mt-0.5">12</div>
                <div className="text-[10px] text-orange-200 mt-1 font-mono">
                  ↑ +1 new alert
                </div>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 z-10">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border border-white text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                  1
                </span>
              </div>
            </div>
          </div>

          {/* 3. MIDDLE ROW: MODULE-WISE OVERVIEW & EVENT TELEMETRY STATISTICS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Panel 1: Site/Module-wise Overview */}
            <div className={`${cardBg} p-4 rounded-xl border shadow-xs flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-xs tracking-tight">Module-wise Feeder Status Overview</span>
                </div>
                <div className="flex rounded p-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
                  <button
                    onClick={() => setActiveTab('feeders')}
                    className={`px-2 py-0.5 rounded ${activeTab === 'feeders' ? 'bg-[#1E50ED] text-white font-bold' : 'text-slate-500'}`}
                  >
                    Feeders
                  </button>
                  <button
                    onClick={() => setActiveTab('events')}
                    className={`px-2 py-0.5 rounded ${activeTab === 'events' ? 'bg-[#1E50ED] text-white font-bold' : 'text-slate-500'}`}
                  >
                    Events
                  </button>
                  <button
                    onClick={() => setActiveTab('alerts')}
                    className={`px-2 py-0.5 rounded ${activeTab === 'alerts' ? 'bg-[#1E50ED] text-white font-bold' : 'text-slate-500'}`}
                  >
                    Alert Status
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Donut Gauge */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-36 h-36 -rotate-90">
                      <circle cx="50" cy="50" r="38" stroke="#E2E8F0" strokeWidth="8" fill="none" className="dark:stroke-slate-800" />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#10B981"
                        strokeWidth="8"
                        strokeDasharray="232.1 238.8"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#EF4444"
                        strokeWidth="8"
                        strokeDasharray="6.7 238.8"
                        strokeDashoffset="-232.1"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-black font-mono tracking-tight">97.2%</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono mt-2">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Online: 138
                    </span>
                    <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-500" /> Offline: 4
                    </span>
                  </div>
                </div>

                {/* Clustered Bar Chart */}
                <div className="sm:col-span-7 flex flex-col justify-end h-40">
                  <div className="flex justify-end gap-3 text-[10px] font-mono mb-2">
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                      <span className="w-2 h-2 rounded-sm bg-blue-600" /> Online
                    </span>
                    <span className="flex items-center gap-1 text-red-500 font-bold">
                      <span className="w-2 h-2 rounded-sm bg-red-500" /> Offline
                    </span>
                  </div>

                  <svg viewBox="0 0 240 120" className="w-full h-auto">
                    {[0, 20, 40, 60].map((val) => {
                      const y = 100 - (val / 60) * 85;
                      return (
                        <g key={val}>
                          <line x1="25" y1={y} x2="235" y2={y} stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="2,2" className="dark:stroke-slate-800" />
                          <text x="20" y={y + 3} textAnchor="end" fontSize="7.5" fill="#94A3B8" fontFamily="monospace">
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Bars for Site-1 (Mod-1: 52 / 1) */}
                    <g transform="translate(45, 0)">
                      <rect x="0" y={100 - (52 / 60) * 85} width="18" height={(52 / 60) * 85} rx="2" fill="#1E50ED" />
                      <text x="9" y={100 - (52 / 60) * 85 - 3} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1E50ED" fontFamily="monospace">52</text>
                      <rect x="22" y={100 - (1 / 60) * 85} width="18" height={(1 / 60) * 85 || 3} rx="2" fill="#EF4444" />
                      <text x="31" y={100 - (1 / 60) * 85 - 3} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#EF4444" fontFamily="monospace">1</text>
                      <text x="20" y="114" textAnchor="middle" fontSize="8" fill="#64748B" fontFamily="monospace">Site-1</text>
                    </g>

                    {/* Bars for Site-2 (Mod-2: 48 / 2) */}
                    <g transform="translate(115, 0)">
                      <rect x="0" y={100 - (48 / 60) * 85} width="18" height={(48 / 60) * 85} rx="2" fill="#1E50ED" />
                      <text x="9" y={100 - (48 / 60) * 85 - 3} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1E50ED" fontFamily="monospace">48</text>
                      <rect x="22" y={100 - (2 / 60) * 85} width="18" height={(2 / 60) * 85 || 4} rx="2" fill="#EF4444" />
                      <text x="31" y={100 - (2 / 60) * 85 - 3} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#EF4444" fontFamily="monospace">2</text>
                      <text x="20" y="114" textAnchor="middle" fontSize="8" fill="#64748B" fontFamily="monospace">Site-2</text>
                    </g>

                    {/* Bars for Site-3 (Mod-3: 38 / 1) */}
                    <g transform="translate(185, 0)">
                      <rect x="0" y={100 - (38 / 60) * 85} width="18" height={(38 / 60) * 85} rx="2" fill="#1E50ED" />
                      <text x="9" y={100 - (38 / 60) * 85 - 3} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1E50ED" fontFamily="monospace">38</text>
                      <rect x="22" y={100 - (1 / 60) * 85} width="18" height={(1 / 60) * 85 || 3} rx="2" fill="#EF4444" />
                      <text x="31" y={100 - (1 / 60) * 85 - 3} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#EF4444" fontFamily="monospace">1</text>
                      <text x="20" y="114" textAnchor="middle" fontSize="8" fill="#64748B" fontFamily="monospace">Site-3</text>
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Panel 2: Placement & Drop Telemetry Statistics */}
            <div className={`${cardBg} p-4 rounded-xl border shadow-xs flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-xs tracking-tight">Event Statistics</span>
                </div>
                <div className="flex rounded p-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
                  {(['1h', '6h', '24h', '7d'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={`px-2 py-0.5 rounded ${timeRange === r ? 'bg-[#1E50ED] text-white font-bold' : 'text-slate-500'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono mb-2">
                <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Motion / Placements
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Video Loss / Pick Drop
                </span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Alarm / Retries
                </span>
                <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Other / Jams
                </span>
              </div>

              {/* 4 Multi-Wave Spline SVG Chart */}
              <div className="w-full h-40">
                <svg viewBox="0 0 400 130" className="w-full h-full overflow-visible">
                  {[0, 500, 1000, 1500].map((val) => {
                    const y = 110 - (val / 1500) * 95;
                    return (
                      <g key={val}>
                        <line x1="25" y1={y} x2="395" y2={y} stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="2,2" className="dark:stroke-slate-800" />
                        <text x="20" y={y + 3} textAnchor="end" fontSize="7.5" fill="#94A3B8" fontFamily="monospace">
                          {val.toLocaleString()}
                        </text>
                      </g>
                    );
                  })}

                  {/* Curve 1: Placements (Cyan) */}
                  <path
                    d="M 35 32 C 75 22, 115 38, 155 24 C 195 12, 235 44, 275 30 C 315 18, 355 20, 390 28"
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 35 32 C 75 22, 115 38, 155 24 C 195 12, 235 44, 275 30 C 315 18, 355 20, 390 28 L 390 110 L 35 110 Z"
                    fill="#06B6D4"
                    opacity="0.12"
                  />

                  {/* Curve 2: Pick Drops (Emerald) */}
                  <path
                    d="M 35 62 C 75 58, 115 72, 155 60 C 195 50, 235 70, 275 58 C 315 48, 355 56, 390 52"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Curve 3: Vision Retries (Amber) */}
                  <path
                    d="M 35 78 C 75 74, 115 85, 155 76 C 195 70, 235 84, 275 74 C 315 68, 355 75, 390 70"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  {/* Curve 4: Feeder Starve (Purple) */}
                  <path
                    d="M 35 92 C 75 88, 115 96, 155 90 C 195 86, 235 95, 275 88 C 315 84, 355 90, 390 85"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  {/* Time X-Axis */}
                  {[
                    { time: '16:30', x: 35 },
                    { time: '16:45', x: 125 },
                    { time: '17:00', x: 215 },
                    { time: '17:15', x: 305 },
                    { time: '17:30', x: 390 },
                  ].map((pt, i) => (
                    <text key={i} x={pt.x} y="124" textAnchor="middle" fontSize="7.5" fill="#64748B" fontFamily="monospace">
                      {pt.time}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* 4. BOTTOM ROW: FLEET OVERVIEW / RECENT EVENTS & DIAGNOSTICS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Left 7 Columns: Toggle between Fleet Production Lines and Live Event Stream */}
            <div className={`${cardBg} p-4 rounded-xl border shadow-xs lg:col-span-7 flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-bold text-xs tracking-tight">
                    {bottomTableMode === 'FLEET' ? 'FLEET PRODUCTION LINES OVERVIEW (MAIN WINDOW)' : 'Recent Placement Events & Feeder Stream'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded p-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
                    <button
                      onClick={() => setBottomTableMode('FLEET')}
                      className={`px-2 py-0.5 rounded ${bottomTableMode === 'FLEET' ? 'bg-[#1E50ED] text-white font-bold' : 'text-slate-500'}`}
                    >
                      Fleet Lines
                    </button>
                    <button
                      onClick={() => setBottomTableMode('EVENTS')}
                      className={`px-2 py-0.5 rounded ${bottomTableMode === 'EVENTS' ? 'bg-[#1E50ED] text-white font-bold' : 'text-slate-500'}`}
                    >
                      Event Stream
                    </button>
                  </div>
                </div>
              </div>

              {bottomTableMode === 'FLEET' ? (
                /* Fleet Lines Table matching screenshot */
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono border-collapse">
                    <thead>
                      <tr className={`${tableHeaderBg} text-[10px] uppercase font-bold tracking-wider rounded-t`}>
                        <th className="text-left px-2.5 py-2">Line</th>
                        <th className="text-left px-2 py-2">Recipe / Job</th>
                        <th className="text-right px-2 py-2">Progress</th>
                        <th className="text-left px-2 py-2">Micro-State Timer</th>
                        <th className="text-right px-2 py-2">PBR %</th>
                        <th className="text-right px-2 py-2">OEE %</th>
                        <th className="text-right px-2 py-2">3D SPI</th>
                        <th className="text-right px-2 py-2">Post AOI</th>
                        <th className="text-left px-2 py-2">Est. End</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                      {fleet.map((line) => {
                        const isSelected = line.lineId === selectedLineId;
                        const progressPct = line.progressTarget > 0 
                          ? Math.min(100, Math.round((line.progressCompleted / line.progressTarget) * 100))
                          : 0;

                        return (
                          <tr
                            key={line.lineId}
                            onClick={() => setSelectedLineId(line.lineId)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold'
                                : tableRowHover
                            }`}
                          >
                            <td className="px-2.5 py-2.5 font-bold whitespace-nowrap">
                              {line.lineName}
                            </td>
                            <td className="px-2 py-2.5">
                              <div className="font-sans font-medium text-[11px] truncate max-w-[140px]">
                                {line.productName}
                              </div>
                              <div className="text-[9.5px] text-slate-400 font-mono">
                                {line.jobName}
                              </div>
                            </td>
                            <td className="px-2 py-2.5 text-right whitespace-nowrap">
                              <div>{line.progressCompleted} / {line.progressTarget}</div>
                              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-1 overflow-hidden">
                                <div className="bg-[#1E50ED] h-full" style={{ width: `${progressPct}%` }} />
                              </div>
                            </td>
                            <td className="px-2 py-2.5 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                                line.statusState === 'RUN'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}>
                                {line.statusLabel.toUpperCase()} {formatDuration(line.statusDurationSeconds)}
                              </span>
                            </td>
                            <td className="px-2 py-2.5 text-right font-bold text-blue-600 dark:text-blue-400">
                              {line.currentPbr.toFixed(1)}%
                            </td>
                            <td className="px-2 py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                              {line.oee.toFixed(1)}%
                            </td>
                            <td className="px-2 py-2.5 text-right text-slate-500">
                              {line.spiYieldPct.toFixed(1)}%
                            </td>
                            <td className="px-2 py-2.5 text-right text-slate-500">
                              {line.secondAoiYieldPct.toFixed(1)}%
                            </td>
                            <td className="px-2 py-2.5 text-slate-500">
                              {line.estimatedEndTime}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Live Placement Event Stream Table */
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className={`${tableHeaderBg} text-[10px] uppercase font-bold tracking-wider rounded-t`}>
                      <tr>
                        <th className="py-2 px-2.5">Time</th>
                        <th className="py-2 px-2">Line</th>
                        <th className="py-2 px-2">Feeder/Head</th>
                        <th className="py-2 px-2">Event Type</th>
                        <th className="py-2 px-2">Status</th>
                        <th className="py-2 px-2">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                      <tr className={tableRowHover}>
                        <td className="py-2 px-2.5 font-bold">17:26:12</td>
                        <td className="py-2 px-2">SMD_01</td>
                        <td className="py-2 px-2 text-blue-600 dark:text-blue-400 font-bold">Slot 04</td>
                        <td className="py-2 px-2">Auto-Splice Done</td>
                        <td className="py-2 px-2">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Normal
                          </span>
                        </td>
                        <td className="py-2 px-2 text-[10.5px] text-slate-500">AGV Trolley #2 Spliced</td>
                      </tr>
                      <tr className={tableRowHover}>
                        <td className="py-2 px-2.5 font-bold">17:25:47</td>
                        <td className="py-2 px-2">SMD_02</td>
                        <td className="py-2 px-2 text-red-600 dark:text-red-400 font-bold">Head H04</td>
                        <td className="py-2 px-2">Vision Reject</td>
                        <td className="py-2 px-2">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Critical
                          </span>
                        </td>
                        <td className="py-2 px-2 text-[10.5px] text-slate-500">Nozzle Tip Cleaned</td>
                      </tr>
                      <tr className={tableRowHover}>
                        <td className="py-2 px-2.5 font-bold">17:25:31</td>
                        <td className="py-2 px-2">SMD_01</td>
                        <td className="py-2 px-2 text-amber-600 dark:text-amber-400 font-bold">Slot 18</td>
                        <td className="py-2 px-2">Drop Rate High</td>
                        <td className="py-2 px-2">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Warning
                          </span>
                        </td>
                        <td className="py-2 px-2 text-[10.5px] text-slate-500">Feeder Pitch Calibrated</td>
                      </tr>
                      <tr className={tableRowHover}>
                        <td className="py-2 px-2.5 font-bold">17:24:58</td>
                        <td className="py-2 px-2">SMD_01</td>
                        <td className="py-2 px-2 text-blue-600 dark:text-blue-400 font-bold">Slot 08</td>
                        <td className="py-2 px-2">Reel Low (&lt;120)</td>
                        <td className="py-2 px-2">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Normal
                          </span>
                        </td>
                        <td className="py-2 px-2 text-[10.5px] text-slate-500">Splicing Buffer Ready</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right 5 Columns: Diagnostics, 3 Cpk Health Rings & SCADA Hardware Resources */}
            <div className={`${cardBg} p-4 rounded-xl border shadow-xs lg:col-span-5 flex flex-col justify-between space-y-3`}>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-xs tracking-tight">
                    {selectedLine?.lineName || 'SMD_01'} - DIAGNOSTICS & HEALTH
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  LIVE BUS
                </span>
              </div>

              {/* 3 Circular Health Gauges matching screenshot */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                  Site & Line Placement Health
                </div>
                <div className="flex items-center justify-between gap-1">
                  {/* Gauge 1: Site-1 (98.1%) */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg viewBox="0 0 70 70" className="w-16 h-16 -rotate-90">
                        <circle cx="35" cy="35" r="28" stroke="#E2E8F0" strokeWidth="6" fill="none" className="dark:stroke-slate-800" />
                        <circle
                          cx="35"
                          cy="35"
                          r="28"
                          stroke="#10B981"
                          strokeWidth="6"
                          strokeDasharray="172.6 175.9"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-black font-mono">98.1%</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 font-mono mt-1">Site-1</span>
                  </div>

                  {/* Gauge 2: Site-2 (96.7%) */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg viewBox="0 0 70 70" className="w-16 h-16 -rotate-90">
                        <circle cx="35" cy="35" r="28" stroke="#E2E8F0" strokeWidth="6" fill="none" className="dark:stroke-slate-800" />
                        <circle
                          cx="35"
                          cy="35"
                          r="28"
                          stroke="#06B6D4"
                          strokeWidth="6"
                          strokeDasharray="170.1 175.9"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-black font-mono">96.7%</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 font-mono mt-1">Site-2</span>
                  </div>

                  {/* Gauge 3: Site-3 (94.4%) */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg viewBox="0 0 70 70" className="w-16 h-16 -rotate-90">
                        <circle cx="35" cy="35" r="28" stroke="#E2E8F0" strokeWidth="6" fill="none" className="dark:stroke-slate-800" />
                        <circle
                          cx="35"
                          cy="35"
                          r="28"
                          stroke="#F59E0B"
                          strokeWidth="6"
                          strokeDasharray="166.0 175.9"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-black font-mono">94.4%</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 font-mono mt-1">Site-3</span>
                  </div>
                </div>
              </div>

              {/* SCADA Machine Resources & Live Diagnostics */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  SCADA Machine Resources
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Vacuum Pressure</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">32 kPa</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '32%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Conveyor Torque</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">58%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '58%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Feeder Bus Latency (12ms)</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">47%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: '47%' }} />
                  </div>
                </div>
              </div>

              {/* Nozzle Error Ranking Table */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">
                  <span>NOZZLE ERROR RANKING (PDERROR)</span>
                  <span>Top Mispicks</span>
                </div>
                <div className="space-y-1 text-[10.5px] font-mono">
                  {(diagnostics?.nozzleRankings || []).slice(0, 3).map((n) => (
                    <div key={n.nozzleAddress} className="flex justify-between items-center py-0.5 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-600 dark:text-slate-300 font-semibold">{n.nozzleAddress}</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold">{n.mispickCount}x</span>
                      <span className="text-slate-400">{(n.errorRatePct ?? 0).toFixed(3)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* LINE FLOW & DROP ANALYSIS MODE */
        <div className="space-y-3">
          <SmtLineFlowStrip
            machines={machineFlow}
            lineName={selectedLine?.lineName || 'SMD_01'}
            targetCycleTimeSec={18.0}
          />
          <MounterDropAnalysisCard
            dropData={diagnostics?.dropRatePpm || FALLBACK_DIAGNOSTICS.dropRatePpm}
            shiftData={diagnostics?.shiftMatrix || FALLBACK_DIAGNOSTICS.shiftMatrix}
            lineName={selectedLine?.lineName || 'SMD_01'}
          />
        </div>
      )}
    </div>
  );
};
