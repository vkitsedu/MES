import React, { useState, useEffect } from 'react';
import { 
  Activity, Cpu, Shield, AlertTriangle, CheckCircle2, 
  Clock, Download, ExternalLink, Filter, 
  Terminal, Sparkles, Zap, Layers, Copy, Check,
  X, ChevronRight, Pause, Play, BarChart3
} from 'lucide-react';
import { NavTab } from '../config/navigation';

interface SmtNocTelemetryStudioProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export type TimeWindow = '1h' | '4h' | '24h' | '7d' | '30d';
export type RefreshRate = '5s' | '15s' | '30s' | 'manual';
export type DomainFilter = 'ALL' | 'MOUNTER' | 'SPI_PRINTER' | 'THERMAL_AOI' | 'AGV_LOGISTICS';

export const SmtNocTelemetryStudio: React.FC<SmtNocTelemetryStudioProps> = ({ onNavigateTab }) => {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('24h');
  const [refreshRate, setRefreshRate] = useState<RefreshRate>('15s');
  const [refreshCountdown, setRefreshCountdown] = useState<number>(15);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [domainFilter, setDomainFilter] = useState<DomainFilter>('ALL');
  const [selectedSlotHover, setSelectedSlotHover] = useState<string | null>(null);

  // Modals state
  const [isOpenMetricsOpen, setIsOpenMetricsOpen] = useState<boolean>(false);
  const [isGrafanaGuideOpen, setIsGrafanaGuideOpen] = useState<boolean>(false);
  const [isCopiedMetrics, setIsCopiedMetrics] = useState<boolean>(false);
  const [isCopiedGrafanaJson, setIsCopiedGrafanaJson] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Countdown timer for auto-refresh
  useEffect(() => {
    if (refreshRate === 'manual' || isPaused) return;

    const interval = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          const resetVal = refreshRate === '5s' ? 5 : refreshRate === '15s' ? 15 : 30;
          return resetVal;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [refreshRate, isPaused]);

  // Handle refresh interval change
  const handleSelectRefresh = (rate: RefreshRate) => {
    setRefreshRate(rate);
    if (rate === '5s') setRefreshCountdown(5);
    else if (rate === '15s') setRefreshCountdown(15);
    else if (rate === '30s') setRefreshCountdown(30);
  };

  // Export Snapshot JSON
  const handleExportSnapshot = () => {
    const snapshot = {
      timestamp: new Date().toISOString(),
      cleanroom: 'CLEANROOM-SMT-BAY-01',
      gateway: 'IPC-CFX-HERMES-ZERO-LOSS',
      timeWindow,
      kpis: {
        oee: 88.4,
        availability: 91.2,
        performance: 99.6,
        quality: 98.4,
        placementCph: 44820,
        feederDeficit: 2,
        cfr21Interlocks: 0,
        fpy: 98.4,
        mounterDropPpm: 288
      },
      feederSafetyStock: [
        { slot: '01', part: '0402_100N', current: 3820, buffer: 1000, status: 'OK' },
        { slot: '02', part: '0603_10K', current: 2450, buffer: 1000, status: 'OK' },
        { slot: '03', part: '0201_CAP', current: 1980, buffer: 1000, status: 'OK' },
        { slot: '04', part: 'QFP_144', current: 340, buffer: 1000, status: 'LOW_DEFICIT' },
        { slot: '05', part: 'BGA_256', current: 1850, buffer: 1000, status: 'OK' },
        { slot: '06', part: 'SOT23_NPN', current: 2900, buffer: 1000, status: 'OK' },
        { slot: '07', part: '0805_LED', current: 1420, buffer: 1000, status: 'OK' },
        { slot: '08', part: 'SOIC_8', current: 410, buffer: 1000, status: 'LOW_DEFICIT' }
      ]
    };

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smt-noc-telemetry-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('Telemetry snapshot exported to JSON');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const copyMetricsToClipboard = () => {
    navigator.clipboard.writeText(openMetricsPayload);
    setIsCopiedMetrics(true);
    setTimeout(() => setIsCopiedMetrics(false), 2500);
  };

  const copyGrafanaJsonToClipboard = () => {
    navigator.clipboard.writeText(grafanaDatasourceJson);
    setIsCopiedGrafanaJson(true);
    setTimeout(() => setIsCopiedGrafanaJson(false), 2500);
  };

  // Mock OpenMetrics Scraping String
  const openMetricsPayload = `# HELP smt_cleanroom_placement_speed_cph Current mounter component placement speed in CPH
# TYPE smt_cleanroom_placement_speed_cph gauge
smt_cleanroom_placement_speed_cph{line="LINE_01",mounter="MNT-01"} 44820
# HELP smt_cleanroom_oee_percent SEMI E10 Overall Equipment Effectiveness
# TYPE smt_cleanroom_oee_percent gauge
smt_cleanroom_oee_percent{line="LINE_01"} 88.4
smt_cleanroom_oee_availability{line="LINE_01"} 91.2
smt_cleanroom_oee_performance{line="LINE_01"} 99.6
smt_cleanroom_oee_quality{line="LINE_01"} 98.4
# HELP smt_feeder_parts_remaining Remaining parts per feeder slot
# TYPE smt_feeder_parts_remaining gauge
smt_feeder_parts_remaining{line="LINE_01",slot="01",part="0402_100N"} 3820
smt_feeder_parts_remaining{line="LINE_01",slot="02",part="0603_10K"} 2450
smt_feeder_parts_remaining{line="LINE_01",slot="03",part="0201_CAP"} 1980
smt_feeder_parts_remaining{line="LINE_01",slot="04",part="QFP_144"} 340
smt_feeder_parts_remaining{line="LINE_01",slot="05",part="BGA_256"} 1850
smt_feeder_parts_remaining{line="LINE_01",slot="06",part="SOT23_NPN"} 2900
smt_feeder_parts_remaining{line="LINE_01",slot="07",part="0805_LED"} 1420
smt_feeder_parts_remaining{line="LINE_01",slot="08",part="SOIC_8"} 410
# HELP smt_cfr21_active_holds Active Part 11 electronic signature quarantine holds
# TYPE smt_cfr21_active_holds gauge
smt_cfr21_active_holds{line="LINE_01"} 0
# HELP smt_reflow_pwi_index Reflow Oven Process Window Index percent
# TYPE smt_reflow_pwi_index gauge
smt_reflow_pwi_index{line="LINE_01",oven="RFW-01"} 62.4`;

  const grafanaDatasourceJson = JSON.stringify({
    apiVersion: 1,
    datasources: [
      {
        name: 'SMT Cleanroom Prometheus',
        type: 'prometheus',
        access: 'proxy',
        url: 'http://localhost:4000/api/v1/metrics',
        isDefault: true,
        jsonData: {
          httpMethod: 'GET',
          timeInterval: '5s'
        }
      }
    ]
  }, null, 2);

  // Feeder Data
  const feederData = [
    { slot: 'SLOT_01', part: '0402_100N', current: 3820, buffer: 1000, max: 4000, status: 'OK', depletionMin: 184 },
    { slot: 'SLOT_02', part: '0603_10K', current: 2450, buffer: 1000, max: 4000, status: 'OK', depletionMin: 118 },
    { slot: 'SLOT_03', part: '0201_CAP', current: 1980, buffer: 1000, max: 4000, status: 'OK', depletionMin: 95 },
    { slot: 'SLOT_04', part: 'QFP_144', current: 340, buffer: 1000, max: 4000, status: 'LOW', depletionMin: 12 },
    { slot: 'SLOT_05', part: 'BGA_256', current: 1850, buffer: 1000, max: 4000, status: 'OK', depletionMin: 89 },
    { slot: 'SLOT_06', part: 'SOT23', current: 2900, buffer: 1000, max: 4000, status: 'OK', depletionMin: 140 },
    { slot: 'SLOT_07', part: '0805_LED', current: 1420, buffer: 1000, max: 4000, status: 'OK', depletionMin: 68 },
    { slot: 'SLOT_08', part: 'SOIC_8', current: 410, buffer: 1000, max: 4000, status: 'LOW', depletionMin: 14 },
  ];

  // Multi-Up Cycle Time distribution
  const cycleTimeBins = [
    { bin: '< 14s', count: 12, isTakt: false },
    { bin: '14-16s', count: 48, isTakt: false },
    { bin: '16-18s', count: 184, isTakt: true },
    { bin: '18-20s', count: 62, isTakt: false },
    { bin: '20-22s', count: 18, isTakt: false },
    { bin: '> 22s', count: 6, isTakt: false },
  ];

  // Live Cleanroom Events Table
  const eventQueue = [
    { id: 'EVT-90124', station: 'MNT-01', title: '[Feeder Buffer Low] Reel slot 04 replenishment AGV dispatched', category: 'FEEDER_AGV', severity: 'HIGH', time: '14:32:10', status: 'DISPATCHED' },
    { id: 'EVT-90125', station: 'SPI-01', title: '[Closed Loop] 3D Paste height +8µm offset auto-applied to DEK printer', category: 'CLOSED_LOOP', severity: 'INFO', time: '14:28:45', status: 'AUTO_CORRECT' },
    { id: 'EVT-90126', station: 'RFW-01', title: '[Thermal Profile] Zone 7 peak temp 242.4°C verified within SAC305 profile', category: 'THERMAL_PWI', severity: 'NORMAL', time: '14:20:12', status: 'PASS' },
    { id: 'EVT-90127', station: 'DHR-01', title: '[CFR 11 eDHR Gate] Lot IMES-2026-09 batch electronic signature signed', category: 'COMPLIANCE', severity: 'INFO', time: '14:15:00', status: 'VERIFIED' },
    { id: 'EVT-90128', station: 'MNT-02', title: '[Nozzle Auto-Purge] Vacuum drop recovery executed on Fuji Head 02', category: 'MOUNTER_AI', severity: 'MEDIUM', time: '14:02:30', status: 'RESOLVED' },
  ];

  return (
    <div className="bg-[#070A10] min-h-screen text-slate-200 font-sans p-2 sm:p-3 space-y-2.5 select-none">
      
      {/* 1. TOP STATUS & TELEMETRY CONTROL STRIP */}
      <div className="bg-[#0D121D] border border-slate-800/80 rounded-md px-3 py-2 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>OT Gateway: LIVE (IPC-CFX / Hermes)</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>RSS: <strong className="text-slate-200 font-mono">104 MB</strong></span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Latency: <strong className="text-slate-200 font-mono">12 ms</strong></span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>Uptime: <strong className="text-slate-200 font-mono">14d 08h</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <button 
              onClick={() => setIsPaused(!isPaused)} 
              title={isPaused ? 'Resume auto-poll' : 'Pause auto-poll'}
              className="hover:text-white transition-colors"
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            </button>
            <span className="text-[11px]">
              {isPaused ? 'Paused' : `Refresh in ${refreshCountdown}s`}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800 text-[11px]">
            {(['1h', '4h', '24h', '7d', '30d'] as TimeWindow[]).map((tw) => (
              <button
                key={tw}
                onClick={() => setTimeWindow(tw)}
                className={`px-2 py-0.5 rounded transition-all font-medium ${
                  timeWindow === tw 
                    ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tw}
              </button>
            ))}
          </div>

          <select
            value={refreshRate}
            onChange={(e) => handleSelectRefresh(e.target.value as RefreshRate)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] rounded px-2 py-0.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="5s">Every 5s</option>
            <option value="15s">Every 15s</option>
            <option value="30s">Every 30s</option>
            <option value="manual">Manual</option>
          </select>

          <button
            onClick={handleExportSnapshot}
            title="Export Cleanroom Telemetry Snapshot (JSON)"
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. ALERT STRIP & OBSERVABILITY BRIDGES */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div 
          onClick={() => onNavigateTab ? onNavigateTab('OPERATOR') : null}
          className="inline-flex items-center gap-2 px-3 py-1 rounded bg-rose-950/40 border border-rose-600/40 text-rose-300 cursor-pointer hover:bg-rose-950/60 transition-colors"
          title="Click to jump to Feeder Bay Rails (FDR-01)"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
          <span className="font-bold font-mono">2 Feeder Deficit (&lt;15m buffer)</span>
          <span className="text-[11px] text-rose-400/80">• Slots 04 &amp; 08 Dispatched to Material AGV</span>
          <ChevronRight className="w-3 h-3 text-rose-400" />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
          <span className="text-cyan-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            100% In-App Telemetry &amp; Analytics (Built-in)
          </span>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => setIsOpenMetricsOpen(true)}
            className="text-slate-300 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
          >
            <Terminal className="w-3 h-3" />
            <span>Raw OpenMetrics Scrape Stream (/api/v1/metrics)</span>
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => setIsGrafanaGuideOpen(true)}
            className="text-slate-300 hover:text-indigo-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>External Corporate Grafana Integration (Optional)</span>
          </button>
        </div>
      </div>

      {/* 3. DOMAIN FILTER STRIP */}
      <div className="bg-[#0A0E17] border border-slate-900 rounded px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-500 uppercase text-[10px] tracking-wider flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-500" />
            Domain Filter:
          </span>
          <button
            onClick={() => setDomainFilter('ALL')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              domainFilter === 'ALL' 
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Cleanroom Domains
          </button>
          <button
            onClick={() => setDomainFilter('MOUNTER')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              domainFilter === 'MOUNTER' 
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fuji NXT III Mounters
          </button>
          <button
            onClick={() => setDomainFilter('SPI_PRINTER')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              domainFilter === 'SPI_PRINTER' 
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Printer &amp; 3D SPI
          </button>
          <button
            onClick={() => setDomainFilter('THERMAL_AOI')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              domainFilter === 'THERMAL_AOI' 
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Reflow &amp; AOI Quality
          </button>
          <button
            onClick={() => setDomainFilter('AGV_LOGISTICS')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              domainFilter === 'AGV_LOGISTICS' 
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Material AGV Fleet
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-sans">
          Window: <strong className="text-slate-300 font-mono">{timeWindow}</strong> • Real-time Reactive Redraw
        </div>
      </div>

      {/* 4. TOP 5 HIGH-IMPACT KPI TELEMETRY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        
        {/* Card 1: TOTAL WORKCENTERS */}
        <div 
          onClick={() => onNavigateTab ? onNavigateTab('FLEET') : null}
          className="bg-[#0D121D] border border-slate-800/90 hover:border-cyan-500/40 rounded-md p-3 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider text-[10.5px]">TOTAL WORKCENTERS</span>
            <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            9 <span className="text-xs font-normal text-slate-400">units</span>
          </div>
          <div className="text-[11px] text-cyan-400/90 font-mono mt-1 flex items-center justify-between">
            <span>78% Fleet Running</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>
        </div>

        {/* Card 2: READY STOCK BUFFER */}
        <div 
          onClick={() => onNavigateTab ? onNavigateTab('OPERATOR') : null}
          className="bg-[#0D121D] border border-slate-800/90 hover:border-emerald-500/40 rounded-md p-3 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider text-[10.5px]">READY BUFFER RAILS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            14 <span className="text-xs font-normal text-slate-400">/ 16 loaded</span>
          </div>
          <div className="text-[11px] text-emerald-400/90 font-mono mt-1 flex items-center justify-between">
            <span>Immediate Placement Ready</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Card 3: FEEDER DEFICIT */}
        <div 
          onClick={() => onNavigateTab ? onNavigateTab('AGV_LOGISTICS') : null}
          className="bg-[#0D121D] border border-rose-900/40 hover:border-rose-500/60 rounded-md p-3 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider text-[10.5px]">FEEDER DEFICIT</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            -2 <span className="text-xs font-normal text-slate-400">Slots (04 &amp; 08)</span>
          </div>
          <div className="text-[11px] text-rose-400/90 font-mono mt-1 flex items-center justify-between">
            <span>&lt;15m Splicing Buffer</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          </div>
        </div>

        {/* Card 4: CLEANROOM INTERLOCKS */}
        <div 
          onClick={() => onNavigateTab ? onNavigateTab('COMPLIANCE') : null}
          className="bg-[#0D121D] border border-slate-800/90 hover:border-indigo-500/40 rounded-md p-3 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider text-[10.5px]">CLEANROOM INTERLOCKS</span>
            <Shield className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-300 mt-1">
            0 <span className="text-xs font-normal text-slate-400">Active Holds</span>
          </div>
          <div className="text-[11px] text-indigo-400/90 font-mono mt-1 flex items-center justify-between">
            <span>21 CFR Part 11 Armed</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          </div>
        </div>

        {/* Card 5: PLANT OEE */}
        <div 
          onClick={() => onNavigateTab ? onNavigateTab('SUPERVISOR') : null}
          className="bg-[#0D121D] border border-slate-800/90 hover:border-cyan-500/40 rounded-md p-3 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="uppercase tracking-wider text-[10.5px]">PLANT OEE (SEMI E10)</span>
            <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            88.4%
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center justify-between">
            <span>A:91% • P:99% • Q:98%</span>
            <span className="text-emerald-400 font-bold">+1.8%</span>
          </div>
        </div>

      </div>

      {/* 5. MID-ROW 1: DUAL DIAGNOSTIC RADARS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        
        {/* Left: Feeder Safety Stock Radar */}
        <div className="lg:col-span-7 bg-[#0D121D] border border-slate-800/90 rounded-md p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Feeder Safety Stock Radar (In-Stock vs Minimum Buffer)</span>
              </div>
              <p className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                Dynamic Cleanroom Feeder Catalog Thresholds • Auto-AGV Trigger Buffer
              </p>
            </div>
            
            <div className="flex items-center gap-3 text-[10.5px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[1px] bg-cyan-400" />
                <span className="text-slate-400">In-Stock Units</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[1px] bg-indigo-600" />
                <span className="text-slate-400">Target Safety Buffer</span>
              </div>
            </div>
          </div>

          <div className="w-full h-56 pt-2">
            <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
              {[0, 50, 100, 150].map((yVal, i) => (
                <g key={yVal}>
                  <line 
                    x1="40" 
                    y1={yVal + 20} 
                    x2="680" 
                    y2={yVal + 20} 
                    stroke="#1E293B" 
                    strokeDasharray="2 4" 
                    strokeWidth="1" 
                  />
                  <text x="32" y={yVal + 24} fill="#64748B" fontSize="9" textAnchor="end" fontFamily="monospace">
                    {4000 - i * 1000}
                  </text>
                </g>
              ))}

              {feederData.map((slot, index) => {
                const xBase = 55 + index * 78;
                const inStockH = (slot.current / 4000) * 150;
                const bufferH = (slot.buffer / 4000) * 150;
                const isLow = slot.status === 'LOW';

                return (
                  <g 
                    key={slot.slot}
                    onMouseEnter={() => setSelectedSlotHover(slot.slot)}
                    onMouseLeave={() => setSelectedSlotHover(null)}
                    className="cursor-pointer transition-opacity hover:opacity-90"
                  >
                    <rect
                      x={xBase - 5}
                      y="20"
                      width="64"
                      height="150"
                      fill={selectedSlotHover === slot.slot ? 'rgba(56, 189, 248, 0.05)' : 'transparent'}
                      rx="2"
                    />

                    <rect
                      x={xBase + 18}
                      y={170 - bufferH}
                      width="14"
                      height={bufferH}
                      fill="#4F46E5"
                      rx="1"
                    />

                    <rect
                      x={xBase}
                      y={170 - inStockH}
                      width="14"
                      height={inStockH}
                      fill={isLow ? '#F43F5E' : '#06B6D4'}
                      rx="1"
                    />

                    {isLow && (
                      <circle cx={xBase + 7} cy={170 - inStockH - 6} r="3" fill="#F43F5E" />
                    )}

                    <text 
                      x={xBase + 16} 
                      y="186" 
                      fill={isLow ? '#F43F5E' : '#94A3B8'} 
                      fontSize="9.5" 
                      textAnchor="middle" 
                      fontFamily="monospace"
                      fontWeight={isLow ? 'bold' : 'normal'}
                    >
                      {slot.slot}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-1 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10.5px] font-mono text-slate-400">
            <span>Catalog: <strong className="text-slate-200">SMT-BOM-METER-V4</strong></span>
            <span>Active Feeders: <strong className="text-slate-200">8 Slots Tracked</strong></span>
            <span>Replenishment Priority: <strong className="text-rose-400">SLOT 04 (12m), SLOT 08 (14m)</strong></span>
          </div>
        </div>

        {/* Right: Equipment SEMI E10 Allocation */}
        <div className="lg:col-span-5 bg-[#0D121D] border border-slate-800/90 rounded-md p-3.5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Equipment SEMI E10 Allocation</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">9 Total Workcenters</span>
            </div>
            <p className="text-[10.5px] text-slate-500 font-mono">
              Autonomous Telemetry State Classification
            </p>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1E293B" strokeWidth="11" />
                
                {/* Running: 78% */}
                <circle 
                  cx="50" cy="50" r="38" 
                  fill="transparent" 
                  stroke="#10B981" 
                  strokeWidth="11" 
                  strokeDasharray="186.2 238.8" 
                  strokeDashoffset="0" 
                />

                {/* Starved: 11% */}
                <circle 
                  cx="50" cy="50" r="38" 
                  fill="transparent" 
                  stroke="#0EA5E9" 
                  strokeWidth="11" 
                  strokeDasharray="26.2 238.8" 
                  strokeDashoffset="-186.2" 
                />

                {/* Splicing: 7% */}
                <circle 
                  cx="50" cy="50" r="38" 
                  fill="transparent" 
                  stroke="#F59E0B" 
                  strokeWidth="11" 
                  strokeDasharray="16.7 238.8" 
                  strokeDashoffset="-212.4" 
                />

                {/* Interlocked / Hold: 4% */}
                <circle 
                  cx="50" cy="50" r="38" 
                  fill="transparent" 
                  stroke="#8B5CF6" 
                  strokeWidth="11" 
                  strokeDasharray="9.6 238.8" 
                  strokeDashoffset="-229.1" 
                />
              </svg>

              <div className="absolute text-center">
                <div className="text-2xl font-bold font-mono text-white">78%</div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">RUNNING</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Running: 78% (7 units)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span className="text-slate-300">Starved/Wait: 11% (1 unit)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300">Splicing: 7% (1 unit)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-slate-300">Hold/Gate: 4% (0 units)</span>
            </div>
          </div>
        </div>

      </div>

      {/* 6. MID-ROW 2: DUAL TIME-SERIES CURVES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        
        {/* Left: Fuji PDERROR Drop Rate vs Auto-Recovery Velocity */}
        <div className="bg-[#0D121D] border border-slate-800/90 rounded-md p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200">
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                <span>Fuji PDERROR Component Drop vs Auto-Recovery Velocity (24H)</span>
              </div>
              <p className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                Placement Vision Retry Engine • SLA Escalations Tracked
              </p>
            </div>

            <div className="flex items-center gap-3 text-[10.5px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-slate-400">Pickup Dropped</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-slate-400">Vision Re-Aligned</span>
              </div>
            </div>
          </div>

          <div className="w-full h-48 pt-1">
            <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="purpleWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9333EA" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#9333EA" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="cyanWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {[30, 70, 110].map((y) => (
                <line key={y} x1="20" y1={y} x2="580" y2={y} stroke="#1E293B" strokeDasharray="2 4" strokeWidth="1" />
              ))}

              <path
                d="M 30,130 Q 80,40 140,110 T 260,135 T 380,80 T 500,45 T 570,45 L 570,140 L 30,140 Z"
                fill="url(#purpleWave)"
              />
              <path
                d="M 30,130 Q 80,40 140,110 T 260,135 T 380,80 T 500,45 T 570,45"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2.5"
              />

              <path
                d="M 30,135 Q 80,100 140,120 T 260,140 T 380,105 T 500,60 T 570,50 L 570,140 L 30,140 Z"
                fill="url(#cyanWave)"
              />
              <path
                d="M 30,135 Q 80,100 140,120 T 260,140 T 380,105 T 500,60 T 570,50"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2"
              />

              {['-24h', '-20h', '-16h', '-12h', '-8h', '-4h', 'Now'].map((label, idx) => (
                <text 
                  key={label} 
                  x={30 + idx * 90} 
                  y="155" 
                  fill="#64748B" 
                  fontSize="9" 
                  textAnchor="middle" 
                  fontFamily="monospace"
                >
                  {label}
                </text>
              ))}
            </svg>
          </div>

          <div className="mt-1 flex items-center justify-between text-[10.5px] font-mono text-slate-400">
            <span>Net Recovery Rate: <strong className="text-emerald-400 font-bold">98.8%</strong></span>
            <span>Total Pickups: <strong className="text-slate-200">1,280,450</strong></span>
            <span>Drop PPM: <strong className="text-cyan-400">288 PPM (Pass)</strong></span>
          </div>
        </div>

        {/* Right: Solder Paste Stencil Life Countdown & Reflow Thermal Trajectory */}
        <div className="bg-[#0D121D] border border-slate-800/90 rounded-md p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Solder Paste Stencil Life Countdown &amp; Reflow Thermal PWI</span>
              </div>
              <p className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                480-Minute Tack Life Expiration Schedule • Process Window Index Target
              </p>
            </div>

            <div className="flex items-center gap-3 text-[10.5px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[1px] bg-cyan-400" />
                <span className="text-slate-400">Tack Life (Min)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[1px] bg-emerald-400" />
                <span className="text-slate-400">Reflow PWI (62%)</span>
              </div>
            </div>
          </div>

          <div className="w-full h-48 pt-1">
            <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pasteGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {[30, 70, 110].map((y) => (
                <line key={y} x1="30" y1={y} x2="570" y2={y} stroke="#1E293B" strokeDasharray="2 4" strokeWidth="1" />
              ))}

              <polygon
                points="40,30 160,55 280,80 400,105 540,135 540,140 40,140"
                fill="url(#pasteGradient)"
              />
              <polyline
                points="40,30 160,55 280,80 400,105 540,135"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2.5"
              />

              <line x1="40" y1="75" x2="540" y2="75" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="545" y="78" fill="#10B981" fontSize="9" fontFamily="monospace">PWI Target</text>

              {['Hour 0', 'Hour 2', 'Hour 4', 'Hour 6', 'Hour 8 (Expiry)'].map((label, idx) => (
                <text 
                  key={label} 
                  x={40 + idx * 125} 
                  y="155" 
                  fill="#64748B" 
                  fontSize="9" 
                  textAnchor="middle" 
                  fontFamily="monospace"
                >
                  {label}
                </text>
              ))}
            </svg>
          </div>

          <div className="mt-1 flex items-center justify-between text-[10.5px] font-mono text-slate-400">
            <span>Current Jar: <strong className="text-slate-200">IND-SAC305-88-M4</strong></span>
            <span>Tack Life Remaining: <strong className="text-cyan-400 font-bold">240 min (50%)</strong></span>
            <span>Reflow PWI: <strong className="text-emerald-400 font-bold">62.4% (Optimal)</strong></span>
          </div>
        </div>

      </div>

      {/* 7. BOTTOM ROW: DISTRIBUTION & LIVE NOC INTERLOCK QUEUE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        
        {/* Left: Multi-Up Panel Cycle Time & Takt Pacing Distribution */}
        <div className="lg:col-span-5 bg-[#0D121D] border border-slate-800/90 rounded-md p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Multi-Up Panel Cycle Time &amp; Takt Pacing</span>
              </div>
              <p className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                Target: 18.0s Takt • IPC-9850 Tact Variance Distribution
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
              BALANCED
            </span>
          </div>

          <div className="w-full h-44 pt-2">
            <div className="flex items-end justify-between h-36 px-2 gap-2 border-b border-slate-800">
              {cycleTimeBins.map((bin) => (
                <div key={bin.bin} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bin.count}
                  </span>
                  <div className="w-full flex flex-col justify-end items-center h-28 bg-slate-900/60 rounded-[1px]">
                    <div 
                      style={{ height: `${(bin.count / 200) * 100}%` }}
                      className={`w-full rounded-[1px] transition-all ${
                        bin.isTakt 
                          ? 'bg-gradient-to-t from-cyan-600 to-emerald-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                          : 'bg-indigo-600/70 hover:bg-indigo-500'
                      }`}
                    />
                  </div>
                  <span className={`text-[9.5px] font-mono whitespace-nowrap ${
                    bin.isTakt ? 'text-cyan-400 font-bold' : 'text-slate-500'
                  }`}>
                    {bin.bin}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10.5px] font-mono text-slate-400">
            <span>Mean Tact: <strong className="text-slate-100">18.2s</strong></span>
            <span>Std Dev (σ): <strong className="text-slate-100">0.42s</strong></span>
            <span>Target Pacing: <strong className="text-emerald-400 font-bold">18.0s (ON PACE)</strong></span>
          </div>
        </div>

        {/* Right: NOC Live Cleanroom Interlock & Event Queue Table */}
        <div className="lg:col-span-7 bg-[#0D121D] border border-slate-800/90 rounded-md p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>NOC Live Cleanroom Interlock &amp; Event Queue</span>
              </div>
              <p className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                Real-Time Telemetry Log Stream &amp; Automated Governance
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              5 Active Telemetry Signals
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800/90 text-[10px] uppercase tracking-wider">
                  <th className="pb-2 font-medium">EVENT ID</th>
                  <th className="pb-2 font-medium">STATION</th>
                  <th className="pb-2 font-medium">DETAILS</th>
                  <th className="pb-2 font-medium">CATEGORY</th>
                  <th className="pb-2 font-medium">SEVERITY</th>
                  <th className="pb-2 font-medium text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {eventQueue.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2 text-cyan-400 font-semibold">{evt.id}</td>
                    <td className="py-2 text-slate-300">{evt.station}</td>
                    <td className="py-2 text-slate-300 max-w-[260px] truncate" title={evt.title}>
                      {evt.title}
                    </td>
                    <td className="py-2 text-slate-400 text-[10px]">{evt.category}</td>
                    <td className="py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                        evt.severity === 'HIGH' 
                          ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                          : evt.severity === 'MEDIUM'
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {evt.severity}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <span className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {evt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL 1: RAW OPENMETRICS / PROMETHEUS SCRAPE STREAM */}
      {isOpenMetricsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D121D] border border-slate-800 rounded-lg max-w-2xl w-full p-4 shadow-2xl space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-sm text-cyan-400 font-bold">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Live OpenMetrics / Prometheus Scrape Endpoint</span>
              </div>
              <button 
                onClick={() => setIsOpenMetricsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-sans">
              Industrial telemetry is broadcasted in standard OpenMetrics exposition format. Any Prometheus, VictoriaMetrics, or Telegraf agent can scrape <code className="text-cyan-300 font-mono">http://localhost:4000/api/v1/metrics</code>.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-emerald-400/90 overflow-x-auto max-h-72 select-text">
              <pre>{openMetricsPayload}</pre>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={copyMetricsToClipboard}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                {isCopiedMetrics ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedMetrics ? 'Copied to Clipboard' : 'Copy Metrics Stream'}</span>
              </button>

              <button
                onClick={() => setIsOpenMetricsOpen(false)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CORPORATE GRAFANA INTEGRATION GUIDE */}
      {isGrafanaGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D121D] border border-slate-800 rounded-lg max-w-2xl w-full p-4 shadow-2xl space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-sm text-indigo-400 font-bold">
                <ExternalLink className="w-4 h-4 text-indigo-400" />
                <span>Turnkey Corporate Grafana Datasource Setup</span>
              </div>
              <button 
                onClick={() => setIsGrafanaGuideOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-sans">
              To import this SMT cleanroom telemetry stream into your enterprise Grafana cluster (e.g. AWS Managed Grafana, Grafana Cloud, or On-Prem), save this datasource YAML/JSON into your Grafana provisioning directory:
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-indigo-300 overflow-x-auto max-h-64 select-text">
              <pre>{grafanaDatasourceJson}</pre>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={copyGrafanaJsonToClipboard}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                {isCopiedGrafanaJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedGrafanaJson ? 'Copied Datasource JSON' : 'Copy Datasource JSON'}</span>
              </button>

              <button
                onClick={() => setIsGrafanaGuideOpen(false)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snapshot notification toast */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-mono px-3.5 py-2 rounded shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

    </div>
  );
};
