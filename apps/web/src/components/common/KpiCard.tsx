import React from 'react';
import { 
  TrendingUp, TrendingDown, Minus, ChevronRight, AlertTriangle, 
  ChevronDown, ChevronUp, Maximize2, ShieldAlert
} from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

export type KpiStatus = 'PASS' | 'WARN' | 'HALT' | 'IDLE';

export interface KpiCardDrillDownItem {
  id: string;
  timestamp: string;
  category: string;
  title: string;
  description: string;
  severity?: 'CRITICAL' | 'WARNING' | 'INFO';
  durationMinutes?: number;
  stationCode?: string;
  metricDelta?: string;
  occurrences?: number;
}

export interface KpiCardProps {
  id: string;
  label: string;
  category?: string;
  value: number;
  unit?: string;
  prefix?: string;
  decimals?: number;
  target?: number;
  targetLabel?: string;
  trendPct?: number; // e.g. +2.4 or -1.5
  status?: KpiStatus;
  sparklineData?: number[]; // Array of 5-10 numeric values for trendline
  isException?: boolean;
  exceptionNotice?: string;
  onClickDrillDown?: (id: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
  drillDownSummary?: string;
  drillDownItems?: KpiCardDrillDownItem[];
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  label,
  category,
  value,
  unit = '',
  prefix = '',
  decimals = 0,
  target,
  targetLabel,
  trendPct,
  status = 'PASS',
  sparklineData,
  isException = false,
  exceptionNotice,
  onClickDrillDown,
  isExpanded = false,
  onToggleExpand,
  drillDownSummary,
  drillDownItems,
  className = ''
}) => {
  // Status-driven styling using semantic CSS variables
  const statusColors: Record<KpiStatus, { text: string; bg: string; border: string; badge: string }> = {
    PASS: {
      text: 'var(--mes-status-pass)',
      bg: 'var(--mes-status-pass-muted)',
      border: 'rgba(16, 185, 129, 0.35)',
      badge: 'NORMAL'
    },
    WARN: {
      text: 'var(--mes-status-warn)',
      bg: 'var(--mes-status-warn-muted)',
      border: 'rgba(245, 158, 11, 0.4)',
      badge: 'ATTENTION'
    },
    HALT: {
      text: 'var(--mes-status-halt)',
      bg: 'var(--mes-status-halt-muted)',
      border: 'rgba(244, 63, 94, 0.45)',
      badge: 'CRITICAL'
    },
    IDLE: {
      text: 'var(--mes-status-idle)',
      bg: 'rgba(100, 116, 139, 0.12)',
      border: 'var(--mes-border-subtle)',
      badge: 'STANDBY'
    }
  };

  const currentThemeStatus = statusColors[status] || statusColors.PASS;

  // Render SVG Sparkline
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;

    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const width = 64;
    const height = 24;

    const points = sparklineData
      .map((val, idx) => {
        const x = (idx / (sparklineData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible opacity-80 shrink-0" aria-hidden="true">
        <polyline
          fill="none"
          stroke={currentThemeStatus.text}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const handleCardClick = () => {
    if (onToggleExpand) {
      onToggleExpand(id);
    } else if (onClickDrillDown) {
      onClickDrillDown(id);
    }
  };

  const isClickable = Boolean(onToggleExpand || onClickDrillDown);

  return (
    <div
      onClick={isClickable ? handleCardClick : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); } : undefined}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      aria-expanded={isExpanded}
      aria-label={`${label}: ${value} ${unit}. Status: ${status}`}
      className={`mes-spotlight-card relative bg-[var(--mes-bg-surface)] border rounded-[var(--mes-radius)] p-3.5 flex flex-col justify-between select-none transition-all duration-200 ${
        isClickable ? 'cursor-pointer hover:border-[var(--mes-accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--mes-accent-primary)]' : ''
      } ${
        isExpanded ? 'ring-1 ring-[var(--mes-accent-primary)] border-[var(--mes-accent-primary)] col-span-1 sm:col-span-2 shadow-lg' : ''
      } ${
        isException 
          ? 'border-[var(--mes-status-halt)] shadow-[0_0_12px_rgba(244,63,94,0.15)]' 
          : 'border-[var(--mes-border-subtle)]'
      } ${className}`}
      style={{
        boxShadow: 'var(--mes-shadow-subtle)'
      }}
    >
      <div>
        {/* Top Header Row: Label & Category Badge */}
        <div className="flex items-start justify-between gap-2">
          <div>
            {category && (
              <span className="text-[10px] font-mono tracking-wider uppercase text-[var(--mes-text-muted)] block mb-0.5">
                {category}
              </span>
            )}
            <h3 className="text-xs font-semibold text-[var(--mes-text-secondary)] tracking-tight">
              {label}
            </h3>
          </div>

          {/* Semantic Status Badge */}
          <div 
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--mes-radius)] border text-[10px] font-mono font-bold shrink-0"
            style={{
              backgroundColor: currentThemeStatus.bg,
              borderColor: currentThemeStatus.border,
              color: currentThemeStatus.text
            }}
          >
            <span 
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: currentThemeStatus.text }}
            />
            <span>{currentThemeStatus.badge}</span>
          </div>
        </div>

        {/* Center Row: Visually Dominant Numerals & Sparkline */}
        <div className="my-2 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <AnimatedNumber
              value={value}
              decimals={decimals}
              prefix={prefix}
              className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--mes-text-primary)]"
            />
            {unit && (
              <span className="text-xs font-mono font-medium text-[var(--mes-text-muted)]">
                {unit}
              </span>
            )}
          </div>

          {/* Trend Indicator & Mini Sparkline */}
          <div className="flex items-center gap-2">
            {renderSparkline()}
            {trendPct !== undefined && (
              <div 
                className={`flex items-center text-[10.5px] font-mono font-bold ${
                  trendPct > 0 
                    ? 'text-[var(--mes-status-pass)]' 
                    : trendPct < 0 
                      ? 'text-[var(--mes-status-halt)]' 
                      : 'text-[var(--mes-text-muted)]'
                }`}
              >
                {trendPct > 0 ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : trendPct < 0 ? (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                ) : (
                  <Minus className="w-3 h-3 mr-0.5" />
                )}
                <span>{trendPct > 0 ? `+${trendPct}%` : `${trendPct}%`}</span>
              </div>
            )}
          </div>
        </div>

        {/* Exception Notice Banner if Present */}
        {isException && exceptionNotice && (
          <div className="mb-2 px-2 py-1 bg-[var(--mes-status-halt-muted)] border border-[var(--mes-status-halt)] rounded-[var(--mes-radius)] flex items-center gap-1.5 text-[10.5px] text-[var(--mes-status-halt)] font-medium">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span className="truncate">{exceptionNotice}</span>
          </div>
        )}
      </div>

      {/* In-Place Expanded Telemetry Drill-Down */}
      {isExpanded && (
        <div className="my-2.5 pt-2.5 border-t border-[var(--mes-border-hairline)] space-y-2 text-left animate-in fade-in duration-200">
          {drillDownSummary && (
            <p className="text-[11px] text-[var(--mes-text-secondary)] leading-relaxed bg-[var(--mes-bg-well)] p-2.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
              {drillDownSummary}
            </p>
          )}

          {drillDownItems && drillDownItems.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--mes-text-muted)] block">
                Recent Telemetry Events ({drillDownItems.length})
              </span>
              {drillDownItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-[var(--mes-bg-well)] p-2 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)] flex items-start justify-between gap-2 text-[10.5px]"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-[var(--mes-text-primary)] font-bold">{item.title}</span>
                      {item.stationCode && (
                        <span className="text-[10px] text-[var(--mes-text-muted)] bg-[var(--mes-bg-surface)] px-1 rounded-[1px] border border-[var(--mes-border-hairline)]">
                          {item.stationCode}
                        </span>
                      )}
                      <span className="text-[10px] text-[var(--mes-text-dim)]">{item.timestamp}</span>
                    </div>
                    <p className="text-[10.5px] text-[var(--mes-text-muted)] mt-0.5">{item.description}</p>
                  </div>
                  {item.durationMinutes !== undefined && (
                    <span className="text-[10.5px] font-mono text-[var(--mes-status-halt)] font-bold shrink-0">
                      {item.durationMinutes}m lost
                    </span>
                  )}
                  {item.metricDelta && (
                    <span className="text-[10.5px] font-mono text-[var(--mes-status-pass)] font-bold shrink-0">
                      {item.metricDelta}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {onClickDrillDown && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-[var(--mes-text-muted)]">Expanded In-Place</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClickDrillDown(id);
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-[var(--mes-accent-muted)] hover:bg-[var(--mes-accent-primary)] text-[var(--mes-accent-primary)] hover:text-white rounded-[var(--mes-radius)] text-[10px] font-mono font-bold transition-all"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Enlarge Full Screen</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Footer: Target Context & Drill-down Cue */}
      <div className="pt-2 border-t border-[var(--mes-border-hairline)] flex items-center justify-between text-[10px] font-mono text-[var(--mes-text-muted)]">
        <div>
          {target !== undefined ? (
            <span>
              Target: <strong className="text-[var(--mes-text-secondary)]">{target}{unit}</strong>
              {targetLabel ? ` (${targetLabel})` : ''}
            </span>
          ) : (
            <span>SEMI E10 Baseline</span>
          )}
        </div>

        {isClickable && (
          <div className="flex items-center gap-1 text-[var(--mes-accent-primary)] font-bold">
            <span>{isExpanded ? 'Collapse' : 'In-Place Drill'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
