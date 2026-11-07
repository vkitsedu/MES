import React, { useState } from 'react';
import { 
  Building2, CheckCircle2, XCircle, AlertTriangle, Clock, ArrowRight,
  Search, Play, Pause, AlertOctagon, RotateCw, Filter, Layers, 
  Cpu, Flame, Eye, Shield, Tag, Calendar, Database, Activity,
  Sliders, Settings, Wrench, BarChart2, ChevronRight, Check,
  Maximize2, Download, Printer, RefreshCw, Star, FileText, TrendingUp, Zap
} from 'lucide-react';
import {
  DpxDonutChart,
  DpxHorizontalPareto,
  DpxMultiLineTrend,
  DpxDualBarChart,
  DpxReflowThermalCurve,
  DpxGanttTimeline,
  Dpx3dHeatmap,
  DpxOpticalPcb,
  DpxProcessStepper
} from './DpxCharts';

// Sequence Badge Component matching top-left [1], [2]... [20]
export const DpxSeqBadge: React.FC<{ seq: number; title: string; subtitle?: string }> = ({ seq, title, subtitle }) => (
  <div className="flex items-center gap-2 bg-[#0a192f] text-white px-3 py-1.5 rounded-t border-b-2 border-blue-500 shadow-sm">
    <div className="bg-blue-600 text-white font-black text-xs px-2 py-0.5 rounded shadow-inner font-mono">
      {seq}
    </div>
    <div className="font-bold text-xs tracking-wide uppercase text-slate-100 flex items-center gap-2">
      <span>{title}</span>
      {subtitle && <span className="text-[10px] text-blue-300 font-normal font-mono">({subtitle})</span>}
    </div>
  </div>
);

// -------------------------------------------------------------
// [1] Plant Overview Dashboard
// -------------------------------------------------------------
export const Dashboard1PlantOverview: React.FC = () => {
  const [activeView, setActiveView] = useState<'sapphire' | 'multi_plant'>('sapphire');
  const [timeRange, setTimeRange] = useState<string>('Shift A');

  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={1} title="Plant Overview Dashboard" subtitle="DPX Enterprise Cloud Analytics" />

      {/* Control Strip: Sub-view Switcher + Filter Pills + Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 my-3 bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs">
        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
          <button
            onClick={() => setActiveView('sapphire')}
            className={`px-3 py-1 font-bold rounded transition-all ${
              activeView === 'sapphire'
                ? 'bg-[#1E50ED] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Executive Cloud View (Sapphire)
          </button>
          <button
            onClick={() => setActiveView('multi_plant')}
            className={`px-3 py-1 font-bold rounded transition-all ${
              activeView === 'multi_plant'
                ? 'bg-[#1E50ED] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Multi-Plant Facility Grid
          </button>
        </div>

        {/* Time Range Pills */}
        <div className="flex items-center gap-1 text-xs">
          {['Today', 'Shift A', 'Last 7 days', 'Last 30 days', 'All Time'].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                timeRange === r
                  ? 'bg-blue-50 text-[#1E50ED] border border-blue-200 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          <button className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-700 font-medium shadow-2xs">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Data</span>
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-700 font-medium shadow-2xs">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Reports</span>
          </button>
        </div>
      </div>

      {activeView === 'sapphire' ? (
        <div className="space-y-3">
          {/* 1. TOP 4 SATURATED HERO CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Card 1: Cobalt Blue (#1E50ED) - Total Output & Plan */}
            <div className="bg-gradient-to-br from-[#1E50ED] to-[#1643CD] text-white p-4 rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-100 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-white" /> Total SMT Units & Plan
                </span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  +4.2% pace
                </span>
              </div>
              <div className="my-1">
                <div className="text-3xl font-black font-mono tracking-tight text-white">118,340</div>
                <div className="text-xs text-blue-100 font-mono mt-0.5">
                  Plan Target: <span className="font-bold text-white">125,600 pcs</span> (94.2%)
                </div>
              </div>
              {/* Wave Spline Chart Graphic */}
              <div className="h-10 my-1 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="blueWaveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,32 Q30,12 60,24 T120,14 T160,20 T200,6 L200,40 L0,40 Z"
                    fill="url(#blueWaveGrad)"
                  />
                  <path
                    d="M0,32 Q30,12 60,24 T120,14 T160,20 T200,6"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="text-[11px] text-blue-100 flex items-center justify-between border-t border-white/20 pt-1.5 font-mono">
                <span>Pacing: <strong className="text-white">+7,260 pcs</strong></span>
                <span>Shift A On-Track</span>
              </div>
            </div>

            {/* Card 2: Ocean Cyan (#00A8B5) - Active SMT Lines */}
            <div className="bg-gradient-to-br from-[#00A8B5] to-[#008B96] text-white p-4 rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-100 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-white" /> Active SMT Lines
                </span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  14 Total
                </span>
              </div>
              <div className="flex items-center justify-between my-1">
                <div>
                  <div className="text-3xl font-black font-mono tracking-tight text-white">11 Active</div>
                  <div className="text-xs text-cyan-100 font-mono mt-0.5">
                    Fleet Utilization: <span className="font-bold text-white">78.6%</span>
                  </div>
                </div>
                {/* Donut Status Ring */}
                <div className="relative w-12 h-12 shrink-0">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3.5" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeDasharray="78.6, 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-black text-[10px] font-mono text-white">
                    79%
                  </span>
                </div>
              </div>
              <div className="space-y-1 my-1">
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden flex">
                  <div style={{ width: '78.6%' }} className="bg-white h-full" title="11 Running" />
                  <div style={{ width: '14.3%' }} className="bg-amber-300 h-full" title="2 Idle" />
                  <div style={{ width: '7.1%' }} className="bg-red-300 h-full" title="1 Down" />
                </div>
              </div>
              <div className="text-[11px] text-cyan-100 flex items-center justify-between border-t border-white/20 pt-1.5 font-mono">
                <span>● 11 Run</span>
                <span>● 2 Idle</span>
                <span>● 1 Down</span>
              </div>
            </div>

            {/* Card 3: Deep Indigo (#4F46E5) - First Pass Yield */}
            <div className="bg-gradient-to-br from-[#4F46E5] to-[#3B34AF] text-white p-4 rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-100 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-white" /> First Pass Yield (FPY)
                </span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  Six Sigma
                </span>
              </div>
              <div className="flex items-center justify-between my-1">
                <div>
                  <div className="text-3xl font-black font-mono tracking-tight text-white">98.9%</div>
                  <div className="text-xs text-indigo-100 font-mono mt-0.5">
                    Shift Delta: <span className="font-bold text-emerald-200">▲ +0.4%</span>
                  </div>
                </div>
                {/* Mini FPY Arc Gauge */}
                <div className="relative w-12 h-12 shrink-0">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3.5" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#A5B4FC"
                      strokeWidth="3.5"
                      strokeDasharray="98.9, 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-black text-[9px] font-mono text-white">
                    0.011
                  </span>
                </div>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden my-1">
                <div style={{ width: '98.9%' }} className="bg-emerald-300 h-full rounded-full" />
              </div>
              <div className="text-[11px] text-indigo-100 flex items-center justify-between border-t border-white/20 pt-1.5 font-mono">
                <span>Target: <strong>98.5%</strong></span>
                <span>DPU: <strong>0.011</strong></span>
              </div>
            </div>

            {/* Card 4: Electric Purple (#7E1CE5) - Placement Speed */}
            <div className="bg-gradient-to-br from-[#7E1CE5] to-[#6012B5] text-white p-4 rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-100 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-white" /> Placement Speed (CPH)
                </span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  Peak Speed
                </span>
              </div>
              <div className="my-1">
                <div className="text-3xl font-black font-mono tracking-tight text-white">44,820</div>
                <div className="text-xs text-purple-100 font-mono mt-0.5">
                  Total Throughput: <span className="font-bold text-white">CPH Fleet Pace</span>
                </div>
              </div>
              {/* Mini Column Bars */}
              <div className="h-10 my-1 flex items-end justify-between gap-1 px-1">
                {[55, 68, 74, 88, 92, 85, 96].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      style={{ height: `${val * 0.35}px` }}
                      className={`w-full rounded-xs transition-all ${
                        idx === 6 ? 'bg-white shadow-xs' : 'bg-white/40'
                      }`}
                    />
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-purple-100 flex items-center justify-between border-t border-white/20 pt-1.5 font-mono">
                <span>Line 01: <strong>48.2k CPH</strong></span>
                <span>Line 02: <strong>44.1k CPH</strong></span>
              </div>
            </div>
          </div>

          {/* 2. SIX SECONDARY WHITE CARDS WITH COLORED BADGES */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {/* Card 1: Amber - Line Holds */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Line Holds</div>
                  <div className="text-sm font-black font-mono text-slate-800">0 Holds</div>
                  <div className="text-[10px] text-slate-400">Watch list: 0</div>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                0 Holds
              </span>
            </div>

            {/* Card 2: Green - Stencil & Solder Paste Life */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stencil & Paste</div>
                  <div className="text-sm font-black font-mono text-slate-800">100% In-Spec</div>
                  <div className="text-[10px] text-slate-400">Remaining &gt;4.5h</div>
                </div>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                2 Low
              </span>
            </div>

            {/* Card 3: Purple - 21 CFR Part 11 e-Signatures */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">e-Signatures</div>
                  <div className="text-sm font-black font-mono text-slate-800">100% Signed</div>
                  <div className="text-[10px] text-slate-400">972 records</div>
                </div>
              </div>
              <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                Signed
              </span>
            </div>

            {/* Card 4: Orange - Reflow Thermal PWI */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Thermal PWI</div>
                  <div className="text-sm font-black font-mono text-slate-800">100% Pass</div>
                  <div className="text-[10px] text-slate-400">1,238 profiled</div>
                </div>
              </div>
              <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                Pass
              </span>
            </div>

            {/* Card 5: Cyan - Active SMT Equipment */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SMT Equipment</div>
                  <div className="text-sm font-black font-mono text-slate-800">14 Online</div>
                  <div className="text-[10px] text-slate-400">0 Downtime</div>
                </div>
              </div>
              <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                14/14
              </span>
            </div>

            {/* Card 6: Amber Star - Six Sigma Quality Index */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Six Sigma Index</div>
                  <div className="text-sm font-black font-mono text-slate-800">1.48 Cpk</div>
                  <div className="text-[10px] text-slate-400">3.4 DPMO Goal</div>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                Excellent
              </span>
            </div>
          </div>

          {/* 3. TWO BOTTOM ANALYTICAL VISUALIZATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Left: Daily SMT Production Trend (7 cols) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs lg:col-span-7 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#1E50ED]" /> Daily SMT Production Trend & Takt Velocity
                  </div>
                  <div className="text-xs text-slate-500">
                    Throughput vs planned velocity across Shift A (Units / Hour)
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E50ED]" /> Actual
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-0.5 bg-slate-300" /> Target (15.7k)
                  </span>
                </div>
              </div>

              {/* Blue Spline Wave Chart */}
              <div className="h-56 relative w-full pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="splineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E50ED" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#1E50ED" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[40, 80, 120, 160].map((y) => (
                    <line key={y} x1="40" y1={y} x2="580" y2={y} stroke="#F1F5F9" strokeWidth="1" />
                  ))}

                  {/* Y-axis Labels */}
                  <text x="35" y="44" textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="monospace">20k</text>
                  <text x="35" y="84" textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="monospace">15k</text>
                  <text x="35" y="124" textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="monospace">10k</text>
                  <text x="35" y="164" textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="monospace">5k</text>

                  {/* Target Reference Line */}
                  <line x1="40" y1="74" x2="580" y2="74" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />

                  {/* Shaded Area */}
                  <path
                    d="M 50,150 C 110,130 150,95 210,85 C 270,75 300,35 360,40 C 420,45 450,75 510,70 C 540,68 560,90 575,95 L 575,180 L 50,180 Z"
                    fill="url(#splineAreaGrad)"
                  />

                  {/* Spline Curve */}
                  <path
                    d="M 50,150 C 110,130 150,95 210,85 C 270,75 300,35 360,40 C 420,45 450,75 510,70 C 540,68 560,90 575,95"
                    fill="none"
                    stroke="#1E50ED"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  {[
                    { cx: 50, cy: 150, val: '6.2k' },
                    { cx: 130, cy: 110, val: '11.8k' },
                    { cx: 210, cy: 85, val: '14.2k' },
                    { cx: 290, cy: 55, val: '16.9k' },
                    { cx: 360, cy: 40, val: '18.4k', peak: true },
                    { cx: 440, cy: 72, val: '15.1k' },
                    { cx: 510, cy: 70, val: '15.6k' },
                    { cx: 575, cy: 95, val: '13.2k' }
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.cx} cy={pt.cy} r={pt.peak ? 5 : 4} fill="#FFFFFF" stroke="#1E50ED" strokeWidth="2.5" />
                      {pt.peak && (
                        <g>
                          <rect x={pt.cx - 45} y={pt.cy - 30} width="90" height="20" rx="4" fill="#0A192F" />
                          <text x={pt.cx} y={pt.cy - 16} textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">
                            Peak: 18,450 pcs
                          </text>
                          <polygon points={`${pt.cx-4},${pt.cy-10} ${pt.cx+4},${pt.cy-10} ${pt.cx},${pt.cy-6}`} fill="#0A192F" />
                        </g>
                      )}
                    </g>
                  ))}

                  {/* X-axis Labels */}
                  <text x="50" y="195" textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="monospace">08:00</text>
                  <text x="130" y="195" textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="monospace">10:00</text>
                  <text x="210" y="195" textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="monospace">12:00</text>
                  <text x="290" y="195" textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="monospace">14:00</text>
                  <text x="360" y="195" textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="monospace">16:00</text>
                  <text x="440" y="195" textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="monospace">18:00</text>
                  <text x="510" y="195" textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="monospace">20:00</text>
                  <text x="575" y="195" textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="monospace">22:00</text>
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2 font-mono">
                <span>Shift Avg: <strong className="text-slate-900">14,792 pcs/hr</strong></span>
                <span>Pace Delta: <strong className="text-emerald-600">+4.2%</strong></span>
                <span>Adherence: <strong className="text-blue-600">98.4%</strong></span>
              </div>
            </div>

            {/* Right: Hourly Output & Takt Pacing Analysis (5 cols) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs lg:col-span-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-emerald-600" /> Hourly Output & Takt Pacing
                  </div>
                  <div className="text-xs text-slate-500">Clean histogram takt adherence</div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                  Peak: 12:00 (18.4k)
                </span>
              </div>

              {/* Green Histogram Bar Chart */}
              <div className="h-56 relative w-full pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 350 200" preserveAspectRatio="none">
                  {/* Grid lines */}
                  {[40, 80, 120, 160].map((y) => (
                    <line key={y} x1="30" y1={y} x2="330" y2={y} stroke="#F1F5F9" strokeWidth="1" />
                  ))}

                  {/* Target benchmark dashed line */}
                  <line x1="30" y1="75" x2="330" y2="75" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="325" y="70" textAnchor="end" fontSize="8" fill="#D97706" fontFamily="monospace" fontWeight="bold">
                    Target Takt
                  </text>

                  {/* Histogram Bars */}
                  {[
                    { hour: '08h', val: 95, h: 70 },
                    { hour: '10h', val: 130, h: 95 },
                    { hour: '12h', val: 184, h: 140, peak: true },
                    { hour: '14h', val: 142, h: 105 },
                    { hour: '16h', val: 168, h: 125 },
                    { hour: '18h', val: 151, h: 115 },
                    { hour: '20h', val: 132, h: 100 },
                  ].map((bar, i) => {
                    const x = 45 + i * 40;
                    const y = 175 - bar.h;
                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={y}
                          width="24"
                          height={bar.h}
                          rx="3"
                          fill={bar.peak ? '#10B981' : '#34D399'}
                          className="hover:opacity-90 transition-opacity"
                        />
                        <text
                          x={x + 12}
                          y={y - 4}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#0F172A"
                          fontFamily="monospace"
                          fontWeight={bar.peak ? 'bold' : 'normal'}
                        >
                          {(bar.val / 10).toFixed(1)}k
                        </text>
                        <text
                          x={x + 12}
                          y="190"
                          textAnchor="middle"
                          fontSize="9"
                          fill="#64748B"
                          fontFamily="monospace"
                        >
                          {bar.hour}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2 font-mono">
                <span>Mean Takt: <strong className="text-emerald-700">18.2s</strong></span>
                <span>Target: <strong className="text-slate-700">19.5s</strong></span>
                <span className="text-emerald-600 font-bold">Beating Takt</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MULTI-PLANT BREAKDOWN VIEW (PUNE / NOIDA / GREATER NOIDA) */
        <div className="space-y-3">
          {/* Top 6 KPI summary */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 my-2">
            <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Total Plan</div>
              <div className="text-xl font-black text-slate-900 mt-1 font-mono">125,600</div>
              <div className="text-[10px] text-slate-400">Target units</div>
            </div>
            <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Total Actual</div>
              <div className="text-xl font-black text-blue-600 mt-1 font-mono">118,340</div>
              <div className="text-[10px] text-slate-400">Achieved units</div>
            </div>
            <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Achievement</div>
              <div className="text-xl font-black text-emerald-600 mt-1 font-mono">94.2%</div>
              <div className="text-[10px] text-emerald-500">↑ 1.2% shift pace</div>
            </div>
            <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Overall OEE</div>
              <div className="text-xl font-black text-amber-600 mt-1 font-mono">85.6%</div>
              <div className="text-[10px] text-slate-400">Target 85.0%</div>
            </div>
            <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Availability</div>
              <div className="text-xl font-black text-indigo-600 mt-1 font-mono">90.2%</div>
              <div className="text-[10px] text-slate-400">Uptime ratio</div>
            </div>
            <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">First Pass Yield</div>
              <div className="text-xl font-black text-purple-600 mt-1 font-mono">98.9%</div>
              <div className="text-[10px] text-purple-500">Six Sigma Target</div>
            </div>
          </div>

          {/* 3 Plant Cards with Circular OEE Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {/* Plant 01 Pune */}
            <div className="bg-white p-3 rounded shadow-xs border border-slate-200">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" /> Plant-01 (Pune)
                </span>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded font-mono">84.2%</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-500" strokeDasharray="84.2, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute font-black text-[11px] font-mono text-slate-800">84%</span>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-1 text-center text-xs">
                  <div className="bg-slate-50 p-1 rounded">
                    <div className="text-[9px] text-slate-400">Plan</div>
                    <div className="font-bold font-mono text-[11px]">45k</div>
                  </div>
                  <div className="bg-slate-50 p-1 rounded">
                    <div className="text-[9px] text-slate-400">Actual</div>
                    <div className="font-bold text-blue-600 font-mono text-[11px]">42.1k</div>
                  </div>
                  <div className="bg-slate-50 p-1 rounded">
                    <div className="text-[9px] text-slate-400">FPY</div>
                    <div className="font-bold text-emerald-600 font-mono text-[11px]">98.6%</div>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t">
                <span>Active Lines: <strong>4 / 4</strong></span>
                <span className="text-emerald-600 font-bold">● Operational</span>
              </div>
            </div>

            {/* Plant 02 Noida */}
            <div className="bg-white p-3 rounded shadow-xs border border-slate-200">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" /> Plant-02 (Noida)
                </span>
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded font-mono">78.6%</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-amber-500" strokeDasharray="78.6, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute font-black text-[11px] font-mono text-slate-800">79%</span>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-1 text-center text-xs">
                  <div className="bg-slate-50 p-1 rounded">
                    <div className="text-[9px] text-slate-400">Plan</div>
                    <div className="font-bold font-mono text-[11px]">35k</div>
                  </div>
                  <div className="bg-slate-50 p-1 rounded">
                    <div className="text-[9px] text-slate-400">Actual</div>
                    <div className="font-bold text-blue-600 font-mono text-[11px]">30.9k</div>
                  </div>
                  <div className="bg-slate-50 p-1 rounded">
                    <div className="text-[9px] text-slate-400">FPY</div>
                    <div className="font-bold text-emerald-600 font-mono text-[11px]">98.1%</div>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t">
                <span>Active Lines: <strong>3 / 4</strong></span>
                <span className="text-amber-600 font-bold">● Maintenance</span>
              </div>
            </div>

            {/* Plant 03 Greater Noida */}
            <div className="bg-white p-3 rounded shadow-xs border border-slate-200">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-600" /> Plant-03 (Greater Noida)
                </span>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded font-mono">83.1%</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-cyan-500" strokeDasharray="83.1, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute font-black text-[11px] font-mono text-slate-800">83%</span>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-1 text-center text-xs">
                  <div className="bg-slate-50 p-1 rounded">
                    <div className="text-[9px] text-slate-400">Plan</div>
                    <div className="font-bold font-mono text-[11px]">45.6k</div>
                  </div>
                  <div className="bg-slate-50 p-1 rounded">
                    <div className="text-[9px] text-slate-400">Actual</div>
                    <div className="font-bold text-blue-600 font-mono text-[11px]">45.3k</div>
                  </div>
                  <div className="bg-slate-50 p-1 rounded">
                    <div className="text-[9px] text-slate-400">FPY</div>
                    <div className="font-bold text-emerald-600 font-mono text-[11px]">99.1%</div>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t">
                <span>Active Lines: <strong>4 / 4</strong></span>
                <span className="text-emerald-600 font-bold">● Peak Output</span>
              </div>
            </div>
          </div>

          {/* Plan vs Actual Chart + Line Status Donut + Active Alarms */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Plan vs Actual Bar (col-span-6) */}
            <div className="bg-white p-3 rounded shadow-xs border border-slate-200 md:col-span-6 flex flex-col justify-between">
              <div className="font-bold text-xs text-slate-700 mb-1 flex items-center justify-between">
                <span>Plan vs Actual (All Plants)</span>
                <span className="text-[10px] text-slate-400 font-mono">118,340 / 125,600 pcs</span>
              </div>
              <DpxDualBarChart
                items={[
                  { label: 'Line 01', plan: 90, actual: 85 },
                  { label: 'Line 02', plan: 95, actual: 92 },
                  { label: 'Line 03', plan: 80, actual: 78 },
                  { label: 'Line 04', plan: 100, actual: 97 },
                  { label: 'Line 05', plan: 85, actual: 81 },
                  { label: 'Line 06', plan: 90, actual: 89 },
                  { label: 'Line 07', plan: 95, actual: 93 },
                  { label: 'Line 08', plan: 75, actual: 70 },
                ]}
                height={155}
              />
            </div>

            {/* Line Status SVG Donut Chart (col-span-3) */}
            <div className="bg-white p-3 rounded shadow-xs border border-slate-200 md:col-span-3 flex flex-col justify-between">
              <div className="font-bold text-xs text-slate-700 mb-1">Line Status Overview</div>
              <div className="py-1 flex justify-center">
                <DpxDonutChart
                  data={[
                    { label: 'Running', value: 11, color: '#059669' },
                    { label: 'Idle', value: 2, color: '#D97706' },
                    { label: 'Down', value: 1, color: '#DC2626' }
                  ]}
                  size={130}
                  donutWidth={20}
                  centerValue="100%"
                  centerLabel="14 Lines"
                  legendPosition="bottom"
                />
              </div>
              <div className="text-[10px] text-center text-slate-500 border-t pt-1 font-mono">
                Availability: <strong className="text-emerald-600">92.8% (SEMI E10)</strong>
              </div>
            </div>

            {/* Active Alarms (col-span-3) */}
            <div className="bg-white p-3 rounded shadow-xs border border-slate-200 md:col-span-3 flex flex-col justify-between">
              <div>
                <div className="font-bold text-xs text-slate-700 mb-2">Active Cleanroom Alarms</div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between bg-red-50 text-red-700 px-2.5 py-2 rounded border border-red-200">
                    <span className="font-bold font-sans">Critical Alarms</span>
                    <span className="font-black text-sm">2</span>
                  </div>
                  <div className="flex items-center justify-between bg-amber-50 text-amber-700 px-2.5 py-2 rounded border border-amber-200">
                    <span className="font-bold font-sans">Major Warnings</span>
                    <span className="font-black text-sm">5</span>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 text-blue-700 px-2.5 py-2 rounded border border-blue-200">
                    <span className="font-bold font-sans">Minor Notices</span>
                    <span className="font-black text-sm">3</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 border-t pt-1 font-mono text-center">
                Sensor Poll: 2s (Normal)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// [3] Production Planning Dashboard
// -------------------------------------------------------------
export const Dashboard3ProductionPlanning: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={3} title="Production Planning" subtitle="Gantt Scheduling & Bay Loading" />

      {/* Filter toolbar */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded shadow-sm border border-slate-200 my-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">Plant:</span>
          <select className="border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-700">
            <option>Plant-01 (Pune)</option>
            <option>Plant-02 (Noida)</option>
            <option>Plant-03 (Greater Noida)</option>
          </select>

          <span className="text-slate-500 font-medium ml-2">Line:</span>
          <select className="border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-700">
            <option>Line-01 (High Speed SMT)</option>
            <option>Line-02 (Flexible SMT)</option>
            <option>Line-03 (Prototypes)</option>
          </select>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border">
          <button className="px-2 py-1 text-xs font-bold rounded bg-blue-600 text-white shadow-xs">Day</button>
          <button className="px-2 py-1 text-xs font-bold rounded text-slate-600 hover:bg-white">Week</button>
          <button className="px-2 py-1 text-xs font-bold rounded text-slate-600 hover:bg-white">Month</button>
        </div>
      </div>

      {/* Gantt Timeline */}
      <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b mb-3">
          <span className="font-bold text-xs text-slate-700 uppercase">Line Work Schedule (25 Sep 2026 - 24h Timeline)</span>
          <div className="flex gap-4 text-xs font-mono">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-600 rounded-xs" /> Running</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-xs" /> Setup / Changeover</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs" /> Planned Next</span>
          </div>
        </div>

        <DpxGanttTimeline
          lines={[
            {
              lineName: 'Line-01 SMT',
              jobs: [
                { id: 'WO-01', product: 'SMT_ASSY_A', startHour: 0, durationHours: 10, color: '#2563EB', status: 'Running' },
                { id: 'SETUP', product: 'Changeover', startHour: 10, durationHours: 2, color: '#F59E0B', status: 'Setup' },
                { id: 'WO-04', product: 'CONTROL_B', startHour: 12, durationHours: 11, color: '#059669', status: 'Planned' }
              ]
            },
            {
              lineName: 'Line-02 SMT',
              jobs: [
                { id: 'WO-02', product: 'SMT_POWER_C', startHour: 0, durationHours: 8, color: '#2563EB', status: 'Running' },
                { id: 'WO-05', product: 'IOT_GATEWAY', startHour: 9, durationHours: 14, color: '#059669', status: 'Planned' }
              ]
            },
            {
              lineName: 'Line-03 SMT',
              jobs: [
                { id: 'WO-03', product: 'AUTO_SENSOR', startHour: 0, durationHours: 14, color: '#2563EB', status: 'Running' },
                { id: 'WO-06', product: 'BATTERY_BMS', startHour: 15, durationHours: 8, color: '#059669', status: 'Planned' }
              ]
            },
            {
              lineName: 'Line-04 SMT',
              jobs: [
                { id: 'MAINT', product: 'Preventive PM', startHour: 0, durationHours: 4, color: '#64748B', status: 'Maintenance' },
                { id: 'WO-07', product: 'SMART_METER', startHour: 4, durationHours: 19, color: '#059669', status: 'Planned' }
              ]
            }
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-3 pt-3 border-t text-xs font-mono">
          <div className="p-2 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-400 block text-[10px]">LINE 01 CAPACITY</span>
            <span className="font-bold text-slate-800">92% Loaded (23/24h)</span>
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-400 block text-[10px]">LINE 02 CAPACITY</span>
            <span className="font-bold text-slate-800">78% Loaded (22/24h)</span>
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-400 block text-[10px]">LINE 03 CAPACITY</span>
            <span className="font-bold text-slate-800">88% Loaded (22/24h)</span>
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-400 block text-[10px]">LINE 04 CAPACITY</span>
            <span className="font-bold text-slate-800">96% Loaded (23/24h)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [4] Work Order Management Dashboard
// -------------------------------------------------------------
export const Dashboard4WorkOrderManagement: React.FC = () => {
  const orders = [
    { no: 'WO-20260925-01', product: 'SMT_ASSY_A', planQty: '25,000', startDate: '25-09-2026', endDate: '26-09-2026', status: 'Running', color: 'bg-emerald-500' },
    { no: 'WO-20260925-02', product: 'SMT_ASSY_B', planQty: '18,000', startDate: '25-09-2026', endDate: '27-09-2026', status: 'Running', color: 'bg-emerald-500' },
    { no: 'WO-20260925-03', product: 'SMT_ASSY_C', planQty: '15,000', startDate: '24-09-2026', endDate: '25-09-2026', status: 'Down', color: 'bg-red-500' },
    { no: 'WO-20260924-04', product: 'SMT_ASSY_A', planQty: '20,000', startDate: '23-09-2026', endDate: '24-09-2026', status: 'Completed', color: 'bg-blue-600' },
    { no: 'WO-20260924-05', product: 'SMT_ASSY_B', planQty: '12,000', startDate: '24-09-2026', endDate: '25-09-2026', status: 'Hold', color: 'bg-amber-500' },
    { no: 'WO-20260923-06', product: 'SMT_ASSY_A', planQty: '25,000', startDate: '22-09-2026', endDate: '23-09-2026', status: 'Completed', color: 'bg-blue-600' },
  ];

  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={4} title="Work Order Management" subtitle="Production Orders & Batch Dispatch" />

      {/* Actions Strip */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded shadow-sm border border-slate-200 my-3">
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded shadow-xs hover:bg-blue-700 flex items-center gap-1">
            + New WO
          </button>
          <button className="bg-slate-100 text-slate-700 font-bold text-xs px-3 py-1.5 rounded border hover:bg-slate-200">
            Edit
          </button>
          <button className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded hover:bg-emerald-700">
            Release
          </button>
          <button className="bg-amber-500 text-white font-bold text-xs px-3 py-1.5 rounded hover:bg-amber-600">
            Hold
          </button>
          <button className="bg-slate-600 text-white font-bold text-xs px-3 py-1.5 rounded hover:bg-slate-700">
            Close
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Search:</span>
          <input type="text" placeholder="WO number / product..." className="border rounded px-2 py-1 text-xs w-48 font-mono" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b text-slate-500 font-mono uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">WO No.</th>
              <th className="py-2.5 px-3">Product</th>
              <th className="py-2.5 px-3 text-right">Plan Qty</th>
              <th className="py-2.5 px-3">Start Date</th>
              <th className="py-2.5 px-3">End Date</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {orders.map((wo) => (
              <tr key={wo.no} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3 font-bold text-blue-600">{wo.no}</td>
                <td className="py-2.5 px-3 text-slate-700 font-bold">{wo.product}</td>
                <td className="py-2.5 px-3 text-right font-black">{wo.planQty}</td>
                <td className="py-2.5 px-3 text-slate-500">{wo.startDate}</td>
                <td className="py-2.5 px-3 text-slate-500">{wo.endDate}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`${wo.color} text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs inline-block min-w-[70px]`}>
                    {wo.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <button className="text-blue-600 hover:text-blue-800 font-sans font-bold text-xs underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [5] Production Execution Dashboard
// -------------------------------------------------------------
export const Dashboard5ProductionExecution: React.FC = () => {
  const [scanResult, setScanResult] = useState<'OK' | 'NG'>('OK');

  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={5} title="Production Execution" subtitle="Floor PCB Scan Terminal & Verification" />

      {/* Top Filter Selection */}
      <div className="grid grid-cols-4 gap-2 bg-white p-2.5 rounded shadow-sm border border-slate-200 my-3 text-xs">
        <div>
          <span className="text-slate-400 font-mono text-[10px] block">PLANT</span>
          <select className="font-bold border rounded px-1.5 py-0.5 w-full mt-0.5 text-xs"><option>Plant-01</option></select>
        </div>
        <div>
          <span className="text-slate-400 font-mono text-[10px] block">LINE</span>
          <select className="font-bold border rounded px-1.5 py-0.5 w-full mt-0.5 text-xs"><option>Line-01</option></select>
        </div>
        <div>
          <span className="text-slate-400 font-mono text-[10px] block">WO NO.</span>
          <select className="font-bold border rounded px-1.5 py-0.5 w-full mt-0.5 text-xs"><option>WO-20260925-01</option></select>
        </div>
        <div>
          <span className="text-slate-400 font-mono text-[10px] block">PRODUCT</span>
          <select className="font-bold border rounded px-1.5 py-0.5 w-full mt-0.5 text-xs"><option>SMT_ASSY_A</option></select>
        </div>
      </div>

      {/* Huge Scan Button Section */}
      <div className="bg-white p-6 rounded shadow-sm border border-slate-200 text-center my-3">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cleanroom Optical Barcode Reader</div>
        <button 
          onClick={() => setScanResult('OK')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg px-8 py-3.5 rounded-lg shadow-md transition-transform active:scale-95 inline-flex items-center gap-2"
        >
          <CheckCircle2 className="w-6 h-6" /> Scan PCB Barcode
        </button>
        <div className="text-[11px] text-slate-400 font-mono mt-2">Ready to receive IPC-CFX barcode laser scanner pulse</div>
      </div>

      {/* Recent Scans Table */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-3 py-2 border-b font-bold text-xs text-slate-700 flex justify-between">
          <span>Recent Scans / Route Verification</span>
          <span className="text-[10px] text-emerald-600 font-mono">● Scanner Online (COM3)</span>
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b text-slate-500 font-mono uppercase text-[10px]">
            <tr>
              <th className="py-2 px-3">PCB Serial No</th>
              <th className="py-2 px-3">Scan Time</th>
              <th className="py-2 px-3">Current Process</th>
              <th className="py-2 px-3 text-center">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {[
              { sn: '705525635000551', time: '11:42:15', step: 'SPI Inspection', res: 'OK' },
              { sn: '705525635000552', time: '11:42:04', step: 'Placement Fuji NXT', res: 'OK' },
              { sn: '705525635000553', time: '11:41:51', step: 'AOI Inspection', res: 'NG' },
              { sn: '705525635000554', time: '11:41:33', step: 'Completed Unload', res: 'OK' },
              { sn: '705525635000555', time: '11:41:12', step: 'AOI Inspection', res: 'OK' },
              { sn: '705525635000556', time: '11:40:48', step: 'Placement Fuji NXT', res: 'OK' },
            ].map((s, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-2 px-3 font-bold text-slate-800">{s.sn}</td>
                <td className="py-2 px-3 text-slate-500">{s.time}</td>
                <td className="py-2 px-3 text-slate-700 font-bold">{s.step}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-xs ${
                    s.res === 'OK' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {s.res}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [6] WIP Management Dashboard
// -------------------------------------------------------------
export const Dashboard6WipManagement: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={6} title="WIP Management" subtitle="Work-In-Process Cleanroom Buffer Tracking" />

      {/* Top 7 Stat badges */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-2 my-3">
        <div className="bg-white p-2 rounded border border-slate-200 text-center shadow-xs">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Total WIP</div>
          <div className="text-xl font-black text-slate-900 font-mono mt-0.5">320</div>
        </div>
        <div className="bg-white p-2 rounded border border-slate-200 text-center shadow-xs">
          <div className="text-[10px] text-emerald-600 font-bold uppercase">Processing</div>
          <div className="text-xl font-black text-emerald-600 font-mono mt-0.5">210</div>
        </div>
        <div className="bg-white p-2 rounded border border-slate-200 text-center shadow-xs">
          <div className="text-[10px] text-amber-600 font-bold uppercase">Waiting</div>
          <div className="text-xl font-black text-amber-600 font-mono mt-0.5">45</div>
        </div>
        <div className="bg-white p-2 rounded border border-slate-200 text-center shadow-xs">
          <div className="text-[10px] text-red-600 font-bold uppercase">Hold</div>
          <div className="text-xl font-black text-red-600 font-mono mt-0.5">20</div>
        </div>
        <div className="bg-white p-2 rounded border border-slate-200 text-center shadow-xs">
          <div className="text-[10px] text-rose-600 font-bold uppercase">NG</div>
          <div className="text-xl font-black text-rose-600 font-mono mt-0.5">12</div>
        </div>
        <div className="bg-white p-2 rounded border border-slate-200 text-center shadow-xs">
          <div className="text-[10px] text-purple-600 font-bold uppercase">Repair</div>
          <div className="text-xl font-black text-purple-600 font-mono mt-0.5">8</div>
        </div>
        <div className="bg-white p-2 rounded border border-slate-200 text-center shadow-xs">
          <div className="text-[10px] text-blue-600 font-bold uppercase">Completed</div>
          <div className="text-xl font-black text-blue-600 font-mono mt-0.5">1,236</div>
        </div>
      </div>

      {/* WIP Queue Table */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b text-slate-500 font-mono uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">PCB Serial No</th>
              <th className="py-2.5 px-3">Product</th>
              <th className="py-2.5 px-3">Current Line</th>
              <th className="py-2.5 px-3">Current Process</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Time at Process</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {[
              { sn: '705525635000551', prod: 'SMT_ASSY_A', line: 'Line-01', step: 'Placement', status: 'Processing', color: 'bg-emerald-600', time: '00:01:22' },
              { sn: '705525635000552', prod: 'SMT_ASSY_B', line: 'Line-01', step: 'Placement', status: 'Processing', color: 'bg-emerald-600', time: '00:00:54' },
              { sn: '705525635000553', prod: 'SMT_ASSY_A', line: 'Line-01', step: 'Placement', status: 'Waiting', color: 'bg-amber-500', time: '00:03:10' },
              { sn: '705525635000554', prod: 'SMT_ASSY_C', line: 'Line-01', step: 'AOI', status: 'NG', color: 'bg-red-600', time: '00:05:28' },
              { sn: '705525635000555', prod: 'SMT_ASSY_A', line: 'Line-01', step: 'AOI', status: 'Repair', color: 'bg-purple-600', time: '00:08:45' },
              { sn: '705525635000556', prod: 'SMT_ASSY_A', line: 'Line-01', step: 'Completed', status: 'Completed', color: 'bg-blue-600', time: '00:09:00' },
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-blue-600">{row.sn}</td>
                <td className="py-2.5 px-3 text-slate-700 font-bold">{row.prod}</td>
                <td className="py-2.5 px-3 text-slate-500">{row.line}</td>
                <td className="py-2.5 px-3 text-slate-800 font-bold">{row.step}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`${row.color} text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs inline-block min-w-[70px]`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right text-slate-500">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [7] Quality Dashboard (Overall)
// -------------------------------------------------------------
export const Dashboard7QualityOverall: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={7} title="Quality Dashboard (Overall)" subtitle="Cleanroom Defect Pareto & Six Sigma SPC" />

      {/* Top 7 Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-2 my-3 font-mono">
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Overall FPY</div>
          <div className="text-xl font-black text-emerald-600 mt-1">98.9%</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">SPI FPY</div>
          <div className="text-xl font-black text-blue-600 mt-1">99.2%</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Placement FPY</div>
          <div className="text-xl font-black text-indigo-600 mt-1">99.5%</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">AOI FPY</div>
          <div className="text-xl font-black text-purple-600 mt-1">98.1%</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Defect PPM</div>
          <div className="text-xl font-black text-red-600 mt-1">6,250</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Repair Rate</div>
          <div className="text-xl font-black text-amber-600 mt-1">0.8%</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Scrap Rate</div>
          <div className="text-xl font-black text-slate-700 mt-1">0.3%</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Defect Pareto */}
        <div className="bg-white p-3.5 rounded shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-slate-700">Defect Pareto Breakdown</span>
            <span className="text-[10px] text-slate-400 font-mono">Pareto Top 80%</span>
          </div>
          <DpxHorizontalPareto
            maxPct={40}
            items={[
              { name: 'Missing Component', percentage: 36.0, color: '#EF4444' },
              { name: 'Tombstone', percentage: 22.2, color: '#F59E0B' },
              { name: 'Polarity Reverse', percentage: 9.6, color: '#6366F1' },
              { name: 'Solder Bridge', percentage: 8.8, color: '#3B82F6' },
              { name: 'Insufficient Paste', percentage: 6.9, color: '#06B6D4' },
              { name: 'Excess Solder', percentage: 5.8, color: '#10B981' },
              { name: 'Foreign Material', percentage: 0.9, color: '#94A3B8' },
            ]}
          />
        </div>

        {/* Defect Trend Over Shift */}
        <div className="bg-white p-3.5 rounded shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-slate-700">Defect Trend Over Shift (PPM)</span>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">▼ -68% Post-Purge</span>
          </div>
          <DpxMultiLineTrend
            labels={['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h']}
            threshold={40}
            thresholdLabel="UCL Limit"
            series={[
              { name: 'AOI Defects', color: '#EF4444', data: [45, 38, 52, 28, 30, 22, 18, 14] },
              { name: 'Placement Drops', color: '#F59E0B', data: [22, 18, 25, 14, 12, 10, 8, 5] },
              { name: 'SPI Offsets', color: '#3B82F6', data: [12, 15, 10, 8, 7, 5, 4, 3] },
            ]}
          />
        </div>

        {/* Defect Wise Breakdown Donut */}
        <div className="bg-white p-3.5 rounded shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-slate-700">Defect Wise by Station</span>
            <span className="text-[10px] text-slate-400 font-mono">Current Shift</span>
          </div>
          <div className="py-2 flex justify-center">
            <DpxDonutChart
              size={140}
              donutWidth={24}
              centerLabel="TOTAL"
              centerValue="103"
              data={[
                { label: 'AOI Optical', value: 55, color: '#EF4444' },
                { label: 'Placement (Fuji)', value: 28, color: '#F59E0B' },
                { label: 'SPI Inspection', value: 12, color: '#3B82F6' },
                { label: 'Reflow Oven', value: 6, color: '#8B5CF6' },
                { label: 'Others', value: 2, color: '#94A3B8' }
              ]}
              showLegend={true}
              legendPosition="bottom"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [8] SPI Dashboard
// -------------------------------------------------------------
export const Dashboard8Spi: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={8} title="SPI Dashboard" subtitle="Koh Young 3D Solder Paste Inspection" />

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 my-3 font-mono">
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Boards Inspected</div>
          <div className="text-xl font-black text-slate-900 mt-1">1,240</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Boards OK</div>
          <div className="text-xl font-black text-emerald-600 mt-1">1,226</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Boards NG</div>
          <div className="text-xl font-black text-red-600 mt-1">14</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">SPI FPY</div>
          <div className="text-xl font-black text-blue-600 mt-1">98.9%</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Total Cycle Time</div>
          <div className="text-xl font-black text-indigo-600 mt-1">4.8 s</div>
        </div>
      </div>

      {/* Heatmap & Optical Inspection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {/* Optical Camera View */}
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-slate-700">Koh Young 3D Optical Camera Alignment</span>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">● MOIRÉ DUAL-PROJECTION ACTIVE</span>
          </div>
          <DpxOpticalPcb type="SPI" showBBoxes={true} />
        </div>

        {/* 3D Volumetric Solder Heatmap */}
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-slate-700">3D Volumetric Solder Height Topology</span>
            <div className="flex gap-1 text-[10px]">
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-bold font-mono">3D Mesh</span>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">2D Slice</span>
            </div>
          </div>
          <Dpx3dHeatmap rows={6} cols={10} highlightDefect={true} />
        </div>
      </div>

      {/* Panel Measurement Table */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-3 border-b bg-slate-50 font-bold text-xs text-slate-700 flex justify-between items-center">
          <span>Realtime Pad Volumetric Readings</span>
          <span className="text-[10px] text-slate-400 font-mono">Threshold: 80% - 130% Volume</span>
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b text-slate-500 font-mono uppercase text-[10px]">
            <tr>
              <th className="py-2 px-3">Panel No</th>
              <th className="py-2 px-3">Volume AVG</th>
              <th className="py-2 px-3">Height AVG</th>
              <th className="py-2 px-3">Offset X</th>
              <th className="py-2 px-3 text-center">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {[
              { p: 1, v: '100.8%', h: '65.98 µm', x: '+0.030 mm', res: 'GOOD' },
              { p: 2, v: '102.1%', h: '66.15 µm', x: '-0.010 mm', res: 'GOOD' },
              { p: 3, v: '81.4%', h: '54.10 µm', x: '+0.050 mm', res: 'NG' },
              { p: 4, v: '99.5%', h: '65.53 µm', x: '+0.000 mm', res: 'GOOD' },
              { p: 5, v: '101.2%', h: '66.20 µm', x: '-0.020 mm', res: 'GOOD' },
            ].map(r => (
              <tr key={r.p} className="hover:bg-slate-50">
                <td className="py-2 px-3 font-bold text-blue-600">Panel-{r.p}</td>
                <td className="py-2 px-3">{r.v}</td>
                <td className="py-2 px-3">{r.h}</td>
                <td className="py-2 px-3">{r.x}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    r.res === 'GOOD' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {r.res}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-2.5 bg-slate-50 text-[10px] font-mono text-slate-500 border-t flex justify-between">
          <span>Koh Young aSPIre3 Gateway (IPC-HERMES-9852)</span>
          <span className="text-emerald-600 font-bold">● SPC Closed-Loop Auto-Correction Active (Offset: +8µm X / -4µm Y)</span>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [9] FUJI Placement Dashboard
// -------------------------------------------------------------
export const Dashboard9FujiPlacement: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={9} title="FUJI Placement Dashboard" subtitle="NXT III High-Speed Modular Mounter" />

      {/* Machine Header */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded shadow-sm border border-slate-200 my-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Machine:</span>
          <span className="bg-blue-100 text-blue-800 font-mono font-black px-2 py-0.5 rounded">NXT-05 (Line-01)</span>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          <span>Boards: <strong>1,240</strong></span>
          <span>Speed: <strong className="text-blue-600">44,820 CPH</strong></span>
          <span>Placement FPY: <strong className="text-emerald-600">99.52%</strong></span>
          <span>Drop Rate: <strong className="text-amber-600">0.22%</strong></span>
        </div>
      </div>

      {/* Module 1-4 Status Table */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden mb-3">
        <div className="p-2.5 bg-slate-50 border-b font-bold text-xs text-slate-700">
          Module Configuration & Operational Status
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b text-slate-500 font-mono uppercase text-[10px]">
            <tr>
              <th className="py-2 px-3">Module</th>
              <th className="py-2 px-3">Head Type</th>
              <th className="py-2 px-3 text-center">Status</th>
              <th className="py-2 px-3 text-right">Nozzles</th>
              <th className="py-2 px-3 text-right">Pick Errors</th>
              <th className="py-2 px-3 text-right">Drop Count</th>
              <th className="py-2 px-3 text-right">Head Temp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {[
              { m: 'M01', head: 'H24S (24-Nozzle High Speed)', st: 'Running', noz: 24, err: 2, drop: 1, temp: '42°C' },
              { m: 'M02', head: 'H08M (8-Nozzle Multi)', st: 'Running', noz: 8, err: 0, drop: 0, temp: '41°C' },
              { m: 'M03', head: 'H24S (24-Nozzle High Speed)', st: 'Running', noz: 24, err: 3, drop: 2, temp: '43°C' },
              { m: 'M04', head: 'H04 (4-Nozzle Odd-Form)', st: 'Running', noz: 4, err: 1, drop: 1, temp: '40°C' },
            ].map(r => (
              <tr key={r.m} className="hover:bg-slate-50">
                <td className="py-2 px-3 font-bold text-blue-600">{r.m}</td>
                <td className="py-2 px-3 font-sans font-medium">{r.head}</td>
                <td className="py-2 px-3 text-center">
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {r.st}
                  </span>
                </td>
                <td className="py-2 px-3 text-right">{r.noz}</td>
                <td className="py-2 px-3 text-right text-amber-600 font-bold">{r.err}</td>
                <td className="py-2 px-3 text-right text-red-600 font-bold">{r.drop}</td>
                <td className="py-2 px-3 text-right text-slate-500">{r.temp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drop Rate & Pick Error Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-slate-700">Drop Rate Trend (PPM Target &lt; 25)</span>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">Current: 8 PPM (OK)</span>
          </div>
          <DpxMultiLineTrend
            labels={['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10']}
            threshold={25}
            thresholdLabel="Max UCL"
            series={[
              { name: 'Drop Rate (PPM)', color: '#3B82F6', data: [22, 18, 25, 30, 15, 12, 14, 18, 10, 8] },
              { name: 'Shift Target', color: '#10B981', data: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15] },
            ]}
          />
        </div>

        <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-slate-700">Nozzle Pick Error Analysis by Head</span>
            <span className="text-[10px] text-slate-400 font-mono">H24S Nozzles N1 - N8</span>
          </div>
          <DpxDualBarChart
            items={[
              { label: 'N1', plan: 100, actual: 4 },
              { label: 'N2', plan: 100, actual: 2 },
              { label: 'N3', plan: 100, actual: 7 },
              { label: 'N4', plan: 100, actual: 1 },
              { label: 'N5', plan: 100, actual: 0 },
              { label: 'N6', plan: 100, actual: 3 },
              { label: 'N7', plan: 100, actual: 5 },
              { label: 'N8', plan: 100, actual: 2 },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [10] SMT Stencil & Setup Management Dashboard
// -------------------------------------------------------------
export const Dashboard10StencilSetup: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={10} title="SMT Stencil & Setup" subtitle="Printer Tooling & Tension Governance" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 my-3">
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200 text-center">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Stencil ID</div>
          <div className="text-lg font-black text-slate-800 font-mono mt-1">ST-METER-REV4</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">● Tension: 38 N/cm (PASS)</div>
        </div>
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200 text-center">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Wash Cycle Counter</div>
          <div className="text-lg font-black text-blue-600 font-mono mt-1">14 / 20</div>
          <div className="text-[10px] text-slate-500 mt-1">6 prints until auto-wipe</div>
        </div>
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200 text-center">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Squeegee Pressure</div>
          <div className="text-lg font-black text-indigo-600 font-mono mt-1">2.4 kg / 180mm</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">● Speed: 35 mm/s</div>
        </div>
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200 text-center">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Paste MSL Life</div>
          <div className="text-lg font-black text-emerald-600 font-mono mt-1">4.2 hrs remaining</div>
          <div className="text-[10px] text-slate-500 mt-1">Lot: SP-2026-SAC305</div>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow-sm border border-slate-200 text-xs font-mono">
        <div className="font-bold text-slate-700 mb-2">Setup Checklist & Cleanroom Verification</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-700"><Check className="w-4 h-4 text-emerald-600" /> Stencil fiducial alignment verified (±8µm limit met)</div>
          <div className="flex items-center gap-2 text-emerald-700"><Check className="w-4 h-4 text-emerald-600" /> Solvent level in automatic under-stencil roll OK</div>
          <div className="flex items-center gap-2 text-emerald-700"><Check className="w-4 h-4 text-emerald-600" /> Support pins magnetic matrix locked in position</div>
          <div className="flex items-center gap-2 text-emerald-700"><Check className="w-4 h-4 text-emerald-600" /> Closed-loop SPI feedback handshake established</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [11] AOI Dashboard
// -------------------------------------------------------------
export const Dashboard11Aoi: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={11} title="AOI Dashboard" subtitle="Automated Optical Inspection Defect Review" />

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 my-3 font-mono">
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Boards Inspected</div>
          <div className="text-xl font-black text-slate-900 mt-1">1,236</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Boards OK</div>
          <div className="text-xl font-black text-emerald-600 mt-1">1,206</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Boards NG</div>
          <div className="text-xl font-black text-red-600 mt-1">30</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">AOI FPY</div>
          <div className="text-xl font-black text-purple-600 mt-1">97.6%</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Cycle Time</div>
          <div className="text-xl font-black text-indigo-600 mt-1">6.0 s</div>
        </div>
      </div>

      {/* Image Preview & Defect Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Optical Camera Defect View */}
        <div className="bg-white p-3.5 rounded shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-slate-700">Koh Young Zenith 3D AOI Inspection Feed</span>
            <span className="text-[10px] text-red-600 font-bold font-mono">1 DEFECT LOCATED</span>
          </div>
          <DpxOpticalPcb type="AOI" showBBoxes={true} />
        </div>

        {/* Defect Pareto */}
        <div className="bg-white p-3.5 rounded shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-700">AOI Defect Classification Breakdown</span>
              <span className="text-[10px] text-slate-400 font-mono">30 NG Boards</span>
            </div>
            <DpxHorizontalPareto
              maxPct={40}
              items={[
                { name: 'Missing Component', percentage: 35.2, color: '#EF4444' },
                { name: 'Tombstone', percentage: 32.1, color: '#F59E0B' },
                { name: 'Polarity Reverse', percentage: 15.2, color: '#8B5CF6' },
                { name: 'Solder Bridge', percentage: 10.8, color: '#3B82F6' },
                { name: 'Insufficient Solder', percentage: 5.8, color: '#06B6D4' },
                { name: 'Wrong Component', percentage: 0.9, color: '#94A3B8' },
              ]}
            />
          </div>
          <div className="p-2 bg-slate-50 border rounded text-[10px] text-slate-500 font-mono flex justify-between mt-3">
            <span>Defect Density: 2.42%</span>
            <span className="text-blue-600 font-bold">Auto-Review Queue: 4 pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [12] Reflow Dashboard
// -------------------------------------------------------------
export const Dashboard12Reflow: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={12} title="Reflow Dashboard" subtitle="Heller 10-Zone Thermal Profiling & PWI" />

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-3 font-mono">
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200 text-center">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Boards Processed</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">1,238</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200 text-center">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Profile OK</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">98.8%</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200 text-center">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Thermal NG</div>
          <div className="text-xl font-black text-red-600 mt-0.5">0.48%</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-xs border border-slate-200 text-center">
          <div className="text-[10px] text-slate-500 font-sans font-bold">Oven Temperature</div>
          <div className="text-xl font-black text-blue-600 mt-0.5">OPTIMAL</div>
        </div>
      </div>

      {/* 10-Zone Curve + Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Thermal Curve SVG */}
        <div className="bg-white p-3.5 rounded shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-slate-700">10-Zone Reflow Thermal Profile (SAC305 Lead-Free)</span>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">● LIVE THERMOCOUPLE FEED</span>
          </div>
          <DpxReflowThermalCurve
            liquidusTemp={217}
            peakTemp={245}
            zones={[
              { zone: 1, setTemp: 140, actualTemp: 138, label: 'Preheat 1' },
              { zone: 2, setTemp: 155, actualTemp: 154, label: 'Preheat 2' },
              { zone: 3, setTemp: 170, actualTemp: 171, label: 'Soak 1' },
              { zone: 4, setTemp: 185, actualTemp: 184, label: 'Soak 2' },
              { zone: 5, setTemp: 200, actualTemp: 199, label: 'Soak 3' },
              { zone: 6, setTemp: 220, actualTemp: 222, label: 'Reflow 1' },
              { zone: 7, setTemp: 245, actualTemp: 246, label: 'Peak' },
              { zone: 8, setTemp: 230, actualTemp: 228, label: 'Reflow 2' },
              { zone: 9, setTemp: 170, actualTemp: 168, label: 'Cool 1' },
              { zone: 10, setTemp: 90, actualTemp: 88, label: 'Cool 2' },
            ]}
          />
        </div>

        {/* Zone 1-10 Table */}
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b text-slate-500 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-2 px-3">Zone</th>
                <th className="py-2 px-3">Set (°C)</th>
                <th className="py-2 px-3">Actual (°C)</th>
                <th className="py-2 px-3">Upper / Lower</th>
                <th className="py-2 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {[
                { z: 1, set: 150, act: 150.2, band: '±5°C', st: 'OK' },
                { z: 2, set: 165, act: 165.4, band: '±5°C', st: 'OK' },
                { z: 3, set: 180, act: 180.1, band: '±5°C', st: 'OK' },
                { z: 4, set: 195, act: 194.8, band: '±5°C', st: 'OK' },
                { z: 5, set: 215, act: 215.3, band: '±5°C', st: 'OK' },
                { z: 6, set: 245, act: 245.0, band: '±5°C', st: 'OK' },
              ].map(r => (
                <tr key={r.z} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-bold text-blue-600">Zone {r.z}</td>
                  <td className="py-2 px-3">{r.set}</td>
                  <td className="py-2 px-3 font-bold">{r.act}</td>
                  <td className="py-2 px-3 text-slate-500">{r.band}</td>
                  <td className="py-2 px-3 text-center">
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {r.st}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [13] PCB Traceability / Genealogy Dashboard
// -------------------------------------------------------------
export const Dashboard13PcbTraceability: React.FC = () => {
  const [serial, setSerial] = useState('705525635000551');

  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={13} title="PCB Traceability / Genealogy" subtitle="Complete Unit Lifecycle History" />

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white p-3 rounded shadow-sm border border-slate-200 my-3">
        <span className="text-xs font-bold text-slate-600">PCB Serial No:</span>
        <input
          type="text"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          className="border rounded px-3 py-1 text-xs font-mono font-bold w-64 border-slate-300 focus:outline-blue-500"
        />
        <button className="bg-blue-600 text-white font-bold text-xs px-4 py-1.5 rounded hover:bg-blue-700 flex items-center gap-1">
          <Search className="w-3.5 h-3.5" /> Search
        </button>
      </div>

      {/* Header Info */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-white p-3 rounded shadow-sm border border-slate-200 mb-3 text-xs font-mono">
        <div><span className="text-slate-400 block text-[10px]">PRODUCT</span> <strong>SMT_ASSY_A</strong></div>
        <div><span className="text-slate-400 block text-[10px]">WORK ORDER</span> <strong>WO-20260925-01</strong></div>
        <div><span className="text-slate-400 block text-[10px]">PANEL NO</span> <strong>1</strong></div>
        <div><span className="text-slate-400 block text-[10px]">START TIME</span> <strong>10:08:25</strong></div>
        <div><span className="text-slate-400 block text-[10px]">END TIME</span> <strong>10:14:36</strong></div>
        <div><span className="text-slate-400 block text-[10px]">TOTAL CYCLE</span> <strong className="text-emerald-600">6 min 11 sec</strong></div>
      </div>

      {/* Stepper Milestone Flow */}
      <div className="bg-white p-4 rounded shadow-sm border border-slate-200 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">Process Route Milestones (Traceability Lineage)</span>
          <span className="text-[10px] text-emerald-600 font-bold font-mono">100% IPC-1782 CERTIFIED</span>
        </div>
        <DpxProcessStepper
          steps={[
            { name: 'Loader', time: '10:08:25', status: 'PASS' },
            { name: 'Printer', time: '10:09:12', status: 'PASS' },
            { name: 'SPI', time: '10:10:02', status: 'PASS' },
            { name: 'Placement', time: '10:11:15', status: 'PASS' },
            { name: 'Reflow', time: '10:12:45', status: 'PASS' },
            { name: 'AOI', time: '10:14:10', status: 'PASS' },
            { name: 'Unloader', time: '10:14:36', status: 'PASS' },
          ]}
        />
      </div>

      {/* Detailed Steps Table */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-xs text-left font-mono">
          <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-2 px-3">Step</th>
              <th className="py-2 px-3">Station</th>
              <th className="py-2 px-3">Machine / Unit</th>
              <th className="py-2 px-3">Time</th>
              <th className="py-2 px-3 text-center">Result</th>
              <th className="py-2 px-3">Remark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { s: 1, name: 'Loader', m: 'LD-01', t: '10:08:25', res: 'GOOD', rem: 'Board Loaded' },
              { s: 2, name: 'Printer', m: 'MPM-125', t: '10:09:12', res: 'GOOD', rem: '2D Stencil Verified' },
              { s: 3, name: 'SPI', m: 'KY-SPI', t: '10:10:02', res: 'GOOD', rem: 'Inspection OK' },
              { s: 4, name: 'Placement', m: 'NXT-01 M01', t: '10:11:15', res: 'GOOD', rem: '1st Placement' },
              { s: 5, name: 'Reflow', m: 'Heller-10', t: '10:12:45', res: 'GOOD', rem: 'Profile OK' },
              { s: 6, name: 'AOI', m: 'Zenith-AOI', t: '10:14:10', res: 'GOOD', rem: 'Zero Defect' },
            ].map(r => (
              <tr key={r.s} className="hover:bg-slate-50">
                <td className="py-2 px-3 font-bold text-blue-600">{r.s}</td>
                <td className="py-2 px-3 font-sans font-bold">{r.name}</td>
                <td className="py-2 px-3 text-slate-600">{r.m}</td>
                <td className="py-2 px-3 text-slate-500">{r.t}</td>
                <td className="py-2 px-3 text-center">
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {r.res}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 font-sans">{r.rem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [14] Component Genealogy Dashboard
// -------------------------------------------------------------
export const Dashboard14ComponentGenealogy: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={14} title="Component Genealogy" subtitle="SMT Bill of Materials & Lot Association" />

      {/* Component Usage Table */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden my-3">
        <div className="p-2.5 bg-slate-50 border-b font-bold text-xs text-slate-700">
          Placed Components for Serial 705525635000551
        </div>
        <table className="w-full text-xs text-left font-mono">
          <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-2 px-3">Ref Des</th>
              <th className="py-2 px-3">Part No</th>
              <th className="py-2 px-3">Feeder ID</th>
              <th className="py-2 px-3">Reel ID</th>
              <th className="py-2 px-3">Lot No</th>
              <th className="py-2 px-3 text-center">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { ref: 'R45', pn: 'RC0402JR-0710KL', fdr: 'F-23', reel: 'R000125', lot: 'LOT825', res: 'OK' },
              { ref: 'C12', pn: 'CC0402KRX7R7BB104', fdr: 'F-08', reel: 'R000126', lot: 'LOT912', res: 'OK' },
              { ref: 'U01', pn: 'STM32F401RET6', fdr: 'F-45', reel: 'R000127', lot: 'LOT441', res: 'OK' },
            ].map(r => (
              <tr key={r.ref} className="hover:bg-slate-50">
                <td className="py-2 px-3 font-bold text-blue-600">{r.ref}</td>
                <td className="py-2 px-3 text-slate-800">{r.pn}</td>
                <td className="py-2 px-3 text-slate-600">{r.fdr}</td>
                <td className="py-2 px-3 text-slate-600">{r.reel}</td>
                <td className="py-2 px-3 text-slate-500">{r.lot}</td>
                <td className="py-2 px-3 text-center">
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {r.res}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Component Details Card */}
      <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
        <div className="font-bold text-xs text-slate-700 mb-2">Selected Component Deep-Dive: RC0402JR-0710KL</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div><span className="text-slate-400 block text-[10px]">MANUFACTURER</span> Yageo Corporation</div>
          <div><span className="text-slate-400 block text-[10px]">PACKAGE</span> 0402 (1005 Metric)</div>
          <div><span className="text-slate-400 block text-[10px]">MSD LEVEL</span> MSL-1 (Unlimited)</div>
          <div><span className="text-slate-400 block text-[10px]">REMAINING ON REEL</span> 4,820 / 5,000 pcs</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [15] Material / Reel Management Dashboard
// -------------------------------------------------------------
export const Dashboard15MaterialReel: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={15} title="Material / Reel Management" subtitle="SMD Reel Inventory & MSD Floor Life" />

      {/* Toolbar */}
      <div className="flex gap-2 bg-white p-2.5 rounded shadow-sm border border-slate-200 my-3 text-xs">
        <button className="bg-blue-600 text-white font-bold px-3 py-1 rounded">Reel Stock</button>
        <button className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded border">Reel Loading</button>
        <button className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded border">Usage History</button>
        <button className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded border">Expiry Alerts</button>
      </div>

      {/* Reel Table */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-xs text-left font-mono">
          <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-2 px-3">Reel ID</th>
              <th className="py-2 px-3">Part No</th>
              <th className="py-2 px-3 text-right">Initial Qty</th>
              <th className="py-2 px-3 text-right">Remaining</th>
              <th className="py-2 px-3">MSD Level</th>
              <th className="py-2 px-3">Expiry Date</th>
              <th className="py-2 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { id: 'R000125', pn: 'RC0402JR-0710KL', init: 5000, rem: 4820, msd: 'MSL-1', exp: '31-12-2026', st: 'OK', col: 'bg-emerald-600' },
              { id: 'R000126', pn: 'CC0402KRX7R7BB104', init: 10000, rem: 240, msd: 'MSL-1', exp: '20-11-2026', st: 'LOW', col: 'bg-amber-500' },
              { id: 'R000127', pn: 'STM32F401RET6', init: 1000, rem: 880, msd: 'MSL-3', exp: '15-10-2026', st: 'OK', col: 'bg-emerald-600' },
              { id: 'R000128', pn: 'TPS62130RGTR', init: 3000, rem: 1900, msd: 'MSL-2', exp: '18-09-2026', st: 'OK', col: 'bg-emerald-600' },
            ].map(r => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="py-2 px-3 font-bold text-blue-600">{r.id}</td>
                <td className="py-2 px-3">{r.pn}</td>
                <td className="py-2 px-3 text-right">{r.init}</td>
                <td className="py-2 px-3 text-right font-bold">{r.rem}</td>
                <td className="py-2 px-3 text-slate-500">{r.msd}</td>
                <td className="py-2 px-3 text-slate-500">{r.exp}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`${r.col} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
                    {r.st}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [16] Feeder Management Dashboard
// -------------------------------------------------------------
export const Dashboard16FeederManagement: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={16} title="Feeder Management" subtitle="Smart Feeder Health & Splicing Alerts" />

      {/* Feeder Table */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden my-3">
        <table className="w-full text-xs text-left font-mono">
          <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-2 px-3">Feeder ID</th>
              <th className="py-2 px-3">Machine</th>
              <th className="py-2 px-3">Module</th>
              <th className="py-2 px-3">Slot</th>
              <th className="py-2 px-3">Part No</th>
              <th className="py-2 px-3">Reel ID</th>
              <th className="py-2 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { id: 'W08F-001', m: 'NXT-01', mod: 'M01', slot: '12', pn: 'RC0402100K', reel: 'R000125', st: 'LOADED', col: 'bg-emerald-600' },
              { id: 'W08F-002', m: 'NXT-01', mod: 'M01', slot: '13', pn: 'CC0402100N', reel: 'R000126', st: 'LOW', col: 'bg-amber-500' },
              { id: 'W12F-005', m: 'NXT-01', mod: 'M02', slot: '04', pn: 'STM32F401', reel: 'R000127', st: 'LOADED', col: 'bg-emerald-600' },
              { id: 'W16F-010', m: 'NXT-02', mod: 'M01', slot: '08', pn: 'TPS62130', reel: 'R000128', st: 'EMPTY', col: 'bg-red-600' },
            ].map(r => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="py-2 px-3 font-bold text-blue-600">{r.id}</td>
                <td className="py-2 px-3">{r.m}</td>
                <td className="py-2 px-3">{r.mod}</td>
                <td className="py-2 px-3 font-bold">{r.slot}</td>
                <td className="py-2 px-3">{r.pn}</td>
                <td className="py-2 px-3 text-slate-500">{r.reel}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`${r.col} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
                    {r.st}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feeder Details */}
      <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
        <div className="font-bold text-xs text-slate-700 mb-2">Smart Feeder Calibration Status</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div><span className="text-slate-400 block text-[10px]">FEEDER TYPE</span> W08F 8mm Intelligent</div>
          <div><span className="text-slate-400 block text-[10px]">TOTAL CYCLES</span> 128,450 picks</div>
          <div><span className="text-slate-400 block text-[10px]">NEXT CALIBRATION</span> In 22 days</div>
          <div><span className="text-slate-400 block text-[10px]">SPLICING AGV</span> Ready for dispatch</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [17] Equipment Real-Time Monitoring Dashboard
// -------------------------------------------------------------
export const Dashboard17EquipmentMonitoring: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={17} title="Equipment Real-Time Monitoring" subtitle="Line-01 Machine State & SECS/GEM Telemetry" />

      {/* Line Machine Flow */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2 my-3">
        {[
          { name: 'Loader', state: 'Running', ct: '8.2s', out: '11,820', col: 'border-emerald-500' },
          { name: 'SPI', state: 'Running', ct: '6.5s', out: '11,700', col: 'border-emerald-500' },
          { name: 'Printer', state: 'Running', ct: '7.8s', out: '11,650', col: 'border-emerald-500' },
          { name: 'FUJI NXT-01', state: 'Running', ct: '12.3s', out: '11,520', col: 'border-emerald-500' },
          { name: 'Reflow', state: 'Idle', ct: '45.0s', out: '11,450', col: 'border-amber-500' },
          { name: 'AOI', state: 'Down', ct: '10.8s', out: '11,420', col: 'border-red-500' },
          { name: 'Unloader', state: 'Running', ct: '6.7s', out: '11,420', col: 'border-emerald-500' },
        ].map(m => (
          <div key={m.name} className={`bg-white p-3 rounded shadow-sm border-t-4 ${m.col} border-slate-200 text-center`}>
            <div className="text-xs font-bold text-slate-800">{m.name}</div>
            <div className={`text-[10px] font-bold font-mono uppercase mt-1 ${
              m.state === 'Running' ? 'text-emerald-600' : m.state === 'Idle' ? 'text-amber-600' : 'text-red-600'
            }`}>
              ● {m.state}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">Output: {m.out}</div>
            <div className="text-[10px] text-slate-400 font-mono">CT: {m.ct}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow-sm border border-slate-200 text-xs font-mono">
        <div className="font-bold text-slate-700 mb-2">OT Communications Link Status</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-600">
          <div>SECS/GEM Gateway: <strong className="text-emerald-600">CONNECTED (10.0.1.55)</strong></div>
          <div>IPC-CFX Broker: <strong className="text-emerald-600">ACTIVE (MQTT/AMQP)</strong></div>
          <div>PLC Polling Latency: <strong className="text-blue-600">12 ms</strong></div>
          <div>OPC-UA Server: <strong className="text-emerald-600">PORT 4840 OK</strong></div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [18] Alarm & Downtime Analysis Dashboard
// -------------------------------------------------------------
export const Dashboard18AlarmDowntime: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={18} title="Alarm & Downtime Analysis" subtitle="Root-Cause Pareto & Alarm Frequency" />

      {/* Alarm Log Table */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden my-3">
        <div className="p-2.5 bg-slate-50 border-b font-bold text-xs text-slate-700 flex justify-between">
          <span>Active Cleanroom Alarm Log</span>
          <span className="text-[10px] text-slate-500 font-mono">Total Downtime: 2h 45m</span>
        </div>
        <table className="w-full text-xs text-left font-mono">
          <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-2 px-3">Time</th>
              <th className="py-2 px-3">Line</th>
              <th className="py-2 px-3">Machine</th>
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3 text-right">Duration</th>
              <th className="py-2 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { t: '11:37:12', l: 'Line-01', m: 'AOI', desc: 'Missing component defect threshold exceeded', dur: '15 min', st: 'OPEN', col: 'bg-red-600' },
              { t: '10:56:45', l: 'Line-01', m: 'Reflow', desc: 'Zone 4 temperature lower tolerance limit', dur: '12 min', st: 'RESOLVED', col: 'bg-emerald-600' },
              { t: '10:12:00', l: 'Line-01', m: 'FUJI NXT', desc: 'Feeder slot 12 tape splice warning', dur: '5 min', st: 'RESOLVED', col: 'bg-emerald-600' },
              { t: '09:20:18', l: 'Line-01', m: 'Printer', desc: 'Under-stencil solvent wipe roll empty', dur: '8 min', st: 'RESOLVED', col: 'bg-emerald-600' },
            ].map((r, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-2 px-3 text-slate-500">{r.t}</td>
                <td className="py-2 px-3 font-bold">{r.l}</td>
                <td className="py-2 px-3 font-bold text-blue-600">{r.m}</td>
                <td className="py-2 px-3 font-sans">{r.desc}</td>
                <td className="py-2 px-3 text-right font-bold">{r.dur}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`${r.col} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
                    {r.st}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts Grid: Pareto + Hourly Alarm Trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Pareto Horizontal Chart */}
        <div className="bg-white p-3.5 rounded shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-slate-700">Downtime Pareto by Machine</span>
            <span className="text-[10px] text-slate-400 font-mono">Total: 2h 45m</span>
          </div>
          <DpxHorizontalPareto
            maxPct={35}
            items={[
              { name: 'Reflow Oven (Zone 4 Alarm)', percentage: 29.1, color: '#EF4444' },
              { name: 'AOI Optical (Threshold Exceeded)', percentage: 25.5, color: '#F59E0B' },
              { name: 'FUJI NXT III (Splice Warning)', percentage: 17.0, color: '#FBBF24' },
              { name: 'SPI 3D (Calibration Cycle)', percentage: 10.9, color: '#3B82F6' },
              { name: 'Screen Printer (Wipe Roll Out)', percentage: 7.3, color: '#06B6D4' },
              { name: 'Conveyor & Board Buffer Jam', percentage: 10.2, color: '#94A3B8' },
            ]}
          />
        </div>

        {/* Hourly Alarm Frequency Trend */}
        <div className="bg-white p-3.5 rounded shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-slate-700">Hourly Alarm Frequency & Recovery Pace</span>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">MTTR: 8.4 min</span>
          </div>
          <DpxMultiLineTrend
            labels={['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h']}
            threshold={5}
            thresholdLabel="Alarm Limit"
            series={[
              { name: 'Triggered Alarms', color: '#EF4444', data: [3, 2, 7, 5, 2, 1, 3, 1] },
              { name: 'Resolved by Operator', color: '#10B981', data: [3, 2, 6, 5, 2, 1, 3, 1] },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [19] Maintenance Management Dashboard
// -------------------------------------------------------------
export const Dashboard19Maintenance: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={19} title="Maintenance Management" subtitle="Preventive & Corrective Maintenance (TPM)" />

      {/* Filter tabs */}
      <div className="flex gap-2 bg-white p-2.5 rounded shadow-sm border border-slate-200 my-3 text-xs">
        <button className="bg-blue-600 text-white font-bold px-3 py-1 rounded">PM Schedule</button>
        <button className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded border">Breakdown</button>
        <button className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded border">Corrective</button>
        <button className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded border">Calibration</button>
      </div>

      {/* Maintenance Table */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-xs text-left font-mono">
          <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-2 px-3">Req No</th>
              <th className="py-2 px-3">Equipment</th>
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3 text-center">Priority</th>
              <th className="py-2 px-3">Plan Date</th>
              <th className="py-2 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { req: 'PM-001', eq: 'NXT-05 Head H24S', type: 'Preventive', prio: 'High', date: '26-09-2026', st: 'OPEN', col: 'bg-red-600' },
              { req: 'PM-002', eq: 'Reflow Zone 4', type: 'Preventive', prio: 'Medium', date: '28-09-2026', st: 'PLANNED', col: 'bg-blue-600' },
              { req: 'CM-003', eq: 'AOI Camera 02', type: 'Breakdown', prio: 'High', date: '25-09-2026', st: 'COMPLETED', col: 'bg-emerald-600' },
              { req: 'PM-004', eq: 'Koh Young SPI', type: 'Calibration', prio: 'High', date: '25-09-2026', st: 'OPEN', col: 'bg-amber-500' },
            ].map(r => (
              <tr key={r.req} className="hover:bg-slate-50">
                <td className="py-2 px-3 font-bold text-blue-600">{r.req}</td>
                <td className="py-2 px-3 font-sans font-bold text-slate-800">{r.eq}</td>
                <td className="py-2 px-3 text-slate-600">{r.type}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    r.prio === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {r.prio}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-500">{r.date}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`${r.col} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
                    {r.st}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [20] Spare Parts Management Dashboard
// -------------------------------------------------------------
export const Dashboard20SpareParts: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={20} title="Spare Parts Management" subtitle="Cleanroom Parts Stock & Reorder Levels" />

      {/* Spare Parts Inventory Table */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden my-3">
        <table className="w-full text-xs text-left font-mono">
          <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-2 px-3">Part ID</th>
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3">Machine</th>
              <th className="py-2 px-3 text-right">Stock</th>
              <th className="py-2 px-3 text-right">Min Stock</th>
              <th className="py-2 px-3">Location</th>
              <th className="py-2 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { id: 'RC00400', desc: 'CPU Card', m: 'NXT', stock: 12, min: 5, loc: 'UPR-01', st: 'OK', col: 'bg-emerald-600' },
              { id: 'RC00500', desc: 'H24S Head', m: 'NXT', stock: 2, min: 1, loc: 'UPR-02', st: 'OK', col: 'bg-emerald-600' },
              { id: 'RC00410', desc: 'Nozzle H04', m: 'NXT', stock: 12, min: 10, loc: 'UPR-01', st: 'OK', col: 'bg-emerald-600' },
              { id: 'RC00420', desc: 'Power Supply', m: 'Heller', stock: 1, min: 2, loc: 'UPR-03', st: 'LOW', col: 'bg-red-600' },
              { id: 'RC00430', desc: 'Sensor Unit', m: 'KY-SPI', stock: 10, min: 3, loc: 'UPR-01', st: 'OK', col: 'bg-emerald-600' },
            ].map(r => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="py-2 px-3 font-bold text-blue-600">{r.id}</td>
                <td className="py-2 px-3 font-sans font-bold text-slate-800">{r.desc}</td>
                <td className="py-2 px-3 text-slate-600">{r.m}</td>
                <td className="py-2 px-3 text-right font-black">{r.stock}</td>
                <td className="py-2 px-3 text-right text-slate-400">{r.min}</td>
                <td className="py-2 px-3 text-slate-500">{r.loc}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`${r.col} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
                    {r.st}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
