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
  Clock, RefreshCw, Cpu, Crosshair, Sliders, Shield, Filter, Download
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
    { shiftCode: '3 Shift (Night)', pickups: 420100, pickupErrors: 64, recogErrors: 48, totalErrors: 112, dropRatePpm: 267, recogDropRatePpm: 114, pickupDropRatePpm: 153 }
  ],
  refDesPareto: [
    { refDes: 'C104', partNumber: 'CAP-0402-100NF', defectRatePct: 0.12 },
    { refDes: 'R12', partNumber: 'RES-0805-10K', defectRatePct: 0.08 },
    { refDes: 'U02', partNumber: 'STM32F401-LQFP', defectRatePct: 0.04 }
  ]
};

const FALLBACK_FLOW: SmtMachineFlowItem[] = [
  { id: 'm1', name: 'Laser Marker', equipmentCode: 'LSR-01', type: 'LASER', towerLamp: 'RUN', cycleTimeSec: 12.4, stopCount: 2, stopTimeMin: 1.5, nozzleBypass: false },
  { id: 'm2', name: 'Screen Printer', equipmentCode: 'PRN-01', type: 'PRINTER', towerLamp: 'RUN', cycleTimeSec: 17.4, stopCount: 1, stopTimeMin: 0.8, nozzleBypass: false },
  { id: 'm3', name: '3D SPI', equipmentCode: 'SPI-01', type: 'SPI', towerLamp: 'RUN', cycleTimeSec: 14.2, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false },
  { id: 'm4', name: 'NXT III (Mod 1)', equipmentCode: 'MNT-01', type: 'MOUNTER', towerLamp: 'RUN', cycleTimeSec: 22.1, stopCount: 3, stopTimeMin: 4.2, nozzleBypass: false },
  { id: 'm5', name: 'NXT III (Mod 2)', equipmentCode: 'MNT-02', type: 'MOUNTER', towerLamp: 'RUN', cycleTimeSec: 21.4, stopCount: 1, stopTimeMin: 1.1, nozzleBypass: false },
  { id: 'm6', name: 'NXT III (Mod 3)', equipmentCode: 'MNT-03', type: 'MOUNTER', towerLamp: 'RUN', cycleTimeSec: 21.8, stopCount: 2, stopTimeMin: 1.8, nozzleBypass: false },
  { id: 'm7', name: 'Reflow 10-Zone', equipmentCode: 'RFW-01', type: 'REFLOW', towerLamp: 'RUN', cycleTimeSec: 18.0, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false },
  { id: 'm8', name: '3D AOI Post', equipmentCode: 'AOI-01', type: 'AOI_POST', towerLamp: 'RUN', cycleTimeSec: 15.1, stopCount: 1, stopTimeMin: 0.5, nozzleBypass: false },
  { id: 'm9', name: 'X-Ray Test', equipmentCode: 'XRY-01', type: 'XRAY', towerLamp: 'RUN', cycleTimeSec: 16.5, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false }
];

export const FujiManagementMonitor: React.FC = () => {
  const [fleet, setFleet] = useState<FujiManagementMonitorLineSummary[]>(FALLBACK_FLEET);
  const [selectedLineId, setSelectedLineId] = useState<string>('LINE_01');
  const [diagnostics, setDiagnostics] = useState<DiagnosticsData>(FALLBACK_DIAGNOSTICS);
  const [machineFlow, setMachineFlow] = useState<SmtMachineFlowItem[]>(FALLBACK_FLOW);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'COCKPIT' | 'FLOW_AND_DROP'>('COCKPIT');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchFleet = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await authService.authFetch('/api/v1/smt/management-monitor/fleet').catch(() => null);
      if (res && res.ok) {
        const data: FujiManagementMonitorLineSummary[] = await res.json();
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
        const d = await diagRes.json();
        if (d && d.nozzleRankings) setDiagnostics(d);
      }
      if (flowRes && flowRes.ok) {
        const f = await flowRes.json();
        if (Array.isArray(f) && f.length > 0) setMachineFlow(f);
      }
      setLastUpdated(new Date());
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

  // Compute operating state donut values dynamically from selectedLine
  const isRunning = selectedLine?.statusState === 'RUN';
  const opRunPct = isRunning ? 78.4 : 52.0;
  const opWaitPrevPct = isRunning ? 11.2 : 32.0;
  const opWaitNextPct = isRunning ? 6.4 : 9.0;
  const opStopPct = isRunning ? 4.0 : 7.0;

  // Unclipped 120x120 SVG Donut Geometry
  const donutR = 44;
  const donutCx = 60;
  const donutCy = 60;
  const donutCircumference = 2 * Math.PI * donutR;
  const runOffset = 0;
  const waitPrevOffset = (opRunPct / 100) * donutCircumference;
  const waitNextOffset = ((opRunPct + opWaitPrevPct) / 100) * donutCircumference;
  const stopOffset = ((opRunPct + opWaitPrevPct + opWaitNextPct) / 100) * donutCircumference;

  return (
    <div className="space-y-2">
      {/* Enterprise Filter & Command Bar */}
      <div 
        className="bg-slate-950 px-3.5 py-2 border border-slate-800 rounded-[var(--mes-radius)] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-100"
        style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.6)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
          <span className="font-sans font-bold text-slate-100 uppercase tracking-wider text-[12px]">
            FUJI NEXIM MANAGEMENT MONITOR (v2.2.16 SPECIFICATION)
          </span>
          <span className="text-[10.5px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 border border-slate-800 rounded-[var(--mes-radius)] font-medium">
            Active Line: <strong className="text-slate-100">{selectedLine?.lineName || 'SMD_01'}</strong>
          </span>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 p-0.5 border border-slate-800 rounded-[var(--mes-radius)] text-[10.5px] font-mono">
            <button
              type="button"
              onClick={() => setViewMode('COCKPIT')}
              className={`px-3 py-1 font-bold rounded-[var(--mes-radius)] transition-colors ${
                viewMode === 'COCKPIT' ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              TWO-PANE MONITOR
            </button>
            <button
              type="button"
              onClick={() => setViewMode('FLOW_AND_DROP')}
              className={`px-3 py-1 font-bold rounded-[var(--mes-radius)] transition-colors ${
                viewMode === 'FLOW_AND_DROP' ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LINE FLOW & DROP (PPM)
            </button>
          </div>

          <span className="text-[10.5px] font-mono text-slate-400">
            {lastUpdated.toLocaleTimeString()} {refreshing && '···'}
          </span>
        </div>
      </div>

      {/* Primary Arc Gauges Row */}
      {selectedLine && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          <ArcGaugeOee
            value={selectedLine.oee}
            target={85.0}
            label="LINE OEE"
            sublabel="SEMI E10"
            size={136}
          />
          <ArcGaugeOee
            value={selectedLine.availability}
            target={90.0}
            label="AVAILABILITY"
            sublabel="Uptime"
            size={136}
          />
          <ArcGaugeOee
            value={Math.min(100, selectedLine.performance)}
            target={88.0}
            label="PERFORMANCE"
            sublabel={`${selectedLine.performance.toFixed(0)}% Rate`}
            size={136}
          />
          <ArcGaugeOee
            value={selectedLine.quality}
            target={98.0}
            label="QUALITY RATE"
            sublabel="Yield"
            size={136}
          />
          <ArcGaugeOee
            value={selectedLine.currentPbr}
            target={selectedLine.optimizedPbr}
            label="LINE BALANCE (PBR)"
            sublabel={`Opt: ${selectedLine.optimizedPbr.toFixed(1)}%`}
            size={136}
          />
        </div>
      )}

      {/* Main Content Pane */}
      {viewMode === 'COCKPIT' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5">
          {/* Left Pane (8 cols): Fleet Overview Table (Fuji Main Window) */}
          <div 
            className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] overflow-hidden flex flex-col justify-between"
            style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.6)' }}
          >
            <div>
              {/* Header */}
              <div className="bg-slate-900/90 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-sans font-bold text-slate-100 uppercase tracking-wider text-[11.5px]">
                  FLEET PRODUCTION LINES OVERVIEW (MAIN WINDOW)
                </span>
                <span className="text-[10.5px] font-mono text-slate-400">Click row to synchronize diagnostics</span>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-[10.5px] text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="text-left px-3 py-2">Line</th>
                      <th className="text-left px-3 py-2">Recipe / Job</th>
                      <th className="text-right px-3 py-2">Progress</th>
                      <th className="text-left px-3 py-2">Micro-State Timer</th>
                      <th className="text-right px-3 py-2">PBR %</th>
                      <th className="text-right px-3 py-2">OEE %</th>
                      <th className="text-right px-3 py-2">3D SPI</th>
                      <th className="text-right px-3 py-2">Post AOI</th>
                      <th className="text-left px-3 py-2">Est. End</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {fleet.map((line) => {
                      const isSelected = line.lineId === selectedLineId;
                      const progressPct = line.progressTarget > 0 
                        ? Math.min(100, Math.round((line.progressCompleted / line.progressTarget) * 100))
                        : 0;

                      let stateBadge = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/50';
                      if (line.statusState === 'WAIT_PREV') stateBadge = 'text-amber-400 bg-amber-950/60 border-amber-500/50';
                      if (line.statusState === 'WAIT_NEXT') stateBadge = 'text-orange-400 bg-orange-950/60 border-orange-500/50';
                      if (line.statusState === 'STOP') stateBadge = 'text-rose-400 bg-rose-950/60 border-rose-500/50';

                      return (
                        <tr
                          key={line.lineId}
                          onClick={() => setSelectedLineId(line.lineId)}
                          className={`cursor-pointer transition-colors hover:bg-slate-900/80 ${
                            isSelected ? 'bg-slate-900 font-semibold border-l-2 border-l-cyan-400' : ''
                          }`}
                        >
                          <td className="px-3 py-2 font-sans font-bold text-slate-100">{line.lineName}</td>
                          <td className="px-3 py-2 truncate max-w-[150px]">
                            <div className="font-bold text-slate-200">{line.productName}</div>
                            <div className="text-[10px] text-slate-400 truncate">{line.jobName}</div>
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            <div className="text-slate-200">{line.progressCompleted} / {line.progressTarget}</div>
                            <div className="w-16 h-1 bg-slate-900 ml-auto mt-1 rounded-[1px] overflow-hidden border border-slate-800">
                              <div className="h-full bg-cyan-400" style={{ width: `${progressPct}%` }} />
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-[2px] border uppercase ${stateBadge}`}>
                              {line.statusLabel} {formatDuration(line.statusDurationSeconds)}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            <span className="font-bold text-slate-100">{line.currentPbr.toFixed(1)}%</span>
                            <span className="text-[10px] text-slate-400 block font-normal">Opt: {line.optimizedPbr.toFixed(1)}%</span>
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-emerald-400 tabular-nums">
                            {line.oee.toFixed(1)}%
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-slate-300">{line.spiYieldPct.toFixed(1)}%</td>
                          <td className="px-3 py-2 text-right tabular-nums text-slate-300">{line.secondAoiYieldPct.toFixed(1)}%</td>
                          <td className="px-3 py-2 text-slate-400 text-[10.5px]">{line.estimatedEndTime}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shift Performance Timeline */}
            <div className="p-2 border-t border-slate-800/80">
              <ShiftGanttTimeline />
            </div>
          </div>

          {/* Right Pane (4 cols): Root-Cause Sub Window */}
          <div 
            className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-3 space-y-3"
            style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.6)' }}
          >
            <div className="bg-slate-900/90 px-3 py-2 border border-slate-800 rounded-[var(--mes-radius)] flex items-center justify-between text-xs">
              <span className="font-sans font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                {selectedLine?.lineName || 'LINE 01'} · DIAGNOSTICS
              </span>
              <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/40 bg-cyan-950/40 px-1.5 py-0.5 rounded-[2px] font-bold">
                LIVE BUS
              </span>
            </div>

            {/* Operating State Breakdown Donut */}
            <div className="bg-slate-900/80 p-3 border border-slate-800 rounded-[var(--mes-radius)] flex items-center justify-between gap-3.5">
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg width="112" height="112" viewBox="0 0 120 120" className="-rotate-90">
                  <circle cx={donutCx} cy={donutCy} r={donutR} fill="none" stroke="#1e293b" strokeWidth="10" />
                  <circle
                    cx={donutCx} cy={donutCy} r={donutR} fill="none" stroke="#10B981" strokeWidth="10"
                    strokeDasharray={`${(opRunPct / 100) * donutCircumference} ${donutCircumference}`}
                    strokeDashoffset={-runOffset}
                  />
                  <circle
                    cx={donutCx} cy={donutCy} r={donutR} fill="none" stroke="#F59E0B" strokeWidth="10"
                    strokeDasharray={`${(opWaitPrevPct / 100) * donutCircumference} ${donutCircumference}`}
                    strokeDashoffset={-waitPrevOffset}
                  />
                  <circle
                    cx={donutCx} cy={donutCy} r={donutR} fill="none" stroke="#F97316" strokeWidth="10"
                    strokeDasharray={`${(opWaitNextPct / 100) * donutCircumference} ${donutCircumference}`}
                    strokeDashoffset={-waitNextOffset}
                  />
                  <circle
                    cx={donutCx} cy={donutCy} r={donutR} fill="none" stroke="#EF4444" strokeWidth="10"
                    strokeDasharray={`${(opStopPct / 100) * donutCircumference} ${donutCircumference}`}
                    strokeDashoffset={-stopOffset}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-black text-white tabular-nums tracking-tight">{opRunPct}%</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">RUN TIME</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 text-[10.5px] flex-1 font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_4px_#10B981]" />
                    Run (Placement)
                  </span>
                  <span className="font-bold tabular-nums text-emerald-400">{opRunPct}%</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block shadow-[0_0_4px_#F59E0B]" />
                    Wait Upstream (Starved)
                  </span>
                  <span className="font-bold tabular-nums text-amber-400">{opWaitPrevPct}%</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block shadow-[0_0_4px_#F97316]" />
                    Wait Downstream (Blocked)
                  </span>
                  <span className="font-bold tabular-nums text-orange-400">{opWaitNextPct}%</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shadow-[0_0_4px_#EF4444]" />
                    Stop / Feeder Alarm
                  </span>
                  <span className="font-bold tabular-nums text-rose-400">{opStopPct}%</span>
                </div>
              </div>
            </div>

            {/* Nozzle Error Ranking Table */}
            <div>
              <div className="flex items-center justify-between text-[10.5px] text-slate-300 mb-1 font-sans">
                <span className="font-bold uppercase tracking-wide">NOZZLE ERROR RANKING (PDERROR)</span>
                <span className="text-slate-400 text-[10px] font-mono">Top Mispicks</span>
              </div>
              <table className="w-full text-xs font-mono border border-slate-800 rounded-[var(--mes-radius)] overflow-hidden">
                <thead>
                  <tr className="bg-slate-900 text-[10px] text-slate-400 uppercase font-semibold">
                    <th className="text-left px-2 py-1.5">Nozzle Address</th>
                    <th className="text-right px-2 py-1.5">Errors</th>
                    <th className="text-right px-2 py-1.5">Rate %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {(diagnostics?.nozzleRankings || []).slice(0, 3).map((n) => (
                    <tr key={n.nozzleAddress} className="hover:bg-slate-800/40">
                      <td className="px-2 py-1.5 font-bold text-slate-200">{n.nozzleAddress}</td>
                      <td className="px-2 py-1.5 text-right text-rose-400 font-bold tabular-nums">{n.mispickCount}x</td>
                      <td className="px-2 py-1.5 text-right text-slate-300 tabular-nums">{n.errorRatePct.toFixed(3)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Feeder Slot Error Ranking */}
            <div>
              <div className="flex items-center justify-between text-[10.5px] text-slate-300 mb-1 font-sans">
                <span className="font-bold uppercase tracking-wide">SLOT ERROR RANKING (LOADCOMPIV)</span>
                <span className="text-slate-400 text-[10px] font-mono">Slot Misfires</span>
              </div>
              <table className="w-full text-xs font-mono border border-slate-800 rounded-[var(--mes-radius)] overflow-hidden">
                <thead>
                  <tr className="bg-slate-900 text-[10px] text-slate-400 uppercase font-semibold">
                    <th className="text-left px-2 py-1.5">Slot</th>
                    <th className="text-left px-2 py-1.5">Part Number</th>
                    <th className="text-right px-2 py-1.5">Errors</th>
                    <th className="text-right px-2 py-1.5">Rate %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {(diagnostics?.slotRankings || []).slice(0, 3).map((s) => (
                    <tr key={s.slotAddress} className="hover:bg-slate-800/40">
                      <td className="px-2 py-1.5 font-bold text-slate-200">{s.slotAddress}</td>
                      <td className="px-2 py-1.5 text-slate-400 truncate max-w-[90px]">{s.partNumber}</td>
                      <td className="px-2 py-1.5 text-right text-amber-400 font-bold tabular-nums">{s.mispickCount}x</td>
                      <td className="px-2 py-1.5 text-right text-slate-300 tabular-nums">{s.errorRatePct.toFixed(3)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PCB Reference Designator Defect Pareto */}
            <div>
              <div className="flex items-center justify-between text-[10.5px] text-slate-300 mb-1 font-sans">
                <span className="font-bold uppercase tracking-wide">REF-DES DEFECT PARETO (BOMLIST)</span>
                <span className="text-slate-400 text-[10px] font-mono">SPI + AOI</span>
              </div>
              <div className="space-y-2 bg-slate-900/80 p-2.5 border border-slate-800 rounded-[var(--mes-radius)] text-[11px] font-mono">
                {(diagnostics?.refDesPareto || []).slice(0, 3).map((b) => (
                  <div key={b.refDes} className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-bold text-slate-100">{b.refDes} <span className="text-slate-400 font-normal">({b.partNumber})</span></span>
                      <span className="text-amber-400 font-bold">{b.defectRatePct}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-[1px] overflow-hidden border border-slate-800">
                      <div className="bg-cyan-400 h-full" style={{ width: `${Math.min(100, b.defectRatePct * 16)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
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
