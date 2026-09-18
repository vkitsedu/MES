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
  facility?: string;
  facilityName?: string;
  timestamp: string;
  averageOee?: number;
  summary?: {
    totalLines: number;
    activeLines: number;
    averageOee: number;
    totalActiveJobs: number;
  };
  lines: LineSummary[];
}

const FALLBACK_FLEET_OVERVIEW: FleetOverview = {
  bayName: 'SMT BAY 1',
  facility: 'i-MES 2.0 SMT FACILITY',
  timestamp: new Date().toISOString(),
  summary: {
    totalLines: 2,
    activeLines: 2,
    averageOee: 0.884,
    totalActiveJobs: 2
  },
  lines: [
    {
      lineId: 'LINE_01',
      lineName: 'SMD_01: Fuji NXT III M6',
      activeBatch: {
        batchNumber: 'BATCH-2026-09A',
        productCode: 'PRD-SM-METER-TOP',
        targetQuantity: 1200,
        completedQuantity: 892,
        status: 'RUNNING'
      },
      oee: {
        lineId: 'LINE_01',
        lineName: 'SMD_01: Fuji NXT III M6',
        availability: 0.912,
        performance: 0.996,
        quality: 0.984,
        oee: 0.884,
        operatingTimeMinutes: 420,
        plannedProductionTimeMinutes: 480,
        idealCycleTimeSeconds: 18.0,
        actualOutputPanels: 892,
        scrappedPanels: 4,
        goodPanels: 888
      },
      workCenters: [
        { id: 'wc-1', code: 'LSR-01', name: 'Laser Marker', type: 'LASER', status: 'RUNNING' },
        { id: 'wc-2', code: 'PRN-01', name: 'Screen Printer', type: 'PRINTER', status: 'RUNNING' },
        { id: 'wc-3', code: 'SPI-01', name: '3D SPI', type: 'SPI', status: 'RUNNING' },
        { id: 'wc-4', code: 'MNT-01', name: 'NXT III Mod 1', type: 'MOUNTER', status: 'RUNNING' },
        { id: 'wc-5', code: 'RFW-01', name: 'Reflow Oven', type: 'REFLOW', status: 'RUNNING' }
      ]
    },
    {
      lineId: 'LINE_02',
      lineName: 'SMD_02: Fuji AIMEX IIIc',
      activeBatch: {
        batchNumber: 'BATCH-2026-09B',
        productCode: 'PRD-SM-METER-BOT',
        targetQuantity: 800,
        completedQuantity: 540,
        status: 'RUNNING'
      },
      oee: {
        lineId: 'LINE_02',
        lineName: 'SMD_02: Fuji AIMEX IIIc',
        availability: 0.895,
        performance: 0.962,
        quality: 0.991,
        oee: 0.853,
        operatingTimeMinutes: 405,
        plannedProductionTimeMinutes: 480,
        idealCycleTimeSeconds: 22.0,
        actualOutputPanels: 540,
        scrappedPanels: 2,
        goodPanels: 538
      },
      workCenters: [
        { id: 'wc-6', code: 'PRN-02', name: 'Screen Printer', type: 'PRINTER', status: 'RUNNING' },
        { id: 'wc-7', code: 'SPI-02', name: '3D SPI', type: 'SPI', status: 'RUNNING' },
        { id: 'wc-8', code: 'MNT-04', name: 'AIMEX IIIc', type: 'MOUNTER', status: 'RUNNING' },
        { id: 'wc-9', code: 'RFW-02', name: 'Reflow Oven', type: 'REFLOW', status: 'RUNNING' },
        { id: 'wc-10', code: 'AOI-02', name: '3D AOI Post', type: 'AOI_POST', status: 'RUNNING' }
      ]
    }
  ]
};

const FALLBACK_TAKT_REPORT: TaktBalancingReport = {
  bayName: 'SMT BAY 1',
  timestamp: new Date().toISOString(),
  recommendation: 'SMD_01 is running 35 minutes ahead of schedule. SMD_02 feeder reel 04 requires inspection within 40 minutes to prevent starvation.',
  lines: [
    {
      lineId: 'LINE_01',
      lineName: 'SMD_01: Fuji NXT III M6',
      targetTaktSeconds: 18.0,
      actualCycleTimeSeconds: 17.8,
      taktVariancePercent: -1.1,
      status: 'AHEAD_OF_SCHEDULE',
      bottleneckStation: 'MNT-01 (NXT III)',
      actualOutputPerHour: 202,
      targetOutputPerHour: 200
    },
    {
      lineId: 'LINE_02',
      lineName: 'SMD_02: Fuji AIMEX IIIc',
      targetTaktSeconds: 22.0,
      actualCycleTimeSeconds: 22.4,
      taktVariancePercent: 1.8,
      status: 'ON_PACE',
      bottleneckStation: 'MNT-04 (AIMEX IIIc)',
      actualOutputPerHour: 161,
      targetOutputPerHour: 163
    }
  ]
};

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
        const json = await overviewRes.json();
        setOverview(json.data || json);
      }
      if (taktRes?.ok) {
        const json = await taktRes.json();
        setTaktReport(json.data || json);
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

  const activeOverview = overview || FALLBACK_FLEET_OVERVIEW;
  const activeTakt = taktReport || FALLBACK_TAKT_REPORT;

  return (
    <div className="space-y-2 font-sans">
      {/* Top Banner & Multi-Line Mode Bar */}
      <div 
        className="flex flex-wrap items-center justify-between gap-3 bg-[var(--mes-bg-surface)] px-3 py-2 rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle)] text-xs"
        style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[var(--mes-radius)] bg-[var(--mes-bg-well)] border border-[var(--mes-border-subtle)] flex items-center justify-center text-[var(--mes-accent-primary)]">
            <Split className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--mes-text-muted)]">
                {activeOverview.facilityName || activeOverview.facility || 'i-MES 2.0 SMT Facility'} • {activeOverview.bayName || 'SMT Cleanroom Bay A'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--mes-status-pass)] animate-pulse" />
              <span className="text-[10px] font-mono text-[var(--mes-status-pass)] font-bold uppercase">
                DUAL-LINE ORCHESTRATION ACTIVE
              </span>
            </div>
            <h2 className="text-sm font-bold text-[var(--mes-text-primary)] font-mono tracking-tight">
              Bay Fleet Operations & Fuji Nexim Enterprise Gateway
            </h2>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex bg-[var(--mes-bg-well)] p-0.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle)] text-[10px]">
            <button
              type="button"
              onClick={() => setViewMode('MANAGEMENT_MONITOR')}
              className={`px-2.5 py-1 rounded-[var(--mes-radius)] transition-colors font-semibold ${
                viewMode === 'MANAGEMENT_MONITOR' ? 'bg-[var(--mes-accent-muted)] text-[var(--mes-accent-primary)] font-bold' : 'text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]'
              }`}
            >
              NEXIM MANAGEMENT MONITOR
            </button>
            <button
              type="button"
              onClick={() => setViewMode('TAKT_OVERVIEW')}
              className={`px-2.5 py-1 rounded-[var(--mes-radius)] transition-colors font-semibold ${
                viewMode === 'TAKT_OVERVIEW' ? 'bg-[var(--mes-accent-muted)] text-[var(--mes-accent-primary)] font-bold' : 'text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]'
              }`}
            >
              BAY TAKT PACING
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-[var(--mes-bg-well)] px-2.5 py-1 rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle)] text-[10.5px]">
            <span className="text-[var(--mes-text-muted)]">BAY AVG OEE:</span>
            <span className="text-[var(--mes-status-pass)] font-bold">
              {(((activeOverview.averageOee ?? activeOverview.summary?.averageOee ?? 0.884)) * 100).toFixed(1)}%
            </span>
          </div>

          <button
            type="button"
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-1 px-2.5 py-1 bg-[var(--mes-bg-well)] hover:bg-[var(--mes-bg-surface)] text-[var(--mes-text-primary)] rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle)] transition-colors text-xs"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-[var(--mes-status-pass)]' : ''}`} />
            <span>POLL</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-[var(--mes-status-halt-muted)] border border-[var(--mes-status-halt)] p-2.5 rounded-[var(--mes-radius)] text-[var(--mes-status-halt)] text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-[var(--mes-status-halt)]" />
          <span>Telemetry Stream Degradation: {error}</span>
        </div>
      )}

      {viewMode === 'MANAGEMENT_MONITOR' ? (
        <FujiManagementMonitor />
      ) : (
        <div className="space-y-2">
          {/* Side-by-Side Dual-Line Architecture (Line 01 vs Line 02) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {(activeOverview.lines || []).map((line: any) => {
              const oeePct = Math.round((line.oee?.oee || 0) * 1000) / 10;
              const availPct = Math.round((line.oee?.availability || 0) * 1000) / 10;
              const perfPct = Math.round((line.oee?.performance || 0) * 1000) / 10;
              const qualPct = Math.round((line.oee?.quality || 0) * 1000) / 10;
              const lineId = line.lineId || line.id || 'LINE_01';
              const lineName = line.lineName || line.name || lineId;

              return (
                <div 
                  key={lineId}
                  className="bg-[var(--mes-bg-surface)] rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle)] p-3 flex flex-col justify-between space-y-2"
                  style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
                >
                  {/* Line Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-[var(--mes-border-hairline)]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--mes-status-pass)] animate-pulse" />
                      <div>
                        <h3 className="text-sm font-bold text-[var(--mes-text-primary)] font-mono tracking-tight flex items-center gap-2">
                          {lineName}
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--mes-bg-well)] text-[var(--mes-text-muted)] border border-[var(--mes-border-hairline)]">
                            {lineId}
                          </span>
                        </h3>
                        <p className="text-[10px] text-[var(--mes-text-muted)] font-mono">
                          Active: {line.activeBatch?.batchNumber || line.activeBatchCode || 'JOB-RUNNING'} ({line.activeBatch?.productCode || line.activeProgramName || 'PRD-SM-4G-V2'})
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[9px] uppercase tracking-wider text-[var(--mes-text-muted)] block">SEMI E10 OEE</span>
                      <span className="text-xl font-bold text-[var(--mes-status-pass)] tabular-nums">
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
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--mes-text-muted)] mb-1.5 flex items-center justify-between">
                      <span>Equipment Station Chain</span>
                      <span className="text-[var(--mes-text-dim)]">{line.workCenters?.length || 5} Units</span>
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {line.workCenters?.map((wc: WorkCenterSummary) => (
                        <div 
                          key={wc.id}
                          className="bg-[var(--mes-bg-well)] p-2 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)] text-center flex flex-col justify-between"
                        >
                          <span className="text-[8px] font-mono text-[var(--mes-text-muted)] truncate block">
                            {wc.type.replace('STATION_', '').replace('PRINTER_', 'PRINT_')}
                          </span>
                          <span className="text-[11px] font-bold text-[var(--mes-text-primary)] font-mono my-0.5 truncate block">
                            {wc.code}
                          </span>
                          <div className="flex items-center justify-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              wc.status === 'RUNNING' || wc.status === 'IDLE' ? 'bg-[var(--mes-status-pass)]' : 'bg-[var(--mes-status-warn)]'
                            }`} />
                            <span className="text-[8px] font-mono text-[var(--mes-text-muted)]">{wc.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Production Progress */}
                  <div className="bg-[var(--mes-bg-well)] p-2.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                    <div className="flex justify-between text-[11px] font-mono text-[var(--mes-text-muted)] mb-1">
                      <span>PANEL COMPLETION</span>
                      <span className="text-[var(--mes-text-primary)] font-bold tabular-nums">
                        {line.activeBatch?.completedQuantity || 142} / {line.activeBatch?.targetQuantity || 500} panels
                      </span>
                    </div>
                    <div className="w-full bg-[var(--mes-bg-canvas)] h-2 rounded-full overflow-hidden border border-[var(--mes-border-hairline)]">
                      <div 
                        className="bg-[var(--mes-accent-primary)] h-full transition-all duration-500 rounded-full"
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
          <div 
            className="bg-[var(--mes-bg-surface)] rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle)] p-3"
            style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--mes-border-subtle)] mb-2.5">
              <div className="flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5 text-[var(--mes-accent-primary)]" />
                <div>
                  <h3 className="text-xs font-bold text-[var(--mes-text-primary)] font-mono tracking-tight uppercase">
                    Bay Takt Balancing & Line Pacing Engine
                  </h3>
                  <p className="text-[10px] text-[var(--mes-text-muted)] font-mono">
                    Real-time pitch rate comparison vs target production cycle
                  </p>
                </div>
              </div>
              <div className="text-[10px] font-mono bg-[var(--mes-bg-well)] px-2 py-0.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle)] text-[var(--mes-text-muted)]">
                LINE BALANCING ENGINE v5.0
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {activeTakt.lines.map((tl) => {
                const isAhead = tl.status === 'AHEAD_OF_SCHEDULE';
                const isOnPace = tl.status === 'ON_PACE';

                return (
                  <div 
                    key={tl.lineId}
                    className="bg-[var(--mes-bg-well)] p-3 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-xs font-bold text-[var(--mes-text-primary)]">{tl.lineName}</span>
                        <span className="text-[10px] text-[var(--mes-text-muted)]">({tl.lineId})</span>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                        isAhead ? 'bg-[var(--mes-status-pass-muted)] text-[var(--mes-status-pass)] border-[var(--mes-status-pass)]' :
                        isOnPace ? 'bg-[var(--mes-accent-muted)] text-[var(--mes-accent-primary)] border-[var(--mes-accent-ring)]' :
                        'bg-[var(--mes-status-warn-muted)] text-[var(--mes-status-warn)] border-[var(--mes-status-warn)]'
                      }`}>
                        {tl.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      <div className="bg-[var(--mes-bg-surface)] p-1.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                        <span className="text-[9px] text-[var(--mes-text-muted)] block">TARGET TAKT</span>
                        <span className="text-xs font-bold text-[var(--mes-text-primary)] mt-0.5 block tabular-nums">{tl.targetTaktSeconds}s</span>
                      </div>
                      <div className="bg-[var(--mes-bg-surface)] p-1.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                        <span className="text-[9px] text-[var(--mes-text-muted)] block">ACTUAL CYCLE</span>
                        <span className="text-xs font-bold text-[var(--mes-status-pass)] mt-0.5 block tabular-nums">{tl.actualCycleTimeSeconds}s</span>
                      </div>
                      <div className="bg-[var(--mes-bg-surface)] p-1.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                        <span className="text-[9px] text-[var(--mes-text-muted)] block">VARIANCE</span>
                        <span className={`text-xs font-bold mt-0.5 block tabular-nums ${
                          tl.taktVariancePercent <= 0 ? 'text-[var(--mes-status-pass)]' : 'text-[var(--mes-status-warn)]'
                        }`}>
                          {tl.taktVariancePercent > 0 ? `+${tl.taktVariancePercent}%` : `${tl.taktVariancePercent}%`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono pt-0.5 text-[var(--mes-text-muted)]">
                      <span>Bottleneck: <strong className="text-[var(--mes-text-primary)]">{tl.bottleneckStation}</strong></span>
                      <span>Output: <strong className="text-[var(--mes-text-primary)]">{tl.actualOutputPerHour} panels/hr</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actionable Bay Balancing Recommendation */}
            {activeTakt.recommendation && (
              <div className="bg-[var(--mes-bg-well)] border border-[var(--mes-accent-ring)] p-2.5 rounded-[var(--mes-radius)] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[var(--mes-accent-primary)] mt-0.5 shrink-0" />
                <div className="text-[10px] font-mono">
                  <span className="text-[var(--mes-accent-primary)] font-bold block mb-0.5">LINE BALANCING ADVISORY:</span>
                  <span className="text-[var(--mes-text-secondary)]">{activeTakt.recommendation}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
