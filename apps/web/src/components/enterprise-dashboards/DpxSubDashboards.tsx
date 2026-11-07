import React, { useState } from 'react';
import { 
  Building2, CheckCircle2, XCircle, AlertTriangle, Clock, ArrowRight,
  Search, Play, Pause, AlertOctagon, RotateCw, Filter, Layers, 
  Cpu, Flame, Eye, Shield, Tag, Calendar, Database, Activity,
  Sliders, Settings, Wrench, BarChart2, ChevronRight, Check,
  Maximize2, Download, Printer, RefreshCw, Star, FileText, TrendingUp, Zap,
  Factory, ShieldCheck, Bell, GitFork
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
// [2] SMT Line Live Monitor (Flagship Single-Pane-of-Glass Cockpit)
// -------------------------------------------------------------
export const Dashboard2SmtLineMonitor: React.FC = () => {
  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      {/* Sequence Header Tag */}
      <DpxSeqBadge seq={2} title="SMT Line Live Monitor (Line-01)" subtitle="Single-Pane-of-Glass Operational Cockpit" />

      {/* TOP ROW: 7 VIBRANT SATURATED HERO CARDS (1:1 MATCHING SMT SPECIFICATION) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {/* 1. OEE Card (Green) */}
        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">OEE</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">86.4%</div>
            <div className="text-[10px] text-emerald-200 mt-1">↑ 2.1% vs. yesterday</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* 2. Availability Card (Cyan/Sky Blue) */}
        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Availability</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">94.2%</div>
            <div className="text-[10px] text-sky-200 mt-1">↑ 0.6% vs. yesterday</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* 3. Performance Card (Warm Orange) */}
        <div className="bg-[#EA580C] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Performance</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">91.7%</div>
            <div className="text-[10px] text-orange-200 mt-1">↑ 1.5% vs. yesterday</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* 4. FPY Card (Purple) */}
        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">FPY</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">98.8%</div>
            <div className="text-[10px] text-purple-200 mt-1">↑ 0.4% vs. yesterday</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* 5. Plan Card (Teal/Cyan) */}
        <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">Plan</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">12,000</div>
            <div className="text-[10px] text-cyan-200 mt-1">pcs</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* 6. Actual Card (Deep Ocean Blue) */}
        <div className="bg-[#1D4ED8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Actual</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">11,420</div>
            <div className="text-[10px] text-blue-200 mt-1">pcs (95.2%)</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* 7. Reject Card (Red) */}
        <div className="bg-[#DC2626] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-red-100">Reject</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">138</div>
            <div className="text-[10px] text-red-200 mt-1">pcs (1.2%)</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: LEFT (72%) & RIGHT (28%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* LEFT COLUMN (8.5/9 cols) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-3">
          {/* PRODUCTION FLOW CARD (7 STATIONS) */}
          <div className="bg-white p-3.5 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-800">
                Production Flow – Plant-01 / Line-01
              </span>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Running
                </span>
                <span className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Idle
                </span>
                <span className="flex items-center gap-1.5 text-red-500 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Down
                </span>
              </div>
            </div>

            {/* 7 Machines Flow Sequence */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {[
                { name: 'Loader', status: 'Running', dot: 'bg-emerald-500', out: '11,820 / 12,000', ct: '8.2 sec', icon: Layers },
                { name: 'SPI', status: 'Running', dot: 'bg-emerald-500', out: '11,700 / 12,000', ct: '6.5 sec', icon: Eye },
                { name: 'Printer', status: 'Running', dot: 'bg-emerald-500', out: '11,650 / 12,000', ct: '7.8 sec', icon: Factory },
                { name: 'FUJI NXT', status: 'Running', dot: 'bg-emerald-500', out: '11,520 / 12,000', ct: '12.3 sec', icon: Cpu },
                { name: 'Reflow', status: 'Idle', dot: 'bg-amber-400', out: '11,450 / 12,000', ct: '45.0 sec', icon: Flame },
                { name: 'AOI', status: 'Down', dot: 'bg-red-500', out: '11,420 / 12,000', ct: '10.8 sec', icon: Eye },
                { name: 'Unloader', status: 'Running', dot: 'bg-emerald-500', out: '11,420 / 12,000', ct: '6.7 sec', icon: Layers },
              ].map((mach) => {
                const Icon = mach.icon;
                return (
                  <div 
                    key={mach.name}
                    className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col justify-between text-center relative group hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-800">{mach.name}</span>
                      <span className={`w-2 h-2 rounded-full ${mach.dot} shadow-xs`} title={mach.status} />
                    </div>

                    {/* Machine Illustration Graphic */}
                    <div className="h-16 bg-white rounded border border-slate-100 flex items-center justify-center p-2 mb-2 shadow-inner">
                      <div className="flex flex-col items-center">
                        <Icon className="w-7 h-7 text-slate-600 group-hover:text-blue-600 transition-colors" />
                        <div className="w-10 h-1 bg-slate-200 rounded mt-1" />
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono">
                      <div className="text-slate-400 text-[9px] uppercase">Output</div>
                      <div className="font-bold text-slate-800">{mach.out}</div>
                      <div className="text-[9px] text-slate-400 mt-1">Cycle Time</div>
                      <div className="font-semibold text-slate-700">{mach.ct}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* THREE CHARTS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Chart 1: Hourly Target vs Actual Dual Bar Chart */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-800">
                  Production (Target vs Actual) - Hourly
                </span>
                <div className="flex gap-2 text-[10px] font-mono">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#0066FF] rounded-xs" /> Target</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#10B981] rounded-xs" /> Actual</span>
                </div>
              </div>

              {/* SVG Bar Chart */}
              <div className="h-44 pt-2">
                <svg viewBox="0 0 280 150" className="w-full h-full">
                  <line x1="30" y1="20" x2="275" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="30" y1="50" x2="275" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="30" y1="80" x2="275" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="30" y1="110" x2="275" y2="110" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="30" y1="130" x2="275" y2="130" stroke="#CBD5E1" strokeWidth="1" />

                  <text x="25" y="24" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">2,000</text>
                  <text x="25" y="54" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">1,500</text>
                  <text x="25" y="84" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">1,000</text>
                  <text x="25" y="114" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">500</text>
                  <text x="25" y="133" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">0</text>

                  {[
                    { h: '08:00', tgt: 950, act: 900 },
                    { h: '09:00', tgt: 1100, act: 980 },
                    { h: '10:00', tgt: 1200, act: 1050 },
                    { h: '11:00', tgt: 1250, act: 1100 },
                    { h: '12:00', tgt: 1350, act: 1280 },
                    { h: '13:00', tgt: 1400, act: 1350 },
                    { h: '14:00', tgt: 1550, act: 1500 },
                    { h: '15:00', tgt: 1650, act: 1600 },
                    { h: '16:00', tgt: 1700, act: 1650 },
                    { h: '17:00', tgt: 1750, act: 1720 },
                  ].map((b, idx) => {
                    const x = 38 + idx * 24;
                    const tH = (b.tgt / 2000) * 110;
                    const aH = (b.act / 2000) * 110;

                    return (
                      <g key={b.h}>
                        <rect x={x} y={130 - tH} width="8" height={tH} fill="#0066FF" rx="1" />
                        <rect x={x + 9} y={130 - aH} width="8" height={aH} fill="#10B981" rx="1" />
                        <text x={x + 8} y="142" fontSize="7" fill="#64748B" textAnchor="middle" fontFamily="monospace">
                          {b.h.split(':')[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Chart 2: OEE Trend (Last 8 Hours) Area Chart */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-800">
                  OEE Trend (Last 8 Hours)
                </span>
                <span className="text-[10px] text-blue-600 font-bold font-mono">Current: 86.4%</span>
              </div>

              <div className="h-44 pt-2">
                <svg viewBox="0 0 280 150" className="w-full h-full">
                  <line x1="30" y1="20" x2="275" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="30" y1="50" x2="275" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="30" y1="80" x2="275" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="30" y1="110" x2="275" y2="110" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="30" y1="130" x2="275" y2="130" stroke="#CBD5E1" strokeWidth="1" />

                  <text x="25" y="24" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">100%</text>
                  <text x="25" y="54" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">90%</text>
                  <text x="25" y="84" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">80%</text>
                  <text x="25" y="114" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">70%</text>
                  <text x="25" y="133" fontSize="8" fill="#94A3B8" textAnchor="end" fontFamily="monospace">60%</text>

                  <defs>
                    <linearGradient id="oeeGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 40 73 L 72 69 L 105 65 L 138 62 L 171 60 L 204 58 L 237 56 L 270 59 L 270 130 L 40 130 Z"
                    fill="url(#oeeGrad2)"
                  />
                  <path
                    d="M 40 73 L 72 69 L 105 65 L 138 62 L 171 60 L 204 58 L 237 56 L 270 59"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                  />

                  {[
                    { x: 40, y: 73, v: '82.1%', h: '04:00' },
                    { x: 72, y: 69, v: '83.4%', h: '05:00' },
                    { x: 105, y: 65, v: '84.7%', h: '06:00' },
                    { x: 138, y: 62, v: '85.6%', h: '07:00' },
                    { x: 171, y: 60, v: '86.2%', h: '08:00' },
                    { x: 204, y: 58, v: '86.9%', h: '09:00' },
                    { x: 237, y: 56, v: '87.4%', h: '10:00' },
                    { x: 270, y: 59, v: '86.4%', h: '11:00' },
                  ].map((pt) => (
                    <g key={pt.h}>
                      <circle cx={pt.x} cy={pt.y} r="3" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                      <text x={pt.x} y={pt.y - 6} fontSize="7" fill="#1E293B" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                        {pt.v}
                      </text>
                      <text x={pt.x} y="142" fontSize="7" fill="#64748B" textAnchor="middle" fontFamily="monospace">
                        {pt.h}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Chart 3: Downtime Pareto Horizontal Bars */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-800">Downtime Pareto</span>
                <span className="text-[10px] text-slate-500 font-mono">Total Downtime: 2h 45m</span>
              </div>

              <div className="space-y-1.5 pt-1 text-xs font-mono">
                {[
                  { mach: 'Reflow', dur: '48m (29%)', color: 'bg-[#DC2626]', w: '75%' },
                  { mach: 'AOI', dur: '42m (26%)', color: 'bg-[#EA580C]', w: '66%' },
                  { mach: 'FUJI NXT', dur: '28m (17%)', color: 'bg-[#F59E0B]', w: '44%' },
                  { mach: 'SPI', dur: '18m (11%)', color: 'bg-[#0284C7]', w: '28%' },
                  { mach: 'Printer', dur: '12m (7%)', color: 'bg-[#06B6D4]', w: '19%' },
                  { mach: 'Loader/Unloader', dur: '9m (5%)', color: 'bg-[#64748B]', w: '14%' },
                  { mach: 'Others', dur: '6m (4%)', color: 'bg-[#94A3B8]', w: '9%' },
                ].map((d) => (
                  <div key={d.mach}>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="font-sans font-medium text-slate-700">{d.mach}</span>
                      <span className="text-slate-500 font-semibold">{d.dur}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-xs h-2">
                      <div className={`${d.color} h-2 rounded-xs`} style={{ width: d.w }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW (SUMMARY, MATERIAL STATUS, RECENT WORK ORDERS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Production Summary */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5 mb-2.5">
                <BarChart2 className="w-4 h-4 text-blue-600" /> Production Summary
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-sans">Total Panels</div>
                  <div className="text-base font-black text-slate-800 mt-0.5">11,420</div>
                </div>
                <div className="bg-emerald-50/60 p-2 rounded border border-emerald-100">
                  <div className="text-[10px] text-emerald-700 font-sans">Good Panels</div>
                  <div className="text-base font-black text-emerald-600 mt-0.5">11,282 (98.8%)</div>
                </div>
                <div className="bg-red-50/60 p-2 rounded border border-red-100">
                  <div className="text-[10px] text-red-700 font-sans">Reject Panels</div>
                  <div className="text-base font-black text-red-600 mt-0.5">138 (1.2%)</div>
                </div>
                <div className="bg-blue-50/60 p-2 rounded border border-blue-100">
                  <div className="text-[10px] text-blue-700 font-sans">Rework</div>
                  <div className="text-base font-black text-blue-600 mt-0.5">56 (0.5%)</div>
                </div>
              </div>
            </div>

            {/* 2. Material Status Progress Bars */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5 mb-2">
                <Database className="w-4 h-4 text-indigo-600" /> Material Status
              </div>
              <div className="space-y-2.5 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-sans font-medium text-slate-700">Solder Paste</span>
                    <span className="font-bold text-emerald-600">78%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-sans font-medium text-slate-700">Feeder</span>
                    <span className="font-bold text-amber-500">64%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-400 h-2 rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-sans font-medium text-slate-700">PCB</span>
                    <span className="font-bold text-blue-600">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
              <div className="text-[9px] text-slate-400 font-mono pt-1 text-right">
                Auto-replenishment threshold: 20%
              </div>
            </div>

            {/* 3. Recent Production (Last 5 Work Orders) */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5 mb-2">
                <Layers className="w-4 h-4 text-blue-600" /> Recent Production <span className="text-[10px] text-slate-400 font-normal">(Last 5 Work Orders)</span>
              </div>
              <table className="w-full text-left font-mono text-[10.5px]">
                <thead className="text-slate-400 border-b border-slate-100 uppercase text-[9px]">
                  <tr>
                    <th className="pb-1">WO No.</th>
                    <th className="pb-1">Product</th>
                    <th className="pb-1">Qty (Plan/Act)</th>
                    <th className="pb-1 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { wo: 'WO-2026-0925-014', prod: 'P1234', qty: '3,000 / 2,860', st: 'Running', dot: 'bg-emerald-500' },
                    { wo: 'WO-2026-0925-013', prod: 'P5678', qty: '2,000 / 1,980', st: 'Completed', dot: 'bg-blue-600' },
                    { wo: 'WO-2026-0925-012', prod: 'P9012', qty: '4,000 / 3,850', st: 'Completed', dot: 'bg-blue-600' },
                    { wo: 'WO-2026-0925-011', prod: 'P3456', qty: '2,000 / 1,730', st: 'Completed', dot: 'bg-blue-600' },
                  ].map((r) => (
                    <tr key={r.wo} className="hover:bg-slate-50">
                      <td className="py-1 text-blue-600 font-semibold">{r.wo.replace('WO-2026-', '')}</td>
                      <td className="py-1 text-slate-700">{r.prod}</td>
                      <td className="py-1 text-slate-600">{r.qty}</td>
                      <td className="py-1 text-center">
                        <span className="inline-flex items-center gap-1 text-[9.5px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`} />
                          <span>{r.st}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (3.5 cols) - ALERTS & TRACEABILITY */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-3">
          {/* Live Alerts & Events */}
          <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-blue-600" /> Live Alerts & Events
              </span>
              <button className="text-[10px] text-blue-600 hover:text-blue-800 font-bold font-mono">
                View All &gt;
              </button>
            </div>

            <div className="space-y-2">
              {[
                {
                  lvl: 'HIGH',
                  lvlCol: 'bg-red-600',
                  title: 'AOI – Defect Detected',
                  time: '11:37',
                  sub: 'Panel ID: PNL-0004587 | Defect: Missing Component',
                },
                {
                  lvl: 'MEDIUM',
                  lvlCol: 'bg-amber-500',
                  title: 'Feeder Shortage',
                  time: '11:21',
                  sub: 'FUJI NXT – Feeder 12 (R0201)',
                },
                {
                  lvl: 'HIGH',
                  lvlCol: 'bg-red-600',
                  title: 'Machine Downtime',
                  time: '10:56',
                  sub: 'Reflow – Temperature not reached',
                },
                {
                  lvl: 'INFO',
                  lvlCol: 'bg-blue-600',
                  title: 'New Work Order Started',
                  time: '09:43',
                  sub: 'WO-2026-0925-014 | Product: P1234',
                },
                {
                  lvl: 'INFO',
                  lvlCol: 'bg-blue-600',
                  title: 'Material Replenished',
                  time: '08:32',
                  sub: 'Solder Paste (Lot: SP24678)',
                },
              ].map((al, idx) => (
                <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`${al.lvlCol} text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded`}>
                      {al.lvl}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{al.time}</span>
                  </div>
                  <div className="font-bold text-slate-800 text-[11px]">{al.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 line-clamp-1">{al.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Traceability (Latest Panel) */}
          <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5 text-blue-600" /> Traceability <span className="text-[10px] text-slate-400 font-normal">(Latest Panel)</span>
              </span>
              <button className="text-[10px] text-blue-600 hover:text-blue-800 font-bold font-mono">
                View All &gt;
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Panel ID:</span>
                <strong className="text-blue-600 font-bold">PNL-0004587</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Array Barcode:</span>
                <span className="text-slate-800 font-bold">A123456789012</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Product:</span>
                <span className="text-slate-800 font-medium">P1234 (Control Board)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Work Order:</span>
                <span className="text-slate-800">WO-2026-0925-014</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">SPI Result:</span>
                <div className="flex items-center gap-1.5">
                  <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded shadow-xs">
                    PASS
                  </span>
                  <span className="text-slate-400 text-[10px]">(0.12mm)</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">AOI Result:</span>
                <div className="flex items-center gap-1.5">
                  <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded shadow-xs">
                    PASS
                  </span>
                  <span className="text-slate-400 text-[10px]">(0 Defect)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [3] Production Planning Dashboard
// -------------------------------------------------------------
export const Dashboard3ProductionPlanning: React.FC = () => {
  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={3} title="Production Planning" subtitle="Gantt Scheduling & Bay Loading" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Scheduled Jobs</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">18 Active</div>
            <div className="text-[10px] text-emerald-200 mt-1">4 planned next shift</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">On-Time Dispatch</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">98.4%</div>
            <div className="text-[10px] text-sky-200 mt-1">↑ 1.2% vs target</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#EA580C] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">SMED Changeover</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">18.2 min</div>
            <div className="text-[10px] text-orange-200 mt-1">Target: &lt;20 min</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Line Utilization</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">92.6%</div>
            <div className="text-[10px] text-purple-200 mt-1">Cleanroom Bays 1-4</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">Shift Volume</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">38,500 pcs</div>
            <div className="text-[10px] text-cyan-200 mt-1">Pacing on-track</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">Plant:</span>
          <select className="border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-700 font-mono">
            <option>Plant-01 (Pune)</option>
            <option>Plant-02 (Noida)</option>
            <option>Plant-03 (Greater Noida)</option>
          </select>

          <span className="text-slate-500 font-medium ml-2">Line:</span>
          <select className="border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-700 font-mono">
            <option>Line-01 (High Speed SMT)</option>
            <option>Line-02 (Flexible SMT)</option>
            <option>Line-03 (Prototypes)</option>
          </select>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200 font-mono">
          <button className="px-2.5 py-1 text-xs font-bold rounded bg-[#1E50ED] text-white shadow-xs">Day</button>
          <button className="px-2.5 py-1 text-xs font-bold rounded text-slate-600 hover:bg-white">Week</button>
          <button className="px-2.5 py-1 text-xs font-bold rounded text-slate-600 hover:bg-white">Month</button>
        </div>
      </div>

      {/* Gantt Timeline */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b mb-3">
          <span className="font-bold text-xs text-slate-700 uppercase">Line Work Schedule (25 Sep 2026 - 24h Timeline)</span>
          <div className="flex gap-4 text-xs font-mono">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#1E50ED] rounded-xs" /> Running</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-xs" /> Setup / Changeover</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs" /> Planned Next</span>
          </div>
        </div>

        <DpxGanttTimeline
          lines={[
            {
              lineName: 'Line-01 SMT',
              jobs: [
                { id: 'WO-01', product: 'SMT_ASSY_A', startHour: 0, durationHours: 10, color: '#1E50ED', status: 'Running' },
                { id: 'SETUP', product: 'Changeover', startHour: 10, durationHours: 2, color: '#F59E0B', status: 'Setup' },
                { id: 'WO-04', product: 'CONTROL_B', startHour: 12, durationHours: 11, color: '#059669', status: 'Planned' }
              ]
            },
            {
              lineName: 'Line-02 SMT',
              jobs: [
                { id: 'WO-02', product: 'SMT_POWER_C', startHour: 0, durationHours: 8, color: '#1E50ED', status: 'Running' },
                { id: 'WO-05', product: 'IOT_GATEWAY', startHour: 9, durationHours: 14, color: '#059669', status: 'Planned' }
              ]
            },
            {
              lineName: 'Line-03 SMT',
              jobs: [
                { id: 'WO-03', product: 'SENSOR_NODE_D', startHour: 0, durationHours: 14, color: '#1E50ED', status: 'Running' },
                { id: 'SETUP', product: 'Line Maintenance', startHour: 15, durationHours: 4, color: '#EF4444', status: 'Down' }
              ]
            }
          ]}
        />
      </div>

      {/* Changeover Matrix */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3 border-b bg-slate-50/70 font-bold text-xs text-slate-700 flex justify-between items-center">
          <span>SMT Line Changeover Matrix (SMED Protocol)</span>
          <span className="text-[10px] text-emerald-600 font-mono font-bold">● FAST CHANGEOVER APERTURES VALIDATED</span>
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b text-slate-500 font-mono uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Line</th>
              <th className="py-2.5 px-3">Current Recipe</th>
              <th className="py-2.5 px-3">Next Recipe</th>
              <th className="py-2.5 px-3">Trolley Pre-Kit</th>
              <th className="py-2.5 px-3">Stencil Swap ETA</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {[
              { line: 'Line-01', curr: 'PCB-METER-REV4', next: 'CONTROL-BOARD-V2', trolley: '100% Staged (Bay 1)', eta: '12 min', st: 'READY', col: 'bg-emerald-600' },
              { line: 'Line-02', curr: 'PWR-SMT-48V', next: 'IOT-BLE-MESH', trolley: '85% Staged (Slot 14 pending)', eta: '24 min', st: 'PRE-KIT', col: 'bg-blue-600' },
              { line: 'Line-03', curr: 'SENSOR-MCU-REV3', next: 'SENSOR-MCU-REV3', trolley: 'Same Recipe (Roll-over)', eta: '0 min', st: 'CONTINUOUS', col: 'bg-slate-600' },
            ].map(r => (
              <tr key={r.line} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-[#1E50ED]">{r.line}</td>
                <td className="py-2.5 px-3">{r.curr}</td>
                <td className="py-2.5 px-3 font-bold text-slate-800">{r.next}</td>
                <td className="py-2.5 px-3">{r.trolley}</td>
                <td className="py-2.5 px-3 font-bold">{r.eta}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded text-white ${r.col}`}>
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
// [4] Work Order Management Dashboard
// -------------------------------------------------------------
export const Dashboard4WorkOrderManagement: React.FC = () => {
  const orders = [
    { no: 'WO-20260925-01', product: 'SMT_ASSY_A', planQty: '25,000', actQty: '23,800', prog: 95, startDate: '25-09-2026', endDate: '26-09-2026', status: 'Running', color: 'bg-emerald-500' },
    { no: 'WO-20260925-02', product: 'SMT_ASSY_B', planQty: '18,000', actQty: '16,200', prog: 90, startDate: '25-09-2026', endDate: '27-09-2026', status: 'Running', color: 'bg-emerald-500' },
    { no: 'WO-20260925-03', product: 'SMT_ASSY_C', planQty: '15,000', actQty: '4,500', prog: 30, startDate: '24-09-2026', endDate: '25-09-2026', status: 'Down', color: 'bg-red-500' },
    { no: 'WO-20260924-04', product: 'SMT_ASSY_A', planQty: '20,000', actQty: '20,000', prog: 100, startDate: '23-09-2026', endDate: '24-09-2026', status: 'Completed', color: 'bg-blue-600' },
    { no: 'WO-20260924-05', product: 'SMT_ASSY_B', planQty: '12,000', actQty: '8,400', prog: 70, startDate: '24-09-2026', endDate: '25-09-2026', status: 'Hold', color: 'bg-amber-500' },
    { no: 'WO-20260923-06', product: 'SMT_ASSY_A', planQty: '25,000', actQty: '25,000', prog: 100, startDate: '22-09-2026', endDate: '23-09-2026', status: 'Completed', color: 'bg-blue-600' },
  ];

  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={4} title="Work Order Management" subtitle="Production Orders & Batch Dispatch" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Active Orders</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">12 Running</div>
            <div className="text-[10px] text-emerald-200 mt-1">Cleanroom L1-L4</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Play className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#1D4ED8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Completed Today</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">28 Closed</div>
            <div className="text-[10px] text-blue-200 mt-1">99.1% FPY average</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">In-Release Queue</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">6 Staged</div>
            <div className="text-[10px] text-cyan-200 mt-1">BOMs explosion valid</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Quality Holds</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">0 Holds</div>
            <div className="text-[10px] text-purple-200 mt-1">100% Release Flow</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#EA580C] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Planned Output</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">45,000 pcs</div>
            <div className="text-[10px] text-orange-200 mt-1">Shift A + B</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Actions Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs">
        <div className="flex gap-2">
          <button className="bg-[#1E50ED] text-white font-bold text-xs px-3 py-1.5 rounded shadow-xs hover:bg-blue-700 flex items-center gap-1 font-mono">
            + New WO
          </button>
          <button className="bg-slate-100 text-slate-700 font-bold text-xs px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-200 font-mono">
            Edit
          </button>
          <button className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded hover:bg-emerald-700 font-mono">
            Release
          </button>
          <button className="bg-amber-500 text-white font-bold text-xs px-3 py-1.5 rounded hover:bg-amber-600 font-mono">
            Hold
          </button>
          <button className="bg-slate-600 text-white font-bold text-xs px-3 py-1.5 rounded hover:bg-slate-700 font-mono">
            Close
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Search:</span>
          <input type="text" placeholder="WO number / product..." className="border border-slate-200 rounded px-2.5 py-1 text-xs w-52 font-mono" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b text-slate-500 font-mono uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">WO No.</th>
              <th className="py-2.5 px-3">Product</th>
              <th className="py-2.5 px-3 text-right">Plan Qty</th>
              <th className="py-2.5 px-3 text-right">Actual Qty</th>
              <th className="py-2.5 px-3">Progress</th>
              <th className="py-2.5 px-3">Start Date</th>
              <th className="py-2.5 px-3">End Date</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {orders.map((o) => (
              <tr key={o.no} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-[#1E50ED]">{o.no}</td>
                <td className="py-2.5 px-3 font-bold text-slate-800">{o.product}</td>
                <td className="py-2.5 px-3 text-right">{o.planQty}</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900">{o.actQty}</td>
                <td className="py-2.5 px-3">
                  <div className="w-24 bg-slate-100 rounded-full h-2 inline-block mr-2 align-middle">
                    <div className="bg-[#1E50ED] h-2 rounded-full" style={{ width: `${o.prog}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-500">{o.prog}%</span>
                </td>
                <td className="py-2.5 px-3 text-slate-500">{o.startDate}</td>
                <td className="py-2.5 px-3 text-slate-500">{o.endDate}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded text-white ${
                    o.status === 'Running' ? 'bg-emerald-600' :
                    o.status === 'Completed' ? 'bg-blue-600' :
                    o.status === 'Hold' ? 'bg-amber-500' : 'bg-red-600'
                  }`}>
                    {o.status}
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
// [5] Production Execution Dashboard
// -------------------------------------------------------------
export const Dashboard5ProductionExecution: React.FC = () => {
  const [scanResult, setScanResult] = useState<'OK' | 'NG'>('OK');

  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={5} title="Production Execution" subtitle="Floor PCB Scan Terminal & Verification" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Run Pace</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">1,540 pcs/h</div>
            <div className="text-[10px] text-emerald-200 mt-1">Takt: 2.3s / unit</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Station Staffing</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">14/14 Online</div>
            <div className="text-[10px] text-sky-200 mt-1">Shift A Certified</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#1D4ED8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Shift Output</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">11,420 pcs</div>
            <div className="text-[10px] text-blue-200 mt-1">95.2% target</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Cycle Efficiency</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">96.8%</div>
            <div className="text-[10px] text-purple-200 mt-1">OEE matched</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#EA580C] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Line Balance</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">91.4%</div>
            <div className="text-[10px] text-orange-200 mt-1">SMEMA synchronized</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Top Filter Selection */}
      <div className="grid grid-cols-4 gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs text-xs font-mono">
        <div>
          <span className="text-slate-400 text-[10px] block">PLANT</span>
          <select className="font-bold border border-slate-200 rounded px-2 py-1 w-full mt-0.5 text-xs"><option>Plant-01</option></select>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block">LINE</span>
          <select className="font-bold border border-slate-200 rounded px-2 py-1 w-full mt-0.5 text-xs"><option>Line-01</option></select>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block">WO NO.</span>
          <select className="font-bold border border-slate-200 rounded px-2 py-1 w-full mt-0.5 text-xs"><option>WO-20260925-01</option></select>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block">PRODUCT</span>
          <select className="font-bold border border-slate-200 rounded px-2 py-1 w-full mt-0.5 text-xs"><option>SMT_ASSY_A</option></select>
        </div>
      </div>

      {/* Huge Scan Button Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs text-center">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cleanroom Optical Barcode Laser Terminal</div>
        <button 
          onClick={() => setScanResult('OK')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg px-8 py-3.5 rounded-lg shadow-md transition-transform active:scale-95 inline-flex items-center gap-2 font-mono"
        >
          <CheckCircle2 className="w-6 h-6" /> Scan PCB Barcode
        </button>
        <div className="text-[11px] text-slate-400 font-mono mt-2">Ready to receive IPC-CFX laser barcode trigger</div>
      </div>

      {/* Recent Scans Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="bg-slate-50/70 px-3 py-2 border-b font-bold text-xs text-slate-700 flex justify-between">
          <span>Recent Scans / Route Verification</span>
          <span className="text-[10px] text-emerald-600 font-mono font-bold">● Scanner Online (COM3 - 9600 Baud)</span>
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
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-xs text-white ${
                    s.res === 'OK' ? 'bg-emerald-600' : 'bg-red-600'
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
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={6} title="WIP Management" subtitle="Work-In-Process Cleanroom Buffer Tracking" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">Total WIP</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">3,420 panels</div>
            <div className="text-[10px] text-cyan-200 mt-1">In-line buffer stock</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Buffer Saturation</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">42% Safe</div>
            <div className="text-[10px] text-emerald-200 mt-1">No overflow alarm</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Aging Alarms</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">0 Dwell Alerts</div>
            <div className="text-[10px] text-purple-200 mt-1">Max dwell &lt;2 hours</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Flow Velocity</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">28.4 s/panel</div>
            <div className="text-[10px] text-sky-200 mt-1">SMEMA synchronized</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#EA580C] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Magazines In-Use</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">18 / 40 Slots</div>
            <div className="text-[10px] text-orange-200 mt-1">22 empty available</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Buffers Visual Map */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <span className="font-bold text-xs text-slate-800">SMT In-Line Buffer Queue Distribution</span>
          <span className="text-[10px] text-slate-400 font-mono">Max Capacity: 50 Panels / Buffer</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {[
            { name: 'Loader Buffer', count: 24, max: 50, col: 'bg-emerald-500' },
            { name: 'Post-Printer', count: 12, max: 50, col: 'bg-emerald-500' },
            { name: 'Pre-SPI Queue', count: 8, max: 50, col: 'bg-emerald-500' },
            { name: 'Mounter Buffer', count: 32, max: 50, col: 'bg-amber-500' },
            { name: 'Pre-Reflow', count: 18, max: 50, col: 'bg-emerald-500' },
            { name: 'Post-AOI Buffer', count: 14, max: 50, col: 'bg-emerald-500' },
          ].map(b => (
            <div key={b.name} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-center font-mono">
              <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{b.name}</div>
              <div className="text-xl font-black text-slate-800">{b.count}</div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div className={`${b.col} h-1.5 rounded-full`} style={{ width: `${(b.count/b.max)*100}%` }} />
              </div>
              <div className="text-[9px] text-slate-400 mt-1">{Math.round((b.count/b.max)*100)}% Cap</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [7] Quality Dashboard (Overall)
// -------------------------------------------------------------
export const Dashboard7QualityOverall: React.FC = () => {
  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={7} title="Quality Dashboard (Overall)" subtitle="Cleanroom Defect Pareto & Six Sigma SPC" />

      {/* TOP ROW: 7 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Overall FPY</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">98.9%</div>
            <div className="text-[10px] text-emerald-200 mt-1">Target: 98.5%</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">SPI FPY</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">99.2%</div>
            <div className="text-[10px] text-sky-200 mt-1">Vol: 100.8% Avg</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Placement FPY</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">99.5%</div>
            <div className="text-[10px] text-purple-200 mt-1">Pick Err: 12 PPM</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">AOI FPY</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">98.1%</div>
            <div className="text-[10px] text-cyan-200 mt-1">False Call: 0.15%</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#DC2626] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-red-100">Defect PPM</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">6,250</div>
            <div className="text-[10px] text-red-200 mt-1">▼ -18% vs UCL</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#EA580C] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Repair Rate</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">0.8%</div>
            <div className="text-[10px] text-orange-200 mt-1">91 Bds Reworked</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#475569] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-200">Scrap Rate</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">0.3%</div>
            <div className="text-[10px] text-slate-300 mt-1">Target: &lt;0.5%</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Six Sigma Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">SIX SIGMA SPC METRICS:</span>
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
            Cpk: 1.48 (4.8σ World Class)
          </span>
          <span className="text-slate-500 font-mono">DPMO: 112 | Spec Limit: ±3σ</span>
        </div>
        <span className="text-blue-600 font-mono font-bold">Auto-Purge Loop: ON</span>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Defect Pareto */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
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
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
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
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
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
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={8} title="SPI Dashboard" subtitle="Koh Young 3D Solder Paste Inspection" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#1D4ED8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Boards Inspected</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">1,240</div>
            <div className="text-[10px] text-blue-200 mt-1">Shift A Progress</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Boards OK</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">1,226</div>
            <div className="text-[10px] text-emerald-200 mt-1">98.9% Pass Rate</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#DC2626] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-red-100">Boards NG</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">14</div>
            <div className="text-[10px] text-red-200 mt-1">1.1% Defect Rate</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Solder Volume Avg</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">100.8%</div>
            <div className="text-[10px] text-sky-200 mt-1">Target: 80% - 130%</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Cycle Time</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">4.8 s</div>
            <div className="text-[10px] text-purple-200 mt-1">Takt Cap: 6.5s</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs text-xs">
        <div className="flex items-center gap-2 font-mono">
          <span className="font-bold text-slate-800">EQUIPMENT:</span>
          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-200">
            Koh Young aSPIre3 (Line-01)
          </span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">Dual Moiré 25µm</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-slate-500">Threshold: 80% - 130% Volume</span>
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
            CLOSED-LOOP FEEDBACK ● ON
          </span>
        </div>
      </div>

      {/* Heatmap & Optical Inspection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {/* Optical Camera View */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-slate-700">Koh Young 3D Optical Camera Alignment</span>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">● MOIRÉ DUAL-PROJECTION ACTIVE</span>
          </div>
          <DpxOpticalPcb type="SPI" showBBoxes={true} />
        </div>

        {/* 3D Volumetric Solder Heatmap */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-slate-700">3D Volumetric Solder Height Topology</span>
            <div className="flex gap-1 text-[10px]">
              <span className="bg-[#1E50ED] text-white px-2 py-0.5 rounded font-bold font-mono">3D Mesh</span>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">2D Slice</span>
            </div>
          </div>
          <Dpx3dHeatmap rows={6} cols={10} highlightDefect={true} />
        </div>
      </div>

      {/* Panel Measurement Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3 border-b bg-slate-50/70 font-bold text-xs text-slate-700 flex justify-between items-center">
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
                <td className="py-2 px-3 font-bold text-[#1E50ED]">Panel-{r.p}</td>
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
        <div className="p-2.5 bg-slate-50/70 text-[10px] font-mono text-slate-500 border-t flex justify-between">
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
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={9} title="FUJI Placement Dashboard" subtitle="AIMEX III / NXT III High-Speed Mounters" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Placement Speed</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">44,820 CPH</div>
            <div className="text-[10px] text-purple-200 mt-1">Peak: 48,200 CPH</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Pickup Error</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">12 PPM</div>
            <div className="text-[10px] text-emerald-200 mt-1">Benchmark &lt;25 PPM</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Active Nozzles</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">24/24 Online</div>
            <div className="text-[10px] text-sky-200 mt-1">H01-H12 Heads Valid</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#EA580C] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Reel Splice Due</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">Slot 08 (12m)</div>
            <div className="text-[10px] text-orange-200 mt-1">Dispatch AGV Trolley</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">Placed Today</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">1.42M chips</div>
            <div className="text-[10px] text-cyan-200 mt-1">Shift A throughput</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Fuji Error Trend Chart & Nozzle Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-slate-700">Drop Rate Trend (PPM) Across Shift</span>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">Threshold: 25 PPM (UCL)</span>
          </div>
          <DpxMultiLineTrend
            labels={['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h']}
            threshold={25}
            thresholdLabel="25 PPM UCL"
            series={[
              { name: '0402 Chips', color: '#1E50ED', data: [18, 14, 12, 10, 15, 11, 8, 9] },
              { name: '0201 Passives', color: '#EA580C', data: [22, 19, 15, 14, 18, 12, 11, 10] },
            ]}
          />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-slate-700">Nozzle Pick Error by Head (H01-H12)</span>
            <span className="text-[10px] text-slate-400 font-mono">PPM / Head</span>
          </div>
          <DpxDualBarChart
            items={[
              { label: 'H01', plan: 15, actual: 12 },
              { label: 'H02', plan: 15, actual: 8 },
              { label: 'H03', plan: 15, actual: 14 },
              { label: 'H04', plan: 15, actual: 19 },
              { label: 'H05', plan: 15, actual: 6 },
              { label: 'H06', plan: 15, actual: 11 },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [10] Stencil Setup & Solder Paste Life
// -------------------------------------------------------------
export const Dashboard10StencilSetup: React.FC = () => {
  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={10} title="Stencil Setup & Solder Paste Life" subtitle="Screen Printer Setup & IPC J-STD-005" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Paste Open Life</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">3h 45m rem</div>
            <div className="text-[10px] text-emerald-200 mt-1">IPC J-STD-005 spec</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Stencil Tension</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">38.4 N/cm</div>
            <div className="text-[10px] text-sky-200 mt-1">Nominal: 35 - 42 N/cm</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">Wipe Cycles</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">14 / 50</div>
            <div className="text-[10px] text-cyan-200 mt-1">Auto-wipe interval 5 pcb</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Squeegee Force</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">7.2 kg</div>
            <div className="text-[10px] text-purple-200 mt-1">Speed: 35 mm/s</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#1D4ED8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Jar Thaw Time</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">4.0h Done</div>
            <div className="text-[10px] text-blue-200 mt-1">Room temp stabilized</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* 5-Point Tension Grid & Lot Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="font-bold text-xs text-slate-800 mb-2">5-Point Fiducial Stencil Tension Grid (N/cm)</div>
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="bg-white p-2 rounded shadow-2xs font-bold text-emerald-600">TL: 38.2</div>
            <div className="text-slate-300 flex items-center justify-center">──</div>
            <div className="bg-white p-2 rounded shadow-2xs font-bold text-emerald-600">TR: 38.6</div>
            <div className="text-slate-300 flex items-center justify-center">│</div>
            <div className="bg-blue-50 border border-blue-200 p-2 rounded shadow-2xs font-black text-blue-700">CTR: 38.4</div>
            <div className="text-slate-300 flex items-center justify-center">│</div>
            <div className="bg-white p-2 rounded shadow-2xs font-bold text-emerald-600">BL: 37.9</div>
            <div className="text-slate-300 flex items-center justify-center">──</div>
            <div className="bg-white p-2 rounded shadow-2xs font-bold text-emerald-600">BR: 38.5</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between font-mono text-xs">
          <div className="font-bold text-xs text-slate-800 font-sans mb-1">Active Solder Paste Lot Tracking</div>
          <div className="space-y-1.5 py-1">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">PASTE LOT:</span>
              <span className="font-bold text-slate-800">SP-2026-SAC305-928</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">ALLOY TYPE:</span>
              <span className="font-bold text-slate-800">Sn96.5 Ag3.0 Cu0.5 (Type 4)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">JAR OPENED:</span>
              <span className="text-slate-700">25-Sep-2026 08:15 AM</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">DISCARD EXPIRY:</span>
              <span className="font-bold text-emerald-600">25-Sep-2026 16:15 PM (3h 45m left)</span>
            </div>
          </div>
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
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={11} title="AOI Dashboard" subtitle="Koh Young Zenith 3D Automated Optical Inspection" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#1D4ED8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Inspected Boards</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">1,240</div>
            <div className="text-[10px] text-blue-200 mt-1">Zenith 3D Camera</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">True FPY</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">98.1%</div>
            <div className="text-[10px] text-emerald-200 mt-1">Target &gt;97.5%</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">False Call Rate</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">0.12%</div>
            <div className="text-[10px] text-cyan-200 mt-1">AI Neural Filtered</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#DC2626] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-red-100">Defect Count</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">24 pcs</div>
            <div className="text-[10px] text-red-200 mt-1">14 Missing, 6 Tomb</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Optical Cycle</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">10.8 s</div>
            <div className="text-[10px] text-purple-200 mt-1">Takt: 12.0s</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Optical Camera View & Defect Classification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-slate-700">Zenith 3D High-Res Optical Feed</span>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">● 8-WAY COAXIAL PROJECTION</span>
          </div>
          <DpxOpticalPcb type="AOI" showBBoxes={true} />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-slate-700">AOI Defect Classification</span>
            <span className="text-[10px] text-slate-400 font-mono">24 Total Defective</span>
          </div>
          <DpxHorizontalPareto
            maxPct={50}
            items={[
              { name: 'Missing 0402 Chip', percentage: 42, color: '#EF4444' },
              { name: 'Tombstoning (C0603)', percentage: 25, color: '#F59E0B' },
              { name: 'Solder Bridge (QFP48)', percentage: 18, color: '#6366F1' },
              { name: 'Polarity Reverse (LED)', percentage: 10, color: '#3B82F6' },
              { name: 'Lifted Lead (SOIC8)', percentage: 5, color: '#94A3B8' },
            ]}
          />
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
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={12} title="Reflow Dashboard" subtitle="Heller 1913 MK5 10-Zone Forced Air Convection" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Process Window (PWI)</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">62.4% PWI</div>
            <div className="text-[10px] text-emerald-200 mt-1">SAC305 Spec &lt;80%</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#EA580C] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Peak Temperature</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">245.2°C</div>
            <div className="text-[10px] text-orange-200 mt-1">Nominal: 242-248°C</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Time Above Liquidus</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">62 sec TAL</div>
            <div className="text-[10px] text-sky-200 mt-1">Liquidus line 217°C</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">N2 Oxygen Level</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">450 PPM</div>
            <div className="text-[10px] text-purple-200 mt-1">Target &lt;500 PPM</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">Conveyor Speed</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">0.85 m/min</div>
            <div className="text-[10px] text-cyan-200 mt-1">Profile locked</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* 10-Zone Thermal Curve */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-xs text-slate-700">10-Zone Thermal Gradient Profile (SAC305 Solder Recipe)</span>
          <span className="text-[10px] text-emerald-600 font-bold font-mono">● KIC RPI LIVE THERMOCOUPLE LINK ACTIVE</span>
        </div>
        <DpxReflowThermalCurve
          zones={[
            { zone: 1, setTemp: 155, actualTemp: 153, label: 'Z1 Pre-heat' },
            { zone: 2, setTemp: 170, actualTemp: 169, label: 'Z2 Soak 1' },
            { zone: 3, setTemp: 185, actualTemp: 184, label: 'Z3 Soak 2' },
            { zone: 4, setTemp: 205, actualTemp: 204, label: 'Z4 Soak 3' },
            { zone: 5, setTemp: 220, actualTemp: 219, label: 'Z5 Ramp' },
            { zone: 6, setTemp: 238, actualTemp: 237, label: 'Z6 Reflow 1' },
            { zone: 7, setTemp: 245, actualTemp: 244, label: 'Z7 Peak' },
            { zone: 8, setTemp: 242, actualTemp: 241, label: 'Z8 Reflow 2' },
            { zone: 9, setTemp: 180, actualTemp: 178, label: 'Z9 Cool 1' },
            { zone: 10, setTemp: 80, actualTemp: 78, label: 'Z10 Cool 2' },
          ]}
          liquidusTemp={217}
          peakTemp={245}
        />
      </div>

      {/* 10-Zone Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-center font-mono">
          <thead className="bg-slate-50 border-b text-slate-500 text-[10px]">
            <tr>
              <th className="py-2 px-1">Zone</th>
              {Array.from({ length: 10 }, (_, i) => <th key={i} className="py-2 px-1">Z{i + 1}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-2 px-1 font-bold text-slate-700 text-left pl-3">Top Set (°C)</td>
              {[155, 170, 185, 205, 220, 238, 245, 242, 180, 80].map((t, i) => <td key={i} className="py-2 px-1">{t}</td>)}
            </tr>
            <tr className="bg-slate-50/50">
              <td className="py-2 px-1 font-bold text-slate-700 text-left pl-3">Top Act (°C)</td>
              {[154, 169, 186, 204, 219, 237, 245.2, 241, 179, 79].map((t, i) => (
                <td key={i} className="py-2 px-1 font-bold text-emerald-600">{t}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [13] PCB Traceability
// -------------------------------------------------------------
export const Dashboard13PcbTraceability: React.FC = () => {
  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={13} title="PCB Traceability" subtitle="IPC-1782 Level 4 & 21 CFR Part 11 Audit Trail" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#1D4ED8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Traced Boards</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">11,420 pcs</div>
            <div className="text-[10px] text-blue-200 mt-1">Shift A 100% indexed</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">IPC-1782 Standard</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">Class 4 Valid</div>
            <div className="text-[10px] text-emerald-200 mt-1">Full component lot linkage</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Hash Integrity</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">SHA-256 OK</div>
            <div className="text-[10px] text-purple-200 mt-1">Immutable ledger locked</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">Quarantine Holds</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">0 Boards</div>
            <div className="text-[10px] text-cyan-200 mt-1">Audit trail clear</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">e-Signature Log</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">972 Records</div>
            <div className="text-[10px] text-sky-200 mt-1">21 CFR Part 11</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Traceability Stepper Route */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-xs text-slate-800">Unit Lifecycle Route Verification (Panel ID: PNL-0004587)</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">● 100% AUDIT READY</span>
        </div>
        <DpxProcessStepper
          steps={[
            { name: 'Laser Mark', time: '08:14:02', status: 'PASS' },
            { name: 'Paste Print', time: '08:15:30', status: 'PASS' },
            { name: 'SPI 3D', time: '08:16:15', status: 'PASS' },
            { name: 'Fuji Pick&Place', time: '08:18:04', status: 'PASS' },
            { name: 'Reflow 10-Zone', time: '08:23:40', status: 'PASS' },
            { name: 'AOI 3D', time: '08:24:55', status: 'PASS' },
            { name: 'ICT / Functional', time: '08:27:10', status: 'PASS' },
          ]}
        />
      </div>

      {/* Query Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3 text-xs">
        <span className="font-bold text-slate-700">Audit Serial Lookup:</span>
        <input type="text" defaultValue="PNL-0004587" className="border border-slate-300 rounded px-2.5 py-1 font-mono text-xs w-64" />
        <button className="bg-[#1E50ED] text-white px-3 py-1 rounded font-bold font-mono">Verify Hash</button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [14] Component Genealogy
// -------------------------------------------------------------
export const Dashboard14ComponentGenealogy: React.FC = () => {
  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={14} title="Component Genealogy" subtitle="Reel Lot-to-Board Correlation & J-STD-033D MSL" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#1D4ED8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Scanned Reels</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">1,248 Active</div>
            <div className="text-[10px] text-blue-200 mt-1">Feeder Trolleys 1-4</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">Unique Components</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">482 Part Nos</div>
            <div className="text-[10px] text-cyan-200 mt-1">BOM Verified 100%</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Tag className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">MSL Violations</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">0 Alarms</div>
            <div className="text-[10px] text-emerald-200 mt-1">J-STD-033D In-Spec</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Expiration Alerts</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">0 Expired</div>
            <div className="text-[10px] text-purple-200 mt-1">Reel Date-Codes OK</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Chip UIDs Placed</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">2.84M units</div>
            <div className="text-[10px] text-sky-200 mt-1">Full Traceability</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Lot Tree Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3 border-b bg-slate-50/70 font-bold text-xs text-slate-700 flex justify-between items-center">
          <span>Component Lot Correlation – Panel PNL-0004587</span>
          <span className="text-[10px] text-slate-400 font-mono">MSL Level 3 Max Floor Life: 168h</span>
        </div>
        <table className="w-full text-xs text-left font-mono">
          <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Designator</th>
              <th className="py-2.5 px-3">Part Number</th>
              <th className="py-2.5 px-3">Reel ID</th>
              <th className="py-2.5 px-3">Manufacturer</th>
              <th className="py-2.5 px-3">Date Code</th>
              <th className="py-2.5 px-3 text-center">MSL Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { des: 'U1', pn: 'STM32F407VGT6', reel: 'REEL-9021', mfr: 'STMicro', dc: '2612', msl: 'MSL 3 (124h rem)' },
              { des: 'C1..C12', pn: 'GRM188R71C104KA01D', reel: 'REEL-4481', mfr: 'Murata', dc: '2618', msl: 'MSL 1 (Unlimited)' },
              { des: 'R1..R8', pn: 'RC0402FR-0710KL', reel: 'REEL-1129', mfr: 'Yageo', dc: '2620', msl: 'MSL 1 (Unlimited)' },
              { des: 'IC2', pn: 'TPS54331DR', reel: 'REEL-3342', mfr: 'TI', dc: '2614', msl: 'MSL 2 (1 year)' },
            ].map(r => (
              <tr key={r.des} className="hover:bg-slate-50">
                <td className="py-2 px-3 font-bold text-[#1E50ED]">{r.des}</td>
                <td className="py-2 px-3 text-slate-800 font-bold">{r.pn}</td>
                <td className="py-2 px-3 text-slate-600">{r.reel}</td>
                <td className="py-2 px-3 text-slate-600">{r.mfr}</td>
                <td className="py-2 px-3 text-slate-600">{r.dc}</td>
                <td className="py-2 px-3 text-center">
                  <span className="bg-emerald-100 text-emerald-800 text-[9.5px] px-2 py-0.5 rounded font-bold">
                    {r.msl}
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
// [15] Material Reel Management
// -------------------------------------------------------------
export const Dashboard15MaterialReel: React.FC = () => {
  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={15} title="Material Reel Management" subtitle="Smart Dry Cabinet Storage & Splicing" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Active Reels</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">640 Reels</div>
            <div className="text-[10px] text-sky-200 mt-1">Mounted on Line 01</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Dry Cabinet RH</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">8.5% RH</div>
            <div className="text-[10px] text-emerald-200 mt-1">Target &lt;10% Safe</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#1D4ED8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Cabinet Temp</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">21.4°C</div>
            <div className="text-[10px] text-blue-200 mt-1">Climate Controlled</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#EA580C] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Splice Actions</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">42 Spliced</div>
            <div className="text-[10px] text-orange-200 mt-1">Zero Line Stops</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">AGV Deliveries</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">2 Pending</div>
            <div className="text-[10px] text-purple-200 mt-1">ETA: 15 minutes</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Play className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Splicing Countdown Queue */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3 border-b bg-slate-50/70 font-bold text-xs text-slate-700 flex justify-between items-center">
          <span>Feeder Reel Depletion & Splicing Queue</span>
          <span className="text-[10px] text-amber-600 font-mono font-bold">● SMART SPLICING TRIGGER ACTIVE</span>
        </div>
        <table className="w-full text-xs text-left font-mono">
          <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Slot No</th>
              <th className="py-2.5 px-3">Component PN</th>
              <th className="py-2.5 px-3">Remaining Pcs</th>
              <th className="py-2.5 px-3">Depletion Time</th>
              <th className="py-2.5 px-3">Pre-Kitted Reel</th>
              <th className="py-2.5 px-3 text-center">Urgency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { slot: 'Slot 08', pn: 'R-0402-10K', rem: 420, eta: '12 min', prekit: 'REEL-8841 (Ready)', urg: 'URGENT', col: 'bg-red-600' },
              { slot: 'Slot 14', pn: 'C-0603-100NF', rem: 1100, eta: '28 min', prekit: 'REEL-7712 (Staged)', urg: 'SOON', col: 'bg-amber-500' },
              { slot: 'Slot 22', pn: 'LED-0805-GRN', rem: 2400, eta: '54 min', prekit: 'REEL-5520 (In-Store)', urg: 'OK', col: 'bg-emerald-600' },
            ].map(r => (
              <tr key={r.slot} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-[#1E50ED]">{r.slot}</td>
                <td className="py-2.5 px-3 font-bold text-slate-800">{r.pn}</td>
                <td className="py-2.5 px-3">{r.rem} pcs</td>
                <td className="py-2.5 px-3 font-bold">{r.eta}</td>
                <td className="py-2.5 px-3 text-slate-600">{r.prekit}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded text-white ${r.col}`}>
                    {r.urg}
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
// [16] Feeder Management
// -------------------------------------------------------------
export const Dashboard16FeederManagement: React.FC = () => {
  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={16} title="Feeder Management" subtitle="Feeder Calibration & Pick Count Tracking" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#1D4ED8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Installed Feeders</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">120 Units</div>
            <div className="text-[10px] text-blue-200 mt-1">Lines 01-04</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Calibration Valid</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">118 / 120</div>
            <div className="text-[10px] text-emerald-200 mt-1">98.3% In-Spec</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#EA580C] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Service Due</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">2 Feeders</div>
            <div className="text-[10px] text-orange-200 mt-1">Pick count &gt;50k hits</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Total Pick Count</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">12.4M Hits</div>
            <div className="text-[10px] text-sky-200 mt-1">Shift A cumulative</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Trolley Banks</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">4 Docked</div>
            <div className="text-[10px] text-purple-200 mt-1">All RFID paired</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Feeder Health Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3 border-b bg-slate-50/70 font-bold text-xs text-slate-700 flex justify-between items-center">
          <span>Smart Intelligent Feeder Status (FUJI W08f / W12f)</span>
          <span className="text-[10px] text-slate-400 font-mono">Service Threshold: 50,000 Picks</span>
        </div>
        <table className="w-full text-xs text-left font-mono">
          <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Feeder Serial</th>
              <th className="py-2.5 px-3">Width / Pitch</th>
              <th className="py-2.5 px-3">Machine / Slot</th>
              <th className="py-2.5 px-3">Picks Since PM</th>
              <th className="py-2.5 px-3">Last Calibrated</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { sn: 'FDR-8MM-041', type: '8mm / 2mm', pos: 'AIMEX-01 / Slot 08', picks: '48,200', cal: '15-Sep-2026', st: 'INSPECT SOON', col: 'bg-amber-500' },
              { sn: 'FDR-8MM-012', type: '8mm / 4mm', pos: 'AIMEX-01 / Slot 14', picks: '18,500', cal: '20-Sep-2026', st: 'OPTIMAL', col: 'bg-emerald-600' },
              { sn: 'FDR-12MM-005', type: '12mm / 4mm', pos: 'AIMEX-02 / Slot 04', picks: '51,400', cal: '01-Sep-2026', st: 'SERVICE DUE', col: 'bg-red-600' },
            ].map(r => (
              <tr key={r.sn} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-[#1E50ED]">{r.sn}</td>
                <td className="py-2.5 px-3">{r.type}</td>
                <td className="py-2.5 px-3 text-slate-800 font-bold">{r.pos}</td>
                <td className="py-2.5 px-3">{r.picks}</td>
                <td className="py-2.5 px-3 text-slate-500">{r.cal}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded text-white ${r.col}`}>
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
// [17] Equipment Monitoring
// -------------------------------------------------------------
export const Dashboard17EquipmentMonitoring: React.FC = () => {
  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={17} title="Equipment Monitoring" subtitle="Shop-Floor SCADA & Sensor Telemetry" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Equipment Online</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">7 / 7 Online</div>
            <div className="text-[10px] text-emerald-200 mt-1">IPC-CFX Telemetry Live</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Factory className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#EA580C] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Power Consumption</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">42.5 kW</div>
            <div className="text-[10px] text-orange-200 mt-1">Nominal: 45 kW cap</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Main Pneumatic</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">0.62 MPa</div>
            <div className="text-[10px] text-sky-200 mt-1">Target: 0.55 - 0.70</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Vacuum Header</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">-88.4 kPa</div>
            <div className="text-[10px] text-purple-200 mt-1">Nozzle suction strong</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">Sensor Health</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">100% Polling</div>
            <div className="text-[10px] text-cyan-200 mt-1">1.2s live refresh</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Machine Telemetry Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        {[
          { name: 'DEK Printer', power: '4.8 kW', air: '0.61 MPa', temp: '24.2°C', st: 'Optimal' },
          { name: 'Fuji NXT Mounter', power: '18.4 kW', air: '0.62 MPa', temp: '31.5°C', st: 'Optimal' },
          { name: 'Heller Reflow', power: '19.3 kW', air: '0.60 MPa', temp: '245°C peak', st: 'Optimal' },
        ].map(m => (
          <div key={m.name} className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs font-mono text-xs">
            <div className="flex justify-between items-center mb-2 font-sans font-bold">
              <span className="text-slate-800">{m.name}</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">● {m.st}</span>
            </div>
            <div className="space-y-1.5 pt-1 text-[11px]">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Power:</span>
                <span className="font-bold text-slate-800">{m.power}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">Pressure:</span>
                <span className="font-bold text-slate-800">{m.air}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Thermal:</span>
                <span className="font-bold text-slate-800">{m.temp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [18] Alarm & Downtime Analytics
// -------------------------------------------------------------
export const Dashboard18AlarmDowntime: React.FC = () => {
  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={18} title="Alarm & Downtime Analytics" subtitle="Root-Cause Analysis, MTBF & MTTR" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#DC2626] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-red-100">Total Downtime</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">2h 45m</div>
            <div className="text-[10px] text-red-200 mt-1">Shift A cumulative</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">MTBF (Mean Time)</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">14.2 hours</div>
            <div className="text-[10px] text-emerald-200 mt-1">↑ +2.1h vs goal</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#EA580C] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">MTTR (Recovery)</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">8.4 min</div>
            <div className="text-[10px] text-orange-200 mt-1">Fast Response Crew</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Critical Alarms</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">0 Active</div>
            <div className="text-[10px] text-sky-200 mt-1">All interlocks cleared</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Micro-Stoppages</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">14 Events</div>
            <div className="text-[10px] text-purple-200 mt-1">Average duration 35s</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Downtime Pareto & Hourly Frequency Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-slate-700">Downtime Pareto by Machine</span>
            <span className="text-[10px] text-slate-400 font-mono">Total: 165 minutes</span>
          </div>
          <DpxHorizontalPareto
            maxPct={40}
            items={[
              { name: 'Reflow Temp Stability', percentage: 29.1, color: '#DC2626' },
              { name: 'AOI Head Calibration', percentage: 25.5, color: '#EA580C' },
              { name: 'Fuji NXT Feeder Deplete', percentage: 17.0, color: '#F59E0B' },
              { name: 'SPI Camera Wash', percentage: 10.9, color: '#0284C7' },
              { name: 'Screen Printer Wipe', percentage: 7.3, color: '#06B6D4' },
              { name: 'Conveyor Jam', percentage: 5.5, color: '#64748B' },
            ]}
          />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-slate-700">Hourly Alarm Frequency & Recovery Pace</span>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">MTTR Benchmark: 10m</span>
          </div>
          <DpxMultiLineTrend
            labels={['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h']}
            threshold={10}
            thresholdLabel="10m Target"
            series={[
              { name: 'Alarms Count', color: '#EF4444', data: [4, 6, 2, 8, 3, 2, 1, 1] },
              { name: 'MTTR (min)', color: '#3B82F6', data: [7, 9, 6, 12, 8, 7, 5, 6] },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// [19] Maintenance Dashboard
// -------------------------------------------------------------
export const Dashboard19Maintenance: React.FC = () => {
  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={19} title="Maintenance Dashboard" subtitle="Total Productive Maintenance (TPM) & Calibration" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">TPM Compliance</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">98.5%</div>
            <div className="text-[10px] text-emerald-200 mt-1">Class 1 Cleanroom</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Open Work Orders</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">3 Scheduled</div>
            <div className="text-[10px] text-sky-200 mt-1">Shift B PM Planned</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#1D4ED8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Completed Today</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">8 PMs Done</div>
            <div className="text-[10px] text-blue-200 mt-1">Signatures Logged</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">Lubrication Plan</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">100% Current</div>
            <div className="text-[10px] text-purple-200 mt-1">Fuji Spindles OK</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0891B2] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">Certified Techs</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">3 On-Duty</div>
            <div className="text-[10px] text-cyan-200 mt-1">Level-3 Certified</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Autonomous TPM Checklist */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3 border-b bg-slate-50/70 font-bold text-xs text-slate-700 flex justify-between items-center">
          <span>Daily Autonomous Maintenance (TPM) Sign-Off</span>
          <span className="text-[10px] text-emerald-600 font-mono font-bold">● ALL LEVEL 1 CHECKS COMPLETED</span>
        </div>
        <table className="w-full text-xs text-left font-mono">
          <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Equipment</th>
              <th className="py-2.5 px-3">Maintenance Task</th>
              <th className="py-2.5 px-3">Interval</th>
              <th className="py-2.5 px-3">Assigned Tech</th>
              <th className="py-2.5 px-3">Completion Time</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { mach: 'DEK Printer', task: 'Under-stencil solvent tank refill & squeegee inspection', int: 'Daily', tech: 'R. Sharma', time: '06:15 AM', st: 'DONE', col: 'bg-emerald-600' },
              { mach: 'Fuji NXT Head 1', task: 'Nozzle tip ultrasonic cleaning & vacuum sensor zero-calibration', int: 'Daily', tech: 'A. Patel', time: '06:30 AM', st: 'DONE', col: 'bg-emerald-600' },
              { mach: 'Heller 1913 Oven', task: 'Exhaust flux condensation trap clean & conveyor chain oiling', int: 'Weekly', tech: 'V. Kumar', time: '14:00 PM', st: 'PENDING', col: 'bg-amber-500' },
            ].map(r => (
              <tr key={r.mach} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-[#1E50ED]">{r.mach}</td>
                <td className="py-2.5 px-3 text-slate-800">{r.task}</td>
                <td className="py-2.5 px-3">{r.int}</td>
                <td className="py-2.5 px-3 text-slate-600">{r.tech}</td>
                <td className="py-2.5 px-3 text-slate-500">{r.time}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded text-white ${r.col}`}>
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
// [20] Spare Parts & Inventory
// -------------------------------------------------------------
export const Dashboard20SpareParts: React.FC = () => {
  return (
    <div className="bg-[#F0F5FA] min-h-[750px] p-3 rounded font-sans text-slate-800 space-y-3">
      <DpxSeqBadge seq={20} title="Spare Parts & Inventory" subtitle="Critical Wear Items, SMT Nozzles & Tool Crib" />

      {/* TOP ROW: 5 VIBRANT SATURATED HERO CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#1D4ED8] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Cleanroom SKUs</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">842 Items</div>
            <div className="text-[10px] text-blue-200 mt-1">Central Tool Crib</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#059669] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Stock Availability</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">99.2%</div>
            <div className="text-[10px] text-emerald-200 mt-1">Zero Line Blocker</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#EA580C] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Reorder Alerts</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">4 SKUs</div>
            <div className="text-[10px] text-orange-200 mt-1">Below safety stock</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-100">SMT Nozzles Ready</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">180 Units</div>
            <div className="text-[10px] text-purple-200 mt-1">0402 / 0201 / QFP</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-[#0284C7] text-white p-3 rounded-lg shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Squeegee Sets</div>
            <div className="text-2xl font-black font-mono tracking-tight mt-0.5">24 Sets</div>
            <div className="text-[10px] text-sky-200 mt-1">Spring steel calibrated</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Critical Spares Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3 border-b bg-slate-50/70 font-bold text-xs text-slate-700 flex justify-between items-center">
          <span>Critical High-Wear Consumable Spares Catalog</span>
          <span className="text-[10px] text-emerald-600 font-mono font-bold">● AUTO-ERP REPLENISHMENT ACTIVE</span>
        </div>
        <table className="w-full text-xs text-left font-mono">
          <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Part Number</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3">Target Equipment</th>
              <th className="py-2.5 px-3 text-right">In-Stock</th>
              <th className="py-2.5 px-3 text-right">Min Threshold</th>
              <th className="py-2.5 px-3">Lead Time</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { pn: 'NZL-FUJI-0402', desc: 'Fuji NXT Ceramic Suction Nozzle 0402', eq: 'Fuji AIMEX / NXT', stock: 45, min: 20, lead: '3 Days', st: 'IN-STOCK', col: 'bg-emerald-600' },
              { pn: 'NZL-FUJI-0201', desc: 'Ultra-Fine Pitch Passive Nozzle 0201', eq: 'Fuji AIMEX / NXT', stock: 12, min: 15, lead: '5 Days', st: 'REORDER', col: 'bg-amber-500' },
              { pn: 'SQG-DEK-350MM', desc: 'Polyurethane Squeegee Blade 350mm Set', eq: 'DEK Horizon Printer', stock: 8, min: 5, lead: '2 Days', st: 'IN-STOCK', col: 'bg-emerald-600' },
              { pn: 'BLT-OVEN-MESH', desc: 'Inconel Heavy Duty Reflow Mesh Belt Segment', eq: 'Heller 1913 MK5', stock: 2, min: 1, lead: '14 Days', st: 'RESERVE', col: 'bg-blue-600' },
            ].map(r => (
              <tr key={r.pn} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-[#1E50ED]">{r.pn}</td>
                <td className="py-2.5 px-3 font-bold text-slate-800">{r.desc}</td>
                <td className="py-2.5 px-3 text-slate-600">{r.eq}</td>
                <td className="py-2.5 px-3 text-right font-black">{r.stock}</td>
                <td className="py-2.5 px-3 text-right text-slate-400">{r.min}</td>
                <td className="py-2.5 px-3">{r.lead}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded text-white ${r.col}`}>
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
