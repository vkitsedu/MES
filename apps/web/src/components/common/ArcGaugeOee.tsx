import React from 'react';
import { AnimatedNumber } from './AnimatedNumber';

export interface ArcGaugeOeeProps {
  value: number;
  target?: number;
  label: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  unit?: string;
  className?: string;
}

export const ArcGaugeOee: React.FC<ArcGaugeOeeProps> = ({
  value,
  target = 85,
  label,
  sublabel,
  size = 150,
  strokeWidth = 9,
  unit = '%',
  className = ''
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const clampedTarget = Math.max(0, Math.min(100, target));

  // Geometry: 200-degree modern precision arc (from 170° to 10° for open bottom feel)
  // Clean, high-end Apple Pro / Tesla instrument cluster aesthetic
  const startAngleDeg = 190;
  const sweepAngleDeg = 200;
  const radius = (size - strokeWidth * 2 - 14) / 2;
  const cx = size / 2;
  const cy = size / 2 + 6;

  // Degrees to radians
  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  // Arc path generator
  const getArcCoordinates = (startDeg: number, spanDeg: number, r: number) => {
    const endDeg = startDeg + spanDeg;
    const startRad = degToRad(startDeg);
    const endRad = degToRad(endDeg);

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArcFlag = spanDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  const totalArcLength = (sweepAngleDeg / 360) * 2 * Math.PI * radius;
  const activeLength = (clampedValue / 100) * totalArcLength;
  const bgPath = getArcCoordinates(startAngleDeg, sweepAngleDeg, radius);

  // Target tick mark position
  const targetAngleDeg = startAngleDeg + (clampedTarget / 100) * sweepAngleDeg;
  const targetAngleRad = degToRad(targetAngleDeg);
  const targetOuterR = radius + strokeWidth / 2 + 5;
  const targetInnerR = radius - strokeWidth / 2 - 2;
  const targetX1 = cx + targetInnerR * Math.cos(targetAngleRad);
  const targetY1 = cy + targetInnerR * Math.sin(targetAngleRad);
  const targetX2 = cx + targetOuterR * Math.cos(targetAngleRad);
  const targetY2 = cy + targetOuterR * Math.sin(targetAngleRad);

  // Delta calculation against target
  const delta = clampedValue - clampedTarget;

  // Semantic status determination
  let strokeColor = 'var(--mes-status-pass)';
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let statusBadge = 'ON TARGET';
  let badgeStyle = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]';

  if (clampedValue < clampedTarget - 6) {
    strokeColor = 'var(--mes-status-halt)';
    glowColor = 'rgba(244, 63, 94, 0.45)';
    statusBadge = 'CRITICAL';
    badgeStyle = 'text-rose-400 bg-rose-950/40 border-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.2)]';
  } else if (clampedValue < clampedTarget) {
    strokeColor = 'var(--mes-status-warn)';
    glowColor = 'rgba(245, 158, 11, 0.4)';
    statusBadge = 'ATTENTION';
    badgeStyle = 'text-amber-400 bg-amber-950/40 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]';
  }

  const svgHeight = cy + 18;

  return (
    <div 
      className={`bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] hover:border-[var(--mes-border-strong)] rounded-[var(--mes-radius)] p-3 flex flex-col items-center justify-between min-w-[144px] flex-1 select-none transition-all duration-200 group relative overflow-hidden ${className}`}
      style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
    >
      {/* Top Header: Clean Label */}
      <div className="w-full flex items-center justify-between pb-1.5 border-b border-[var(--mes-border-hairline)] mb-1">
        <span className="font-mono text-[10.5px] font-bold text-[var(--mes-text-secondary)] uppercase tracking-wider block truncate">
          {label}
        </span>
        <span className={`w-2 h-2 rounded-full ${delta >= 0 ? 'bg-[var(--mes-status-pass)] shadow-[0_0_6px_var(--mes-status-pass)]' : 'bg-[var(--mes-status-halt)] shadow-[0_0_6px_var(--mes-status-halt)]'}`} />
      </div>

      {/* SVG Precision Dial */}
      <div className="relative my-0.5 flex items-center justify-center" style={{ width: size, height: svgHeight }}>
        <svg 
          width={size} 
          height={svgHeight} 
          viewBox={`0 0 ${size} ${svgHeight}`}
          className="overflow-visible"
          aria-hidden="true"
        >
          <defs>
            {/* Ambient Radial Glow */}
            <filter id={`gauge-glow-${label.replace(/[^a-zA-Z0-9]/g, '-')}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={glowColor} />
            </filter>
          </defs>

          {/* Outer Track Hairline Accent */}
          <path
            d={getArcCoordinates(startAngleDeg - 1, sweepAngleDeg + 2, radius + strokeWidth / 2 + 2)}
            fill="none"
            stroke="var(--mes-border-hairline)"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Background Track Groove */}
          <path
            d={bgPath}
            fill="none"
            stroke="var(--mes-bg-well)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Progress Arc with Luminous Glow */}
          <path
            d={bgPath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${totalArcLength} ${totalArcLength}`}
            strokeDashoffset={totalArcLength - activeLength}
            strokeLinecap="round"
            filter={`url(#gauge-glow-${label.replace(/[^a-zA-Z0-9]/g, '-')})`}
            className="transition-all duration-700 ease-out"
          />

          {/* Target Needle Pin & Pip */}
          {target !== undefined && (
            <g className="transition-all duration-300">
              <line
                x1={targetX1}
                y1={targetY1}
                x2={targetX2}
                y2={targetY2}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]"
              />
              <circle
                cx={targetX2}
                cy={targetY2}
                r="2.5"
                fill="#FFFFFF"
                className="drop-shadow-[0_0_4px_rgba(255,255,255,0.9)]"
              />
            </g>
          )}
        </svg>

        {/* Center Tabular Number Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 pointer-events-none">
          <div className="flex items-baseline gap-0.5">
            <AnimatedNumber
              value={clampedValue}
              decimals={1}
              className="font-mono text-2xl lg:text-[28px] font-black tracking-tight text-[var(--mes-text-primary)] tabular-nums leading-none drop-shadow-sm"
            />
            <span className="font-mono text-xs text-[var(--mes-text-muted)] font-bold">
              {unit}
            </span>
          </div>

          {/* Status Badge with Glowing Dot */}
          <div className="mt-2">
            <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-[var(--mes-radius)] border tracking-wider flex items-center gap-1.5 transition-all ${badgeStyle}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{statusBadge}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Context Band: Target Comparison & Subtitle */}
      <div className="w-full pt-2 border-t border-[var(--mes-border-hairline)] font-mono text-[10.5px] flex items-center justify-between px-0.5 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--mes-text-muted)] text-[10px]">Tgt:</span>
          <strong className="text-[var(--mes-text-primary)] text-[10.5px]">{target.toFixed(1)}{unit}</strong>
          <span className={`text-[10px] font-bold px-1 py-0.2 rounded ${delta >= 0 ? 'text-emerald-400 bg-emerald-950/30' : 'text-rose-400 bg-rose-950/30'}`}>
            {delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
          </span>
        </div>
        {sublabel && (
          <span className="text-[10px] font-semibold text-[var(--mes-text-secondary)] truncate max-w-[95px]" title={sublabel}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
