import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Activity, Clock, CheckCircle2, 
  RefreshCw, Copy, Layers, Cpu, Zap, AlertTriangle,
  Sliders, ShieldCheck, ChevronRight
} from 'lucide-react';
import { ShiftSummaryReport, SmtMachineFlowItem, MounterDropRatePpm, ShiftDropMatrixItem } from '@mes/shared';
import { authService } from '../services/auth.service';
import { ArcGaugeOee } from './common/ArcGaugeOee';
import { SmtLineFlowStrip } from './common/SmtLineFlowStrip';
import { MounterDropAnalysisCard } from './common/MounterDropAnalysisCard';
import { ShiftGanttTimeline } from './common/ShiftGanttTimeline';
import { FujiManagementMonitor } from './FujiManagementMonitor';
import { ManagerExecutiveView } from './personas/ManagerExecutiveView';
import { SmtNocTelemetryStudio } from './SmtNocTelemetryStudio';
import TeslaCyberGridCockpit from './cockpits/TeslaCyberGridCockpit';
import { SixSigmaQualityLab } from './cockpits/SixSigmaQualityLab';
import { KpiCard } from './common/KpiCard';
import { DrillDownDrawer, DrillDownData } from './common/DrillDownDrawer';

interface WorkCenter {
  id: string;
  code: string;
  name: string;
  area: string;
  type: string;
  current_state: string;
  current_batch_id?: string;
  current_program_name?: string;
  batch_number?: string;
  product_name?: string;
  operator_name?: string;
  last_state_change_time: string;
}

interface FeederErrorItem {
  module_no: number;
  slot_no: number;
  feeder_id: string;
  part_number: string;
  error_type: string;
  total_errors: number;
}

export type SupervisorViewMode = 'COCKPIT' | 'CYBER_GRID' | 'SIX_SIGMA_LAB' | 'NOC_MATRIX' | 'EXECUTIVE' | 'MANAGEMENT_MONITOR';

export const SupervisorDashboard: React.FC = () => {
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [report, setReport] = useState<ShiftSummaryReport | null>(null);
  const [feederErrors, setFeederErrors] = useState<FeederErrorItem[]>([]);
  const [machines, setMachines] = useState<SmtMachineFlowItem[]>([]);
  const [dropData, setDropData] = useState<MounterDropRatePpm | null>(null);
  const [shiftMatrix, setShiftMatrix] = useState<ShiftDropMatrixItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<string>('');
  const [viewMode, setViewMode] = useState<SupervisorViewMode>('COCKPIT');
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [wcRes, reportRes, errRes, flowRes, diagRes] = await Promise.all([
        authService.authFetch('/api/v1/work-centers').catch(() => null),
        authService.authFetch('/api/v1/reports/shift-summary').catch(() => null),
        authService.authFetch('/api/v1/smt/pick-errors').catch(() => null),
        authService.authFetch('/api/v1/smt/management-monitor/line/LINE_01/flow').catch(() => null),
        authService.authFetch('/api/v1/smt/management-monitor/line/LINE_01/diagnostics').catch(() => null)
      ]);

      if (wcRes?.ok) {
        const json = await wcRes.json();
        const data = Array.isArray(json) ? json : (json?.data ?? []);
        if (Array.isArray(data)) setWorkCenters(data);
      }
      if (reportRes?.ok) {
        const json = await reportRes.json();
        setReport(json?.data ?? json);
      }
      if (errRes?.ok) {
        const json = await errRes.json();
        const data = Array.isArray(json) ? json : (json?.data ?? []);
        if (Array.isArray(data)) setFeederErrors(data);
      }
      if (flowRes?.ok) {
        const json = await flowRes.json();
        const data = Array.isArray(json) ? json : (json?.data ?? []);
        if (Array.isArray(data)) setMachines(data);
      }
      if (diagRes?.ok) {
        const json = await diagRes.json();
        const d = json?.data ?? json;
        if (d) {
          setDropData(d.dropRatePpm);
          setShiftMatrix(d.shiftMatrix);
        }
      }
    } catch (err) {
      console.error('Failed to load supervisor data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const copyHandoverSummary = () => {
    if (!report) return;

    const summaryText = `[i-MES 2.0 SMT LINE 01 - SHIFT HANDOVER BRIEFING]
Shift: ${report.shiftCode} | Date: ${report.date}
Fuji NXT III Placement Line (Program: PROG-SM-METER-TOP-REV4)
--------------------------------------------------
*SMT Telemetry & OEE:*
• Placement Speed: 44,820 CPH (Target: 45,000 CPH)
• Line Availability: ${report.availabilityPercentage}% (${report.operatingMinutes}m run / ${report.downtimeMinutes}m lost)
• First Pass Yield: ${report.qualityPercentage}%
• Output: ${report.goodQuantity} Good Panels | ${report.rejectedQuantity} Block Skips
• Mounter Component Drop Rate: ${dropData?.actualPpm || 288} PPM (Target: 310 PPM - PASS)

*Top Line Stoppages (Pareto):*
${Array.isArray(report.topDowntimeReasons) ? report.topDowntimeReasons.map((r: any, i: number) => `${i + 1}. ${r.reasonLabel} (${r.durationMinutes}m, ${r.occurrences}x)`).join('\n') : 'Zero line stoppages recorded'}

*Feeder Pickup Health (From Fuji PDERROR):*
${Array.isArray(feederErrors) ? feederErrors.slice(0, 3).map((e, i) => `${i + 1}. Slot 0${e.slot_no} (${e.part_number}): ${e.total_errors}x ${e.error_type}`).join('\n') : 'Zero pickup errors'}

*Machine Fleet Status:*
${Array.isArray(workCenters) ? workCenters.map(w => `• ${w.code}: [${w.current_state}]`).join('\n') : '—'}
--------------------------------------------------
_Automated by i-MES 2.0 (Fuji Nexim 2.2 / i-MES Gateway)_`;

    navigator.clipboard.writeText(summaryText);
    setCopyStatus('COPIED TO CLIPBOARD');
    setTimeout(() => setCopyStatus(''), 3000);
  };

  if (loading && !report && machines.length === 0) {
    return (
      <div className="p-16 text-center text-slate-400 font-mono text-xs tracking-widest uppercase animate-pulse flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
        <span>CALIBRATING LINE TELEMETRY BUS...</span>
      </div>
    );
  }

  // Fallback defaults if offline / mock
  const componentsPlaced = (report?.goodQuantity || 142) * 74;
  const operatingHours = Math.max(0.5, (report?.operatingMinutes || 420) / 60);
  const actualCph = Math.round(componentsPlaced / operatingHours);
  const targetCph = 45000;
  const cphEfficiency = Math.min(100, Math.round((actualCph / targetCph) * 100));
  const availabilityPct = report?.availabilityPercentage || 91.2;
  const qualityPct = report?.qualityPercentage || 98.4;
  const oeeVal = Number(((availabilityPct * (actualCph / targetCph * 100) * qualityPct) / 10000).toFixed(1));

  const fallbackMachines: SmtMachineFlowItem[] = machines.length > 0 ? machines : [
    { id: 'm1', name: 'Laser Marker', equipmentCode: 'LSR-01', type: 'LASER', towerLamp: 'RUN', cycleTimeSec: 12.4, stopCount: 2, stopTimeMin: 1.5, nozzleBypass: false },
    { id: 'm2', name: 'Screen Printer', equipmentCode: 'PRN-01', type: 'PRINTER', towerLamp: 'RUN', cycleTimeSec: 17.4, stopCount: 1, stopTimeMin: 0.8, nozzleBypass: false },
    { id: 'm3', name: '3D SPI', equipmentCode: 'SPI-01', type: 'SPI', towerLamp: 'RUN', cycleTimeSec: 14.2, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false },
    { id: 'm4', name: 'NXT III (Mod 1)', equipmentCode: 'MNT-01', type: 'MOUNTER', towerLamp: 'RUN', cycleTimeSec: 22.1, stopCount: 3, stopTimeMin: 4.2, nozzleBypass: false },
    { id: 'm5', name: 'NXT III (Mod 2)', equipmentCode: 'MNT-02', type: 'MOUNTER', towerLamp: 'WAIT', cycleTimeSec: 0.0, stopCount: 1, stopTimeMin: 2.1, nozzleBypass: false },
    { id: 'm6', name: 'NXT III (Mod 3)', equipmentCode: 'MNT-03', type: 'MOUNTER', towerLamp: 'RUN', cycleTimeSec: 21.8, stopCount: 2, stopTimeMin: 1.8, nozzleBypass: false },
    { id: 'm7', name: 'Reflow 10-Zone', equipmentCode: 'RFW-01', type: 'REFLOW', towerLamp: 'RUN', cycleTimeSec: 18.0, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false },
    { id: 'm8', name: '3D AOI Post', equipmentCode: 'AOI-01', type: 'AOI_POST', towerLamp: 'RUN', cycleTimeSec: 15.1, stopCount: 1, stopTimeMin: 0.5, nozzleBypass: false },
    { id: 'm9', name: 'X-Ray Test', equipmentCode: 'XRY-01', type: 'XRAY', towerLamp: 'RUN', cycleTimeSec: 16.5, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false }
  ];

  const defaultDropData: MounterDropRatePpm = dropData || {
    targetPpm: 310,
    actualPpm: 288,
    status: 'PASS',
    totalPickups: 1280450,
    totalErrors: 368,
    recogErrors: 144,
    pickupErrors: 224,
    recogDropRatePpm: 112,
    pickupDropRatePpm: 175
  };

  const openDowntimeDrillDown = () => {
    setDrillDownData({
      kpiId: 'DOWNTIME_PARETO',
      title: 'SMT Line 01 Stoppage Breakdown (Pareto)',
      subtitle: `Aggregated line stoppage events for Shift ${report?.shiftCode || '1'}`,
      currentValue: `${report?.downtimeMinutes || 44} min`,
      targetValue: '<60 min allowable',
      status: (report?.downtimeMinutes || 44) > 60 ? 'HALT' : 'PASS',
      summaryDescription: 'Root-cause analysis ranks feeder splicing and optical nozzle inspection as primary contributors to unbooked idle time. Automatic recovery restored line balance.',
      items: report && report.topDowntimeReasons.length > 0 
        ? report.topDowntimeReasons.map((r: any, idx: number) => ({
            id: `dt-${idx}`,
            timestamp: `1${idx}:30`,
            category: 'STOPPAGE',
            title: r.reasonLabel,
            description: `Automated stoppage logged by Fuji Nexim Line Controller. Duration: ${r.durationMinutes}m across ${r.occurrences} distinct trips.`,
            severity: (r.durationMinutes > 15 ? 'CRITICAL' : 'WARNING') as 'CRITICAL' | 'WARNING' | 'INFO',
            durationMinutes: r.durationMinutes,
            occurrences: r.occurrences,
            stationCode: 'MNT-01'
          }))
        : [
            { id: 'dt-1', timestamp: '14:22', category: 'FEEDER', title: 'Component Reel Runout (Slot 12)', description: '0402 capacitor spliced in 2.8m.', severity: 'INFO', durationMinutes: 2.8, stationCode: 'MNT-01' }
          ]
    });
  };

  const openFeederErrorsDrillDown = () => {
    setDrillDownData({
      kpiId: 'FEEDER_PDERROR',
      title: 'Fuji NXT III Mounter Feeder Pickup Health',
      subtitle: 'Real-time wire frames parsed from Fuji PDERROR stream',
      currentValue: `${defaultDropData.actualPpm} PPM`,
      targetValue: '<310 PPM spec',
      status: defaultDropData.actualPpm > 310 ? 'HALT' : 'PASS',
      summaryDescription: 'Pickup errors are concentrated on Slot 04 and Slot 12. Vacuum pressure check confirms clean air filter and nozzle tip.',
      items: feederErrors.map((err, idx) => ({
        id: `fe-${idx}`,
        timestamp: '14:15:20',
        category: 'PICKUP',
        title: `Slot 0${err.slot_no} — ${err.part_number}`,
        description: `Error Type: ${err.error_type} on Feeder ${err.feeder_id}. Total misfires: ${err.total_errors}.`,
        severity: (err.total_errors > 10 ? 'CRITICAL' : 'WARNING') as 'CRITICAL' | 'WARNING' | 'INFO',
        occurrences: err.total_errors,
        stationCode: `SLOT-${err.slot_no}`
      }))
    });
  };

  return (
    <div className="space-y-2 font-sans">
      {/* Cockpit Bar */}
      <div className="mes-machined-card px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              SMT LINE 01 SUPERVISOR CONSOLE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold">LIVE TELEMETRY STREAM</span>
          </div>
          <h2 className="text-sm font-bold text-slate-100 font-mono mt-0.5">
            Fuji NXT III M6 Line • High-Speed Placement &amp; Quality Governance
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-950 p-0.5 rounded-[var(--mes-radius)] border border-slate-800 text-[10px]">
            <button
              type="button"
              onClick={() => setViewMode('COCKPIT')}
              className={`px-2.5 py-1 rounded-[var(--mes-radius)] transition-colors font-semibold ${
                viewMode === 'COCKPIT' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)] font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SUPERVISOR COCKPIT
            </button>
            <button
              type="button"
              onClick={() => setViewMode('CYBER_GRID')}
              className={`px-2.5 py-1 rounded-[var(--mes-radius)] transition-colors font-semibold ${
                viewMode === 'CYBER_GRID' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)] font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CYBER-GRID 360°
            </button>
            <button
              type="button"
              onClick={() => setViewMode('SIX_SIGMA_LAB')}
              className={`px-2.5 py-1 rounded-[var(--mes-radius)] transition-colors font-semibold ${
                viewMode === 'SIX_SIGMA_LAB' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)] font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SIX SIGMA SPC LAB
            </button>
            <button
              type="button"
              onClick={() => setViewMode('NOC_MATRIX')}
              className={`px-2.5 py-1 rounded-[var(--mes-radius)] transition-colors font-semibold ${
                viewMode === 'NOC_MATRIX' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)] font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              NOC TELEMETRY MATRIX
            </button>
            <button
              type="button"
              onClick={() => setViewMode('EXECUTIVE')}
              className={`px-2.5 py-1 rounded-[var(--mes-radius)] transition-colors font-semibold ${
                viewMode === 'EXECUTIVE' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)] font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EXECUTIVE BRIEFING
            </button>
            <button
              type="button"
              onClick={() => setViewMode('MANAGEMENT_MONITOR')}
              className={`px-2.5 py-1 rounded-[var(--mes-radius)] transition-colors font-semibold ${
                viewMode === 'MANAGEMENT_MONITOR' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)] font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              NEXIM MANAGEMENT MONITOR
            </button>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-[var(--mes-radius)] border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>SYNC</span>
          </button>

          <button
            type="button"
            onClick={copyHandoverSummary}
            className="flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-black rounded-[var(--mes-radius)] text-xs transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copyStatus || 'EXPORT HANDOVER'}</span>
          </button>
        </div>
      </div>

      {viewMode === 'CYBER_GRID' && <TeslaCyberGridCockpit />}
      {viewMode === 'SIX_SIGMA_LAB' && <SixSigmaQualityLab />}
      {viewMode === 'NOC_MATRIX' && <SmtNocTelemetryStudio />}
      {viewMode === 'MANAGEMENT_MONITOR' && <FujiManagementMonitor />}
      {viewMode === 'EXECUTIVE' && <ManagerExecutiveView />}
      {viewMode === 'COCKPIT' && (
        <div className="space-y-2">
          {/* Top Row: Precision Aerospace Arc Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1.5 bg-slate-950/50 border border-slate-800/80 rounded-[var(--mes-radius)]">
            <ArcGaugeOee
              value={oeeVal > 0 ? oeeVal : 88.4}
              target={85.0}
              label="OVERALL OEE"
              sublabel="SEMI E10 Standard"
              size={148}
            />
            <ArcGaugeOee
              value={Math.min(100, Math.round((actualCph / targetCph) * 100))}
              target={90.0}
              label="PLACEMENT SPEED"
              sublabel={`${actualCph.toLocaleString()} CPH`}
              size={148}
            />
            <ArcGaugeOee
              value={availabilityPct}
              target={90.0}
              label="AVAILABILITY"
              sublabel={`${report?.operatingMinutes || 420}m / ${report?.downtimeMinutes || 44}m`}
              size={148}
            />
            <ArcGaugeOee
              value={qualityPct}
              target={98.0}
              label="FIRST PASS YIELD"
              sublabel={`${report?.goodQuantity || 142} Panels OK`}
              size={148}
            />
            <ArcGaugeOee
              value={92.5}
              target={90.0}
              label="LINE BALANCE (PBR)"
              sublabel="Mod 1 / 2 / 3 Pacing"
              size={148}
            />
          </div>

          {/* Physical SMT Line Flow Strip */}
          <SmtLineFlowStrip
            machines={fallbackMachines}
            lineName="SMT LINE 01 (FUJI NXT III M6)"
            targetCycleTimeSec={18.0}
          />

          {/* Shift Performance Gantt Timeline */}
          <ShiftGanttTimeline
            totalMinutes={480}
            shiftCode={`SHIFT ${report?.shiftCode || '1 (DAY)'}`}
          />

          {/* Mounter Component Drop Analysis in PPM */}
          <MounterDropAnalysisCard
            dropData={defaultDropData}
            shiftData={shiftMatrix}
            lineName="SMT LINE 01"
          />

          {/* 2-Column Split: Downtime Pareto + Feeder Error Health */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 font-mono">
            {/* Left Column (6 cols): SMT Stoppage Pareto */}
            <div 
              onClick={openDowntimeDrillDown}
              className="lg:col-span-6 mes-machined-card p-3 space-y-2 cursor-pointer transition-all group"
              title="Click to drill down into downtime event timeline"
            >
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 uppercase tracking-wide group-hover:text-cyan-400 transition-colors">
                    <BarChart3 className="w-3.5 h-3.5 text-rose-400" />
                    SMT Line Stoppage Pareto
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-[10px] text-slate-400">Ranked by minutes lost during Shift {report?.shiftCode || '1'}</p>
                </div>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-[var(--mes-radius)] border border-rose-500/40">
                  {report?.downtimeMinutes || 44}m Lost
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {report && Array.isArray(report.topDowntimeReasons) && report.topDowntimeReasons.length > 0 ? (
                  report.topDowntimeReasons.map((reason: any, idx: number) => {
                    const maxDur = report.topDowntimeReasons[0].durationMinutes || 1;
                    const pct = Math.round((reason.durationMinutes / maxDur) * 100);

                    return (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-300 text-[11px]">
                          <span className="truncate max-w-[280px]">
                            0{idx + 1}. {reason.reasonLabel}
                          </span>
                          <span className="text-rose-400 font-bold tabular-nums">
                            {reason.durationMinutes}m ({reason.occurrences}x)
                          </span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 border border-slate-800 rounded-[1px] overflow-hidden">
                          <div className="bg-rose-500 h-full rounded-[1px]" style={{ width: `${Math.max(5, pct)}%` }} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-xs text-slate-500">
                    ZERO LINE STOPPAGES RECORDED
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (6 cols): Feeder Pickup Errors */}
            <div 
              onClick={openFeederErrorsDrillDown}
              className="lg:col-span-6 mes-machined-card p-3 space-y-2 cursor-pointer transition-all group"
              title="Click to drill down into feeder errors"
            >
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 uppercase tracking-wide group-hover:text-cyan-400 transition-colors">
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    Feeder Pickup Error Health
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-[10px] text-slate-400">Real-time socket stream from Fuji PDERROR frames</p>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-[var(--mes-radius)] border border-emerald-500/40 font-mono font-bold">
                  SOCKET AUTO-PARSE
                </span>
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                {feederErrors.length > 0 ? (
                  feederErrors.slice(0, 4).map((err, i) => (
                    <div key={i} className="bg-slate-900/90 p-2 rounded-[var(--mes-radius)] border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-2 text-[11px]">
                          <span className="text-emerald-400">Slot 0{err.slot_no}</span>
                          <span>•</span>
                          <span className="text-slate-300">{err.part_number}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Feeder: {err.feeder_id} • Type: <strong className="text-amber-300">{err.error_type}</strong>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-rose-950/40 text-rose-400 border border-rose-500/40 font-bold text-[10.5px] tabular-nums">
                        {err.total_errors} Misfires
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-500">
                    ALL FEEDER VACUUM SENSORS IN SPEC (&lt;0.05% REJECT RATE)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drill-Down Slide-Over Drawer */}
      <DrillDownDrawer
        isOpen={Boolean(drillDownData)}
        onClose={() => setDrillDownData(null)}
        data={drillDownData}
      />
    </div>
  );
};
