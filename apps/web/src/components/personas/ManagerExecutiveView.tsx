import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Award, 
  Calendar, ArrowUpRight, ShieldCheck, Factory,
  Layers, CheckCircle2, ChevronRight
} from 'lucide-react';
import { KpiCard } from '../common/KpiCard';
import { DrillDownDrawer, DrillDownData } from '../common/DrillDownDrawer';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { SmtNocTelemetryStudio } from '../SmtNocTelemetryStudio';

export const ManagerExecutiveView: React.FC = () => {
  const [viewSubMode, setViewSubMode] = useState<'BRIEFING' | 'NOC_MATRIX'>('BRIEFING');
  const [selectedDrillDown, setSelectedDrillDown] = useState<DrillDownData | null>(null);
  const [expandedKpiId, setExpandedKpiId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedKpiId(prev => (prev === id ? null : id));
  };

  // Drill-down data sets for executive KPIs
  const drillDownScenarios: Record<string, DrillDownData> = {
    oee: {
      kpiId: 'OEE',
      title: 'Plantwide Overall Equipment Effectiveness',
      subtitle: 'SEMI E10 standard availability, performance rate, and quality factor',
      currentValue: '88.4%',
      targetValue: '85.0%',
      status: 'PASS',
      summaryDescription: 'Line 01 and Line 02 are currently operating above plant benchmark. Line 01 is placing at 44,820 CPH (99.6% rated). Total downtime across the plant is 44 minutes against an allowance of 60 minutes.',
      items: [
        { id: '1', timestamp: '14:22', category: 'AVAILABILITY', title: 'Feeder Splicing Pause (Slot 12)', description: 'Component reel runout on 0402 capacitor reel. Spliced in 2.8 minutes.', severity: 'INFO', durationMinutes: 2.8, stationCode: 'MNT-01' },
        { id: '2', timestamp: '11:15', category: 'PERFORMANCE', title: 'Line Pacing Waiting for Reflow', description: 'Oven conveyor pacing reduced speed by 3% for dual-sided heavy copper profile.', severity: 'WARNING', durationMinutes: 14.0, stationCode: 'RFW-01' },
        { id: '3', timestamp: '09:04', category: 'QUALITY', title: 'SPI Automated Solder Paste Offset Correction', description: 'Closed-loop feedback to screen printer adjusted stencil offset by +12µm.', severity: 'INFO', durationMinutes: 0.0, stationCode: 'SPI-01' }
      ]
    },
    scrap: {
      kpiId: 'SCRAP_COST',
      title: 'Scrap & Material Loss Financial Impact',
      subtitle: 'Total component and board defect waste cost in current shift',
      currentValue: '$142.50',
      targetValue: '<$350.00',
      status: 'PASS',
      summaryDescription: 'Scrap rate remains at 0.02% of total BOM value. 4 panels flagged with solder bridging were automatically routed to rework station and recovered without board disposal.',
      items: [
        { id: 's1', timestamp: '13:40', category: 'DEFECT', title: 'AOI Solder Bridging on U04 QFP', description: '4 leads bridged on pin 12-15. Repaired at hot-air rework station.', severity: 'WARNING', metricDelta: '+$42.00 recovered', stationCode: 'RWK-01' },
        { id: 's2', timestamp: '10:20', category: 'PICKUP', title: '0201 Resistor Drop at Feeder 08', description: '12 components dropped due to tape peeling resistance. Nozzle blown out.', severity: 'INFO', metricDelta: '$0.84 scrap', stationCode: 'MNT-02' }
      ]
    },
    fpy: {
      kpiId: 'FPY',
      title: 'First Pass Yield (FPY)',
      subtitle: 'Finished boards passing SPI and AOI without rework intervention',
      currentValue: '98.4%',
      targetValue: '98.0%',
      status: 'PASS',
      summaryDescription: 'Plantwide FPY is 98.4%, exceeding the 98.0% quality target. 878 out of 892 panels passed all visual and functional tests on first pass.',
      items: [
        { id: 'f1', timestamp: '15:10', category: 'AOI', title: 'Passed 3D AOI Post-Reflow Inspection', description: 'Zero tombstone or missing part defects detected on lot IMES-01.', severity: 'INFO', stationCode: 'AOI-01' },
        { id: 'f2', timestamp: '12:05', category: 'SPI', title: 'Paste Volume Cpk = 1.48 (Target > 1.33)', description: 'Laser height measurements across 48,000 solder pads show normal distribution.', severity: 'INFO', stationCode: 'SPI-01' }
      ]
    },
    throughput: {
      kpiId: 'THROUGHPUT',
      title: 'Gross Production Output',
      subtitle: 'Finished smart meter assemblies completed across all lines',
      currentValue: '892 Units',
      targetValue: '1,200 Plan',
      status: 'PASS',
      summaryDescription: 'Current production run is on track to complete at 17:45, approximately 35 minutes ahead of scheduled shift changeover.',
      items: [
        { id: 't1', timestamp: '14:00', category: 'OUTPUT', title: 'Hourly Run Rate: 168 panels/hr', description: 'Optimal tact time achieved at 18.2s per panel.', severity: 'INFO', occurrences: 168 }
      ]
    }
  };

  const handleOpenDrillDown = (kpiId: string) => {
    const data = drillDownScenarios[kpiId.toLowerCase()] || drillDownScenarios.oee;
    setSelectedDrillDown(data);
  };

  return (
    <div className="space-y-4 font-sans max-w-7xl mx-auto p-1 sm:p-2">
      {/* Executive Header Banner */}
      <div 
        className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
        style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <Factory className="w-4 h-4 text-[var(--mes-accent-primary)]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--mes-text-muted)]">
              PLANT OPERATIONS • EXECUTIVE BRIEFING
            </span>
            <span className="px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-[var(--mes-status-pass-muted)] text-[var(--mes-status-pass)] text-[9.5px] font-mono font-bold border border-[var(--mes-status-pass)]">
              ALL TARGETS GREEN
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--mes-text-primary)] font-mono mt-1">
            Manufacturing Operations & Yield Executive Cockpit
          </h1>
          <p className="text-xs text-[var(--mes-text-secondary)] mt-0.5">
            Real-time synthesis across SMT Line 01 (Fuji NXT III) and Line 02 (Fuji AIMEX IIIc)
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex bg-slate-950 p-0.5 rounded-[var(--mes-radius)] border border-slate-800 text-[10px]">
            <button
              onClick={() => setViewSubMode('BRIEFING')}
              className={`px-2.5 py-1 rounded-[var(--mes-radius)] font-semibold transition-colors ${
                viewSubMode === 'BRIEFING' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EXECUTIVE BRIEFING
            </button>
            <button
              onClick={() => setViewSubMode('NOC_MATRIX')}
              className={`px-2.5 py-1 rounded-[var(--mes-radius)] font-semibold transition-colors ${
                viewSubMode === 'NOC_MATRIX' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              NOC TELEMETRY MATRIX
            </button>
          </div>
          <div className="bg-[var(--mes-bg-well)] px-3 py-1.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)] text-right hidden sm:block">
            <span className="text-[9.5px] text-[var(--mes-text-muted)] uppercase block">Financial Value Today</span>
            <span className="text-sm font-bold text-[var(--mes-text-primary)] tabular-nums">$148,600 USD</span>
          </div>
          <div className="bg-[var(--mes-bg-well)] px-3 py-1.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)] text-right hidden sm:block">
            <span className="text-[9.5px] text-[var(--mes-text-muted)] uppercase block">Run Schedule</span>
            <span className="text-sm font-bold text-[var(--mes-status-pass)]">+35m AHEAD</span>
          </div>
        </div>
      </div>

      {viewSubMode === 'NOC_MATRIX' ? (
        <SmtNocTelemetryStudio />
      ) : (
        <>
          {/* 4 Spotlight Focus-on-Hover Executive KPI Cards */}
      <div className="mes-spotlight-group grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          id="oee"
          label="Overall Plant OEE"
          category="Effectiveness"
          value={88.4}
          decimals={1}
          unit="%"
          target={85.0}
          trendPct={+2.4}
          status="PASS"
          sparklineData={[84.2, 85.1, 86.0, 85.8, 87.2, 88.4]}
          isExpanded={expandedKpiId === 'oee'}
          onToggleExpand={handleToggleExpand}
          drillDownSummary={drillDownScenarios.oee.summaryDescription}
          drillDownItems={drillDownScenarios.oee.items}
          onClickDrillDown={handleOpenDrillDown}
        />

        <KpiCard
          id="fpy"
          label="First Pass Yield"
          category="Quality"
          value={98.4}
          decimals={1}
          unit="%"
          target={98.0}
          trendPct={+0.6}
          status="PASS"
          sparklineData={[97.8, 98.0, 98.1, 98.2, 98.4]}
          isExpanded={expandedKpiId === 'fpy'}
          onToggleExpand={handleToggleExpand}
          drillDownSummary={drillDownScenarios.fpy.summaryDescription}
          drillDownItems={drillDownScenarios.fpy.items}
          onClickDrillDown={handleOpenDrillDown}
        />

        <KpiCard
          id="throughput"
          label="Throughput Output"
          category="Volume"
          value={892}
          unit="Panels"
          target={1200}
          targetLabel="Plan"
          trendPct={+4.1}
          status="PASS"
          sparklineData={[120, 260, 420, 590, 740, 892]}
          isExpanded={expandedKpiId === 'throughput'}
          onToggleExpand={handleToggleExpand}
          drillDownSummary={drillDownScenarios.throughput.summaryDescription}
          drillDownItems={drillDownScenarios.throughput.items}
          onClickDrillDown={handleOpenDrillDown}
        />

        <KpiCard
          id="scrap"
          label="Scrap Material Cost"
          category="Financial Loss"
          value={142.50}
          prefix="$"
          decimals={2}
          unit=""
          target={350.00}
          targetLabel="Cap"
          trendPct={-18.5}
          status="PASS"
          sparklineData={[280, 240, 210, 180, 160, 142.5]}
          isExpanded={expandedKpiId === 'scrap'}
          onToggleExpand={handleToggleExpand}
          drillDownSummary={drillDownScenarios.scrap.summaryDescription}
          drillDownItems={drillDownScenarios.scrap.items}
          onClickDrillDown={handleOpenDrillDown}
        />
      </div>

      {/* Comparative Plant Lines Matrix (Line 01 vs Line 02) */}
      <div 
        className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-4"
        style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--mes-border-hairline)] mb-3">
          <div>
            <h3 className="text-xs font-bold font-mono text-[var(--mes-text-primary)] uppercase tracking-wide">
              Production Lines Comparative Benchmark
            </h3>
            <p className="text-[11px] text-[var(--mes-text-muted)]">
              Multi-line speed, availability, drop rate, and scrap comparison
            </p>
          </div>
          <span className="text-[10px] font-mono text-[var(--mes-accent-primary)] bg-[var(--mes-accent-muted)] px-2 py-0.5 rounded-[var(--mes-radius)] border border-[var(--mes-accent-ring)]">
            LIVE MES BUS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Line 01 Card */}
          <div className="bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] rounded-[var(--mes-radius)] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[var(--mes-text-muted)] uppercase">SMT LINE 01</span>
                <h4 className="text-sm font-bold text-[var(--mes-text-primary)]">Fuji NXT III M6 (High-Speed Line)</h4>
              </div>
              <span className="px-2 py-0.5 rounded-[var(--mes-radius)] bg-[var(--mes-status-pass-muted)] text-[var(--mes-status-pass)] text-xs font-mono font-bold border border-[var(--mes-status-pass)]">
                RUNNING (99.6%)
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center font-mono pt-1">
              <div className="bg-[var(--mes-bg-surface)] p-2 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                <span className="text-[9px] text-[var(--mes-text-muted)] uppercase block">OEE</span>
                <span className="text-sm font-bold text-[var(--mes-accent-primary)]">88.4%</span>
              </div>
              <div className="bg-[var(--mes-bg-surface)] p-2 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                <span className="text-[9px] text-[var(--mes-text-muted)] uppercase block">Speed</span>
                <span className="text-sm font-bold text-[var(--mes-text-primary)]">44.8k</span>
              </div>
              <div className="bg-[var(--mes-bg-surface)] p-2 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                <span className="text-[9px] text-[var(--mes-text-muted)] uppercase block">Yield</span>
                <span className="text-sm font-bold text-[var(--mes-status-pass)]">98.4%</span>
              </div>
              <div className="bg-[var(--mes-bg-surface)] p-2 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                <span className="text-[9px] text-[var(--mes-text-muted)] uppercase block">Scrap</span>
                <span className="text-sm font-bold text-[var(--mes-text-primary)]">$142</span>
              </div>
            </div>
          </div>

          {/* Line 02 Card */}
          <div className="bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] rounded-[var(--mes-radius)] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[var(--mes-text-muted)] uppercase">SMT LINE 02</span>
                <h4 className="text-sm font-bold text-[var(--mes-text-primary)]">Fuji AIMEX IIIc (Flexible Line)</h4>
              </div>
              <span className="px-2 py-0.5 rounded-[var(--mes-radius)] bg-[var(--mes-status-pass-muted)] text-[var(--mes-status-pass)] text-xs font-mono font-bold border border-[var(--mes-status-pass)]">
                RUNNING (97.8%)
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center font-mono pt-1">
              <div className="bg-[var(--mes-bg-surface)] p-2 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                <span className="text-[9px] text-[var(--mes-text-muted)] uppercase block">OEE</span>
                <span className="text-sm font-bold text-[var(--mes-accent-primary)]">86.2%</span>
              </div>
              <div className="bg-[var(--mes-bg-surface)] p-2 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                <span className="text-[9px] text-[var(--mes-text-muted)] uppercase block">Speed</span>
                <span className="text-sm font-bold text-[var(--mes-text-primary)]">38.2k</span>
              </div>
              <div className="bg-[var(--mes-bg-surface)] p-2 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                <span className="text-[9px] text-[var(--mes-text-muted)] uppercase block">Yield</span>
                <span className="text-sm font-bold text-[var(--mes-status-pass)]">99.1%</span>
              </div>
              <div className="bg-[var(--mes-bg-surface)] p-2 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                <span className="text-[9px] text-[var(--mes-text-muted)] uppercase block">Scrap</span>
                <span className="text-sm font-bold text-[var(--mes-text-primary)]">$88</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Performance & Yield Trend Chart */}
      <div 
        className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-4"
        style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
      >
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--mes-border-hairline)]">
          <div>
            <h3 className="text-xs font-bold font-mono text-[var(--mes-text-primary)] uppercase tracking-wide">
              7-Day Rolling OEE & Scrap Cost Trend
            </h3>
            <p className="text-[11px] text-[var(--mes-text-muted)]">
              Daily aggregates benchmarked against plant target (85.0% OEE)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[var(--mes-accent-primary)]">
              <span className="w-2 h-2 rounded-full bg-[var(--mes-accent-primary)]" />
              <span>OEE %</span>
            </span>
            <span className="flex items-center gap-1.5 text-[var(--mes-status-pass)]">
              <span className="w-2 h-2 rounded-full bg-[var(--mes-status-pass)]" />
              <span>Yield %</span>
            </span>
          </div>
        </div>

        {/* 7-Day Bar / Column Visualizer */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {[
            { day: 'Mon', oee: 84.1, yieldPct: 97.8, panels: 1120 },
            { day: 'Tue', oee: 86.5, yieldPct: 98.2, panels: 1180 },
            { day: 'Wed', oee: 85.8, yieldPct: 98.0, panels: 1150 },
            { day: 'Thu', oee: 87.4, yieldPct: 98.5, panels: 1210 },
            { day: 'Fri', oee: 89.1, yieldPct: 98.8, panels: 1240 },
            { day: 'Sat', oee: 88.0, yieldPct: 98.4, panels: 1190 },
            { day: 'Today', oee: 88.4, yieldPct: 98.4, panels: 892 }
          ].map((item, idx) => (
            <div key={idx} className="bg-[var(--mes-bg-well)] p-2.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)] flex flex-col justify-between text-center font-mono">
              <span className="text-[10px] text-[var(--mes-text-muted)] uppercase block">{item.day}</span>
              
              <div className="my-2 space-y-1">
                <div className="text-sm font-bold text-[var(--mes-accent-primary)]">{item.oee}%</div>
                <div className="text-[10px] text-[var(--mes-status-pass)] font-medium">{item.yieldPct}% FPY</div>
              </div>

              <div className="w-full bg-[var(--mes-bg-surface)] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[var(--mes-accent-primary)] h-full rounded-full"
                  style={{ width: `${Math.min(100, item.oee)}%` }}
                />
              </div>

              <span className="text-[9.5px] text-[var(--mes-text-dim)] mt-1.5">{item.panels} pcs</span>
            </div>
          ))}
        </div>
      </div>
      </>
      )}

      {/* Drill-Down Slide-Over Drawer */}
      <DrillDownDrawer
        isOpen={Boolean(selectedDrillDown)}
        onClose={() => setSelectedDrillDown(null)}
        data={selectedDrillDown}
      />
    </div>
  );
};
