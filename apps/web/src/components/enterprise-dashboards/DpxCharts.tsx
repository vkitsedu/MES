import React from 'react';

// ============================================================================
// 1. HIGH-PRECISION SVG DONUT CHART
// ============================================================================
export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export interface DpxDonutChartProps {
  data: DonutSlice[];
  size?: number;
  donutWidth?: number;
  centerValue?: string;
  centerLabel?: string;
  showLegend?: boolean;
  legendPosition?: 'right' | 'bottom';
}

export const DpxDonutChart: React.FC<DpxDonutChartProps> = ({
  data,
  size = 160,
  donutWidth = 24,
  centerValue,
  centerLabel,
  showLegend = true,
  legendPosition = 'right'
}) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const radius = size / 2;
  const innerRadius = radius - donutWidth;

  // Convert slice angles to polar coordinates
  let cumulativeAngle = -90; // Start at 12 o'clock

  const slices = data.map((slice) => {
    const angle = (slice.value / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);

    const ix1 = radius + innerRadius * Math.cos(endRad);
    const iy1 = radius + innerRadius * Math.sin(endRad);
    const ix2 = radius + innerRadius * Math.cos(startRad);
    const iy2 = radius + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2}`,
      'Z'
    ].join(' ');

    const pct = ((slice.value / total) * 100).toFixed(1);

    return {
      ...slice,
      pathData,
      pct
    };
  });

  return (
    <div className={`flex ${legendPosition === 'bottom' ? 'flex-col items-center' : 'items-center'} gap-3`}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice, i) => (
            <path
              key={i}
              d={slice.pathData}
              fill={slice.color}
              stroke="#ffffff"
              strokeWidth="1.5"
              className="transition-all duration-200 hover:opacity-85 cursor-pointer"
            >
              <title>{`${slice.label}: ${slice.value} (${slice.pct}%)`}</title>
            </path>
          ))}
        </svg>

        {/* Center Metric Label */}
        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {centerLabel && (
              <span className="text-[9px] uppercase font-bold text-slate-400 font-sans tracking-wide">
                {centerLabel}
              </span>
            )}
            {centerValue && (
              <span className="text-base font-black text-slate-800 font-mono leading-tight">
                {centerValue}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className={`text-xs space-y-1 ${legendPosition === 'bottom' ? 'grid grid-cols-2 gap-x-4 gap-y-1 w-full pt-1' : 'flex-1 min-w-0'}`}>
          {slices.map((slice, i) => (
            <div key={i} className="flex items-center justify-between gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 min-w-0 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="text-slate-600 truncate font-sans">{slice.label}</span>
              </div>
              <span className="font-bold text-slate-800 shrink-0">
                {slice.value} <span className="text-slate-400 font-normal">({slice.pct}%)</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. HORIZONTAL DEFECT PARETO BAR CHART
// ============================================================================
export interface ParetoItem {
  name: string;
  percentage: number;
  count?: number;
  color?: string;
}

export const DpxHorizontalPareto: React.FC<{ items: ParetoItem[]; maxPct?: number }> = ({
  items,
  maxPct = 40
}) => {
  return (
    <div className="space-y-1.5 w-full font-mono text-xs">
      {items.map((item, idx) => {
        const barWidth = Math.min(100, (item.percentage / maxPct) * 100);
        const barColor = item.color || '#2563EB';

        return (
          <div key={idx} className="group">
            <div className="flex items-center justify-between text-[11px] mb-0.5">
              <span className="text-slate-700 font-sans truncate pr-2 group-hover:text-blue-600 transition-colors">
                {item.name}
              </span>
              <span className="font-bold text-slate-800 shrink-0 font-mono">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-xs h-3.5 overflow-hidden flex items-center relative border border-slate-200">
              <div
                className="h-full rounded-xs transition-all duration-500 relative flex items-center justify-end pr-1"
                style={{
                  width: `${barWidth}%`,
                  backgroundColor: barColor
                }}
              >
                {barWidth > 20 && (
                  <span className="text-[9px] text-white font-bold font-mono">
                    {item.percentage}%
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// 3. MULTI-LINE DEFECT & SPC TREND CHART
// ============================================================================
export interface TrendSeries {
  name: string;
  color: string;
  data: number[];
}

export const DpxMultiLineTrend: React.FC<{
  labels: string[];
  series: TrendSeries[];
  height?: number;
  threshold?: number;
  thresholdLabel?: string;
}> = ({ labels, series, height = 150, threshold, thresholdLabel = 'UCL Limit' }) => {
  const allValues = series.flatMap((s) => s.data);
  if (threshold !== undefined) allValues.push(threshold);
  const maxVal = Math.max(...allValues, 10) * 1.15;
  const minVal = 0;

  const width = 450;
  const padLeft = 35;
  const padRight = 15;
  const padTop = 15;
  const padBottom = 25;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const getY = (val: number) => padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
  const getX = (index: number) => padLeft + (index / (labels.length - 1 || 1)) * chartW;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = padTop + chartH * pct;
          const val = Math.round(maxVal * (1 - pct));
          return (
            <g key={i}>
              <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2,2" />
              <text x={padLeft - 5} y={y + 3} textAnchor="end" fontSize="9" fill="#94A3B8" fontFamily="monospace">
                {val}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {labels.map((lbl, i) => {
          const x = getX(i);
          return (
            <text key={i} x={x} y={height - 8} textAnchor="middle" fontSize="9" fill="#64748B" fontFamily="monospace">
              {lbl}
            </text>
          );
        })}

        {/* Threshold Line (if any) */}
        {threshold !== undefined && (
          <g>
            <line
              x1={padLeft}
              y1={getY(threshold)}
              x2={width - padRight}
              y2={getY(threshold)}
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            <text x={width - padRight} y={getY(threshold) - 3} textAnchor="end" fontSize="8.5" fill="#EF4444" fontWeight="bold">
              {thresholdLabel} ({threshold})
            </text>
          </g>
        )}

        {/* Data Series Lines */}
        {series.map((s, idx) => {
          const points = s.data.map((val, i) => `${getX(i)},${getY(val)}`).join(' ');
          return (
            <g key={idx}>
              <polyline
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              {s.data.map((val, i) => (
                <circle
                  key={i}
                  cx={getX(i)}
                  cy={getY(val)}
                  r="3.5"
                  fill="#ffffff"
                  stroke={s.color}
                  strokeWidth="2"
                  className="hover:r-5 transition-all"
                >
                  <title>{`${s.name} @ ${labels[i]}: ${val}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Series Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-1.5 text-[10px] font-mono">
        {series.map((s, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span className="w-2.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-slate-600 font-sans">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 4. PLAN VS ACTUAL DUAL COLUMN BAR CHART
// ============================================================================
export const DpxDualBarChart: React.FC<{
  items: { label: string; plan: number; actual: number }[];
  height?: number;
}> = ({ items, height = 150 }) => {
  const maxVal = Math.max(...items.flatMap((d) => [d.plan, d.actual]), 100);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 pt-2 px-1" style={{ height: `${height}px` }}>
        {items.map((item, idx) => {
          const planH = (item.plan / maxVal) * 100;
          const actualH = (item.actual / maxVal) * 100;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-1 h-full pb-1">
                {/* Plan Bar */}
                <div
                  style={{ height: `${planH}%` }}
                  className="w-3 bg-blue-500 rounded-t shadow-xs transition-all group-hover:brightness-110"
                  title={`Plan: ${item.plan}`}
                />
                {/* Actual Bar */}
                <div
                  style={{ height: `${actualH}%` }}
                  className="w-3 bg-cyan-400 rounded-t shadow-xs transition-all group-hover:brightness-110"
                  title={`Actual: ${item.actual}`}
                />
              </div>
              <span className="text-[9px] text-slate-500 font-mono truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-2 border-t mt-1 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-xs inline-block" /> Plan Target
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs inline-block" /> Actual Output
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// 5. 10-ZONE REFLOW THERMAL PROFILING CURVE
// ============================================================================
export const DpxReflowThermalCurve: React.FC<{
  zones: { zone: number; setTemp: number; actualTemp: number; label: string }[];
  liquidusTemp?: number;
  peakTemp?: number;
}> = ({
  zones,
  liquidusTemp = 217,
  peakTemp = 245
}) => {
  const width = 500;
  const height = 170;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxTemp = 280;
  const minTemp = 25;

  const getY = (temp: number) => padTop + chartH - ((temp - minTemp) / (maxTemp - minTemp)) * chartH;
  const getX = (index: number) => padLeft + (index / (zones.length - 1 || 1)) * chartW;

  const setPoints = zones.map((z, i) => `${getX(i)},${getY(z.setTemp)}`).join(' ');
  const actualPoints = zones.map((z, i) => `${getX(i)},${getY(z.actualTemp)}`).join(' ');

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Shaded Process Window Band (Pre-heat, Soak, Reflow, Cool) */}
        <rect x={padLeft} y={padTop} width={chartW * 0.3} height={chartH} fill="#EFF6FF" opacity="0.6" />
        <rect x={padLeft + chartW * 0.3} y={padTop} width={chartW * 0.3} height={chartH} fill="#FEF3C7" opacity="0.4" />
        <rect x={padLeft + chartW * 0.6} y={padTop} width={chartW * 0.25} height={chartH} fill="#FEE2E2" opacity="0.5" />
        <rect x={padLeft + chartW * 0.85} y={padTop} width={chartW * 0.15} height={chartH} fill="#F0FDF4" opacity="0.6" />

        {/* Phase Labels */}
        <text x={padLeft + chartW * 0.15} y={padTop + 12} textAnchor="middle" fontSize="9" fill="#3B82F6" fontWeight="bold">PRE-HEAT</text>
        <text x={padLeft + chartW * 0.45} y={padTop + 12} textAnchor="middle" fontSize="9" fill="#D97706" fontWeight="bold">SOAK</text>
        <text x={padLeft + chartW * 0.72} y={padTop + 12} textAnchor="middle" fontSize="9" fill="#DC2626" fontWeight="bold">REFLOW</text>
        <text x={padLeft + chartW * 0.92} y={padTop + 12} textAnchor="middle" fontSize="9" fill="#059669" fontWeight="bold">COOL</text>

        {/* Liquidus 217°C Line */}
        <line
          x1={padLeft}
          y1={getY(liquidusTemp)}
          x2={width - padRight}
          y2={getY(liquidusTemp)}
          stroke="#EF4444"
          strokeWidth="1.2"
          strokeDasharray="4,2"
        />
        <text x={width - padRight} y={getY(liquidusTemp) - 3} textAnchor="end" fontSize="8.5" fill="#EF4444" fontWeight="bold">
          Liquidus {liquidusTemp}°C
        </text>

        {/* Setpoint Profile (Blue Dashed) */}
        <polyline fill="none" stroke="#93C5FD" strokeWidth="2" strokeDasharray="3,3" points={setPoints} />

        {/* Actual Thermocouple Curve (Red/Orange Bold) */}
        <polyline fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={actualPoints} />

        {/* Zone Markers */}
        {zones.map((z, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(z.actualTemp)} r="3" fill="#DC2626" stroke="#ffffff" strokeWidth="1.5" />
            <text x={getX(i)} y={height - 10} textAnchor="middle" fontSize="8.5" fill="#475569" fontFamily="monospace">
              Z{z.zone}
            </text>
          </g>
        ))}

        {/* Peak Indicator */}
        <text x={getX(7)} y={getY(peakTemp) - 8} textAnchor="middle" fontSize="9.5" fill="#B91C1C" fontWeight="bold">
          ▲ Peak {peakTemp}°C
        </text>
      </svg>

      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t font-mono">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-blue-400 border border-blue-600 inline-block" /> Recipe Target</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-red-600 inline-block" /> Live Thermocouple Actual</span>
        <span className="text-emerald-700 font-bold">PWI: 64.2% (IN SPEC)</span>
      </div>
    </div>
  );
};

// ============================================================================
// 6. GANTT PRODUCTION PLANNING TIMELINE
// ============================================================================
export interface GanttJob {
  id: string;
  product: string;
  startHour: number;
  durationHours: number;
  color: string;
  status: string;
}

export const DpxGanttTimeline: React.FC<{
  lines: { lineName: string; jobs: GanttJob[] }[];
  totalHours?: number;
}> = ({ lines, totalHours = 24 }) => {
  const hours = Array.from({ length: 12 }, (_, i) => `${(i * 2).toString().padStart(2, '0')}:00`);

  return (
    <div className="w-full bg-white rounded border border-slate-200 overflow-hidden font-mono text-xs">
      {/* Time header */}
      <div className="flex border-b bg-slate-50 text-[10px] text-slate-500 py-1.5 px-2">
        <div className="w-20 shrink-0 font-bold">LINE / BAY</div>
        <div className="flex-1 flex justify-between">
          {hours.map((h, i) => (
            <span key={i} className="text-center">{h}</span>
          ))}
        </div>
      </div>

      {/* Line Tracks */}
      <div className="divide-y divide-slate-100">
        {lines.map((l, lIdx) => (
          <div key={lIdx} className="flex items-center py-2 px-2 hover:bg-slate-50/50">
            <div className="w-20 shrink-0 font-bold text-slate-800 text-[11px] font-sans">
              {l.lineName}
            </div>
            <div className="flex-1 h-7 bg-slate-100/70 rounded relative overflow-hidden flex items-center">
              {/* Hour Grid Lines */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-r border-slate-200/60 pointer-events-none"
                  style={{ left: `${(i / 12) * 100}%` }}
                />
              ))}

              {/* Job Blocks */}
              {l.jobs.map((job) => {
                const left = (job.startHour / totalHours) * 100;
                const width = (job.durationHours / totalHours) * 100;

                return (
                  <div
                    key={job.id}
                    className="absolute h-5.5 rounded px-2 flex items-center justify-between text-white text-[9.5px] font-bold shadow-xs truncate cursor-pointer transition-transform hover:scale-[1.01]"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: job.color
                    }}
                    title={`${job.id} (${job.product}) - ${job.durationHours}h [${job.status}]`}
                  >
                    <span className="truncate">{job.id}</span>
                    <span className="text-[8.5px] opacity-80 pl-1 shrink-0">{job.durationHours}h</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 7. 3D SPI VOLUMETRIC HEIGHT HEATMAP
// ============================================================================
export const Dpx3dHeatmap: React.FC<{
  rows?: number;
  cols?: number;
  highlightDefect?: boolean;
}> = ({ rows = 6, cols = 10, highlightDefect = true }) => {
  // Generates gradient topology from blue (low) to cyan, green (ideal), yellow, red (excess)
  return (
    <div className="w-full bg-[#070D18] p-2.5 rounded border border-[#1E293B] shadow-inner select-none font-mono">
      <div className="flex items-center justify-between text-[10px] text-cyan-400 mb-2 border-b border-[#1E293B] pb-1">
        <span>3D SOLDER PASTE HEIGHT TOPOLOGY</span>
        <span className="text-emerald-400">APERTURES: 60/60 OK</span>
      </div>

      <div className="grid grid-cols-10 gap-1 aspect-2/1">
        {Array.from({ length: rows * cols }).map((_, idx) => {
          const isCenter = idx >= 15 && idx <= 45 && idx % 10 >= 2 && idx % 10 <= 7;
          const isDefect = highlightDefect && idx === 24;

          let bg = 'bg-cyan-900/60';
          let border = 'border-cyan-700/40';
          let label = '120µm';

          if (isCenter) {
            bg = 'bg-emerald-500/80';
            border = 'border-emerald-300';
            label = '145µm';
          }
          if (isDefect) {
            bg = 'bg-red-500 animate-pulse';
            border = 'border-red-300';
            label = '210µm';
          }

          return (
            <div
              key={idx}
              className={`rounded-[1px] border ${bg} ${border} flex items-center justify-center text-[7.5px] font-bold text-white transition-all hover:scale-110 cursor-pointer`}
              title={`Pad #${idx + 1}: ${label}`}
            >
              {isDefect ? '!' : ''}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[9px] text-slate-400 mt-2 font-mono">
        <span>0 µm (Bridge)</span>
        <div className="flex items-center gap-1">
          <span className="w-3 h-1.5 bg-blue-600 rounded-xs" />
          <span className="w-3 h-1.5 bg-cyan-400 rounded-xs" />
          <span className="w-3 h-1.5 bg-emerald-500 rounded-xs" />
          <span className="w-3 h-1.5 bg-amber-400 rounded-xs" />
          <span className="w-3 h-1.5 bg-red-500 rounded-xs" />
        </div>
        <span>250 µm (Excess)</span>
      </div>
    </div>
  );
};

// ============================================================================
// 8. OPTICAL PCB CAMERA CAPTURE
// ============================================================================
export const DpxOpticalPcb: React.FC<{
  showBBoxes?: boolean;
  type?: 'SPI' | 'AOI';
}> = ({ showBBoxes = true, type = 'AOI' }) => {
  return (
    <div className="relative w-full aspect-16/10 bg-[#063319] rounded border border-emerald-800/60 overflow-hidden shadow-inner flex items-center justify-center p-3 select-none">
      {/* PCB Gold/Copper Traces Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <pattern id="traces" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 0 15 L 15 15 L 20 20 L 30 20" fill="none" stroke="#D97706" strokeWidth="0.8" />
          <circle cx="15" cy="15" r="1.5" fill="#D97706" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#traces)" />
      </svg>

      {/* Main IC chip */}
      <div className="relative z-10 w-24 h-24 bg-slate-900 border-2 border-slate-700 rounded flex flex-col items-center justify-center text-slate-400 font-mono shadow-xl">
        <span className="text-[8px] tracking-widest text-slate-500">ARM CORTEX</span>
        <span className="text-[10px] font-bold text-slate-200">STM32F4</span>
        <span className="w-2 h-2 rounded-full bg-slate-600 absolute top-1 left-1" />
      </div>

      {/* Surrounding SMT Chip Passives (0402 / 0603) */}
      <div className="absolute top-4 left-6 w-5 h-2.5 bg-amber-200 border border-slate-700 rounded-xs" />
      <div className="absolute top-8 left-6 w-5 h-2.5 bg-amber-200 border border-slate-700 rounded-xs" />
      <div className="absolute bottom-4 left-6 w-6 h-3 bg-slate-300 border border-slate-700 rounded-xs" />
      <div className="absolute top-4 right-6 w-5 h-2.5 bg-amber-200 border border-slate-700 rounded-xs" />
      <div className="absolute bottom-6 right-8 w-7 h-4 bg-slate-800 border border-slate-500 rounded-xs" />

      {/* Bounding Boxes for AOI / SPI */}
      {showBBoxes && (
        <>
          {/* Green Pass Box */}
          <div className="absolute top-3 left-5 w-7 h-9 border-2 border-emerald-400 rounded-xs flex items-start justify-end p-0.5">
            <span className="bg-emerald-500 text-white font-mono text-[7px] font-bold px-0.5 rounded-xs">OK</span>
          </div>

          {/* Red Defect Box */}
          <div className="absolute bottom-3 right-6 w-11 h-8 border-2 border-red-500 rounded-xs flex items-start justify-end p-0.5 animate-pulse bg-red-500/10">
            <span className="bg-red-600 text-white font-mono text-[7px] font-bold px-0.5 rounded-xs">
              {type === 'SPI' ? 'OFFSET' : 'MISSING'}
            </span>
          </div>
        </>
      )}

      {/* Live Feed Watermark */}
      <div className="absolute bottom-1 left-2 text-[9px] font-mono text-emerald-400 font-bold bg-slate-950/70 px-1.5 py-0.5 rounded">
        ● {type} CAMERA: LIVE 12.4 MP
      </div>
    </div>
  );
};

// ============================================================================
// 9. PROCESS MILESTONE STEPPER (FOR TRACEABILITY)
// ============================================================================
export const DpxProcessStepper: React.FC<{
  steps: { name: string; time: string; status: 'PASS' | 'WARN' | 'FAIL' }[];
}> = ({ steps }) => {
  return (
    <div className="w-full py-2 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[500px] relative">
        {/* Continuous Connecting Line */}
        <div className="absolute top-3.5 left-4 right-4 h-1 bg-emerald-500 -z-0" />

        {steps.map((st, i) => {
          return (
            <div key={i} className="flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs">
                ✓
              </div>
              <span className="font-bold text-[11px] text-slate-800 mt-1 font-sans">
                {st.name}
              </span>
              <span className="text-[9.5px] text-slate-500 font-mono">
                {st.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
