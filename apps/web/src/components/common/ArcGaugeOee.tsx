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
  size = 144,
  strokeWidth = 7,
  unit = '%',
  className = ''
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const clampedTarget = Math.max(0, Math.min(100, target));

  // Geometry: Semi-circle (180° to 0°)
  // Radius engineered to leave exact breathing space for micro-ticks & needle
  const radius = (size - strokeWidth * 2 - 20) / 2;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const circumference = Math.PI * radius;

  // Progress calculations
  const progressFraction = clampedValue / 100;
  const dashOffset = circumference * (1 - progressFraction);

  // Target pointer coordinates (Razor-sharp inverted triangle)
  const targetAngleRad = Math.PI * (1 - clampedTarget / 100);
  const targetOuterR = radius + strokeWidth / 2 + 4.5;
  const targetInnerR = radius - strokeWidth / 2 - 1.5;
  const targetNeedleX1 = cx + targetOuterR * Math.cos(targetAngleRad);
  const targetNeedleY1 = cy - targetOuterR * Math.sin(targetAngleRad);
  const targetNeedleX2 = cx + targetInnerR * Math.cos(targetAngleRad);
  const targetNeedleY2 = cy - targetInnerR * Math.sin(targetAngleRad);

  // Delta calculation against target
  const delta = clampedValue - clampedTarget;

  // Semantic status determination
  let strokeColor = 'var(--mes-status-pass)';
  let glowColor = 'rgba(16, 185, 129, 0.25)';
  let statusBadge = 'ON TARGET';
  let badgeStyle = 'text-[var(--mes-status-pass)] bg-[var(--mes-status-pass-muted)] border-[var(--mes-status-pass)]';

  if (clampedValue < clampedTarget - 6) {
    strokeColor = 'var(--mes-status-halt)';
    glowColor = 'rgba(244, 63, 94, 0.35)';
    statusBadge = 'CRITICAL';
    badgeStyle = 'text-[var(--mes-status-halt)] bg-[var(--mes-status-halt-muted)] border-[var(--mes-status-halt)]';
  } else if (clampedValue < clampedTarget) {
    strokeColor = 'var(--mes-status-warn)';
    glowColor = 'rgba(245, 158, 11, 0.3)';
    statusBadge = 'ATTENTION';
    badgeStyle = 'text-[var(--mes-status-warn)] bg-[var(--mes-status-warn-muted)] border-[var(--mes-status-warn)]';
  }

  // Generate 21 calibrated micro-ticks (every 5%)
  // Major ticks at 0%, 25%, 50%, 75%, 100%
  const ticks = Array.from({ length: 21 }, (_, i) => {
    const pct = i * 5;
    const isMajor = pct % 25 === 0;
    const angleRad = Math.PI * (1 - pct / 100);
    const tickOuterR = radius + strokeWidth / 2 + (isMajor ? 6.5 : 3.5);
    const tickInnerR = radius + strokeWidth / 2 + 1.5;

    return {
      pct,
      isMajor,
      x1: cx + tickInnerR * Math.cos(angleRad),
      y1: cy - tickInnerR * Math.sin(angleRad),
      x2: cx + tickOuterR * Math.cos(angleRad),
      y2: cy - tickOuterR * Math.sin(angleRad)
    };
  });

  const svgHeight = cy + 6;

  return (
    <div 
      className={`bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] hover:border-[var(--mes-border-strong)] rounded-[var(--mes-radius)] p-2.5 flex flex-col items-center justify-between min-w-[136px] flex-1 select-none transition-all duration-150 ${className}`}
      style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
    >
      {/* Title Header Band */}
      <div className="w-full text-center pb-1 border-b border-[var(--mes-border-hairline)] mb-1">
        <span className="font-mono text-[10px] font-bold text-[var(--mes-text-secondary)] uppercase tracking-wider block truncate">
          {label}
        </span>
      </div>

      {/* SVG Precision Arc Gauge */}
      <div className="relative my-1" style={{ width: size, height: svgHeight }}>
        <svg 
          width={size} 
          height={svgHeight} 
          viewBox={`0 0 ${size} ${svgHeight}`}
          className="overflow-visible"
          aria-hidden="true"
        >
          <defs>
            {/* Luminous Glow Filter for Arc */}
            <filter id={`gauge-glow-${label.replace(/\s+/g, '-')}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={glowColor} />
            </filter>
          </defs>

          {/* Calibrated Scale Micro-Ticks */}
          {ticks.map((t, idx) => (
            <line
              key={idx}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.isMajor ? 'var(--mes-text-secondary)' : 'var(--mes-border-strong)'}
              strokeWidth={t.isMajor ? 1.4 : 0.8}
              strokeLinecap="round"
            />
          ))}

          {/* Outer Scale Arc Hairline */}
          <path
            d={`M ${cx - (radius + strokeWidth / 2 + 1.5)} ${cy} A ${radius + strokeWidth / 2 + 1.5} ${radius + strokeWidth / 2 + 1.5} 0 0 1 ${cx + (radius + strokeWidth / 2 + 1.5)} ${cy}`}
            fill="none"
            stroke="var(--mes-border-subtle)"
            strokeWidth="0.75"
          />

          {/* Background Groove Track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="var(--mes-bg-well)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Luminous Progress Arc */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            filter={`url(#gauge-glow-${label.replace(/\s+/g, '-')})`}
            className="transition-all duration-500 ease-out"
          />

          {/* High-Precision Target Needle Marker */}
          {target !== undefined && (
            <g className="transition-all duration-300">
              {/* Radial pointer pin */}
              <line
                x1={targetNeedleX1}
                y1={targetNeedleY1}
                x2={targetNeedleX2}
                y2={targetNeedleY2}
                stroke="var(--mes-text-primary)"
                strokeWidth="2"
                strokeLinecap="square"
              />
              {/* Tiny pointer beacon */}
              <circle
                cx={targetNeedleX1}
                cy={targetNeedleY1}
                r="2"
                fill="var(--mes-text-primary)"
              />
            </g>
          )}
        </svg>

        {/* Center Readout: Tabular Animated Number & Status Pill */}
        <div className="absolute inset-x-0 top-[28%] flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-baseline gap-0.5">
            <AnimatedNumber
              value={clampedValue}
              decimals={1}
              className="font-mono text-2xl lg:text-[26px] font-black tracking-tight text-[var(--mes-text-primary)] tabular-nums leading-none"
            />
            <span className="font-mono text-[10.5px] text-[var(--mes-text-muted)] font-semibold">
              {unit}
            </span>
          </div>

          <div className="mt-1">
            <span className={`px-1.5 py-0.5 text-[8.5px] font-mono font-bold uppercase rounded-[var(--mes-radius)] border tracking-wider flex items-center gap-1 ${badgeStyle}`}>
              <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
              <span>{statusBadge}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Context: Target & Dynamic Sublabel */}
      <div className="w-full pt-1.5 border-t border-[var(--mes-border-hairline)] font-mono text-[10px] text-[var(--mes-text-muted)] flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1">
          <span>Tgt: <strong className="text-[var(--mes-text-primary)]">{target.toFixed(1)}{unit}</strong></span>
          <span className={`text-[9px] font-bold ${delta >= 0 ? 'text-[var(--mes-status-pass)]' : 'text-[var(--mes-status-halt)]'}`}>
            ({delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)})
          </span>
        </div>
        {sublabel && (
          <span className="text-[9.5px] text-[var(--mes-text-dim)] truncate max-w-[80px]" title={sublabel}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
