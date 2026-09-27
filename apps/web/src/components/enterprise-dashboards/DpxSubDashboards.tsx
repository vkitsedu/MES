import React, { useState } from 'react';
import { 
  Building2, CheckCircle2, XCircle, AlertTriangle, Clock, ArrowRight,
  Search, Play, Pause, AlertOctagon, RotateCw, Filter, Layers, 
  Cpu, Flame, Eye, Shield, Tag, Calendar, Database, Activity,
  Sliders, Settings, Wrench, BarChart2, ChevronRight, Check,
  Maximize2, Download, Printer, RefreshCw
} from 'lucide-react';

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
  return (
    <div className="bg-slate-100 min-h-[750px] p-3 rounded font-sans text-slate-800">
      <DpxSeqBadge seq={1} title="Plant Overview Dashboard" subtitle="DPX Multi-Facility Production" />
      
      {/* Top 6 KPI summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 my-3">
        <div className="bg-white p-2.5 rounded shadow-sm border border-slate-200">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Total Plan</div>
          <div className="text-xl font-black text-slate-900 mt-1 font-mono">125,600</div>
          <div className="text-[10px] text-slate-400">Target units</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-sm border border-slate-200">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Total Actual</div>
          <div className="text-xl font-black text-blue-600 mt-1 font-mono">118,340</div>
          <div className="text-[10px] text-slate-400">Achieved units</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-sm border border-slate-200">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Achievement</div>
          <div className="text-xl font-black text-emerald-600 mt-1 font-mono">94.2%</div>
          <div className="text-[10px] text-emerald-500">↑ 1.2% shift pace</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-sm border border-slate-200">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Overall OEE</div>
          <div className="text-xl font-black text-amber-600 mt-1 font-mono">85.6%</div>
          <div className="text-[10px] text-slate-400">Target 85.0%</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-sm border border-slate-200">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Availability</div>
          <div className="text-xl font-black text-indigo-600 mt-1 font-mono">90.2%</div>
          <div className="text-[10px] text-slate-400">Uptime ratio</div>
        </div>
        <div className="bg-white p-2.5 rounded shadow-sm border border-slate-200">
          <div className="text-[10px] text-slate-500 font-bold uppercase">First Pass Yield</div>
          <div className="text-xl font-black text-purple-600 mt-1 font-mono">98.9%</div>
          <div className="text-[10px] text-purple-500">Six Sigma Target</div>
        </div>
      </div>

      {/* 3 Plant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        {/* Plant 01 Pune */}
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" /> Plant-01 (Pune)
            </span>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded font-mono">84.2%</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs mb-2">
            <div className="bg-slate-50 p-1.5 rounded">
              <div className="text-[10px] text-slate-400">Plan</div>
              <div className="font-bold font-mono">45,000</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded">
              <div className="text-[10px] text-slate-400">Actual</div>
              <div className="font-bold text-blue-600 font-mono">42,100</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded">
              <div className="text-[10px] text-slate-400">FPY</div>
              <div className="font-bold text-emerald-600 font-mono">98.6%</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>Active Lines: <strong>4 / 4</strong></span>
            <span className="text-emerald-600 font-bold">● Operational</span>
          </div>
        </div>

        {/* Plant 02 Noida */}
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" /> Plant-02 (Noida)
            </span>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded font-mono">78.6%</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs mb-2">
            <div className="bg-slate-50 p-1.5 rounded">
              <div className="text-[10px] text-slate-400">Plan</div>
              <div className="font-bold font-mono">35,000</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded">
              <div className="text-[10px] text-slate-400">Actual</div>
              <div className="font-bold text-blue-600 font-mono">30,940</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded">
              <div className="text-[10px] text-slate-400">FPY</div>
              <div className="font-bold text-emerald-600 font-mono">98.1%</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>Active Lines: <strong>3 / 4</strong> (1 Idle)</span>
            <span className="text-amber-600 font-bold">● Maintenance</span>
          </div>
        </div>

        {/* Plant 03 Greater Noida */}
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-600" /> Plant-03 (Greater Noida)
            </span>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded font-mono">83.1%</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs mb-2">
            <div className="bg-slate-50 p-1.5 rounded">
              <div className="text-[10px] text-slate-400">Plan</div>
              <div className="font-bold font-mono">45,600</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded">
              <div className="text-[10px] text-slate-400">Actual</div>
              <div className="font-bold text-blue-600 font-mono">45,300</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded">
              <div className="text-[10px] text-slate-400">FPY</div>
              <div className="font-bold text-emerald-600 font-mono">99.1%</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>Active Lines: <strong>4 / 4</strong></span>
            <span className="text-emerald-600 font-bold">● Peak Output</span>
          </div>
        </div>
      </div>

      {/* Plan vs Actual Chart + Line Status Donut + Active Alarms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Plan vs Actual Bar */}
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200 md:col-span-2">
          <div className="font-bold text-xs text-slate-700 mb-2">Plan vs Actual (All Plants)</div>
          <div className="h-44 flex items-end justify-between gap-2 px-2 pt-4">
            {[
              { label: 'Line 01', plan: 90, actual: 85 },
              { label: 'Line 02', plan: 95, actual: 92 },
              { label: 'Line 03', plan: 80, actual: 78 },
              { label: 'Line 04', plan: 100, actual: 97 },
              { label: 'Line 05', plan: 85, actual: 81 },
              { label: 'Line 06', plan: 90, actual: 89 },
              { label: 'Line 07', plan: 95, actual: 93 },
              { label: 'Line 08', plan: 75, actual: 70 },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center gap-1 h-32">
                  <div style={{ height: `${col.plan}%` }} className="w-2.5 bg-blue-500 rounded-t" title={`Plan: ${col.plan}%`} />
                  <div style={{ height: `${col.actual}%` }} className="w-2.5 bg-emerald-500 rounded-t" title={`Actual: ${col.actual}%`} />
                </div>
                <span className="text-[9px] text-slate-500 font-mono">{col.label}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 text-[10px] text-slate-500 pt-2 border-t">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-xs inline-block" /> Plan</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs inline-block" /> Actual</span>
          </div>
        </div>

        {/* Status & Alarms */}
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="font-bold text-xs text-slate-700 mb-2">Line Status Overview</div>
            <div className="flex items-center justify-around py-3">
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-600 font-mono">11</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Running</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-amber-500 font-mono">2</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Idle</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-red-500 font-mono">1</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Down</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="font-bold text-xs text-slate-700 mb-2">Active Cleanroom Alarms</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200">
                <span className="font-bold">Critical Alarms</span>
                <span className="font-black font-mono">2</span>
              </div>
              <div className="flex items-center justify-between bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200">
                <span className="font-bold">Major Warnings</span>
                <span className="font-black font-mono">5</span>
              </div>
              <div className="flex items-center justify-between bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                <span className="font-bold">Minor Notices</span>
                <span className="font-black font-mono">3</span>
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
          <span className="font-bold text-xs text-slate-700 uppercase">Line Work Schedule (25 Sep 2026)</span>
          <div className="flex gap-4 text-xs font-mono">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-xs" /> Running</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-xs" /> Setup / Changeover</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" /> Planned Next</span>
          </div>
        </div>

        {/* Time markers */}
        <div className="grid grid-cols-12 text-[10px] text-slate-400 font-mono pb-2 border-b text-center">
          {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00', '02:00', '04:00', '06:00'].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>

        {/* Line 01 */}
        <div className="py-4 border-b">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-800">Line-01 (Main SMT Line)</span>
            <span className="text-[10px] text-slate-500 font-mono">Capacity: 92% loaded</span>
          </div>
          <div className="h-9 bg-slate-100 rounded relative overflow-hidden flex items-center">
            <div className="absolute left-[0%] w-[45%] h-7 bg-blue-600 text-white rounded text-[11px] font-mono flex items-center px-2 font-bold shadow-xs">
              WO-20260925-01 (SMT_ASSY_A) • 12,000 pcs
            </div>
            <div className="absolute left-[45%] w-[8%] h-7 bg-amber-500 text-white rounded text-[10px] font-mono flex items-center justify-center font-bold">
              SETUP
            </div>
            <div className="absolute left-[53%] w-[40%] h-7 bg-emerald-600 text-white rounded text-[11px] font-mono flex items-center px-2 font-bold">
              WO-20260925-04 (CONTROL_BOARD_B) • 8,500 pcs
            </div>
          </div>
        </div>

        {/* Line 02 */}
        <div className="py-4 border-b">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-800">Line-02 (Flexible Placement Line)</span>
            <span className="text-[10px] text-slate-500 font-mono">Capacity: 78% loaded</span>
          </div>
          <div className="h-9 bg-slate-100 rounded relative overflow-hidden flex items-center">
            <div className="absolute left-[0%] w-[35%] h-7 bg-blue-600 text-white rounded text-[11px] font-mono flex items-center px-2 font-bold shadow-xs">
              WO-20260925-02 (SMT_POWER_C) • 6,000 pcs
            </div>
            <div className="absolute left-[38%] w-[55%] h-7 bg-emerald-600 text-white rounded text-[11px] font-mono flex items-center px-2 font-bold">
              WO-20260925-05 (IOT_GATEWAY_V2) • 15,000 pcs
            </div>
          </div>
        </div>

        {/* Line 03 */}
        <div className="py-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-800">Line-03 (High Density Micro-SMT)</span>
            <span className="text-[10px] text-slate-500 font-mono">Capacity: 88% loaded</span>
          </div>
          <div className="h-9 bg-slate-100 rounded relative overflow-hidden flex items-center">
            <div className="absolute left-[0%] w-[60%] h-7 bg-blue-600 text-white rounded text-[11px] font-mono flex items-center px-2 font-bold shadow-xs">
              WO-20260925-03 (AUTO_SENSOR_ECU) • 18,000 pcs
            </div>
            <div className="absolute left-[62%] w-[30%] h-7 bg-emerald-600 text-white rounded text-[11px] font-mono flex items-center px-2 font-bold">
              WO-20260925-06 (BATTERY_BMS_L3) • 5,000 pcs
            </div>
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
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
          <div className="font-bold text-xs text-slate-700 mb-2">Defect Pareto Breakdown</div>
          <div className="space-y-2 text-xs font-mono">
            {[
              { name: 'Missing Component', pct: 36.0, bar: 'bg-red-500' },
              { name: 'Tombstone', pct: 22.2, bar: 'bg-amber-500' },
              { name: 'Polarity', pct: 9.6, bar: 'bg-indigo-500' },
              { name: 'Solder Bridge', pct: 8.8, bar: 'bg-blue-500' },
              { name: 'Insufficient', pct: 6.9, bar: 'bg-cyan-500' },
              { name: 'Excess Solder', pct: 5.8, bar: 'bg-teal-500' },
              { name: 'Others', pct: 0.9, bar: 'bg-slate-400' },
            ].map(d => (
              <div key={d.name}>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="font-sans text-slate-700">{d.name}</span>
                  <span className="font-bold">{d.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${d.bar} h-2 rounded-full`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Defect Trend */}
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
          <div className="font-bold text-xs text-slate-700 mb-2">Defect Trend Over Shift</div>
          <div className="h-44 flex items-end justify-between gap-1 pt-4 px-2">
            {[
              { h: '08:00', v: 45 }, { h: '09:00', v: 38 }, { h: '10:00', v: 52 },
              { h: '11:00', v: 28 }, { h: '12:00', v: 30 }, { h: '13:00', v: 22 },
              { h: '14:00', v: 18 }, { h: '15:00', v: 14 }
            ].map((p, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div style={{ height: `${p.v * 1.5}%` }} className="w-3 bg-red-500/80 rounded-t" />
                <span className="text-[9px] text-slate-400 font-mono">{p.h}</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-center text-emerald-600 font-bold pt-2 border-t font-mono">
            ▼ Defect density reduced by 68% after nozzle purge
          </div>
        </div>

        {/* Defect Wise Breakdown Pie/Donut */}
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="font-bold text-xs text-slate-700 mb-2">Defect Wise by Station</div>
            <div className="text-center py-2">
              <div className="inline-block p-4 rounded-full border-4 border-blue-500 border-t-red-500 border-r-amber-500">
                <div className="text-2xl font-black text-slate-900 font-mono">103</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Total Defects</div>
              </div>
            </div>
          </div>
          <div className="space-y-1 text-xs font-mono border-t pt-2">
            <div className="flex justify-between"><span>● SPI Inspection:</span> <strong>12 (11.7%)</strong></div>
            <div className="flex justify-between"><span>● Placement (Fuji):</span> <strong>28 (27.2%)</strong></div>
            <div className="flex justify-between"><span>● Reflow Oven:</span> <strong>6 (5.8%)</strong></div>
            <div className="flex justify-between"><span>● AOI Optical:</span> <strong className="text-red-600">55 (53.4%)</strong></div>
            <div className="flex justify-between"><span>● Others:</span> <strong>2 (1.9%)</strong></div>
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

      {/* Heatmap & Measurement Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 3D Heatmap */}
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-slate-700">3D Volumetric Solder Heatmap</span>
            <div className="flex gap-1 text-[10px]">
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-bold">3D View</span>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">2D View</span>
            </div>
          </div>
          <div className="h-64 bg-slate-950 rounded flex items-center justify-center p-3 relative overflow-hidden">
            <svg viewBox="0 0 300 180" className="w-full h-full">
              <rect width="300" height="180" fill="#0B132B" rx="4" />
              {Array.from({ length: 15 }).map((_, r) =>
                Array.from({ length: 8 }).map((_, c) => {
                  const vol = Math.sin(r * 0.5) * Math.cos(c * 0.5);
                  const color = vol > 0.4 ? '#10B981' : vol > 0 ? '#3B82F6' : vol > -0.4 ? '#F59E0B' : '#EF4444';
                  return (
                    <rect
                      key={`${r}-${c}`}
                      x={20 + r * 17}
                      y={15 + c * 18}
                      width="12"
                      height="12"
                      rx="2"
                      fill={color}
                      opacity={0.85}
                    />
                  );
                })
              )}
              <text x="20" y="172" fill="#64748B" fontSize="9" fontFamily="monospace">
                PCB-SM-METER-REV4 • 120 Apertures Verified • Closed-Loop Offset: +8µm X / -4µm Y
              </text>
            </svg>
          </div>
        </div>

        {/* Panel Measurement Table */}
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between">
          <div className="p-3 border-b bg-slate-50 font-bold text-xs text-slate-700">
            Realtime Pad Volumetric Readings
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
            <span>Koh Young aSPIre3 Gateway</span>
            <span className="text-emerald-600 font-bold">● SPC Closed-Loop Auto-Correction Active</span>
          </div>
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
          <div className="font-bold text-xs text-slate-700 mb-2">Drop Rate Trend (PPM)</div>
          <div className="h-36 flex items-end justify-between gap-1 pt-2 px-2">
            {[22, 18, 25, 30, 15, 12, 14, 18, 10, 8].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div style={{ height: `${v * 3}px` }} className="w-3 bg-blue-500 rounded-t" />
                <span className="text-[9px] text-slate-400 font-mono mt-1">S{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
          <div className="font-bold text-xs text-slate-700 mb-2">Nozzle Pick Error Analysis</div>
          <div className="h-36 flex items-end justify-between gap-1 pt-2 px-2">
            {[4, 2, 7, 1, 0, 3, 5, 2, 8, 1].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div style={{ height: `${v * 12}px` }} className="w-3 bg-amber-500 rounded-t" />
                <span className="text-[9px] text-slate-400 font-mono mt-1">N{i + 1}</span>
              </div>
            ))}
          </div>
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
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
          <div className="font-bold text-xs text-slate-700 mb-2">AOI Image & Defect Classification</div>
          <div className="h-64 bg-slate-900 rounded p-3 relative flex items-center justify-center">
            <div className="w-56 h-44 border-2 border-emerald-500/40 rounded bg-slate-950/80 relative flex items-center justify-center">
              <div className="absolute top-8 left-12 w-16 h-12 border-2 border-red-500 bg-red-500/20 rounded flex items-center justify-center animate-pulse">
                <span className="text-[9px] font-mono text-red-300 font-bold bg-black/80 px-1">MISSING: R0402</span>
              </div>
              <div className="absolute bottom-6 right-10 w-14 h-10 border border-amber-400 bg-amber-400/20 rounded flex items-center justify-center">
                <span className="text-[8px] font-mono text-amber-200 font-bold">TOMBSTONE</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Koh Young Zenith 3D AOI • FOV 45mm</span>
            </div>
          </div>
        </div>

        {/* Defect Pareto */}
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
          <div className="font-bold text-xs text-slate-700 mb-2">AOI Defect Classification Breakdown</div>
          <div className="space-y-2 text-xs font-mono">
            {[
              { name: 'Missing Component', pct: 35.2, color: 'bg-red-500' },
              { name: 'Tombstone', pct: 32.1, color: 'bg-amber-500' },
              { name: 'Polarity Reverse', pct: 15.2, color: 'bg-purple-500' },
              { name: 'Solder Bridge', pct: 10.8, color: 'bg-blue-500' },
              { name: 'Insufficient Solder', pct: 5.8, color: 'bg-cyan-500' },
              { name: 'Wrong Component', pct: 0.9, color: 'bg-slate-400' },
            ].map(d => (
              <div key={d.name}>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="font-sans text-slate-700">{d.name}</span>
                  <span className="font-bold">{d.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${d.color} h-2 rounded-full`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
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
        <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
          <div className="font-bold text-xs text-slate-700 mb-2">10-Zone Thermal Profile Curve</div>
          <div className="h-64 bg-slate-900 rounded p-2 flex items-center justify-center">
            <svg viewBox="0 0 320 180" className="w-full h-full">
              <path
                d="M 10 160 Q 40 140 80 110 T 160 80 T 230 35 T 270 70 T 310 150"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
              />
              <path
                d="M 10 160 Q 40 140 80 110 T 160 80 T 230 35 T 270 70 T 310 150 L 310 170 L 10 170 Z"
                fill="url(#grad)"
                opacity="0.25"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="10" y1="60" x2="310" y2="60" stroke="#EF4444" strokeDasharray="3 3" strokeWidth="1" />
              <text x="15" y="55" fill="#EF4444" fontSize="8" fontFamily="monospace">TAL Peak 245°C Limit</text>
              <text x="15" y="170" fill="#94A3B8" fontSize="8" fontFamily="monospace">Zone 1 ➔ Zone 10 • Nitrogen: 480 ppm O2</text>
            </svg>
          </div>
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
        <div className="text-xs font-bold text-slate-700 mb-3">Process Route Milestones</div>
        <div className="flex items-center justify-between text-center relative overflow-x-auto py-2">
          {['Loader', 'Printer', 'SPI', 'Placement', 'Reflow', 'AOI', 'Unloader'].map((step) => (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md z-10">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2">{step}</span>
              <span className="text-[10px] text-emerald-600 font-mono">PASS</span>
            </div>
          ))}
        </div>
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

      {/* Pareto Horizontal Chart */}
      <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
        <div className="font-bold text-xs text-slate-700 mb-2">Downtime Pareto by Machine</div>
        <div className="space-y-2 text-xs font-mono">
          {[
            { m: 'Reflow Oven', dur: '48m (29%)', color: 'bg-red-500', w: '65%' },
            { m: 'AOI Optical', dur: '42m (26%)', color: 'bg-amber-500', w: '58%' },
            { m: 'FUJI NXT III', dur: '28m (17%)', color: 'bg-yellow-500', w: '40%' },
            { m: 'SPI 3D', dur: '18m (11%)', color: 'bg-blue-500', w: '28%' },
            { m: 'Screen Printer', dur: '12m (7%)', color: 'bg-cyan-500', w: '18%' },
          ].map(p => (
            <div key={p.m}>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="font-sans font-bold text-slate-700">{p.m}</span>
                <span className="text-slate-500">{p.dur}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className={`${p.color} h-2.5 rounded-full`} style={{ width: p.w }} />
              </div>
            </div>
          ))}
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
