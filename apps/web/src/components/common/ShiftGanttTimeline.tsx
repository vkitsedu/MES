import React from 'react';
import { Clock } from 'lucide-react';

export interface ShiftTimelineSegment {
  state: 'RUN' | 'WAIT_PREV' | 'WAIT_NEXT' | 'STOP' | 'CHANGEOVER';
  durationMinutes: number;
  label: string;
}

export interface ShiftGanttTimelineProps {
  totalMinutes?: number;
  segments?: ShiftTimelineSegment[];
  shiftCode?: string;
}

export const ShiftGanttTimeline: React.FC<ShiftGanttTimelineProps> = ({
  totalMinutes = 480, // 8 hour shift
  segments,
  shiftCode = 'SHIFT 1 (DAY)'
}) => {
  const activeSegments: ShiftTimelineSegment[] = segments || [
    { state: 'RUN', durationMinutes: 195, label: 'Normal Production Placement' },
    { state: 'WAIT_PREV', durationMinutes: 28, label: 'Starvation (Wait Upstream Printer)' },
    { state: 'RUN', durationMinutes: 142, label: 'Normal Production Placement' },
    { state: 'STOP', durationMinutes: 18, label: 'Feeder Splicing & Cassette Alarm' },
    { state: 'WAIT_NEXT', durationMinutes: 14, label: 'Blockage (Wait Downstream Oven)' },
    { state: 'RUN', durationMinutes: 83, label: 'Normal Production Placement' }
  ];

  const totalSegmentMinutes = activeSegments.reduce((acc, s) => acc + s.durationMinutes, 0);

  const getSegmentStyle = (state: ShiftTimelineSegment['state']) => {
    switch (state) {
      case 'RUN':
        return { bg: 'bg-emerald-500 hover:bg-emerald-400', text: 'text-emerald-400', label: 'RUN' };
      case 'WAIT_PREV':
        return { bg: 'bg-amber-400 hover:bg-amber-300', text: 'text-amber-400', label: 'WAIT PREV' };
      case 'WAIT_NEXT':
        return { bg: 'bg-orange-500 hover:bg-orange-400', text: 'text-orange-400', label: 'WAIT NEXT' };
      case 'STOP':
        return { bg: 'bg-rose-500 hover:bg-rose-400', text: 'text-rose-400', label: 'STOP' };
      default:
        return { bg: 'bg-slate-600 hover:bg-slate-500', text: 'text-slate-400', label: 'IDLE' };
    }
  };

  const runMinutes = activeSegments.filter(s => s.state === 'RUN').reduce((a, s) => a + s.durationMinutes, 0);
  const waitMinutes = activeSegments.filter(s => s.state === 'WAIT_PREV' || s.state === 'WAIT_NEXT').reduce((a, s) => a + s.durationMinutes, 0);
  const stopMinutes = activeSegments.filter(s => s.state === 'STOP').reduce((a, s) => a + s.durationMinutes, 0);

  const runPct = (runMinutes / totalSegmentMinutes) * 100;
  const waitPct = (waitMinutes / totalSegmentMinutes) * 100;
  const stopPct = (stopMinutes / totalSegmentMinutes) * 100;

  return (
    <div 
      className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-3 text-slate-100 font-mono text-xs"
      style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.6)' }}
    >
      {/* Header Band */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="font-sans font-bold text-slate-100 uppercase tracking-wider text-[12px]">
            {shiftCode} · SHIFT RUN/DOWNTIME TIMELINE
          </span>
          <span className="text-slate-400 text-[10.5px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {Math.floor(totalSegmentMinutes / 60)}h {totalSegmentMinutes % 60}m Elapsed
          </span>
        </div>

        {/* Aggregate Breakdown Metrics */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
            <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_6px_#10B981]" />
            RUN: {Math.floor(runMinutes / 60)}h {runMinutes % 60}m ({runPct.toFixed(1)}%)
          </span>
          <span className="text-amber-400 font-bold flex items-center gap-1.5 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
            <span className="w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_6px_#F59E0B]" />
            WAIT: {waitMinutes}m ({waitPct.toFixed(1)}%)
          </span>
          <span className="text-rose-400 font-bold flex items-center gap-1.5 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
            <span className="w-2 h-2 bg-rose-400 rounded-full shadow-[0_0_6px_#EF4444]" />
            STOP: {stopMinutes}m ({stopPct.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Segmented Timeline Bar */}
      <div className="relative pt-1 pb-1">
        <div className="h-6 w-full bg-slate-900 rounded-[2px] overflow-hidden flex border border-slate-800">
          {activeSegments.map((segment, idx) => {
            const pct = (segment.durationMinutes / totalSegmentMinutes) * 100;
            const style = getSegmentStyle(segment.state);
            return (
              <div
                key={idx}
                style={{ width: `${pct}%` }}
                className={`h-full ${style.bg} border-r border-black/30 relative group cursor-help transition-opacity`}
              >
                {/* Tooltip */}
                <div className="hidden group-hover:block absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap bg-slate-900 border border-slate-700 text-slate-100 text-[11px] font-mono px-2.5 py-1 shadow-2xl pointer-events-none rounded-[2px]">
                  <strong className="text-white">{segment.label}</strong>: {segment.durationMinutes}m ({pct.toFixed(1)}%)
                </div>
              </div>
            );
          })}
        </div>

        {/* 2-Hour Time Markers with Ticks */}
        <div className="flex justify-between text-[10px] text-slate-400 px-0.5 mt-1.5 font-mono">
          <div className="flex flex-col items-start">
            <span className="w-px h-1 bg-slate-700 mb-0.5" />
            <span>00:00 (Start)</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-px h-1 bg-slate-700 mb-0.5" />
            <span>02:00</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-px h-1 bg-slate-700 mb-0.5" />
            <span>04:00 (Mid-Shift)</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-px h-1 bg-slate-700 mb-0.5" />
            <span>06:00</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="w-px h-1 bg-slate-700 mb-0.5" />
            <span>08:00 (Handover)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
