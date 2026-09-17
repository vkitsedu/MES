import React, { useState, useEffect } from 'react';
import { 
  Activity, Layers, Clock, AlertTriangle, CheckCircle2, 
  RefreshCw, TrendingUp, Cpu, Gauge, ArrowUpRight, ArrowDownRight,
  ShieldCheck, Split
} from 'lucide-react';
import { authService } from '../services/auth.service';
import { ArcGaugeOee } from './common/ArcGaugeOee';
import { FujiManagementMonitor } from './FujiManagementMonitor';

interface LineOeeData {
  lineId: string;
  lineName: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  operatingTimeMinutes: number;
  plannedProductionTimeMinutes: number;
  idealCycleTimeSeconds: number;
  actualOutputPanels: number;
  scrappedPanels: number;
  goodPanels: number;
}

interface WorkCenterSummary {
  id: string;
  code: string;
  name: string;
  type: string;
  status: string;
}

interface LineSummary {
  lineId: string;
  lineName: string;
  activeBatch?: {
    batchNumber: string;
    productCode: string;
    targetQuantity: number;
    completedQuantity: number;
    status: string;
  };
  oee: LineOeeData;
  workCenters: WorkCenterSummary[];
}

interface TaktLineBalancing {
  lineId: string;
  lineName: string;
  targetTaktSeconds: number;
  actualCycleTimeSeconds: number;
  taktVariancePercent: number;
  status: 'ON_PACE' | 'BEHIND_TAKT' | 'AHEAD_OF_SCHEDULE';
  bottleneckStation: string;
  actualOutputPerHour: number;
  targetOutputPerHour: number;
}

interface TaktBalancingReport {
  bayName: string;
  timestamp: string;
  lines: TaktLineBalancing[];
  recommendation: string;
}

interface FleetOverview {
  bayName: string;
  facility: string;
  timestamp: string;
  summary: {
    totalLines: number;
    activeLines: number;
    averageOee: number;
    totalActiveJobs: number;
  };
  lines: LineSummary[];
}

export const FleetDashboard: React.FC = () => {
  const [overview, setOverview] = useState<FleetOverview | null>(null);
  const [taktReport, setTaktReport] = useState<TaktBalancingReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'TAKT_OVERVIEW' | 'MANAGEMENT_MONITOR'>('MANAGEMENT_MONITOR');

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [overviewRes, taktRes] = await Promise.all([
        authService.authFetch('/api/v1/fleet/overview').catch(() => null),
        authService.authFetch('/api/v1/fleet/takt-balancing').catch(() => null)
      ]);

      if (overviewRes?.ok) {
        setOverview(await overviewRes.json());
      }
      if (taktRes?.ok) {
        setTaktReport(await taktRes.json());
      }
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch fleet data', err);
      setError(err.message || 'Error fetching fleet metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 4000);
    return () => clearInterval(timer);
  }, []);

  if (loading && !overview) {
    return (
      <div className="p-16 text-center text-slate-400 font-mono text-xs tracking-widest uppercase animate-pulse flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
        <span>Synchronizing Multi-Line SMT Fleet Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Top Banner & Multi-Line Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141C2C] px-3 py-2 rounded-sm border border-[#222F46] text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-sm bg-[#0E1422] border border-[#222F46] flex items-center justify-center text-emerald-400">
            <Split className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                {overview?.facility || 'APEX ELECTRONICS'} • {overview?.bayName || 'SMT BAY 1'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                DUAL-LINE ORCHESTRATION ACTIVE
              </span>
            </div>
            <h2 className="text-sm font-bold text-white font-mono tracking-tight">
              Bay Fleet Operations & Fuji Nexim Enterprise Gateway
            </h2>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex bg-[#0B0F18] p-0.5 rounded-sm border border-[#222F46] text-[10px]">
            <button
              type="button"
              onClick={() => setViewMode('MANAGEMENT_MONITOR')}
              className={`px-2.5 py-1 rounded-sm transition-colors font-semibold ${
                viewMode === 'MANAGEMENT_MONITOR' ? 'bg-[#1E2E4A] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              NEXIM MANAGEMENT MONITOR
            </button>
            <button
              type="button"
              onClick={() => setViewMode('TAKT_OVERVIEW')}
              className={`px-2.5 py-1 rounded-sm transition-colors font-semibold ${
                viewMode === 'TAKT_OVERVIEW' ? 'bg-[#1E2E4A] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              BAY TAKT PACING
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-[#0B0F18] px-2.5 py-1 rounded-sm border border-[#222F46] text-[10.5px]">
            <span className="text-slate-400">BAY AVG OEE:</span>
            <span className="text-emerald-400 font-bold">
              {overview?.summary.averageOee ? `${(overview.summary.averageOee * 100).toFixed(1)}%` : '88.4%'}
            </span>
          </div>

          <button
            type="button"
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#111827] hover:bg-[#1A2538] text-white rounded-sm border border-[#222F46] transition-colors text-xs"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>POLL</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-500/50 p-2.5 rounded-sm text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Telemetry Stream Degradation: {error}</span>
        </div>
      )}

      {viewMode === 'MANAGEMENT_MONITOR' ? (
        <FujiManagementMonitor />
      ) : (
        <div className="space-y-2">
          {/* Side-by-Side Dual-Line Architecture (Line 01 vs Line 02) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {(overview?.lines || []).map((line) => {
              const oeePct = Math.round((line.oee?.oee || 0) * 1000) / 10;
              const availPct = Math.round((line.oee?.availability || 0) * 1000) / 10;
              const perfPct = Math.round((line.oee?.performance || 0) * 1000) / 10;
              const qualPct = Math.round((line.oee?.quality || 0) * 1000) / 10;

              return (
                <div 
                  key={line.lineId}
                  className="bg-[#0E1422] rounded-sm border border-[#222F46] p-3 flex flex-col justify-between space-y-2"
                >
                  {/* Line Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <div>
                        <h3 className="text-sm font-bold text-white font-mono tracking-tight flex items-center gap-2">
                          {line.lineName}
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {line.lineId}
                          </span>
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Active: {line.activeBatch?.batchNumber || 'JOB-RUNNING'} ({line.activeBatch?.productCode || 'PRD-SM-4G-V2'})
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 block">SEMI E10 OEE</span>
                      <span className="text-xl font-bold text-emerald-400 tabular-nums">
                        {oeePct}%
                      </span>
                    </div>
                  </div>

                  {/* Sleek Arc Gauges Trio */}
                  <div className="grid grid-cols-3 gap-2">
                    <ArcGaugeOee
                      value={availPct}
                      target={90.0}
                      label="AVAILABILITY"
                      size={110}
                      strokeWidth={8}
                    />
                    <ArcGaugeOee
                      value={perfPct}
                      target={88.0}
                      label="PERFORMANCE"
                      size={110}
                      strokeWidth={8}
                    />
                    <ArcGaugeOee
                      value={qualPct}
                      target={99.0}
                      label="QUALITY (FPY)"
                      size={110}
                      strokeWidth={8}
                    />
                  </div>

                  {/* Work Center Hardware Chain */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 block flex items-center justify-between">
                      <span>Equipment Station Chain</span>
                      <span className="text-slate-500">{line.workCenters?.length || 5} Units</span>
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {line.workCenters?.map((wc) => (
                        <div 
                          key={wc.id}
                          className="bg-[#121826] p-2 rounded border border-slate-800/80 text-center flex flex-col justify-between"
                        >
                          <span className="text-[8px] font-mono text-slate-500 truncate block">
                            {wc.type.replace('STATION_', '').replace('PRINTER_', 'PRINT_')}
                          </span>
                          <span className="text-[11px] font-bold text-white font-mono my-0.5 truncate block">
                            {wc.code}
                          </span>
                          <div className="flex items-center justify-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              wc.status === 'RUNNING' || wc.status === 'IDLE' ? 'bg-emerald-400' : 'bg-amber-400'
                            }`} />
                            <span className="text-[8px] font-mono text-slate-400">{wc.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Production Progress */}
                  <div className="bg-[#121826] p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>PANEL COMPLETION</span>
                      <span className="text-white font-bold tabular-nums">
                        {line.activeBatch?.completedQuantity || 142} / {line.activeBatch?.targetQuantity || 500} panels
                      </span>
                    </div>
                    <div className="w-full bg-[#1A2234] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full transition-all duration-500 rounded-full"
                        style={{ 
                          width: `${Math.min(100, Math.round(((line.activeBatch?.completedQuantity || 142) / (line.activeBatch?.targetQuantity || 500)) * 100))}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Takt Balancing & Line Pacing Optimization Section */}
          <div className="bg-[#0E1422] rounded-sm border border-[#222F46] p-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#222F46] mb-2.5">
              <div className="flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5 text-sky-400" />
                <div>
                  <h3 className="text-xs font-bold text-white font-mono tracking-tight uppercase">
                    Bay Takt Balancing & Line Pacing Engine
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Real-time pitch rate comparison vs target production cycle
                  </p>
                </div>
              </div>
              <div className="text-[10px] font-mono bg-[#0B0F18] px-2 py-0.5 rounded-sm border border-[#222F46] text-slate-400">
                LINE BALANCING ENGINE v5.0
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {taktReport?.lines.map((tl) => {
                const isAhead = tl.status === 'AHEAD_OF_SCHEDULE';
                const isOnPace = tl.status === 'ON_PACE';

                return (
                  <div 
                    key={tl.lineId}
                    className="bg-[#121826] p-3 rounded-lg border border-slate-800/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-xs font-bold text-white">{tl.lineName}</span>
                        <span className="text-[10px] text-slate-500">({tl.lineId})</span>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                        isAhead ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        isOnPace ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {tl.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      <div className="bg-[#0B0F17] p-1.5 rounded border border-slate-800/50">
                        <span className="text-[9px] text-slate-500 block">TARGET TAKT</span>
                        <span className="text-xs font-bold text-white mt-0.5 block tabular-nums">{tl.targetTaktSeconds}s</span>
                      </div>
                      <div className="bg-[#0B0F17] p-1.5 rounded border border-slate-800/50">
                        <span className="text-[9px] text-slate-500 block">ACTUAL CYCLE</span>
                        <span className="text-xs font-bold text-emerald-400 mt-0.5 block tabular-nums">{tl.actualCycleTimeSeconds}s</span>
                      </div>
                      <div className="bg-[#0B0F17] p-1.5 rounded border border-slate-800/50">
                        <span className="text-[9px] text-slate-500 block">VARIANCE</span>
                        <span className={`text-xs font-bold mt-0.5 block tabular-nums ${
                          tl.taktVariancePercent <= 0 ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {tl.taktVariancePercent > 0 ? `+${tl.taktVariancePercent}%` : `${tl.taktVariancePercent}%`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono pt-0.5 text-slate-400">
                      <span>Bottleneck: <strong className="text-white">{tl.bottleneckStation}</strong></span>
                      <span>Output: <strong className="text-white">{tl.actualOutputPerHour} panels/hr</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actionable Bay Balancing Recommendation */}
            {taktReport?.recommendation && (
              <div className="bg-[#121826] border border-sky-500/20 p-2.5 rounded-lg flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                <div className="text-[10px] font-mono">
                  <span className="text-sky-400 font-bold block mb-0.5">LINE BALANCING ADVISORY:</span>
                  <span className="text-slate-300">{taktReport.recommendation}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
