import React, { useEffect } from 'react';
import { 
  X, AlertTriangle, Clock, ArrowDownRight, 
  Download, Filter, ChevronRight, CheckCircle2,
  TrendingDown, ShieldAlert
} from 'lucide-react';

export interface DrillDownItem {
  id: string;
  timestamp: string;
  category: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  durationMinutes?: number;
  occurrences?: number;
  metricDelta?: string;
  stationCode?: string;
}

export interface DrillDownData {
  kpiId: string;
  title: string;
  subtitle: string;
  currentValue: string;
  targetValue: string;
  status: 'PASS' | 'WARN' | 'HALT';
  summaryDescription: string;
  items: DrillDownItem[];
}

export interface DrillDownDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: DrillDownData | null;
}

export const DrillDownDrawer: React.FC<DrillDownDrawerProps> = ({
  isOpen,
  onClose,
  data
}) => {
  // Handle ESC key to dismiss drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const severityStyles: Record<'CRITICAL' | 'WARNING' | 'INFO', { text: string; bg: string; border: string }> = {
    CRITICAL: {
      text: 'var(--mes-status-halt)',
      bg: 'var(--mes-status-halt-muted)',
      border: 'rgba(244, 63, 94, 0.3)'
    },
    WARNING: {
      text: 'var(--mes-status-warn)',
      bg: 'var(--mes-status-warn-muted)',
      border: 'rgba(245, 158, 11, 0.3)'
    },
    INFO: {
      text: 'var(--mes-accent-primary)',
      bg: 'var(--mes-accent-muted)',
      border: 'var(--mes-accent-ring)'
    }
  };

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Station', 'Category', 'Title', 'Severity', 'Duration (min)', 'Occurrences'];
    const rows = data.items.map(item => [
      item.timestamp,
      item.stationCode || 'ALL',
      item.category,
      `"${item.title.replace(/"/g, '""')}"`,
      item.severity,
      item.durationMinutes || 0,
      item.occurrences || 1
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${data.kpiId}_drilldown_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="mes-drawer-backdrop fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl z-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        <section
          aria-labelledby="slide-over-title"
          className="mes-drawer-panel bg-[var(--mes-bg-surface)] border border-[var(--mes-border-strong)] rounded-[var(--mes-radius)] flex flex-col shadow-2xl overflow-hidden max-h-[88vh]"
        >
          {/* Drawer Header */}
          <div className="p-4 bg-[var(--mes-bg-header)] border-b border-[var(--mes-border-subtle)] flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--mes-accent-primary)] font-bold">
                  TELEMETRY ROOT-CAUSE DRILL DOWN
                </span>
                <span className="text-[var(--mes-border-strong)]">•</span>
                <span className="text-[10.5px] font-mono text-[var(--mes-text-muted)]">
                  KPI: {data.kpiId}
                </span>
              </div>
              <h2 id="slide-over-title" className="text-base font-bold text-[var(--mes-text-primary)] font-mono mt-1">
                {data.title}
              </h2>
              <p className="text-xs text-[var(--mes-text-secondary)] mt-0.5">
                {data.subtitle}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-[var(--mes-radius)] text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)] hover:bg-[var(--mes-bg-well)] transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Banner */}
          <div className="px-4 py-3 bg-[var(--mes-bg-well)] border-b border-[var(--mes-border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[9.5px] font-mono text-[var(--mes-text-muted)] uppercase block">Observed Metric</span>
                <span className="text-lg font-bold font-mono text-[var(--mes-text-primary)] tabular-nums">
                  {data.currentValue}
                </span>
              </div>
              <div className="h-6 w-px bg-[var(--mes-border-hairline)]" />
              <div>
                <span className="text-[9.5px] font-mono text-[var(--mes-text-muted)] uppercase block">Target Specification</span>
                <span className="text-sm font-semibold font-mono text-[var(--mes-text-secondary)] tabular-nums">
                  {data.targetValue}
                </span>
              </div>
            </div>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--mes-bg-surface)] hover:bg-[var(--mes-bg-canvas)] border border-[var(--mes-border-subtle)] hover:border-[var(--mes-accent-primary)] text-[var(--mes-text-secondary)] hover:text-[var(--mes-text-primary)] rounded-[var(--mes-radius)] text-xs font-mono font-medium transition-colors"
              title="Export event log as CSV"
            >
              <Download className="w-3.5 h-3.5 text-[var(--mes-accent-primary)]" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Summary Callout */}
          <div className="px-4 py-2.5 bg-[var(--mes-bg-surface)] border-b border-[var(--mes-border-hairline)] text-xs text-[var(--mes-text-secondary)] leading-relaxed">
            {data.summaryDescription}
          </div>

          {/* Timeline & Event Breakdown List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--mes-text-muted)] uppercase pb-1">
              <span>Exception Events ({data.items.length})</span>
              <span>Sorted by Impact</span>
            </div>

            {data.items.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-[var(--mes-text-muted)]">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-[var(--mes-status-pass)]" />
                <span>Zero exceptions recorded for this metric process window.</span>
              </div>
            ) : (
              data.items.map((item) => {
                const style = severityStyles[item.severity] || severityStyles.INFO;

                return (
                  <div
                    key={item.id}
                    className="p-3 bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] hover:border-[var(--mes-border-strong)] rounded-[var(--mes-radius)] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-1.5 py-0.5 rounded-[var(--mes-radius)] border text-[9px] font-mono font-bold"
                          style={{
                            backgroundColor: style.bg,
                            borderColor: style.border,
                            color: style.text
                          }}
                        >
                          {item.severity}
                        </span>
                        {item.stationCode && (
                          <span className="text-[10px] font-mono text-[var(--mes-text-muted)] bg-[var(--mes-bg-surface)] px-1.5 py-0.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                            {item.stationCode}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-[var(--mes-text-dim)]">
                          {item.timestamp}
                        </span>
                      </div>

                      {item.durationMinutes !== undefined && (
                        <span className="text-xs font-mono font-bold text-[var(--mes-status-halt)] tabular-nums">
                          {item.durationMinutes}m lost
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-semibold text-[var(--mes-text-primary)] mt-1.5">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[var(--mes-text-secondary)] mt-0.5 leading-relaxed">
                      {item.description}
                    </p>

                    {(item.occurrences || item.metricDelta) && (
                      <div className="mt-2 pt-2 border-t border-[var(--mes-border-hairline)] flex items-center justify-between text-[10px] font-mono text-[var(--mes-text-muted)]">
                        {item.occurrences && (
                          <span>Frequency: <strong className="text-[var(--mes-text-secondary)]">{item.occurrences}x occurrences</strong></span>
                        )}
                        {item.metricDelta && (
                          <span className="text-[var(--mes-status-halt)]">{item.metricDelta}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-3 bg-[var(--mes-bg-header)] border-t border-[var(--mes-border-subtle)] flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] text-[var(--mes-text-dim)]">
              ESC to close • Synced with Live Telemetry Bus
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-[var(--mes-bg-well)] hover:bg-[var(--mes-bg-surface)] text-[var(--mes-text-primary)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] text-xs font-medium transition-colors"
            >
              Close Drawer
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
