import React, { useState, useEffect } from 'react';
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

export const FujiManagementMonitor: React.FC = () => {
  const [fleet, setFleet] = useState<FujiManagementMonitorLineSummary[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string>('LINE_01');
  const [diagnostics, setDiagnostics] = useState<DiagnosticsData | null>(null);
  const [machineFlow, setMachineFlow] = useState<SmtMachineFlowItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'COCKPIT' | 'FLOW_AND_DROP'>('COCKPIT');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchFleet = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/v1/smt/management-monitor/fleet');
      if (res.ok) {
        const data: FujiManagementMonitorLineSummary[] = await res.json();
        setFleet(data);
        if (data.length > 0 && !data.some(d => d.lineId === selectedLineId)) {
          setSelectedLineId(data[0].lineId);
        }
      }
    } catch (err) {
      console.error('Failed to fetch Management Monitor fleet data', err);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchLineDetails = async (lineId: string) => {
    try {
      const [diagRes, flowRes] = await Promise.all([
        fetch(`/api/v1/smt/management-monitor/line/${encodeURIComponent(lineId)}/diagnostics`),
        fetch(`/api/v1/smt/management-monitor/line/${encodeURIComponent(lineId)}/flow`)
      ]);

      if (diagRes.ok) setDiagnostics(await diagRes.json());
      if (flowRes.ok) setMachineFlow(await flowRes.json());
      setLastUpdated(new Date());
    } catch (err) {
      console.error(`Failed to fetch diagnostics for ${lineId}`, err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchFleet();
      await fetchLineDetails(selectedLineId);
      setLoading(false);
    };
    init();

    const interval = setInterval(() => {
      fetchFleet();
      fetchLineDetails(selectedLineId);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedLineId]);

  const selectedLine = fleet.find(f => f.lineId === selectedLineId) || fleet[0];

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading && fleet.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-xs tracking-widest uppercase animate-pulse flex flex-col items-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
        <span>CONNECTING TO FUJI NEXIM MANAGEMENT MONITOR SUITE...</span>
      </div>
    );
  }

  // Donut calculations
  const opRunPct = 68.5;
  const opWaitPrevPct = 14.2;
  const opWaitNextPct = 8.1;
  const opStopPct = 5.2;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const runOffset = 0;
  const waitPrevOffset = (opRunPct / 100) * circumference;
  const waitNextOffset = ((opRunPct + opWaitPrevPct) / 100) * circumference;
  const stopOffset = ((opRunPct + opWaitPrevPct + opWaitNextPct) / 100) * circumference;

  return (
    <div className="space-y-2 font-mono">
      {/* Enterprise Filter & Command Bar */}
      <div className="bg-[#141C2C] px-3 py-1.5 border border-[#222F46] rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider">
            FUJI NEXIM MANAGEMENT MONITOR (v2.2.16 SPECIFICATION)
          </span>
          <span className="text-[10px] text-slate-400 bg-[#0B0F18] px-2 py-0.5 border border-[#1C273A]">
            Active Line: <b className="text-white">{selectedLine?.lineName || 'SMD_01'}</b>
          </span>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#0B0F18] p-0.5 border border-[#222F46] rounded-sm text-[10px]">
            <button
              type="button"
              onClick={() => setViewMode('COCKPIT')}
              className={`px-2.5 py-1 font-bold rounded-sm transition-colors ${
                viewMode === 'COCKPIT' ? 'bg-[#1E2E4A] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              TWO-PANE MONITOR
            </button>
            <button
              type="button"
              onClick={() => setViewMode('FLOW_AND_DROP')}
              className={`px-2.5 py-1 font-bold rounded-sm transition-colors ${
                viewMode === 'FLOW_AND_DROP' ? 'bg-[#1E2E4A] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              LINE FLOW & DROP (PPM)
            </button>
          </div>

          <span className="text-[10px] text-slate-400">
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
            size={124}
            strokeWidth={7}
          />
          <ArcGaugeOee
            value={selectedLine.availability}
            target={90.0}
            label="AVAILABILITY"
            sublabel="Uptime"
            size={124}
            strokeWidth={7}
          />
          <ArcGaugeOee
            value={Math.min(100, selectedLine.performance / 2.5)}
            target={88.0}
            label="PERFORMANCE"
            sublabel={`${selectedLine.performance.toFixed(0)}% Rate`}
            size={124}
            strokeWidth={7}
          />
          <ArcGaugeOee
            value={selectedLine.quality}
            target={99.0}
            label="QUALITY RATE"
            sublabel="Yield"
            size={124}
            strokeWidth={7}
          />
          <ArcGaugeOee
            value={selectedLine.currentPbr}
            target={selectedLine.optimizedPbr}
            label="LINE BALANCE (PBR)"
            sublabel={`Opt: ${selectedLine.optimizedPbr.toFixed(1)}%`}
            size={124}
            strokeWidth={7}
          />
        </div>
      )}

      {/* Main Content Pane */}
      {viewMode === 'COCKPIT' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5">
          {/* Left Pane (8 cols): Fleet Overview Table (Fuji Main Window) */}
          <div className="lg:col-span-8 bg-[#0E1422] border border-[#222F46] rounded-sm overflow-hidden flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="bg-[#141C2C] px-3 py-1.5 border-b border-[#222F46] flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase tracking-wider">
                  FLEET PRODUCTION LINES OVERVIEW (MAIN WINDOW)
                </span>
                <span className="text-[10px] text-slate-400">Click line row to synchronize diagnostic sub-window</span>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="mes-table">
                  <thead>
                    <tr>
                      <th className="text-left">Line</th>
                      <th className="text-left">Recipe / Job</th>
                      <th className="text-right">Progress</th>
                      <th className="text-left">Micro-State Timer</th>
                      <th className="text-right">PBR %</th>
                      <th className="text-right">OEE %</th>
                      <th className="text-right">3D SPI</th>
                      <th className="text-right">Post AOI</th>
                      <th className="text-left">Est. End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fleet.map((line) => {
                      const isSelected = line.lineId === selectedLineId;
                      const progressPct = line.progressTarget > 0 
                        ? Math.min(100, Math.round((line.progressCompleted / line.progressTarget) * 100))
                        : 0;

                      let stateClass = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
                      if (line.statusState === 'WAIT_PREV') stateClass = 'text-amber-400 bg-amber-950/40 border-amber-500/40';
                      if (line.statusState === 'WAIT_NEXT') stateClass = 'text-orange-400 bg-orange-950/40 border-orange-500/40';
                      if (line.statusState === 'STOP') stateClass = 'text-rose-400 bg-rose-950/40 border-rose-500/40';

                      return (
                        <tr
                          key={line.lineId}
                          onClick={() => setSelectedLineId(line.lineId)}
                          className={`cursor-pointer ${
                            isSelected ? 'bg-[#1A2538] font-semibold border-l-2 border-l-blue-400' : ''
                          }`}
                        >
                          <td className="font-bold text-white">{line.lineName}</td>
                          <td className="truncate max-w-[130px] text-slate-300">
                            <div>{line.productName}</div>
                            <div className="text-[8.5px] text-slate-500 truncate">{line.jobName}</div>
                          </td>
                          <td className="text-right tabular-nums">
                            <div>{line.progressCompleted} / {line.progressTarget}</div>
                            <div className="w-14 h-1 bg-[#162032] ml-auto mt-0.5">
                              <div className="h-full bg-blue-500" style={{ width: `${progressPct}%` }} />
                            </div>
                          </td>
                          <td>
                            <span className={`px-1 py-0.2 text-[8.5px] font-bold rounded-sm border uppercase ${stateClass}`}>
                              {line.statusLabel} {formatDuration(line.statusDurationSeconds)}
                            </span>
                          </td>
                          <td className="text-right tabular-nums">
                            <span className="font-bold text-slate-200">{line.currentPbr.toFixed(1)}%</span>
                            <span className="text-[8.5px] text-slate-500 block">Opt: {line.optimizedPbr.toFixed(1)}%</span>
                          </td>
                          <td className="text-right font-bold text-emerald-400 tabular-nums">
                            {line.oee.toFixed(1)}%
                          </td>
                          <td className="text-right tabular-nums text-slate-300">{line.spiYieldPct.toFixed(1)}%</td>
                          <td className="text-right tabular-nums text-slate-300">{line.secondAoiYieldPct.toFixed(1)}%</td>
                          <td className="text-slate-400 text-[10px]">{line.estimatedEndTime}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shift Performance Timeline */}
            <div className="p-1 border-t border-[#222F46]">
              <ShiftGanttTimeline />
            </div>
          </div>

          {/* Right Pane (4 cols): Root-Cause Sub Window */}
          <div className="lg:col-span-4 bg-[#0E1422] border border-[#222F46] rounded-sm p-2 space-y-2">
            <div className="bg-[#141C2C] px-2.5 py-1 border-b border-[#222F46] flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                {selectedLine?.lineName || 'LINE 01'} · DIAGNOSTICS (SUB WINDOW)
              </span>
              <span className="text-[9px] text-blue-400 border border-blue-500/30 px-1">LIVE</span>
            </div>

            {/* Operating State Breakdown Donut */}
            <div className="bg-[#0B101C] p-2 border border-[#1C273A] rounded-sm flex items-center justify-between gap-2">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                  <circle cx="40" cy="40" r={radius} fill="none" stroke="#162032" strokeWidth="9" />
                  <circle
                    cx="40" cy="40" r={radius} fill="none" stroke="#10B981" strokeWidth="9"
                    strokeDasharray={`${(opRunPct / 100) * circumference} ${circumference}`}
                    strokeDashoffset={-runOffset}
                  />
                  <circle
                    cx="40" cy="40" r={radius} fill="none" stroke="#F59E0B" strokeWidth="9"
                    strokeDasharray={`${(opWaitPrevPct / 100) * circumference} ${circumference}`}
                    strokeDashoffset={-waitPrevOffset}
                  />
                  <circle
                    cx="40" cy="40" r={radius} fill="none" stroke="#EA580C" strokeWidth="9"
                    strokeDasharray={`${(opWaitNextPct / 100) * circumference} ${circumference}`}
                    strokeDashoffset={-waitNextOffset}
                  />
                  <circle
                    cx="40" cy="40" r={radius} fill="none" stroke="#EF4444" strokeWidth="9"
                    strokeDasharray={`${(opStopPct / 100) * circumference} ${circumference}`}
                    strokeDashoffset={-stopOffset}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-white tabular-nums">{opRunPct}%</span>
                  <span className="text-[7.5px] text-slate-400">RUN TIME</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-0.5 text-[9px] flex-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 inline-block" />
                    Run (Placement)
                  </span>
                  <span className="font-bold tabular-nums">{opRunPct}%</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-500 inline-block" />
                    Wait Upstream (Starved)
                  </span>
                  <span className="font-bold tabular-nums">{opWaitPrevPct}%</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-orange-500 inline-block" />
                    Wait Downstream (Blocked)
                  </span>
                  <span className="font-bold tabular-nums">{opWaitNextPct}%</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-rose-500 inline-block" />
                    Stop / Feeder Alarm
                  </span>
                  <span className="font-bold tabular-nums">{opStopPct}%</span>
                </div>
              </div>
            </div>

            {/* Nozzle Error Ranking Table */}
            <div>
              <div className="flex items-center justify-between text-[9.5px] text-slate-300 mb-1">
                <span className="font-bold uppercase tracking-wide">NOZZLE ERROR RANKING (PDERROR)</span>
                <span className="text-slate-500 text-[8.5px]">Top Mispicks</span>
              </div>
              <table className="mes-table">
                <thead>
                  <tr>
                    <th className="text-left">Nozzle Address</th>
                    <th className="text-right">Errors</th>
                    <th className="text-right">Rate %</th>
                  </tr>
                </thead>
                <tbody>
                  {(diagnostics?.nozzleRankings || []).slice(0, 3).map((n) => (
                    <tr key={n.nozzleAddress}>
                      <td className="font-bold text-slate-200">{n.nozzleAddress}</td>
                      <td className="text-right text-rose-400 font-bold tabular-nums">{n.mispickCount}x</td>
                      <td className="text-right text-slate-300 tabular-nums">{n.errorRatePct.toFixed(3)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Feeder Slot Error Ranking */}
            <div>
              <div className="flex items-center justify-between text-[9.5px] text-slate-300 mb-1">
                <span className="font-bold uppercase tracking-wide">SLOT ERROR RANKING (LOADCOMPIV)</span>
                <span className="text-slate-500 text-[8.5px]">Slot Misfires</span>
              </div>
              <table className="mes-table">
                <thead>
                  <tr>
                    <th className="text-left">Slot</th>
                    <th className="text-left">Part Number</th>
                    <th className="text-right">Errors</th>
                    <th className="text-right">Rate %</th>
                  </tr>
                </thead>
                <tbody>
                  {(diagnostics?.slotRankings || []).slice(0, 3).map((s) => (
                    <tr key={s.slotAddress}>
                      <td className="font-bold text-slate-200">{s.slotAddress}</td>
                      <td className="text-slate-400 truncate max-w-[80px]">{s.partNumber}</td>
                      <td className="text-right text-amber-400 font-bold tabular-nums">{s.mispickCount}x</td>
                      <td className="text-right text-slate-300 tabular-nums">{s.errorRatePct.toFixed(3)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PCB Reference Designator Defect Pareto */}
            <div>
              <div className="flex items-center justify-between text-[9.5px] text-slate-300 mb-1">
                <span className="font-bold uppercase tracking-wide">REF-DES DEFECT PARETO (BOMLIST)</span>
                <span className="text-slate-500 text-[8.5px]">SPI + AOI</span>
              </div>
              <div className="space-y-1 bg-[#0B101C] p-1.5 border border-[#1C273A] rounded-sm text-[9px]">
                {(diagnostics?.refDesPareto || []).slice(0, 3).map((b) => (
                  <div key={b.refDes} className="space-y-0.5">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-bold text-white">{b.refDes} <span className="text-slate-500 font-normal">({b.partNumber})</span></span>
                      <span className="text-amber-400 font-bold">{b.defectRatePct}%</span>
                    </div>
                    <div className="w-full bg-[#162032] h-1">
                      <div className="bg-purple-500 h-full" style={{ width: `${Math.min(100, b.defectRatePct * 16)}%` }} />
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
          {diagnostics?.dropRatePpm && (
            <MounterDropAnalysisCard
              dropData={diagnostics.dropRatePpm}
              shiftData={diagnostics.shiftMatrix}
              lineName={selectedLine?.lineName || 'SMD_01'}
            />
          )}
        </div>
      )}
    </div>
  );
};
