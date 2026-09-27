import React from 'react';
import { 
  Building2, Activity, Calendar, FileText, CheckCircle2, 
  Layers, BarChart2, Eye, Cpu, Flame, GitFork, Tag, 
  Database, Wrench, Shield, Maximize2, ExternalLink
} from 'lucide-react';

interface CatalogGridProps {
  onSelectDashboard: (seq: number) => void;
}

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
