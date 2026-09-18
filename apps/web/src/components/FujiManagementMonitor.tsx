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
    statusLabel: 'Wait Splicing',
    statusDurationSeconds: 168,
    oee: 82.1,
    availability: 88.5,
    performance: 95.0,
    quality: 97.8,
    spiYieldPct: 97.5,
    firstAoiYieldPct: 96.8,
    secondAoiYieldPct: 97.2,
    estimatedEndTime: '19:15',
    deadline: '19:00',
    deadlineAlert: true
  }
];

const FALLBACK_DIAGNOSTICS: DiagnosticsData = {
  nozzleRankings: [
    { nozzleAddress: 'NXT-M1-H04', machineId: 'MNT-01', headId: 'H12-S', errorRatePct: 0.042, mispickCount: 14 },
    { nozzleAddress: 'NXT-M2-H08', machineId: 'MNT-02', headId: 'H12-S', errorRatePct: 0.028, mispickCount: 8 },
    { nozzleAddress: 'NXT-M1-H11', machineId: 'MNT-01', headId: 'H12-S', errorRatePct: 0.015, mispickCount: 4 }
  ],
  slotRankings: [
    { slotAddress: 'Slot 04 (L1)', feederId: 'W08-0402-991', partNumber: 'CAP-0402-100NF', errorRatePct: 0.058, mispickCount: 18 },
    { slotAddress: 'Slot 12 (L1)', feederId: 'W12-0805-442', partNumber: 'RES-0805-10K', errorRatePct: 0.034, mispickCount: 11 },
    { slotAddress: 'Slot 27 (R2)', feederId: 'W08-0201-884', partNumber: 'RES-0201-0R', errorRatePct: 0.021, mispickCount: 6 }
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
    pickupDropRatePpm: 176
  },
  shiftMatrix: [
    { shiftCode: '1 Shift (Day)', pickups: 1280450, pickupErrors: 224, recogErrors: 144, totalErrors: 368, dropRatePpm: 288, recogDropRatePpm: 112, pickupDropRatePpm: 176 },
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

  // Unclipped 100x100 SVG Donut Geometry
  const donutR = 36;
  const donutCx = 50;
  const donutCy = 50;
  const donutCircumference = 2 * Math.PI * donutR;
  const runOffset = 0;
  const waitPrevOffset = (opRunPct / 100) * donutCircumference;
  const waitNextOffset = ((opRunPct + opWaitPrevPct) / 100) * donutCircumference;
  const stopOffset = ((opRunPct + opWaitPrevPct + opWaitNextPct) / 100) * donutCircumference;

  return (
    <div className="space-y-2 font-mono">
      {/* Enterprise Filter & Command Bar */}
      <div 
        className="bg-[var(--mes-bg-surface)] px-3 py-2 border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] flex flex-wrap items-center justify-between gap-3 text-xs"
        style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[var(--mes-status-pass)] animate-pulse" />
          <span className="font-bold text-[var(--mes-text-primary)] uppercase tracking-wider text-[11px]">
            FUJI NEXIM MANAGEMENT MONITOR (v2.2.16 SPECIFICATION)
          </span>
          <span className="text-[10px] text-[var(--mes-text-muted)] bg-[var(--mes-bg-well)] px-2 py-0.5 border border-[var(--mes-border-hairline)] rounded-[var(--mes-radius)]">
            Active Line: <strong className="text-[var(--mes-text-primary)]">{selectedLine?.lineName || 'SMD_01'}</strong>
          </span>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[var(--mes-bg-well)] p-0.5 border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] text-[10px]">
            <button
              type="button"
              onClick={() => setViewMode('COCKPIT')}
              className={`px-2.5 py-1 font-bold rounded-[var(--mes-radius)] transition-colors ${
                viewMode === 'COCKPIT' ? 'bg-[var(--mes-accent-muted)] text-[var(--mes-accent-primary)]' : 'text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]'
              }`}
            >
              TWO-PANE MONITOR
            </button>
            <button
              type="button"
              onClick={() => setViewMode('FLOW_AND_DROP')}
              className={`px-2.5 py-1 font-bold rounded-[var(--mes-radius)] transition-colors ${
                viewMode === 'FLOW_AND_DROP' ? 'bg-[var(--mes-accent-muted)] text-[var(--mes-accent-primary)]' : 'text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]'
              }`}
            >
              LINE FLOW & DROP (PPM)
            </button>
          </div>

          <span className="text-[10px] text-[var(--mes-text-dim)]">
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
            className="lg:col-span-8 bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] overflow-hidden flex flex-col justify-between"
            style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
          >
            <div>
              {/* Header */}
              <div className="bg-[var(--mes-bg-header)] px-3 py-2 border-b border-[var(--mes-border-subtle)] flex items-center justify-between text-xs">
                <span className="font-bold text-[var(--mes-text-primary)] uppercase tracking-wider text-[11px]">
                  FLEET PRODUCTION LINES OVERVIEW (MAIN WINDOW)
                </span>
                <span className="text-[10px] text-[var(--mes-text-muted)]">Click row to synchronize diagnostics</span>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="mes-table w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--mes-border-hairline)] bg-[var(--mes-bg-well)] text-[10px] text-[var(--mes-text-muted)] uppercase tracking-wider">
                      <th className="text-left p-2">Line</th>
                      <th className="text-left p-2">Recipe / Job</th>
                      <th className="text-right p-2">Progress</th>
                      <th className="text-left p-2">Micro-State Timer</th>
                      <th className="text-right p-2">PBR %</th>
                      <th className="text-right p-2">OEE %</th>
                      <th className="text-right p-2">3D SPI</th>
                      <th className="text-right p-2">Post AOI</th>
                      <th className="text-left p-2">Est. End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fleet.map((line) => {
                      const isSelected = line.lineId === selectedLineId;
                      const progressPct = line.progressTarget > 0 
                        ? Math.min(100, Math.round((line.progressCompleted / line.progressTarget) * 100))
                        : 0;

                      let stateBadge = 'text-[var(--mes-status-pass)] bg-[var(--mes-status-pass-muted)] border-[var(--mes-status-pass)]';
                      if (line.statusState === 'WAIT_PREV') stateBadge = 'text-[var(--mes-status-warn)] bg-[var(--mes-status-warn-muted)] border-[var(--mes-status-warn)]';
                      if (line.statusState === 'WAIT_NEXT') stateBadge = 'text-orange-400 bg-orange-950/40 border-orange-500/40';
                      if (line.statusState === 'STOP') stateBadge = 'text-[var(--mes-status-halt)] bg-[var(--mes-status-halt-muted)] border-[var(--mes-status-halt)]';

                      return (
                        <tr
                          key={line.lineId}
                          onClick={() => setSelectedLineId(line.lineId)}
                          className={`cursor-pointer transition-colors border-b border-[var(--mes-border-hairline)] hover:bg-[var(--mes-bg-well)] ${
                            isSelected ? 'bg-[var(--mes-accent-muted)] font-semibold border-l-2 border-l-[var(--mes-accent-primary)]' : ''
                          }`}
                        >
                          <td className="p-2 font-bold text-[var(--mes-text-primary)]">{line.lineName}</td>
                          <td className="p-2 truncate max-w-[130px] text-[var(--mes-text-secondary)]">
                            <div className="font-bold">{line.productName}</div>
                            <div className="text-[8.5px] text-[var(--mes-text-dim)] truncate">{line.jobName}</div>
                          </td>
                          <td className="p-2 text-right tabular-nums">
                            <div>{line.progressCompleted} / {line.progressTarget}</div>
                            <div className="w-14 h-1 bg-[var(--mes-bg-well)] ml-auto mt-0.5 rounded-[1px] overflow-hidden">
                              <div className="h-full bg-[var(--mes-accent-primary)]" style={{ width: `${progressPct}%` }} />
                            </div>
                          </td>
                          <td className="p-2">
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-[var(--mes-radius)] border uppercase ${stateBadge}`}>
                              {line.statusLabel} {formatDuration(line.statusDurationSeconds)}
                            </span>
                          </td>
                          <td className="p-2 text-right tabular-nums">
                            <span className="font-bold text-[var(--mes-text-primary)]">{line.currentPbr.toFixed(1)}%</span>
                            <span className="text-[8.5px] text-[var(--mes-text-dim)] block">Opt: {line.optimizedPbr.toFixed(1)}%</span>
                          </td>
                          <td className="p-2 text-right font-bold text-[var(--mes-status-pass)] tabular-nums">
                            {line.oee.toFixed(1)}%
                          </td>
                          <td className="p-2 text-right tabular-nums text-[var(--mes-text-secondary)]">{line.spiYieldPct.toFixed(1)}%</td>
                          <td className="p-2 text-right tabular-nums text-[var(--mes-text-secondary)]">{line.secondAoiYieldPct.toFixed(1)}%</td>
                          <td className="p-2 text-[var(--mes-text-muted)] text-[10px]">{line.estimatedEndTime}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shift Performance Timeline */}
            <div className="p-2 border-t border-[var(--mes-border-subtle)]">
              <ShiftGanttTimeline />
            </div>
          </div>

          {/* Right Pane (4 cols): Root-Cause Sub Window */}
          <div 
            className="lg:col-span-4 bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-3 space-y-3"
            style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
          >
            <div className="bg-[var(--mes-bg-header)] px-2.5 py-1.5 border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--mes-text-primary)] uppercase tracking-wider flex items-center gap-1.5 text-[10.5px]">
                <Crosshair className="w-3.5 h-3.5 text-[var(--mes-accent-primary)]" />
                {selectedLine?.lineName || 'LINE 01'} · DIAGNOSTICS (SUB WINDOW)
              </span>
              <span className="text-[9px] text-[var(--mes-accent-primary)] border border-[var(--mes-accent-ring)] px-1 rounded-[1px] font-bold">
                LIVE
              </span>
            </div>

            {/* Operating State Breakdown Donut */}
            <div className="bg-[var(--mes-bg-well)] p-2.5 border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] flex items-center justify-between gap-3">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg width="80" height="80" viewBox="0 0 100 100" className="-rotate-90">
                  <circle cx={donutCx} cy={donutCy} r={donutR} fill="none" stroke="var(--mes-border-subtle)" strokeWidth="8" />
                  <circle
                    cx={donutCx} cy={donutCy} r={donutR} fill="none" stroke="var(--mes-status-pass)" strokeWidth="8"
                    strokeDasharray={`${(opRunPct / 100) * donutCircumference} ${donutCircumference}`}
                    strokeDashoffset={-runOffset}
                  />
                  <circle
                    cx={donutCx} cy={donutCy} r={donutR} fill="none" stroke="var(--mes-status-warn)" strokeWidth="8"
                    strokeDasharray={`${(opWaitPrevPct / 100) * donutCircumference} ${donutCircumference}`}
                    strokeDashoffset={-waitPrevOffset}
                  />
                  <circle
                    cx={donutCx} cy={donutCy} r={donutR} fill="none" stroke="#EA580C" strokeWidth="8"
                    strokeDasharray={`${(opWaitNextPct / 100) * donutCircumference} ${donutCircumference}`}
                    strokeDashoffset={-waitNextOffset}
                  />
                  <circle
                    cx={donutCx} cy={donutCy} r={donutR} fill="none" stroke="var(--mes-status-halt)" strokeWidth="8"
                    strokeDasharray={`${(opStopPct / 100) * donutCircumference} ${donutCircumference}`}
                    strokeDashoffset={-stopOffset}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-[var(--mes-text-primary)] tabular-nums">{opRunPct}%</span>
                  <span className="text-[7.5px] text-[var(--mes-text-muted)] uppercase">RUN TIME</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1 text-[9.5px] flex-1 font-mono">
                <div className="flex items-center justify-between text-[var(--mes-text-secondary)]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--mes-status-pass)] inline-block" />
                    Run (Placement)
                  </span>
                  <span className="font-bold tabular-nums text-[var(--mes-text-primary)]">{opRunPct}%</span>
                </div>
                <div className="flex items-center justify-between text-[var(--mes-text-secondary)]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--mes-status-warn)] inline-block" />
                    Wait Upstream (Starved)
                  </span>
                  <span className="font-bold tabular-nums text-[var(--mes-text-primary)]">{opWaitPrevPct}%</span>
                </div>
                <div className="flex items-center justify-between text-[var(--mes-text-secondary)]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
                    Wait Downstream (Blocked)
                  </span>
                  <span className="font-bold tabular-nums text-[var(--mes-text-primary)]">{opWaitNextPct}%</span>
                </div>
                <div className="flex items-center justify-between text-[var(--mes-text-secondary)]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--mes-status-halt)] inline-block" />
                    Stop / Feeder Alarm
                  </span>
                  <span className="font-bold tabular-nums text-[var(--mes-text-primary)]">{opStopPct}%</span>
                </div>
              </div>
            </div>

            {/* Nozzle Error Ranking Table */}
            <div>
              <div className="flex items-center justify-between text-[9.5px] text-[var(--mes-text-secondary)] mb-1">
                <span className="font-bold uppercase tracking-wide">NOZZLE ERROR RANKING (PDERROR)</span>
                <span className="text-[var(--mes-text-dim)] text-[8.5px]">Top Mispicks</span>
              </div>
              <table className="w-full text-xs font-mono border border-[var(--mes-border-hairline)] rounded-[var(--mes-radius)] overflow-hidden">
                <thead>
                  <tr className="bg-[var(--mes-bg-well)] text-[9px] text-[var(--mes-text-muted)] uppercase">
                    <th className="text-left p-1.5">Nozzle Address</th>
                    <th className="text-right p-1.5">Errors</th>
                    <th className="text-right p-1.5">Rate %</th>
                  </tr>
                </thead>
                <tbody>
                  {(diagnostics?.nozzleRankings || []).slice(0, 3).map((n) => (
                    <tr key={n.nozzleAddress} className="border-t border-[var(--mes-border-hairline)]">
                      <td className="p-1.5 font-bold text-[var(--mes-text-primary)]">{n.nozzleAddress}</td>
                      <td className="p-1.5 text-right text-[var(--mes-status-halt)] font-bold tabular-nums">{n.mispickCount}x</td>
                      <td className="p-1.5 text-right text-[var(--mes-text-secondary)] tabular-nums">{n.errorRatePct.toFixed(3)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Feeder Slot Error Ranking */}
            <div>
              <div className="flex items-center justify-between text-[9.5px] text-[var(--mes-text-secondary)] mb-1">
                <span className="font-bold uppercase tracking-wide">SLOT ERROR RANKING (LOADCOMPIV)</span>
                <span className="text-[var(--mes-text-dim)] text-[8.5px]">Slot Misfires</span>
              </div>
              <table className="w-full text-xs font-mono border border-[var(--mes-border-hairline)] rounded-[var(--mes-radius)] overflow-hidden">
                <thead>
                  <tr className="bg-[var(--mes-bg-well)] text-[9px] text-[var(--mes-text-muted)] uppercase">
                    <th className="text-left p-1.5">Slot</th>
                    <th className="text-left p-1.5">Part Number</th>
                    <th className="text-right p-1.5">Errors</th>
                    <th className="text-right p-1.5">Rate %</th>
                  </tr>
                </thead>
                <tbody>
                  {(diagnostics?.slotRankings || []).slice(0, 3).map((s) => (
                    <tr key={s.slotAddress} className="border-t border-[var(--mes-border-hairline)]">
                      <td className="p-1.5 font-bold text-[var(--mes-text-primary)]">{s.slotAddress}</td>
                      <td className="p-1.5 text-[var(--mes-text-muted)] truncate max-w-[80px]">{s.partNumber}</td>
                      <td className="p-1.5 text-right text-[var(--mes-status-warn)] font-bold tabular-nums">{s.mispickCount}x</td>
                      <td className="p-1.5 text-right text-[var(--mes-text-secondary)] tabular-nums">{s.errorRatePct.toFixed(3)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PCB Reference Designator Defect Pareto */}
            <div>
              <div className="flex items-center justify-between text-[9.5px] text-[var(--mes-text-secondary)] mb-1">
                <span className="font-bold uppercase tracking-wide">REF-DES DEFECT PARETO (BOMLIST)</span>
                <span className="text-[var(--mes-text-dim)] text-[8.5px]">SPI + AOI</span>
              </div>
              <div className="space-y-1.5 bg-[var(--mes-bg-well)] p-2 border border-[var(--mes-border-hairline)] rounded-[var(--mes-radius)] text-[9.5px]">
                {(diagnostics?.refDesPareto || []).slice(0, 3).map((b) => (
                  <div key={b.refDes} className="space-y-0.5">
                    <div className="flex justify-between text-[var(--mes-text-secondary)]">
                      <span className="font-bold text-[var(--mes-text-primary)]">{b.refDes} <span className="text-[var(--mes-text-dim)] font-normal">({b.partNumber})</span></span>
                      <span className="text-[var(--mes-status-warn)] font-bold">{b.defectRatePct}%</span>
                    </div>
                    <div className="w-full bg-[var(--mes-bg-surface)] h-1 rounded-[1px] overflow-hidden">
                      <div className="bg-[var(--mes-accent-primary)] h-full" style={{ width: `${Math.min(100, b.defectRatePct * 16)}%` }} />
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
