import React from 'react';
import { 
  Building2, Activity, Calendar, FileText, CheckCircle2, 
  Layers, BarChart2, Eye, Cpu, Flame, GitFork, Tag, 
  Database, Wrench, Shield, Maximize2, ExternalLink
} from 'lucide-react';

interface CatalogGridProps {
  onSelectDashboard: (seq: number) => void;
}

// Micro Visualizations for each of the 20 Catalog Cards matching reference architecture
export const DpxCardMicroVisualization: React.FC<{ seq: number }> = ({ seq }) => {
  switch (seq) {
    case 1: // Plant Overview: Mini Donut + Dual Bar
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1 flex items-center justify-between">
          <div className="flex items-center gap-1 pl-0.5">
            <svg width="42" height="42" viewBox="0 0 44 44" className="shrink-0">
              <circle cx="22" cy="22" r="16" fill="none" stroke="#E2E8F0" strokeWidth="6" />
              <circle
                cx="22"
                cy="22"
                r="16"
                fill="none"
                stroke="#10B981"
                strokeWidth="6"
                strokeDasharray="75 100"
                strokeDashoffset="25"
              />
              <circle
                cx="22"
                cy="22"
                r="16"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="6"
                strokeDasharray="20 100"
                strokeDashoffset="50"
              />
              <text x="22" y="25" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#1E293B">94%</text>
            </svg>
            <div className="text-[8.5px] font-mono leading-tight">
              <div className="text-emerald-600 font-bold">● 11 Run</div>
              <div className="text-blue-600">● 2 Idle</div>
              <div className="text-red-500">● 1 Down</div>
            </div>
          </div>
          <div className="flex items-end gap-1 h-11 pr-1">
            {[
              { p: 85, a: 80 }, { p: 90, a: 88 }, { p: 75, a: 72 }, { p: 95, a: 92 }
            ].map((b, i) => (
              <div key={i} className="flex gap-0.5 items-end h-full">
                <div style={{ height: `${b.p * 0.4}px` }} className="w-1.5 bg-blue-500 rounded-xs" />
                <div style={{ height: `${b.a * 0.4}px` }} className="w-1.5 bg-cyan-400 rounded-xs" />
              </div>
            ))}
          </div>
        </div>
      );

    case 2: // SMT Line Live Monitor: Conveyor machine nodes
      return (
        <div className="h-16 bg-[#0a192f] rounded border border-blue-900/60 p-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[8px] font-mono text-cyan-300">
            <span>SMT CONVEYOR FLOW</span>
            <span className="text-emerald-400">44.8k CPH</span>
          </div>
          <div className="flex items-center justify-between px-0.5">
            {['LD', 'PRN', 'SPI', 'FUJI', 'OVEN', 'AOI'].map((m, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-xs bg-emerald-500 text-white text-[7px] font-mono font-bold flex items-center justify-center shadow-xs">
                  {m[0]}
                </div>
                <span className="text-[7px] text-slate-400 font-mono mt-0.5">{m}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 3: // Production Planning: Mini Gantt
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1 flex flex-col justify-around">
          <div className="flex justify-between text-[8px] text-slate-400 font-mono px-1">
            <span>08h</span><span>14h</span><span>20h</span><span>02h</span>
          </div>
          {[
            { label: 'L1', l1: '0%', w1: '40%', c1: 'bg-blue-600', l2: '45%', w2: '50%', c2: 'bg-emerald-600' },
            { label: 'L2', l1: '0%', w1: '65%', c1: 'bg-blue-600', l2: '70%', w2: '25%', c2: 'bg-amber-500' },
            { label: 'L3', l1: '10%', w1: '50%', c1: 'bg-blue-600', l2: '65%', w2: '30%', c2: 'bg-emerald-600' }
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-1 text-[7.5px] font-mono">
              <span className="w-3 text-slate-500 font-bold">{row.label}</span>
              <div className="flex-1 h-2 bg-slate-200 rounded relative overflow-hidden">
                <div style={{ left: row.l1, width: row.w1 }} className={`absolute h-full ${row.c1} rounded-xs`} />
                <div style={{ left: row.l2, width: row.w2 }} className={`absolute h-full ${row.c2} rounded-xs`} />
              </div>
            </div>
          ))}
        </div>
      );

    case 4: // Work Order Management: Progress Bars
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1.5 flex flex-col justify-between font-mono text-[8px]">
          <div className="space-y-1">
            <div className="flex justify-between text-slate-600">
              <span className="truncate pr-1">WO-01 (SMT_A)</span>
              <span className="font-bold text-emerald-600 shrink-0">88%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="w-[88%] bg-emerald-500 h-full rounded-full" />
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="truncate pr-1">WO-02 (POWER_C)</span>
              <span className="font-bold text-blue-600 shrink-0">62%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="w-[62%] bg-blue-500 h-full rounded-full" />
            </div>
          </div>
        </div>
      );

    case 5: // Production Execution: Barcode / Laser Scan
      return (
        <div className="h-16 bg-slate-900 rounded border border-slate-800 p-1.5 flex flex-col justify-between font-mono">
          <div className="flex justify-between text-[7.5px] text-cyan-400">
            <span>LASER SCANNER</span>
            <span className="text-emerald-400">ONLINE</span>
          </div>
          <div className="relative h-4.5 bg-slate-950 rounded flex items-center justify-center overflow-hidden">
            <div className="w-full h-0.5 bg-red-500 absolute animate-pulse shadow-sm" />
            <span className="text-[8px] text-white font-mono tracking-widest z-10">||| | | || |||</span>
          </div>
          <div className="text-[7px] text-slate-400 text-center truncate">
            SN: 705525635 • 0.3s cycle
          </div>
        </div>
      );

    case 6: // WIP Management: Buffer Queues
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1.5 flex flex-col justify-between font-mono text-[8px]">
          <div className="flex justify-between text-slate-500">
            <span>BUFFER BALANCE</span>
            <span className="font-bold text-slate-800">320 Units</span>
          </div>
          <div className="flex gap-1 items-end h-6 pt-0.5">
            {[
              { name: 'PRN', val: 20, col: 'bg-blue-400' },
              { name: 'SPI', val: 45, col: 'bg-cyan-500' },
              { name: 'MNT', val: 120, col: 'bg-emerald-500' },
              { name: 'RFL', val: 35, col: 'bg-amber-500' },
              { name: 'AOI', val: 40, col: 'bg-purple-500' },
            ].map((buf, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div style={{ height: `${(buf.val / 120) * 16}px` }} className={`w-full ${buf.col} rounded-t`} />
                <span className="text-[6.5px] text-slate-400 mt-0.5">{buf.name}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 7: // Quality Dashboard: Mini Donut + Mini Pareto
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <svg width="42" height="42" viewBox="0 0 44 44" className="shrink-0">
              <circle cx="22" cy="22" r="16" fill="none" stroke="#E2E8F0" strokeWidth="6" />
              <circle cx="22" cy="22" r="16" fill="none" stroke="#EF4444" strokeWidth="6" strokeDasharray="53 100" strokeDashoffset="0" />
              <circle cx="22" cy="22" r="16" fill="none" stroke="#F59E0B" strokeWidth="6" strokeDasharray="27 100" strokeDashoffset="53" />
              <circle cx="22" cy="22" r="16" fill="none" stroke="#3B82F6" strokeWidth="6" strokeDasharray="12 100" strokeDashoffset="80" />
              <text x="22" y="25" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#1E293B">103</text>
            </svg>
            <div className="text-[7.5px] font-mono leading-tight">
              <div className="text-red-500 font-bold">55 AOI</div>
              <div className="text-amber-500">28 MNT</div>
              <div className="text-blue-500">12 SPI</div>
            </div>
          </div>
          <div className="w-18 space-y-1 pr-0.5">
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="w-[80%] bg-red-500 h-full" />
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="w-[50%] bg-amber-500 h-full" />
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="w-[30%] bg-blue-500 h-full" />
            </div>
          </div>
        </div>
      );

    case 8: // SPI Dashboard: Mini 3D Heatmap Grid
      return (
        <div className="h-16 bg-[#070D18] rounded border border-cyan-900/50 p-1 flex flex-col justify-between font-mono">
          <div className="flex justify-between text-[7.5px] text-cyan-400">
            <span>3D SOLDER HEATMAP</span>
            <span className="text-emerald-400">60/60 OK</span>
          </div>
          <div className="grid grid-cols-10 gap-0.5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-[1px] ${
                  i === 7 ? 'bg-red-500 animate-pulse' : i % 3 === 0 ? 'bg-emerald-400' : 'bg-cyan-600'
                }`}
              />
            ))}
          </div>
          <div className="text-[7px] text-slate-400 flex justify-between">
            <span>Offset: +8µm X</span>
            <span className="text-emerald-400">● Closed-Loop</span>
          </div>
        </div>
      );

    case 9: // FUJI Placement: Drop Rate PPM Trend
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1 flex flex-col justify-between font-mono">
          <div className="flex justify-between text-[7.5px] text-slate-500">
            <span>DROP RATE (PPM)</span>
            <span className="text-emerald-600 font-bold">8 PPM (OK)</span>
          </div>
          <svg viewBox="0 0 100 24" className="w-full h-6">
            <line x1="0" y1="8" x2="100" y2="8" stroke="#EF4444" strokeDasharray="2,2" strokeWidth="0.8" />
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="1.5"
              points="0,18 15,14 30,20 45,10 60,8 75,6 90,4 100,2"
            />
          </svg>
          <div className="flex justify-between text-[7px] text-slate-400">
            <span>H24S Head</span>
            <span>UCL: 25 PPM</span>
          </div>
        </div>
      );

    case 10: // Stencil & Setup: Tension Meter
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1.5 flex items-center justify-between font-mono">
          <div className="text-center">
            <div className="text-[7.5px] text-slate-400">TENSION</div>
            <div className="text-xs font-black text-emerald-600">38 N/cm</div>
            <div className="text-[7px] text-emerald-500 font-bold">PASS</div>
          </div>
          <div className="space-y-1 w-22 text-[7.5px]">
            <div className="flex justify-between text-slate-500"><span>Wipe:</span> <strong>14/20</strong></div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="w-[70%] bg-blue-500 h-full" />
            </div>
            <div className="text-slate-400 text-[6.5px]">SAC305 MSL: 4.2h</div>
          </div>
        </div>
      );

    case 11: // AOI Dashboard: Optical Camera with BBox
      return (
        <div className="h-16 bg-[#063319] rounded border border-emerald-800/60 p-1 flex items-center justify-between relative overflow-hidden font-mono">
          <div className="w-10 h-10 bg-slate-900 border border-slate-700 rounded flex items-center justify-center text-[7px] text-slate-400">
            IC
          </div>
          <div className="flex-1 pl-2">
            <div className="text-[7.5px] text-emerald-400 font-bold">● ZENITH 3D AOI</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[7px] bg-red-600 text-white px-1 rounded-xs">1 MISSING</span>
              <span className="text-[7px] bg-emerald-600 text-white px-1 rounded-xs">FPY 97.6%</span>
            </div>
            <div className="text-[6.5px] text-slate-300 mt-1">FOV 45mm • Auto-Classified</div>
          </div>
        </div>
      );

    case 12: // Reflow Dashboard: 10-Zone Thermal Curve
      return (
        <div className="h-16 bg-[#0a192f] rounded border border-blue-900/60 p-1 flex flex-col justify-between font-mono">
          <div className="flex justify-between text-[7.5px] text-cyan-300">
            <span>HELLER 10-ZONE</span>
            <span className="text-red-400 font-bold">PEAK 245°C</span>
          </div>
          <svg viewBox="0 0 100 24" className="w-full h-6">
            <line x1="0" y1="12" x2="100" y2="12" stroke="#EF4444" strokeDasharray="2,2" strokeWidth="0.8" />
            <path
              d="M 5 22 Q 25 18 45 13 T 70 3 T 85 10 T 98 22"
              fill="none"
              stroke="#10B981"
              strokeWidth="1.5"
            />
          </svg>
          <div className="flex justify-between text-[7px] text-slate-400">
            <span>Liquidus: 217°C</span>
            <span className="text-emerald-400">PWI: 64% OK</span>
          </div>
        </div>
      );

    case 13: // PCB Traceability: Process Stepper
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1 flex flex-col justify-around font-mono">
          <div className="flex justify-between text-[7.5px] text-slate-500">
            <span>ROUTE GENEALOGY</span>
            <span className="text-emerald-600 font-bold">100% PASS</span>
          </div>
          <div className="flex items-center justify-between px-1 relative">
            <div className="absolute top-2 left-2 right-2 h-0.5 bg-emerald-500 -z-0" />
            {['LD', 'PRN', 'SPI', 'MNT', 'RFL', 'AOI'].map((s, i) => (
              <div key={i} className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white text-[7px] font-bold flex items-center justify-center z-10">
                ✓
              </div>
            ))}
          </div>
          <div className="text-[7px] text-center text-slate-400">
            SN: 705525635 • 6m 11s Total
          </div>
        </div>
      );

    case 14: // OEE Dashboard: Availability, Performance, Quality
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1.5 flex items-center justify-around font-mono text-center">
          <div>
            <div className="text-[7px] text-slate-400">AVAIL</div>
            <div className="text-[11px] font-black text-blue-600">90.2%</div>
          </div>
          <div className="w-px h-7 bg-slate-200" />
          <div>
            <div className="text-[7px] text-slate-400">PERF</div>
            <div className="text-[11px] font-black text-indigo-600">94.8%</div>
          </div>
          <div className="w-px h-7 bg-slate-200" />
          <div>
            <div className="text-[7px] text-slate-400">QUAL</div>
            <div className="text-[11px] font-black text-emerald-600">98.9%</div>
          </div>
        </div>
      );

    case 15: // Yield & FPY: Shift Trend Curve
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1 flex flex-col justify-between font-mono">
          <div className="flex justify-between text-[7.5px] text-slate-500">
            <span>FPY MULTI-LINE TREND</span>
            <span className="text-emerald-600 font-bold">98.9%</span>
          </div>
          <svg viewBox="0 0 100 24" className="w-full h-6">
            <polyline fill="none" stroke="#10B981" strokeWidth="1.5" points="0,15 20,12 40,8 60,6 80,4 100,3" />
            <polyline fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2,2" points="0,18 20,16 40,12 60,10 80,8 100,7" />
          </svg>
          <div className="flex justify-between text-[7px] text-slate-400">
            <span>Shift Target: 98.5%</span>
            <span className="text-emerald-500 font-bold">+0.4%</span>
          </div>
        </div>
      );

    case 16: // Feeder & Material: Slot Bar Meters
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1 flex flex-col justify-between font-mono">
          <div className="flex justify-between text-[7.5px] text-slate-500">
            <span>FEEDER REEL CAPACITY</span>
            <span className="text-amber-500 font-bold">2 Low</span>
          </div>
          <div className="grid grid-cols-8 gap-0.5">
            {[90, 85, 45, 12, 95, 78, 25, 88].map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <div style={{ height: `${v * 0.18}px` }} className={`w-full rounded-xs ${v < 20 ? 'bg-red-500 animate-pulse' : v < 50 ? 'bg-amber-500' : 'bg-blue-500'}`} />
                <span className="text-[6.5px] text-slate-400">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 17: // Traceability Verification: Status Matrix
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1.5 flex flex-col justify-between font-mono text-[7px]">
          <div className="flex justify-between text-slate-500">
            <span>COMPLIANCE AUDIT</span>
            <span className="text-emerald-600 font-bold">100% PASS</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-0.5 rounded text-center">✓ 21 CFR 11</div>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-0.5 rounded text-center">✓ IPC-1782</div>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-0.5 rounded text-center">✓ SHA-256</div>
          </div>
          <div className="text-slate-400 text-[6.5px] text-center">Merkle Root Cryptographically Verified</div>
        </div>
      );

    case 18: // Alarm & Downtime: Pareto Bars
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1 flex flex-col justify-between font-mono">
          <div className="flex justify-between text-[7.5px] text-slate-500">
            <span>DOWNTIME PARETO</span>
            <span className="text-red-500 font-bold">2h 45m</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[7px]">
              <span className="w-8 truncate text-slate-600">Reflow</span>
              <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="w-[65%] bg-red-500 h-full" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-[7px]">
              <span className="w-8 truncate text-slate-600">AOI</span>
              <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="w-[50%] bg-amber-500 h-full" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-[7px]">
              <span className="w-8 truncate text-slate-600">FUJI</span>
              <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="w-[35%] bg-blue-500 h-full" />
              </div>
            </div>
          </div>
        </div>
      );

    case 19: // Maintenance: PM Schedule
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1.5 flex flex-col justify-between font-mono text-[7px]">
          <div className="flex justify-between text-slate-500">
            <span>TPM WORK ORDERS</span>
            <span className="text-blue-600 font-bold">4 Tasks</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between bg-blue-50 border border-blue-200 text-blue-800 px-1 py-0.5 rounded">
              <span className="truncate pr-1">PM-001 (NXT Head H24S)</span>
              <span className="font-bold shrink-0">OPEN</span>
            </div>
            <div className="flex justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-1 py-0.5 rounded">
              <span className="truncate pr-1">CM-003 (AOI Camera 02)</span>
              <span className="font-bold shrink-0">DONE</span>
            </div>
          </div>
        </div>
      );

    case 20: // Spare Parts: Stock Meters
      return (
        <div className="h-16 bg-slate-50 rounded border border-slate-100 p-1.5 flex flex-col justify-between font-mono text-[7px]">
          <div className="flex justify-between text-slate-500">
            <span>SPARE INVENTORY</span>
            <span className="text-emerald-600 font-bold">96% Available</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="p-1 bg-white border rounded">
              <span className="text-slate-400 block text-[6.5px]">Nozzles</span>
              <strong className="text-slate-800 text-[9px]">42 / 50</strong>
            </div>
            <div className="p-1 bg-white border rounded">
              <span className="text-slate-400 block text-[6.5px]">Heads</span>
              <strong className="text-slate-800 text-[9px]">8 / 8</strong>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export const DpxDashboardCatalogGrid: React.FC<CatalogGridProps> = ({ onSelectDashboard }) => {
  const dashboards = [
    {
      seq: 1,
      title: 'Plant Overview Dashboard',
      subtitle: 'Multi-Plant OEE & Volume',
      icon: Building2,
      metrics: [
        { label: 'Plan', val: '125,600' },
        { label: 'Actual', val: '118,340' },
        { label: 'OEE', val: '85.6%' }
      ],
      preview: 'Pune: 84.2% • Noida: 78.6% • Gr. Noida: 83.1% | Active Lines: 11 Running, 2 Idle, 1 Down'
    },
    {
      seq: 2,
      title: 'SMT Line Live Monitor (Line-01)',
      subtitle: 'Flagship Single-Pane-of-Glass',
      icon: Activity,
      badge: 'FLAGSHIP VIEW',
      metrics: [
        { label: 'OEE', val: '86.4%' },
        { label: 'FPY', val: '98.8%' },
        { label: 'Actual', val: '11,420' }
      ],
      preview: 'Conveyor Flow: Loader ➔ SPI ➔ Printer ➔ FUJI NXT ➔ Reflow ➔ AOI ➔ Unloader'
    },
    {
      seq: 3,
      title: 'Production Planning',
      subtitle: 'Line Gantt & Shift Loading',
      icon: Calendar,
      metrics: [
        { label: 'Line-01', val: '92% Cap' },
        { label: 'Line-02', val: '78% Cap' },
        { label: 'Line-03', val: '88% Cap' }
      ],
      preview: 'Active: WO-20260925-01 (SMT_ASSY_A) • WO-20260925-02 (SMT_POWER_C)'
    },
    {
      seq: 4,
      title: 'Work Order Management',
      subtitle: 'Batch Dispatch & Order Life',
      icon: FileText,
      metrics: [
        { label: 'Active', val: '4 Running' },
        { label: 'Hold', val: '1 Hold' },
        { label: 'Done', val: '2 Closed' }
      ],
      preview: 'WO-20260925-01: 25k Target • WO-20260925-02: 18k Target • Release / Hold Controls'
    },
    {
      seq: 5,
      title: 'Production Execution',
      subtitle: 'Barcode Scan Terminal',
      icon: CheckCircle2,
      metrics: [
        { label: 'Scanner', val: 'Online' },
        { label: 'Last Scan', val: '705525635' },
        { label: 'Rate', val: '99.8% OK' }
      ],
      preview: 'Optical laser IPC-CFX check-in terminal with instant pass/fail buzzer routing'
    },
    {
      seq: 6,
      title: 'WIP Management',
      subtitle: 'In-Process Buffer Balance',
      icon: Layers,
      metrics: [
        { label: 'Total WIP', val: '320' },
        { label: 'Processing', val: '210' },
        { label: 'Hold/NG', val: '32' }
      ],
      preview: 'Buffer queues across Placement (120), AOI (45), Reflow (35), and Repair (8)'
    },
    {
      seq: 7,
      title: 'Quality Dashboard (Overall)',
      subtitle: 'Six Sigma Defect Pareto & Trend',
      icon: BarChart2,
      metrics: [
        { label: 'FPY', val: '98.9%' },
        { label: 'Defect PPM', val: '6,250' },
        { label: 'Total Defects', val: '103' }
      ],
      preview: 'Pareto: Missing Component 36%, Tombstone 22.2%, Polarity 9.6%, Solder Bridge 8.8%'
    },
    {
      seq: 8,
      title: 'SPI Dashboard',
      subtitle: 'Koh Young 3D Solder Paste',
      icon: Eye,
      metrics: [
        { label: 'Boards', val: '1,240' },
        { label: 'FPY', val: '98.9%' },
        { label: 'Cycle Time', val: '4.8s' }
      ],
      preview: '3D Volumetric pad inspection with auto closed-loop printer offset feedback'
    },
    {
      seq: 9,
      title: 'FUJI Placement Dashboard',
      subtitle: 'NXT III High Speed Mounter',
      icon: Cpu,
      metrics: [
        { label: 'Speed', val: '44,820 CPH' },
        { label: 'Drop Rate', val: '0.22%' },
        { label: 'FPY', val: '99.52%' }
      ],
      preview: 'Modules M01-M04 H24S/H08M head telemetry, pick error count, nozzle diagnostics'
    },
    {
      seq: 10,
      title: 'SMT Stencil & Setup',
      subtitle: 'Printer Tooling & Tension',
      icon: Wrench,
      metrics: [
        { label: 'Stencil ID', val: 'ST-METER' },
        { label: 'Tension', val: '38 N/cm' },
        { label: 'Wipe Cycle', val: '14 / 20' }
      ],
      preview: 'Fiducial alignment, squeegee pressure (2.4 kg), and paste thaw expiry counter'
    },
    {
      seq: 11,
      title: 'AOI Dashboard',
      subtitle: '3D Optical Defect Review',
      icon: Eye,
      metrics: [
        { label: 'Boards', val: '1,236' },
        { label: 'FPY', val: '97.6%' },
        { label: 'NG Count', val: '30' }
      ],
      preview: '3D Optical camera inspection, bounding box defect tagging, rework station link'
    },
    {
      seq: 12,
      title: 'Reflow Dashboard',
      subtitle: 'Heller 10-Zone Thermal Profiling',
      icon: Flame,
      metrics: [
        { label: 'Profile OK', val: '98.8%' },
        { label: 'Oven Temp', val: 'Optimal' },
        { label: 'TAL Peak', val: '245°C' }
      ],
      preview: '10-Zone thermal curve, nitrogen O2 concentration (480 ppm), conveyor speed sync'
    },
    {
      seq: 13,
      title: 'PCB Traceability / Genealogy',
      subtitle: 'Unit Milestone Lifecycle',
      icon: GitFork,
      metrics: [
        { label: 'Milestones', val: '7 Stations' },
        { label: 'Cycle Time', val: '6m 11s' },
        { label: 'Verification', val: '100% Pass' }
      ],
      preview: 'Loader ➔ Printer ➔ SPI ➔ Placement ➔ Reflow ➔ AOI ➔ Unloader complete event trail'
    },
    {
      seq: 14,
      title: 'Component Genealogy',
      subtitle: 'BOM Lot & Feeder Association',
      icon: Tag,
      metrics: [
        { label: 'BOM Items', val: '45 Slots' },
        { label: 'MSD Status', val: 'MSL-1 OK' },
        { label: 'Lot Track', val: 'Active' }
      ],
      preview: 'RefDes (R45, C12, U01), reel barcode numbers, manufacturer lots, and consumption'
    },
    {
      seq: 15,
      title: 'Material / Reel Management',
      subtitle: 'SMD Reel Inventory & MSD Life',
      icon: Database,
      metrics: [
        { label: 'Reels In Bay', val: '380 Reels' },
        { label: 'Low Stock', val: '12 Slots' },
        { label: 'MSD Alert', val: '0 Expired' }
      ],
      preview: 'Real-time reel stock, remaining component count, floor life timers, dry storage'
    },
    {
      seq: 16,
      title: 'Feeder Management',
      subtitle: 'Smart Feeder Health & Splicing',
      icon: Cpu,
      metrics: [
        { label: 'Feeders Live', val: '96 Feeders' },
        { label: 'Splicing Req', val: '2 Slots' },
        { label: 'Calibration', val: 'Valid' }
      ],
      preview: 'Intelligent 8mm-56mm feeder banks, pick counts, splicing alerts, AGV dispatch link'
    },
    {
      seq: 17,
      title: 'Equipment Real-Time Monitoring',
      subtitle: 'Line-01 SECS/GEM State',
      icon: Activity,
      metrics: [
        { label: 'Running', val: '5 Machines' },
        { label: 'Idle/Down', val: '2 Machines' },
        { label: 'OT Latency', val: '12 ms' }
      ],
      preview: 'Real-time PLC, IPC-CFX, and SECS/GEM machine states, cycle times, and line bottleneck'
    },
    {
      seq: 18,
      title: 'Alarm & Downtime Analysis',
      subtitle: 'Downtime Pareto & Root-Cause',
      icon: Activity,
      metrics: [
        { label: 'Downtime', val: '2h 45m' },
        { label: 'Top Reason', val: 'Reflow 48m' },
        { label: 'Active Alarms', val: '1 Open' }
      ],
      preview: 'Real-time alarm log, machine stoppage Pareto chart, hourly incident histogram'
    },
    {
      seq: 19,
      title: 'Maintenance Management',
      subtitle: 'Total Productive Maintenance (TPM)',
      icon: Wrench,
      metrics: [
        { label: 'PM Today', val: '2 Orders' },
        { label: 'Overdue', val: '0 Orders' },
        { label: 'Calibrations', val: 'Up to Date' }
      ],
      preview: 'Preventive, corrective, and calibration schedules with priority tagging'
    },
    {
      seq: 20,
      title: 'Spare Parts Management',
      subtitle: 'Cleanroom Storage & Reorder',
      icon: Shield,
      metrics: [
        { label: 'Part SKUs', val: '450 Items' },
        { label: 'Low Stock', val: '1 Alert' },
        { label: 'Reorder Sent', val: 'Verified' }
      ],
      preview: 'Heads, nozzles, CPU boards, power supplies, motors with storage bin tracking'
    },
  ];

  return (
    <div className="bg-slate-100 p-3 rounded font-sans text-slate-800">
      {/* Header Banner */}
      <div className="bg-[#0a192f] text-white p-3 rounded-t border-b-2 border-blue-500 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white font-black text-sm px-2.5 py-0.5 rounded font-mono shadow-inner">
            ALL 20
          </div>
          <div>
            <div className="font-bold text-sm tracking-wide uppercase text-slate-100">
              Cleanroom SMT MES 20-Dashboard Master Catalog
            </div>
            <div className="text-[11px] text-blue-300 font-mono">
              Click any dashboard below to enter interactive full-screen mode
            </div>
          </div>
        </div>
        <div className="text-right text-[11px] font-mono text-slate-400">
          Standardized Tier-1 Factory Architecture (Line: SPI ➔ Fuji Mounter ➔ Reflow ➔ AOI)
        </div>
      </div>

      {/* Grid of 20 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 my-3">
        {dashboards.map((d) => {
          const Icon = d.icon;
          const isFlagship = d.seq === 2;

          return (
            <div
              key={d.seq}
              onClick={() => onSelectDashboard(d.seq)}
              className={`bg-white rounded-lg p-3 shadow-sm border transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between ${
                isFlagship 
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20' 
                  : 'border-slate-200 hover:border-blue-400'
              }`}
            >
              <div>
                {/* Top Badge and Title */}
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-blue-600 text-white text-xs font-mono font-black px-1.5 py-0.5 rounded shadow-xs">
                      {d.seq}
                    </span>
                    <span className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {d.title}
                    </span>
                  </div>
                  {d.badge && (
                    <span className="bg-emerald-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                      {d.badge}
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 font-medium mb-2.5">
                  {d.subtitle}
                </div>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-1 bg-slate-50 p-1.5 rounded border border-slate-100 font-mono text-center mb-2.5">
                  {d.metrics.map((m, idx) => (
                    <div key={idx}>
                      <div className="text-[9px] text-slate-400 font-sans">{m.label}</div>
                      <div className="text-[11px] font-black text-slate-800">{m.val}</div>
                    </div>
                  ))}
                </div>

                {/* Micro Visualization Graphic */}
                <div className="mb-2.5">
                  <DpxCardMicroVisualization seq={d.seq} />
                </div>

                {/* Preview snippet */}
                <p className="text-[10px] text-slate-600 leading-relaxed font-sans line-clamp-2">
                  {d.preview}
                </p>
              </div>

              {/* Bottom launch footer */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-blue-600 font-bold group-hover:text-blue-700">
                <span className="flex items-center gap-1">
                  Launch View #{d.seq}
                </span>
                <Maximize2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
