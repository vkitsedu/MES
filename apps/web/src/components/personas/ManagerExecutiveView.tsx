import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Award, 
  Calendar, ArrowUpRight, ShieldCheck, Factory,
  Layers, CheckCircle2, ChevronRight, Clock, AlertTriangle,
  ArrowRight, FileText, Check, Sparkles
} from 'lucide-react';
import { DrillDownDrawer, DrillDownData } from '../common/DrillDownDrawer';
import { SmtNocTelemetryStudio } from '../SmtNocTelemetryStudio';

export const ManagerExecutiveView: React.FC = () => {
  const [viewSubMode, setViewSubMode] = useState<'BRIEFING' | 'NOC_MATRIX'>('BRIEFING');
  const [selectedDrillDown, setSelectedDrillDown] = useState<DrillDownData | null>(null);
  const [lineFilter, setLineFilter] = useState<'OEE' | 'YIELD' | 'SPEED' | 'SCRAP'>('OEE');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [nightMode, setNightMode] = useState<boolean>(false);

  // Dynamic Theme Styling matching 20 Dashboards cleanroom palette + Cyber Night toggle
  const containerBg = nightMode ? 'bg-[#070D19]' : 'bg-[#F0F5FA]';
  const cardBg = nightMode ? 'bg-[#0B1528] border-slate-700/60 text-slate-100' : 'bg-white border-slate-200/80 text-slate-800';
  const innerCardBg = nightMode ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800';
  const subtextMuted = nightMode ? 'text-slate-400' : 'text-slate-500';

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
      title: 'Finished Panel Throughput Output',
      subtitle: 'Target scheduled volume versus actual production completion',
      currentValue: '892 Panels',
      targetValue: '1200 Panels',
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
    <div className={`${containerBg} min-h-[750px] p-3 rounded font-sans transition-colors duration-200 space-y-3`}>
      {/* 1. EXECUTIVE HEADER BANNER MATCHING IMAGE 2 */}
      <div className={`${cardBg} p-3 sm:p-4 rounded-xl border shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold font-sans tracking-tight">
                Manufacturing Operations & Yield Executive Cockpit
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <p className={`${subtextMuted} text-[11px] mt-0.5`}>
              Real-time synthesis across SMD Line 01 (Fuji NXT III) and Line 02 (Fuji AIMEX IIIc)
            </p>
          </div>
        </div>

        {/* Action Controls & Date */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-200/60 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-mono">
            <button
              onClick={() => setViewSubMode('BRIEFING')}
              className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                viewSubMode === 'BRIEFING' ? 'bg-[#1E50ED] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Executive Briefing
            </button>
            <button
              onClick={() => setViewSubMode('NOC_MATRIX')}
              className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                viewSubMode === 'NOC_MATRIX' ? 'bg-[#1E50ED] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              NOC Telemetry Matrix
            </button>
          </div>

          <button
            onClick={() => handleOpenDrillDown('scrap')}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-[11px] font-mono font-bold hover:bg-slate-50"
          >
            Financial View
          </button>

          <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20">
            <Calendar className="w-3 h-3" /> Run Schedule: +35m Ahead
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

      {viewSubMode === 'NOC_MATRIX' ? (
        <SmtNocTelemetryStudio />
      ) : (
        <>
          {/* 2. TOP ROW: 4 VIBRANT SATURATED HERO CARDS WITH INLINE SPARKLINE WAVES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Card 1: Overall Plant OEE */}
            <div 
              onClick={() => handleOpenDrillDown('oee')}
              className="bg-[#0284C7] text-white p-4 rounded-xl shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="flex items-center justify-between z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-sky-100 font-mono font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> ▲ +2.4% vs last hour
                </span>
              </div>

              <div className="my-2 z-10 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Overall Plant OEE</div>
                  <div className="text-3xl font-black font-mono tracking-tight mt-0.5">88.4 %</div>
                </div>

                {/* Inline SVG Wave Sparkline */}
                <div className="w-24 h-10">
                  <svg viewBox="0 0 100 40" className="w-full h-full">
                    <path
                      d="M 5 30 C 25 24, 45 32, 65 18 C 80 8, 90 12, 95 10"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="pt-2 border-t border-sky-400/40 flex items-center justify-between text-[11px] font-mono z-10">
                <span className="text-sky-100">Target: 85%</span>
                <span className="bg-white/20 text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
                  On Track ✓
                </span>
              </div>
            </div>

            {/* Card 2: First Pass Yield */}
            <div 
              onClick={() => handleOpenDrillDown('fpy')}
              className="bg-[#059669] text-white p-4 rounded-xl shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="flex items-center justify-between z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-emerald-100 font-mono font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> ▲ +0.6% vs last hour
                </span>
              </div>

              <div className="my-2 z-10 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">First Pass Yield</div>
                  <div className="text-3xl font-black font-mono tracking-tight mt-0.5">98.4 %</div>
                </div>

                <div className="w-24 h-10">
                  <svg viewBox="0 0 100 40" className="w-full h-full">
                    <path
                      d="M 5 28 C 25 22, 45 26, 65 16 C 80 10, 90 12, 95 8"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-400/40 flex items-center justify-between text-[11px] font-mono z-10">
                <span className="text-emerald-100">Target: 98%</span>
                <span className="bg-white/20 text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
                  On Track ✓
                </span>
              </div>
            </div>

            {/* Card 3: Volume Throughput */}
            <div 
              onClick={() => handleOpenDrillDown('throughput')}
              className="bg-[#7C3AED] text-white p-4 rounded-xl shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="flex items-center justify-between z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-purple-100 font-mono font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> ▲ +4.1% vs last hour
                </span>
              </div>

              <div className="my-2 z-10 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Volume Throughput</div>
                  <div className="text-3xl font-black font-mono tracking-tight mt-0.5">892 <span className="text-sm font-sans font-normal">Panels</span></div>
                </div>

                <div className="w-24 h-10">
                  <svg viewBox="0 0 100 40" className="w-full h-full">
                    <path
                      d="M 5 32 C 25 28, 45 30, 65 20 C 80 14, 90 10, 95 6"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-400/40 flex items-center justify-between text-[11px] font-mono z-10">
                <span className="text-purple-100">Target: 1200 Panels (Plan)</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-12 bg-purple-900/50 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-purple-300 h-full rounded-full" style={{ width: '74.3%' }} />
                  </div>
                  <span className="font-bold text-[10px]">74.3%</span>
                </div>
              </div>
            </div>

            {/* Card 4: Financial Impact */}
            <div 
              onClick={() => handleOpenDrillDown('scrap')}
              className="bg-[#EA580C] text-white p-4 rounded-xl shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="flex items-center justify-between z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-orange-100 font-mono font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> ▲ +18.5% vs last hour
                </span>
              </div>

              <div className="my-2 z-10 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Financial Impact</div>
                  <div className="text-3xl font-black font-mono tracking-tight mt-0.5">$142.50</div>
                </div>

                <div className="w-24 h-10">
                  <svg viewBox="0 0 100 40" className="w-full h-full">
                    <path
                      d="M 5 15 C 25 18, 45 12, 65 24 C 80 28, 90 32, 95 34"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="pt-2 border-t border-orange-400/40 flex items-center justify-between text-[11px] font-mono z-10">
                <span className="text-orange-100">Target: 350 (Cap)</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-12 bg-orange-900/50 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-orange-300 h-full rounded-full" style={{ width: '40.7%' }} />
                  </div>
                  <span className="font-bold text-[10px]">40.7%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. MIDDLE ROW: PRODUCTION LINES COMPARISON & YIELD OUTPUT TREND */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Left Panel: Production Lines Comparison */}
            <div className={`${cardBg} p-4 rounded-xl border shadow-xs flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <span className="font-bold text-xs tracking-tight block">Production Lines Comparison</span>
                    <span className={`${subtextMuted} text-[10px]`}>Multi-line performance benchmark</span>
                  </div>
                </div>
                <div className="flex rounded p-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
                  {(['OEE', 'YIELD', 'SPEED', 'SCRAP'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setLineFilter(mode)}
                      className={`px-2 py-0.5 rounded ${lineFilter === mode ? 'bg-[#1E50ED] text-white font-bold' : 'text-slate-500'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Two Lines Side-by-Side (Line 01 vs Line 02) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Line 01 */}
                <div className={`${innerCardBg} p-3 rounded-xl border flex flex-col justify-between`}>
                  <div className="text-[11px] font-bold tracking-tight mb-2 truncate">
                    SMD Line 01 – Fuji NXT III M6 (High-Speed Line)
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Donut Gauge 88.4% */}
                    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 100 100" className="w-20 h-20 -rotate-90">
                        <circle cx="50" cy="50" r="38" stroke="#E2E8F0" strokeWidth="9" fill="none" className="dark:stroke-slate-800" />
                        <circle
                          cx="50" cy="50" r="38"
                          stroke="#10B981" strokeWidth="9"
                          strokeDasharray="211.1 238.8"
                          strokeLinecap="round" fill="none"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-xs font-black font-mono block">88.4%</span>
                        <span className="text-[8.5px] font-bold text-slate-400 uppercase">OEE</span>
                      </div>
                    </div>

                    {/* Breakdown List */}
                    <div className="space-y-1 font-mono text-[10.5px]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1 text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Availability
                        </span>
                        <span className="font-bold">97.2%</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1 text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Performance
                        </span>
                        <span className="font-bold">92.6%</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1 text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Quality
                        </span>
                        <span className="font-bold">98.1%</span>
                      </div>
                    </div>
                  </div>
                  {/* Subtle decorative bottom wave */}
                  <div className="w-full h-4 mt-2">
                    <svg viewBox="0 0 150 20" className="w-full h-full">
                      <path d="M 0 12 C 30 5, 60 16, 90 8 C 120 4, 140 10, 150 6" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.5" />
                    </svg>
                  </div>
                </div>

                {/* Line 02 */}
                <div className={`${innerCardBg} p-3 rounded-xl border flex flex-col justify-between`}>
                  <div className="text-[11px] font-bold tracking-tight mb-2 truncate">
                    SMD Line 02 – Fuji AIMEX IIIc (Flexible Line)
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Donut Gauge 86.2% */}
                    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 100 100" className="w-20 h-20 -rotate-90">
                        <circle cx="50" cy="50" r="38" stroke="#E2E8F0" strokeWidth="9" fill="none" className="dark:stroke-slate-800" />
                        <circle
                          cx="50" cy="50" r="38"
                          stroke="#06B6D4" strokeWidth="9"
                          strokeDasharray="205.8 238.8"
                          strokeLinecap="round" fill="none"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-xs font-black font-mono block">86.2%</span>
                        <span className="text-[8.5px] font-bold text-slate-400 uppercase">OEE</span>
                      </div>
                    </div>

                    {/* Breakdown List */}
                    <div className="space-y-1 font-mono text-[10.5px]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1 text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Availability
                        </span>
                        <span className="font-bold">95.8%</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1 text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Performance
                        </span>
                        <span className="font-bold">89.1%</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1 text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Quality
                        </span>
                        <span className="font-bold">97.5%</span>
                      </div>
                    </div>
                  </div>
                  {/* Subtle decorative bottom wave */}
                  <div className="w-full h-4 mt-2">
                    <svg viewBox="0 0 150 20" className="w-full h-full">
                      <path d="M 0 14 C 30 8, 60 15, 90 10 C 120 6, 140 12, 150 9" fill="none" stroke="#06B6D4" strokeWidth="1.5" opacity="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Yield & Output Trend */}
            <div className={`${cardBg} p-4 rounded-xl border shadow-xs flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-xs tracking-tight">Yield & Output Trend</span>
                </div>
                <div className="flex items-center gap-2">
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
              </div>

              {/* Legend & Current Peak Badge */}
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Yield %
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-3 h-0.5 border-t border-dashed border-slate-400" /> Target (98.0%)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] font-mono">
                  98.4%
                </span>
              </div>

              {/* Smooth Area Spline Chart */}
              <div className="w-full h-40">
                <svg viewBox="0 0 400 130" className="w-full h-full overflow-visible">
                  {/* Horizontal Grid */}
                  {[70, 80, 90, 100].map((val) => {
                    const y = 110 - ((val - 70) / 30) * 85;
                    return (
                      <g key={val}>
                        <line x1="25" y1={y} x2="395" y2={y} stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="2,2" className="dark:stroke-slate-800" />
                        <text x="20" y={y + 3} textAnchor="end" fontSize="7.5" fill="#94A3B8" fontFamily="monospace">
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Target Line at 98% */}
                  <line
                    x1="25"
                    y1={110 - ((98 - 70) / 30) * 85}
                    x2="395"
                    y2={110 - ((98 - 70) / 30) * 85}
                    stroke="#94A3B8"
                    strokeWidth="1.2"
                    strokeDasharray="4,3"
                  />

                  {/* Shaded Area Fill */}
                  <path
                    d="M 35 48 C 75 42, 115 36, 155 38 C 195 42, 235 32, 275 28 C 315 26, 355 24, 390 22 L 390 110 L 35 110 Z"
                    fill="#10B981"
                    opacity="0.15"
                  />

                  {/* Yield Spline Line */}
                  <path
                    d="M 35 48 C 75 42, 115 36, 155 38 C 195 42, 235 32, 275 28 C 315 26, 355 24, 390 22"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  {[
                    { x: 35, y: 48 },
                    { x: 125, y: 37 },
                    { x: 215, y: 36 },
                    { x: 305, y: 26 },
                    { x: 390, y: 22 }
                  ].map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                  ))}

                  {/* Time Axis */}
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

          {/* 4. BOTTOM ROW: 7-DAY ROLLING OEE & SCRAP COST TREND + KEY INSIGHTS & SYSTEM HEALTH */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Left 7 Columns: 7-Day Rolling OEE & Scrap Cost Trend */}
            <div className={`${cardBg} p-4 rounded-xl border shadow-xs lg:col-span-7 flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-xs tracking-tight">7-Day Rolling OEE & Scrap Cost Trend</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-blue-600" /> OEE %
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Yield %
                  </span>
                  <span className="flex items-center gap-1 text-orange-500 font-bold">
                    <span className="w-2.5 h-2 rounded-sm bg-orange-500" /> Scrap Cost
                  </span>
                </div>
              </div>

              {/* Composite SVG Chart (Bars for Scrap Cost + Line for OEE) */}
              <div className="w-full h-44">
                <svg viewBox="0 0 420 140" className="w-full h-full overflow-visible">
                  {/* Left Y-Axis (60% to 100%) */}
                  {[60, 70, 80, 90, 100].map((val) => {
                    const y = 115 - ((val - 60) / 40) * 90;
                    return (
                      <g key={val}>
                        <line x1="28" y1={y} x2="385" y2={y} stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="2,2" className="dark:stroke-slate-800" />
                        <text x="24" y={y + 3} textAnchor="end" fontSize="7" fill="#94A3B8" fontFamily="monospace">
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Right Y-Axis (0k to 15k Scrap Cost) */}
                  {[0, 5, 10, 15].map((val) => {
                    const y = 115 - (val / 15) * 90;
                    return (
                      <text key={val} x="390" y={y + 3} textAnchor="start" fontSize="7" fill="#EA580C" fontFamily="monospace">
                        {val}k
                      </text>
                    );
                  })}

                  {/* 7 Days: Bars (Scrap Cost) & Line Points (OEE) */}
                  {[
                    { day: 'Mon', date: '(01/09)', scrapK: 4.2, oee: 84.1, yieldPct: 97.8, x: 50 },
                    { day: 'Tue', date: '(02/09)', scrapK: 3.8, oee: 86.5, yieldPct: 98.2, x: 100 },
                    { day: 'Wed', date: '(03/09)', scrapK: 4.5, oee: 85.8, yieldPct: 98.0, x: 150 },
                    { day: 'Thu', date: '(04/09)', scrapK: 3.2, oee: 87.4, yieldPct: 98.5, x: 200 },
                    { day: 'Fri', date: '(05/09)', scrapK: 2.8, oee: 89.1, yieldPct: 98.8, x: 250 },
                    { day: 'Sat', date: '(06/09)', scrapK: 3.5, oee: 88.2, yieldPct: 98.4, x: 300 },
                    { day: 'Sun', date: '(07/09)', scrapK: 2.1, oee: 88.4, yieldPct: 98.4, x: 350 },
                  ].map((item, idx) => {
                    const barHeight = (item.scrapK / 15) * 90;
                    const barY = 115 - barHeight;
                    const oeeY = 115 - ((item.oee - 60) / 40) * 90;

                    return (
                      <g key={idx}>
                        {/* Scrap Cost Bar */}
                        <rect x={item.x - 9} y={barY} width="18" height={barHeight} rx="2" fill="#EA580C" opacity="0.85" />
                        
                        {/* Day & Date Labels */}
                        <text x={item.x} y="127" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#475569" fontFamily="monospace">
                          {item.day}
                        </text>
                        <text x={item.x} y="136" textAnchor="middle" fontSize="6.5" fill="#94A3B8" fontFamily="monospace">
                          {item.date}
                        </text>

                        {/* OEE Value Callout above line */}
                        <text x={item.x} y={oeeY - 6} textAnchor="middle" fontSize="7" fontWeight="bold" fill="#1E50ED" fontFamily="monospace">
                          {item.oee}%
                        </text>
                        {/* OEE Point */}
                        <circle cx={item.x} cy={oeeY} r="3" fill="#1E50ED" stroke="#FFFFFF" strokeWidth="1.5" />
                      </g>
                    );
                  })}

                  {/* Connecting OEE Line */}
                  <path
                    d="M 50 61 L 100 55 L 150 57 L 200 53 L 250 49 L 300 51 L 350 51"
                    fill="none"
                    stroke="#1E50ED"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Right 5 Columns: Split into Key Insights (60%) and System Health (40%) */}
            <div className={`${cardBg} p-4 rounded-xl border shadow-xs lg:col-span-5 grid grid-cols-1 sm:grid-cols-12 gap-3`}>
              {/* Key Insights (7 cols) */}
              <div className="sm:col-span-7 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-xs tracking-tight">Key Insights</span>
                  </div>
                  <button className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-0.5 font-mono">
                    View All <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>

                <div className="space-y-2 text-[11px] font-sans">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                      <TrendingUp className="w-3 h-3" />
                    </div>
                    <p className="leading-tight">
                      <strong className="text-emerald-600 dark:text-emerald-400">OEE is 88.4%</strong>, up by 2.4% compared to last hour.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <p className="leading-tight">
                      <strong className="text-blue-600 dark:text-blue-400">Yield reached 98.4%</strong>, meeting the shift target.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                    <p className="leading-tight text-[10.5px]">
                      Scrap is trending <strong className="text-amber-600">18.5% higher</strong> — review feeder settings on Line 02.
                    </p>
                  </div>
                </div>
              </div>

              {/* System Health (5 cols) */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center sm:border-l sm:border-slate-100 dark:sm:border-slate-800 pl-2">
                <div className="flex items-center gap-1.5 text-xs font-bold mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>System Health</span>
                </div>

                {/* Circular Gauge 99.2% */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-20 h-20 -rotate-90">
                    <circle cx="50" cy="50" r="38" stroke="#E2E8F0" strokeWidth="8" fill="none" className="dark:stroke-slate-800" />
                    <circle
                      cx="50" cy="50" r="38"
                      stroke="#10B981" strokeWidth="8"
                      strokeDasharray="236.9 238.8"
                      strokeLinecap="round" fill="none"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-xs font-black font-mono block">99.2%</span>
                    <span className="text-[8.5px] font-bold text-slate-400 uppercase">Online</span>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[9.5px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    All Systems OK
                  </span>
                </div>
              </div>
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
