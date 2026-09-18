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
  size = 152,
  strokeWidth = 6,
  unit = '%',
  className = ''
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const clampedTarget = Math.max(0, Math.min(100, target));

  // Unique identifier for SVG defs to prevent ID collision across multiple gauge instances
  const rawId = String(label || 'gauge').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const uid = `gauge-${rawId}`;

  // Geometry: 240-degree instrument sweep (from 150° to 390°/30°)
  // Leaves an open 120° bottom sector for digital readout and telemetry
  const startAngleDeg = 150;
  const sweepAngleDeg = 240;
  const cx = size / 2;
  const cy = size * 0.49;
  const radius = size * 0.355; // Calibrated for crisp proportions inside the chassis

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

  // Delta calculation against target
  const delta = clampedValue - clampedTarget;

  // Semantic status determination - High Chroma Phosphor Colors
  let phosphorColor = '#34D399'; // Emerald-400
  let phosphorGlowColor = 'rgba(52, 211, 153, 0.45)';
  let gradientId = `${uid}-emerald`;
  let statusBadge = 'ON TARGET';
  let badgeStyle = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/50 shadow-[0_0_10px_rgba(52,211,153,0.25)]';
  let beaconColor = 'bg-emerald-400 shadow-[0_0_8px_#34D399]';

  if (clampedValue < clampedTarget - 6) {
    phosphorColor = '#F43F5E'; // Rose-500
    phosphorGlowColor = 'rgba(244, 63, 94, 0.5)';
    gradientId = `${uid}-rose`;
    statusBadge = 'CRITICAL';
    badgeStyle = 'text-rose-400 bg-rose-950/60 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.25)]';
    beaconColor = 'bg-rose-500 shadow-[0_0_8px_#F43F5E] animate-pulse';
  } else if (clampedValue < clampedTarget) {
    phosphorColor = '#FBBF24'; // Amber-400
    phosphorGlowColor = 'rgba(251, 191, 36, 0.45)';
    gradientId = `${uid}-amber`;
    statusBadge = 'ATTENTION';
    badgeStyle = 'text-amber-300 bg-amber-950/60 border-amber-500/50 shadow-[0_0_10px_rgba(251,191,36,0.25)]';
    beaconColor = 'bg-amber-400 shadow-[0_0_8px_#FBBF24]';
  }

  // Active value leading-edge pip coordinates
  const activeAngleDeg = startAngleDeg + (clampedValue / 100) * sweepAngleDeg;
  const activeAngleRad = degToRad(activeAngleDeg);
  const pipX = cx + radius * Math.cos(activeAngleRad);
  const pipY = cy + radius * Math.sin(activeAngleRad);

  // Target tick mark position
  const targetAngleDeg = startAngleDeg + (clampedTarget / 100) * sweepAngleDeg;
  const targetAngleRad = degToRad(targetAngleDeg);
  const targetOuterR = radius + 15;
  const targetInnerR = radius + 6;
  const targetX1 = cx + targetInnerR * Math.cos(targetAngleRad);
  const targetY1 = cy + targetInnerR * Math.sin(targetAngleRad);
  const targetX2 = cx + targetOuterR * Math.cos(targetAngleRad);
  const targetY2 = cy + targetOuterR * Math.sin(targetAngleRad);

  // Scale bounds coordinate (0% and 100%)
  const zeroRad = degToRad(startAngleDeg);
  const maxRad = degToRad(startAngleDeg + sweepAngleDeg);
  const zeroX = cx + (radius - 14) * Math.cos(zeroRad);
  const zeroY = cy + (radius - 14) * Math.sin(zeroRad);
  const maxX = cx + (radius - 14) * Math.cos(maxRad);
  const maxY = cy + (radius - 14) * Math.sin(maxRad);

  // 41 Laser-etched radial graduation ticks along the 240° sweep
  const numTicks = 41;
  const ticks = Array.from({ length: numTicks }, (_, i) => {
    const tickPct = (i / (numTicks - 1)) * 100;
    const tickDeg = startAngleDeg + (tickPct / 100) * sweepAngleDeg;
    const tickRad = degToRad(tickDeg);
    const isMajor = i % 10 === 0; // 0%, 25%, 50%, 75%, 100%
    const isLit = tickPct <= clampedValue;

    const r1 = radius + 7;
    const r2 = isMajor ? radius + 13 : radius + 10;

    return {
      x1: cx + r1 * Math.cos(tickRad),
      y1: cy + r1 * Math.sin(tickRad),
      x2: cx + r2 * Math.cos(tickRad),
      y2: cy + r2 * Math.sin(tickRad),
      isMajor,
      isLit
    };
  });

  const svgHeight = cy + 22;

  return (
    <div 
      className={`relative bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-3 flex flex-col items-center justify-between min-w-[148px] flex-1 select-none transition-all duration-200 group overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_20px_-2px_rgba(0,0,0,0.65)] hover:border-slate-700 ${className}`}
    >
      {/* Tactical HUD Corner Notches */}
      <span className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-slate-700/60 pointer-events-none" />
      <span className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-slate-700/60 pointer-events-none" />
      <span className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-slate-700/60 pointer-events-none" />
      <span className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-slate-700/60 pointer-events-none" />

      {/* Top Header: Instrument Channel Label & Status Indicator */}
      <div className="w-full flex items-center justify-between pb-1.5 border-b border-slate-800/80 mb-0.5">
        <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-widest block truncate">
          {label}
        </span>
        <span className={`w-2 h-2 rounded-full ${beaconColor}`} />
      </div>

      {/* SVG Machined Dial Assembly */}
      <div className="relative my-0.5 flex items-center justify-center" style={{ width: size, height: svgHeight }}>
        <svg 
          width={size} 
          height={svgHeight} 
          viewBox={`0 0 ${size} ${svgHeight}`}
          className="overflow-visible"
          aria-hidden="true"
        >
          <defs>
            {/* Phosphor Laser Glow Filters */}
            <filter id={`${uid}-glow`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={phosphorGlowColor} />
            </filter>
            <filter id={`${uid}-pip-glow`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={phosphorColor} />
            </filter>

            {/* Phosphor High-Chroma Gradients */}
            <linearGradient id={`${uid}-emerald`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>

            <linearGradient id={`${uid}-amber`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>

            <linearGradient id={`${uid}-rose`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#BE123C" />
              <stop offset="50%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>

            {/* Recessed Center Well Radial Gradient */}
            <radialGradient id={`${uid}-well`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#030712" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          {/* Central Recessed Instrument Well */}
          <circle cx={cx} cy={cy} r={radius - 7} fill={`url(#${uid}-well)`} />

          {/* Concentric Machined Bezel Hairlines */}
          <path
            d={getArcCoordinates(startAngleDeg - 1, sweepAngleDeg + 2, radius + 6)}
            fill="none"
            stroke="#1E293B"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
          <path
            d={getArcCoordinates(startAngleDeg - 1, sweepAngleDeg + 2, radius - 6)}
            fill="none"
            stroke="#1E293B"
            strokeWidth="0.75"
            strokeLinecap="round"
          />

          {/* Recessed Dark Track Groove */}
          <path
            d={bgPath}
            fill="none"
            stroke="#0B1220"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Radial Etched Graduation Scale (Ticks) */}
          <g className="transition-all duration-300">
            {ticks.map((t, i) => (
              <line
                key={i}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={t.isLit ? phosphorColor : t.isMajor ? '#334155' : '#1E293B'}
                strokeWidth={t.isMajor ? 1.5 : 1}
                strokeLinecap="round"
                filter={t.isLit && t.isMajor ? `url(#${uid}-glow)` : undefined}
                className="transition-colors duration-500"
              />
            ))}
          </g>

          {/* Target Milestone Marker */}
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
                className="drop-shadow-[0_0_4px_rgba(255,255,255,0.9)]"
              />
              <circle
                cx={targetX2}
                cy={targetY2}
                r="2"
                fill="#FFFFFF"
                className="drop-shadow-[0_0_4px_rgba(255,255,255,1)]"
              />
            </g>
          )}

          {/* Active Phosphor Neon Halo (Pass 1 - Ambient Bloom) */}
          {clampedValue > 0 && (
            <path
              d={bgPath}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={strokeWidth + 4}
              strokeDasharray={`${totalArcLength} ${totalArcLength}`}
              strokeDashoffset={totalArcLength - activeLength}
              strokeLinecap="round"
              opacity={0.32}
              filter={`url(#${uid}-glow)`}
              className="transition-all duration-700 ease-out"
            />
          )}

          {/* Active Phosphor Core Arc (Pass 2 - Sharp Laser Wire) */}
          {clampedValue > 0 && (
            <path
              d={bgPath}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={strokeWidth}
              strokeDasharray={`${totalArcLength} ${totalArcLength}`}
              strokeDashoffset={totalArcLength - activeLength}
              strokeLinecap="round"
              filter={`url(#${uid}-glow)`}
              className="transition-all duration-700 ease-out"
            />
          )}

          {/* Leading-Edge White-Hot Pip / Beacon Indicator */}
          {clampedValue > 0 && (
            <g className="transition-all duration-700 ease-out">
              <circle
                cx={pipX}
                cy={pipY}
                r="5"
                fill={phosphorColor}
                opacity={0.5}
                filter={`url(#${uid}-pip-glow)`}
              />
              <circle
                cx={pipX}
                cy={pipY}
                r="2.5"
                fill="#FFFFFF"
                className="drop-shadow-[0_0_3px_#FFFFFF]"
              />
            </g>
          )}

          {/* Scale Limit Bound Etchings (0 and 100) */}
          <text
            x={zeroX}
            y={zeroY}
            fill="#475569"
            fontSize="8"
            fontFamily="JetBrains Mono"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="central"
          >
            0
          </text>
          <text
            x={maxX}
            y={maxY}
            fill="#475569"
            fontSize="8"
            fontFamily="JetBrains Mono"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="central"
          >
            100
          </text>
        </svg>

        {/* Center Readout HUD: Tabular Value & Suffix */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 pointer-events-none">
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <AnimatedNumber
              value={clampedValue}
              decimals={1}
              className="font-mono text-2xl lg:text-[27px] font-black tracking-tighter text-slate-100 tabular-nums leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            />
            <span className="font-mono text-xs text-slate-400 font-bold">
              {unit}
            </span>
          </div>

          {/* High-Chroma Phosphor Status Pill */}
          <div className="mt-2">
            <span className={`px-2 py-0.5 text-[8.5px] font-mono font-bold uppercase rounded-[2px] border tracking-wider flex items-center gap-1.5 transition-all ${badgeStyle}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{statusBadge}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Plate: Target Comparison & Subtitle */}
      <div className="w-full pt-2 border-t border-slate-800/80 font-mono text-[10px] flex items-center justify-between px-0.5 mt-1 bg-slate-950/60 rounded-b-[2px]">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 uppercase">Tgt:</span>
          <strong className="text-slate-200 font-bold">{target.toFixed(1)}{unit}</strong>
          <span className={`font-bold px-1 py-0.2 rounded-[2px] ${delta >= 0 ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30' : 'text-rose-400 bg-rose-950/40 border border-rose-500/30'}`}>
            {delta >= 0 ? `▲+${delta.toFixed(1)}` : `▼${delta.toFixed(1)}`}
          </span>
        </div>
        {sublabel && (
          <span className="font-medium text-slate-400 truncate max-w-[90px]" title={sublabel}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
