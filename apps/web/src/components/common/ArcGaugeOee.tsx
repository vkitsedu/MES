import React from 'react';

export interface ArcGaugeOeeProps {
  value: number;
  target?: number;
  label: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  unit?: string;
}

export const ArcGaugeOee: React.FC<ArcGaugeOeeProps> = ({
  value,
  target = 85,
  label,
  sublabel,
  size = 136,
  strokeWidth = 8,
  unit = '%'
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const clampedTarget = Math.max(0, Math.min(100, target));

  // Geometry: Semi-circle (180 to 0 degrees)
  const radius = (size - strokeWidth * 2 - 8) / 2;
  const cx = size / 2;
  const cy = size / 2 + 6;
  const circumference = Math.PI * radius;

  // Progress
  const progressFraction = clampedValue / 100;
  const dashOffset = circumference * (1 - progressFraction);

  // Target marker coordinates
  const targetAngleRad = Math.PI * (1 - clampedTarget / 100);
  const targetX1 = cx + (radius - strokeWidth / 2 - 3) * Math.cos(targetAngleRad);
  const targetY1 = cy - (radius - strokeWidth / 2 - 3) * Math.sin(targetAngleRad);
  const targetX2 = cx + (radius + strokeWidth / 2 + 3) * Math.cos(targetAngleRad);
  const targetY2 = cy - (radius + strokeWidth / 2 + 3) * Math.sin(targetAngleRad);

  // Industrial state color
  let strokeColor = '#10B981'; // Green
  let statusBadge = 'ON TARGET';
  let badgeStyle = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';

  if (clampedValue < clampedTarget - 7) {
    strokeColor = '#EF4444'; // Red
    statusBadge = 'CRITICAL';
    badgeStyle = 'text-rose-400 bg-rose-950/40 border-rose-500/40';
  } else if (clampedValue < clampedTarget) {
    strokeColor = '#F59E0B'; // Amber
    statusBadge = 'WARNING';
    badgeStyle = 'text-amber-400 bg-amber-950/40 border-amber-500/40';
  }

  // Ticks at 0%, 25%, 50%, 75%, 100%
  const tickPercents = [0, 25, 50, 75, 100];
  const ticks = tickPercents.map(pct => {
    const angleRad = Math.PI * (1 - pct / 100);
    const x1 = cx + (radius - strokeWidth / 2 - 1) * Math.cos(angleRad);
    const y1 = cy - (radius - strokeWidth / 2 - 1) * Math.sin(angleRad);
    const x2 = cx + (radius + strokeWidth / 2 + 1) * Math.cos(angleRad);
    const y2 = cy - (radius + strokeWidth / 2 + 1) * Math.sin(angleRad);
    return { pct, x1, y1, x2, y2 };
  });

  const height = cy + 14;

  return (
    <div className="flex flex-col items-center justify-between p-2.5 bg-[#0E1422] border border-[#222F46] rounded-sm flex-1 min-w-[125px] shadow-sm select-none">
      {/* Title Header Band */}
      <div className="w-full text-center pb-1 border-b border-[#1C273A] mb-1">
        <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider block truncate">
          {label}
        </span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative my-0.5" style={{ width: size, height }}>
        <svg width={size} height={height} className="overflow-visible">
          {/* Background Track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="#162032"
            strokeWidth={strokeWidth}
          />

          {/* Scale Ticks */}
          {ticks.map((t, idx) => (
            <line
              key={idx}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="#2B3B54"
              strokeWidth="1.5"
            />
          ))}

          {/* Active Progress Arc */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
            className="transition-all duration-500 ease-out"
          />

          {/* High-Visibility Target Line */}
          {target !== undefined && (
            <line
              x1={targetX1}
              y1={targetY1}
              x2={targetX2}
              y2={targetY2}
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
          )}
        </svg>

        {/* Numeric Center Readout */}
        <div className="absolute inset-x-0 top-[32%] flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-baseline gap-0.5">
            <span className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
              {value.toFixed(1)}
            </span>
            <span className="font-mono text-[10px] text-slate-400 font-semibold">{unit}</span>
          </div>
          <span className={`px-1 py-0.2 text-[8px] font-mono font-bold uppercase rounded-sm border ${badgeStyle}`}>
            {statusBadge}
          </span>
        </div>
      </div>

      {/* Bottom Target Information */}
      <div className="w-full text-center pt-1 border-t border-[#1C273A] font-mono text-[9.5px] text-slate-400 flex items-center justify-between px-1">
        <span>Tgt: <b className="text-slate-200">{target.toFixed(1)}{unit}</b></span>
        {sublabel && <span className="text-slate-500 truncate max-w-[70px]">{sublabel}</span>}
      </div>
    </div>
  );
};
