/**
 * TeslaCyberGridCockpit.tsx
 * Tier-1 Cleanroom SMT Production — 4-Quadrant Zero-Scroll Operational Situational Awareness Cockpit
 * GigaFactory Line 01 | IPC-CFX Compliant | Dark Palette
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Flame,
  GitBranch,
  Layers,
  Play,
  RefreshCw,
  Shield,
  Sliders,
  Target,
  Truck,
  Zap,
  BarChart3,
  Radio,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  onNavigateTab?: (tab: string) => void;
}

interface LineEfficiency {
  id: string;
  pct: number;
}

interface ZoneData {
  zone: number;
  target: number;
  actual: number;
}

interface AgvUnit {
  id: string;
  cx: number;
  cy: number;
  label: string;
  status: "running" | "charging" | "dispatched";
}

// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────
const LINE_EFFICIENCY: LineEfficiency[] = [
  { id: "LINE-01", pct: 88 },
  { id: "LINE-02", pct: 92 },
  { id: "LINE-03", pct: 79 },
  { id: "LINE-04", pct: 95 },
];

const ZONE_DATA: ZoneData[] = [
  { zone: 1, target: 155, actual: 152 },
  { zone: 2, target: 170, actual: 168 },
  { zone: 3, target: 185, actual: 183 },
  { zone: 4, target: 205, actual: 203 },
  { zone: 5, target: 220, actual: 218 },
  { zone: 6, target: 238, actual: 236 },
  { zone: 7, target: 242, actual: 240 },
  { zone: 8, target: 235, actual: 233 },
  { zone: 9, target: 180, actual: 178 },
  { zone: 10, target: 80, actual: 78 },
];

// 8x5 paste volume heat-map values (0-1 scale)
const HEATMAP_VALS: number[][] = [
  [0.92, 0.89, 0.95, 0.97, 0.91, 0.88, 0.93, 0.96],
  [0.87, 0.94, 0.99, 0.95, 0.90, 0.92, 0.97, 0.94],
  [0.91, 0.88, 0.93, 0.62, 0.89, 0.95, 0.91, 0.90],
  [0.95, 0.97, 0.91, 0.93, 0.96, 0.99, 0.94, 0.88],
  [0.89, 0.93, 0.97, 0.91, 0.85, 0.92, 0.96, 0.93],
];

const AGV_UNITS: AgvUnit[] = [
  { id: "AGV-01", cx: 68, cy: 44, label: "BAY-04", status: "dispatched" },
  { id: "AGV-02", cx: 140, cy: 80, label: "FEEDER", status: "running" },
  { id: "AGV-03", cx: 210, cy: 38, label: "CHARGING", status: "charging" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper: heatmap cell colour
// ─────────────────────────────────────────────────────────────────────────────
function heatColor(v: number): string {
  if (v >= 0.9) return "#34d399";
  if (v >= 0.75) return "#fbbf24";
  return "#ef4444";
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: AGV status colour
// ─────────────────────────────────────────────────────────────────────────────
function agvColor(status: AgvUnit["status"]): string {
  if (status === "running") return "#34d399";
  if (status === "charging") return "#facc15";
  return "#22d3ee";
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: CPH Arc Gauge
// ─────────────────────────────────────────────────────────────────────────────
function CphGauge(): React.ReactElement {
  const r = 52;
  const cx = 72;
  const cy = 68;
  const startAngle = -210;
  const endAngle = 30;
  const fillPct = 0.744;

  function polarToCartesian(angle: number): { x: number; y: number } {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcPath(start: number, end: number): string {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const fillEnd = startAngle + (endAngle - startAngle) * fillPct;

  return (
    <div className="flex flex-col items-center">
      <svg width="144" height="110" viewBox="0 0 144 110">
        <defs>
          <linearGradient id="cphGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke="#1E2230"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d={arcPath(startAngle, fillEnd)}
          fill="none"
          stroke="url(#cphGrad)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {Array.from({ length: 11 }, (_, i) => {
          const angle = startAngle + ((endAngle - startAngle) * i) / 10;
          const aRad = ((angle - 90) * Math.PI) / 180;
          const inner = { x: cx + (r - 12) * Math.cos(aRad), y: cy + (r - 12) * Math.sin(aRad) };
          const outer = { x: cx + (r - 6) * Math.cos(aRad), y: cy + (r - 6) * Math.sin(aRad) };
          return (
            <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#1E2230" strokeWidth="1.5" />
          );
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#34d399" fontSize="14" fontWeight="bold" fontFamily="monospace">
          44,820
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#6b7280" fontSize="7" fontFamily="monospace">
          CPH
        </text>
        <text x={cx} y={cy + 22} textAnchor="middle" fill="#6b7280" fontSize="6" fontFamily="monospace">
          PLACEMENT SPEED
        </text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: Reflow SVG Line Chart
// ─────────────────────────────────────────────────────────────────────────────
function ReflowChart(): React.ReactElement {
  const W = 320;
  const H = 120;
  const PAD = { top: 12, right: 10, bottom: 24, left: 32 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const minT = 40;
  const maxT = 260;

  function xOf(i: number): number {
    return PAD.left + (i / (ZONE_DATA.length - 1)) * chartW;
  }
  function yOf(t: number): number {
    return PAD.top + chartH - ((t - minT) / (maxT - minT)) * chartH;
  }

  const targetPts = ZONE_DATA.map((z, i) => `${xOf(i)},${yOf(z.target)}`).join(" ");
  const actualPts = ZONE_DATA.map((z, i) => `${xOf(i)},${yOf(z.actual)}`).join(" ");

  const bandPts = [
    ...ZONE_DATA.map((z, i) => `${xOf(i)},${yOf(z.actual)}`),
    ...[...ZONE_DATA].reverse().map((z, i) => `${xOf(ZONE_DATA.length - 1 - i)},${yOf(z.target)}`),
  ].join(" ");

  const yTicks = [80, 150, 200, 240];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <polygon points={bandPts} fill="#fbbf24" fillOpacity={0.07} />
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={PAD.left} y1={yOf(t)} x2={W - PAD.right} y2={yOf(t)} stroke="#1E2230" strokeWidth="0.5" strokeDasharray="3 3" />
          <text x={PAD.left - 2} y={yOf(t) + 3} textAnchor="end" fill="#4b5563" fontSize="6" fontFamily="monospace">{t}</text>
        </g>
      ))}
      <polyline points={targetPts} fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" />
      <polyline points={actualPts} fill="none" stroke="#34d399" strokeWidth="2" />
      {ZONE_DATA.map((z, i) => (
        <circle key={i} cx={xOf(i)} cy={yOf(z.actual)} r="2.5" fill="#34d399" />
      ))}
      {ZONE_DATA.map((z, i) => (
        <text key={i} x={xOf(i)} y={H - 4} textAnchor="middle" fill="#4b5563" fontSize="6" fontFamily="monospace">
          Z{z.zone}
        </text>
      ))}
      <line x1={PAD.left} y1={PAD.top - 2} x2={PAD.left + 16} y2={PAD.top - 2} stroke="#34d399" strokeWidth="2" />
      <text x={PAD.left + 18} y={PAD.top + 1} fill="#34d399" fontSize="6" fontFamily="monospace">ACTUAL</text>
      <line x1={PAD.left + 60} y1={PAD.top - 2} x2={PAD.left + 76} y2={PAD.top - 2} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 2" />
      <text x={PAD.left + 78} y={PAD.top + 1} fill="#fbbf24" fontSize="6" fontFamily="monospace">SAC305 TARGET</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: AGV Floor Map
// ─────────────────────────────────────────────────────────────────────────────
function AgvFloorMap(): React.ReactElement {
  const stations = [
    { x: 10, y: 40, w: 24, h: 14, label: "SMT-1" },
    { x: 50, y: 40, w: 24, h: 14, label: "SPI" },
    { x: 90, y: 40, w: 24, h: 14, label: "AOI" },
    { x: 130, y: 40, w: 32, h: 14, label: "REFLOW" },
    { x: 180, y: 40, w: 24, h: 14, label: "X-RAY" },
    { x: 220, y: 40, w: 24, h: 14, label: "BUFF" },
  ] as const;

  const bays = ["BAY-01", "BAY-02", "BAY-03", "BAY-04", "BAY-05", "BAY-06"] as const;

  return (
    <svg width="100%" viewBox="0 0 280 110" preserveAspectRatio="xMidYMid meet">
      <rect x="4" y="4" width="272" height="102" rx="4" fill="#0D121D" stroke="#1E2230" strokeWidth="1" />
      {[40, 80, 120, 160, 200, 240].map((x) => (
        <line key={x} x1={x} y1="4" x2={x} y2="106" stroke="#1E2230" strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {[35, 70].map((y) => (
        <line key={y} x1="4" y1={y} x2="276" y2={y} stroke="#1E2230" strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {bays.map((b, i) => (
        <text key={b} x={20 + i * 40} y="18" fill="#374151" fontSize="5" fontFamily="monospace" textAnchor="middle">{b}</text>
      ))}
      {stations.map((s) => (
        <g key={s.label}>
          <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="2" fill="#131929" stroke="#1E2230" strokeWidth="0.8" />
          <text x={s.x + s.w / 2} y={s.y + 9} textAnchor="middle" fill="#374151" fontSize="5" fontFamily="monospace">{s.label}</text>
        </g>
      ))}
      <rect x="240" y="22" width="28" height="10" rx="2" fill="#1a2535" stroke="#facc15" strokeWidth="0.6" />
      <text x="254" y="29" textAnchor="middle" fill="#facc15" fontSize="5" fontFamily="monospace">CHG</text>
      {AGV_UNITS.map((agv) => (
        <g key={agv.id}>
          <circle cx={agv.cx} cy={agv.cy} r="6" fill={agvColor(agv.status)} fillOpacity={0.2} stroke={agvColor(agv.status)} strokeWidth="1.2" />
          <text x={agv.cx} y={agv.cy + 3} textAnchor="middle" fill={agvColor(agv.status)} fontSize="5" fontFamily="monospace" fontWeight="bold">
            {agv.id.split("-")[1]}
          </text>
          <text x={agv.cx} y={agv.cy + 16} textAnchor="middle" fill={agvColor(agv.status)} fontSize="4.5" fontFamily="monospace">
            {agv.label}
          </text>
        </g>
      ))}
      <line x1="68" y1="44" x2="150" y2="44" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="2 2" strokeOpacity={0.4} />
      <line x1="140" y1="80" x2="140" y2="54" stroke="#34d399" strokeWidth="0.6" strokeDasharray="2 2" strokeOpacity={0.4} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: Camera Thumbnail
// ─────────────────────────────────────────────────────────────────────────────
interface CamThumbProps {
  label: string;
  hasDefect: boolean;
}

function CamThumb({ label, hasDefect }: CamThumbProps): React.ReactElement {
  const defectPoints = [
    { cx: 38, cy: 28 },
    { cx: 62, cy: 52 },
    { cx: 22, cy: 60 },
  ] as const;

  return (
    <div className="relative flex-1 rounded border border-[#1E2230] bg-[#070A10] overflow-hidden" style={{ minHeight: 88 }}>
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 80" preserveAspectRatio="none">
        {[10, 22, 34, 46, 58, 70].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#22d3ee" strokeWidth="0.3" />
        ))}
        {[12, 28, 44, 60, 76, 90].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="80" stroke="#22d3ee" strokeWidth="0.3" />
        ))}
        {([[12, 10], [44, 10], [76, 10], [28, 34], [60, 34], [90, 34], [12, 58], [44, 58], [76, 58]] as [number, number][]).map(([px, py]) => (
          <rect key={`${px}-${py}`} x={px - 3} y={py - 2} width="6" height="4" rx="0.5" fill="#0D121D" stroke="#22d3ee" strokeWidth="0.4" />
        ))}
      </svg>
      <div className="absolute inset-x-0 top-0 h-px bg-cyan-400 opacity-60 animate-pulse" />
      <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-cyan-500/60" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-cyan-500/60" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-cyan-500/60" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-cyan-500/60" />
      {hasDefect ? (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80">
          {defectPoints.map((d, i) => (
            <g key={i}>
              <circle cx={d.cx} cy={d.cy} r="3.5" fill="none" stroke="#ef4444" strokeWidth="1.2" />
              <line x1={d.cx - 2} y1={d.cy} x2={d.cx + 2} y2={d.cy} stroke="#ef4444" strokeWidth="0.8" />
              <line x1={d.cx} y1={d.cy - 2} x2={d.cx} y2={d.cy + 2} stroke="#ef4444" strokeWidth="0.8" />
            </g>
          ))}
        </svg>
      ) : (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80">
          <circle cx="50" cy="40" r="12" fill="none" stroke="#34d399" strokeWidth="1.5" strokeOpacity={0.6} />
          <polyline points="44,40 49,46 58,34" fill="none" stroke="#34d399" strokeWidth="1.5" />
        </svg>
      )}
      <div className="absolute bottom-0 inset-x-0 bg-[#0D121D]/80 px-1.5 py-0.5 flex items-center justify-between">
        <span className="text-[9px] font-mono text-cyan-300">{label}</span>
        {hasDefect ? (
          <span className="text-[9px] font-mono text-red-400">3 DEFECTS</span>
        ) : (
          <span className="text-[9px] font-mono text-emerald-400">PASS</span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel Header helper component
// ─────────────────────────────────────────────────────────────────────────────
interface PanelHeaderProps {
  title: string;
  color?: "cyan" | "amber" | "emerald";
  icon: React.ReactElement;
}

function PanelHeader({ title, color = "cyan", icon }: PanelHeaderProps): React.ReactElement {
  const colorMap: Record<"cyan" | "amber" | "emerald", string> = {
    cyan: "text-cyan-300 border-cyan-900/40",
    amber: "text-amber-300 border-amber-900/40",
    emerald: "text-emerald-300 border-emerald-900/40",
  };
  return (
    <div className={`flex items-center gap-1.5 pb-1.5 mb-2 border-b ${colorMap[color]} text-[10px] font-bold tracking-widest font-mono`}>
      {icon}
      {title}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function TeslaCyberGridCockpit({ onNavigateTab }: Props): React.ReactElement {
  const [clock, setClock] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  useEffect(() => {
    const tick = (): void => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
          "  " +
          now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSlotClick = useCallback((slot: number): void => {
    setSelectedSlot((prev) => (prev === slot ? null : slot));
  }, []);

  const handleNavigate = useCallback(
    (tab: string): void => {
      onNavigateTab?.(tab);
    },
    [onNavigateTab]
  );

  return (
    <div className="flex flex-col h-full w-full bg-[#070A10] font-mono overflow-hidden select-none">

      {/* ════════════════════════════════════════════════════════════════
          HEADER BAR
      ════════════════════════════════════════════════════════════════ */}
      <header className="flex-none flex items-center justify-between bg-[#0D121D] border-b border-[#1E2230] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-black text-sm tracking-tight">
            SMT PRODUCTION OPS &mdash; GIGAFACTORY LINE 01
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-emerald-950/50 border border-emerald-800/60 rounded-full px-2.5 py-0.5 text-[10px] text-emerald-400">
            <Radio size={9} className="animate-pulse" />
            IPC-CFX GATEWAY LIVE
          </span>
          <span className="flex items-center gap-1 bg-cyan-950/50 border border-cyan-800/60 rounded-full px-2.5 py-0.5 text-[10px] text-cyan-400">
            <Activity size={9} />
            LATENCY: 12ms
          </span>
          <span className="flex items-center gap-1 bg-amber-950/50 border border-amber-800/60 rounded-full px-2.5 py-0.5 text-[10px] text-amber-400">
            <BarChart3 size={9} />
            OEE: 88.4%
          </span>
        </div>
        <button
          className="flex items-center gap-1.5 bg-red-900/50 border border-red-500 text-red-400 hover:bg-red-800/60 text-xs px-3 py-1 rounded transition-colors"
          onClick={() => handleNavigate("emergency")}
        >
          <Shield size={11} />
          EMERGENCY LINE HOLD
        </button>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          ALERT BANNER
      ════════════════════════════════════════════════════════════════ */}
      <div className="flex-none flex items-center gap-3 bg-amber-950/40 border-b border-amber-800/50 px-4 py-1.5">
        <AlertTriangle size={12} className="text-amber-400 shrink-0 animate-pulse" />
        <span className="text-amber-300 text-[10px] font-mono flex-1 truncate">
          FEEDER DEFICIT: Slot 04 (P-CAP-100NF) LOW &mdash; 12 reels remaining &nbsp;|&nbsp; Slot 08 (R-0402-10K) CRITICAL &mdash; 3 reels remaining
        </span>
        <button
          className="shrink-0 flex items-center gap-1 bg-amber-900/50 border border-amber-600 text-amber-300 hover:bg-amber-800/50 text-[10px] px-2.5 py-0.5 rounded transition-colors"
          onClick={() => handleNavigate("agv")}
        >
          <Truck size={10} />
          DISPATCH SPLICING AGV
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          4-QUADRANT GRID
      ════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-1 p-1 min-h-0">

        {/* Q1: SMT COMPONENT PLACEMENT */}
        <div className="bg-[#0D121D] border border-[#1E2230] rounded p-3 flex flex-col overflow-hidden">
          <PanelHeader title="SMT COMPONENT PLACEMENT — LINE 01-04" color="cyan" icon={<Cpu size={11} />} />
          <div className="flex flex-1 gap-3 min-h-0">
            <div className="flex flex-col items-center justify-center shrink-0">
              <CphGauge />
              <span className="text-emerald-400 text-[10px] mt-0.5">+2.1% vs. shift target</span>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {LINE_EFFICIENCY.map((ln, idx) => {
                  const isSelected = selectedSlot === idx;
                  const barColor = ln.pct >= 85 ? "#34d399" : ln.pct >= 80 ? "#fbbf24" : "#ef4444";
                  return (
                    <button
                      key={ln.id}
                      className={`text-left rounded px-2 py-1.5 border transition-colors ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-950/40"
                          : "border-[#1E2230] hover:border-[#2d3548]"
                      }`}
                      onClick={() => handleSlotClick(idx)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] text-gray-400">{ln.id}</span>
                        <span className="text-[9px]" style={{ color: barColor }}>{ln.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-[#1E2230] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${ln.pct}%`, background: barColor }}
                        />
                      </div>
                      {isSelected && (
                        <div className="text-[8px] text-cyan-400 mt-1">SLOT SELECTED</div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-auto pt-1 border-t border-[#1E2230] flex items-center gap-2 text-[9px] text-gray-500">
                <Layers size={9} />
                <span>PLACEMENTS TODAY: 2,241,000</span>
                <span className="ml-auto text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle2 size={9} />
                  CPKM: 1.67
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Q2: 3D SPI SOLDER PASTE INSPECTION */}
        <div className="bg-[#0D121D] border border-[#1E2230] rounded p-3 flex flex-col overflow-hidden">
          <PanelHeader title="3D SPI SOLDER PASTE INSPECTION" color="cyan" icon={<Target size={11} />} />
          <div className="flex gap-2 mb-2 min-h-0">
            <div className="shrink-0">
              <svg width="164" height="76" viewBox="0 0 164 76">
                {HEATMAP_VALS.map((row, ri) =>
                  row.map((v, ci) => (
                    <g key={`${ri}-${ci}`}>
                      <rect
                        x={ci * 20 + 2}
                        y={ri * 14 + 2}
                        width="18"
                        height="12"
                        rx="1.5"
                        fill={heatColor(v)}
                        fillOpacity={0.7}
                      />
                      <text
                        x={ci * 20 + 11}
                        y={ri * 14 + 11}
                        textAnchor="middle"
                        fill="#000"
                        fontSize="5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {Math.round(v * 100)}
                      </text>
                    </g>
                  ))
                )}
              </svg>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-3 h-2 rounded-sm" style={{ background: "#ef4444" }} />
                <span className="text-[8px] text-gray-500">LOW</span>
                <div className="w-3 h-2 rounded-sm ml-1" style={{ background: "#fbbf24" }} />
                <span className="text-[8px] text-gray-500">MID</span>
                <div className="w-3 h-2 rounded-sm ml-1" style={{ background: "#34d399" }} />
                <span className="text-[8px] text-gray-500">OK</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1.5 text-[9px] min-w-0">
              <div className="bg-[#070A10] rounded border border-[#1E2230] px-2 py-1 text-cyan-300">
                STENCIL: PCB-SM-METER-REV4
              </div>
              <div className="bg-[#070A10] rounded border border-[#1E2230] px-2 py-1 text-emerald-400">
                APERTURES: 840/840 OK
              </div>
              <table className="w-full text-[8px] border-collapse mt-1">
                <thead>
                  <tr className="text-gray-500 border-b border-[#1E2230]">
                    <th className="text-left pb-0.5 font-normal">OFFSET</th>
                    <th className="text-left pb-0.5 font-normal">DIRECTION</th>
                    <th className="text-left pb-0.5 font-normal">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      { off: "+8um", dir: "X-axis", ok: true },
                      { off: "-4um", dir: "Y-axis", ok: true },
                      { off: "+12um", dir: "Z-height", ok: false },
                    ] as const
                  ).map((r) => (
                    <tr key={r.dir} className="border-b border-[#1E2230]/50">
                      <td className="py-0.5 text-gray-300">{r.off}</td>
                      <td className="py-0.5 text-gray-400">{r.dir}</td>
                      <td className="py-0.5">
                        {r.ok ? (
                          <span className="text-emerald-400">AUTO-CORRECTED</span>
                        ) : (
                          <span className="text-amber-400">MONITOR</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-auto flex items-center gap-1 text-emerald-400 text-[8px]">
                <Radio size={8} className="animate-pulse" />
                <span>CLOSED-LOOP SPC ACTIVE</span>
              </div>
            </div>
          </div>
          <div className="mt-auto pt-1 border-t border-[#1E2230] flex items-center gap-2 text-[9px] text-gray-500">
            <GitBranch size={9} />
            <span>LAST CORRECTIVE ACTION: 02:38:14</span>
            <span className="ml-auto text-cyan-400">BOARDS INSPECTED TODAY: 18,442</span>
          </div>
        </div>

        {/* Q3: 10-ZONE REFLOW OVEN */}
        <div className="bg-[#0D121D] border border-[#1E2230] rounded p-3 flex flex-col overflow-hidden">
          <PanelHeader title="10-ZONE REFLOW OVEN — THERMAL PROFILE" color="amber" icon={<Flame size={11} />} />
          <div className="flex-1 min-h-0">
            <ReflowChart />
          </div>
          <div className="flex gap-0.5 mt-1 mb-1.5">
            {ZONE_DATA.map((z) => {
              const delta = Math.abs(z.actual - z.target);
              const warn = delta > 3;
              return (
                <div key={z.zone} className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[7px] text-gray-500">Z{z.zone}</span>
                  <span className={`text-[7px] ${warn ? "text-amber-400" : "text-emerald-400"}`}>{z.actual}</span>
                  <span
                    className={`text-[6px] rounded-full px-0.5 py-px ${
                      warn ? "bg-amber-900/50 text-amber-400" : "bg-emerald-900/50 text-emerald-400"
                    }`}
                  >
                    {warn ? "WRN" : "OK"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-[#1E2230] pt-1 flex items-center gap-3 text-[9px]">
            <span className="text-amber-400 flex items-center gap-1"><Zap size={9} />PWI: 62.4%</span>
            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={9} />SAC305 COMPLIANT</span>
            <span className="text-cyan-400 flex items-center gap-1"><Flame size={9} />PEAK: 240C</span>
            <span className="ml-auto text-gray-500">MAX DELTA: 4C</span>
          </div>
        </div>

        {/* Q4: QUALITY CONTROL & AGV FLEET */}
        <div className="bg-[#0D121D] border border-[#1E2230] rounded p-3 flex flex-col overflow-hidden">
          <PanelHeader title="QUALITY CONTROL & AGV FLEET" color="cyan" icon={<Shield size={11} />} />
          <div className="flex gap-2 mb-2" style={{ height: 96 }}>
            <CamThumb label="CAM-01: AOI STATION" hasDefect={true} />
            <CamThumb label="CAM-02: POST-REFLOW" hasDefect={false} />
          </div>
          <div className="flex items-center gap-1.5 mb-1 text-[9px] text-gray-400">
            <Truck size={9} className="text-cyan-400" />
            <span className="text-cyan-300 font-bold">AGV FLEET — REAL-TIME POSITIONS</span>
            <span className="ml-auto text-emerald-400">3/3 ONLINE</span>
          </div>
          <div className="flex-1 min-h-0 border border-[#1E2230] rounded overflow-hidden">
            <AgvFloorMap />
          </div>
          <div className="border-t border-[#1E2230] pt-1.5 mt-1.5 flex items-center gap-2 text-[9px]">
            <span className="text-gray-500 flex items-center gap-1">
              <Shield size={9} />
              SHA-256: <span className="text-cyan-500 ml-0.5">3a4f8b2c...</span>
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">LOT: <span className="text-cyan-300">2026-09-20-001</span></span>
            <button
              className="ml-auto flex items-center gap-1 bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/40 text-[9px] px-2 py-0.5 rounded transition-colors"
              onClick={() => handleNavigate("signature")}
            >
              <CheckCircle2 size={9} />
              VERIFY SIGNATURE
            </button>
          </div>
        </div>

      </div>

      {/* ════════════════════════════════════════════════════════════════
          FOOTER ACTUATION STRIP
      ════════════════════════════════════════════════════════════════ */}
      <footer className="flex-none flex items-center justify-between bg-[#0D121D] border-t border-[#1E2230] px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 border border-amber-600 text-amber-400 hover:bg-amber-950/50 rounded px-3 py-1.5 text-xs font-bold transition-colors"
            onClick={() => handleNavigate("hold")}
          >
            <Sliders size={10} />
            HOLD LINE
          </button>
          <button
            className="flex items-center gap-1.5 border border-cyan-700 text-cyan-400 hover:bg-cyan-950/50 rounded px-3 py-1.5 text-xs font-bold transition-colors"
            onClick={() => handleNavigate("agv")}
          >
            <Truck size={10} />
            DISPATCH AGV
          </button>
          <button
            className="flex items-center gap-1.5 border border-blue-700 text-blue-400 hover:bg-blue-950/50 rounded px-3 py-1.5 text-xs font-bold transition-colors"
            onClick={() => handleNavigate("purge")}
          >
            <RefreshCw size={10} />
            AUTO-PURGE NOZZLE
          </button>
          <button
            className="flex items-center gap-1.5 border border-emerald-700 text-emerald-400 hover:bg-emerald-950/50 rounded px-3 py-1.5 text-xs font-bold transition-colors"
            onClick={() => handleNavigate("signature")}
          >
            <Play size={10} />
            DIGITAL SIGNATURE
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs">
            <Clock size={11} className="text-cyan-500" />
            <span className="text-cyan-300 tabular-nums">{clock}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
            <Radio size={9} className="animate-pulse" />
            CROSS-QUADRANT SYNC ACTIVE
          </div>
        </div>
      </footer>

    </div>
  );
}


