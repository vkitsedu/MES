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
        return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: 'RUN' };
      case 'WAIT_PREV':
        return { bg: 'bg-amber-400', text: 'text-amber-400', label: 'WAIT PREV' };
      case 'WAIT_NEXT':
        return { bg: 'bg-orange-500', text: 'text-orange-400', label: 'WAIT NEXT' };
      case 'STOP':
        return { bg: 'bg-rose-500', text: 'text-rose-400', label: 'STOP' };
      default:
        return { bg: 'bg-slate-600', text: 'text-slate-400', label: 'IDLE' };
    }
  };

  const runMinutes = activeSegments.filter(s => s.state === 'RUN').reduce((a, s) => a + s.durationMinutes, 0);
  const waitMinutes = activeSegments.filter(s => s.state === 'WAIT_PREV' || s.state === 'WAIT_NEXT').reduce((a, s) => a + s.durationMinutes, 0);
  const stopMinutes = activeSegments.filter(s => s.state === 'STOP').reduce((a, s) => a + s.durationMinutes, 0);

  const runPct = (runMinutes / totalSegmentMinutes) * 100;
  const waitPct = (waitMinutes / totalSegmentMinutes) * 100;
  const stopPct = (stopMinutes / totalSegmentMinutes) * 100;

  return (
    <div className="bg-[#0E1422] border border-[#222F46] rounded-sm p-2 shadow-sm font-mono text-xs">
      {/* Header Band */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-[#1C273A] text-[10.5px]">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-white uppercase tracking-wider">
            {shiftCode} · SHIFT RUN/DOWNTIME TIMELINE
          </span>
          <span className="text-slate-500 text-[10px]">
            ({Math.floor(totalSegmentMinutes / 60)}h {totalSegmentMinutes % 60}m Elapsed)
          </span>
        </div>

        {/* Aggregate Breakdown Metrics */}
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-none inline-block" />
            RUN: {Math.floor(runMinutes / 60)}h {runMinutes % 60}m ({runPct.toFixed(1)}%)
          </span>
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 bg-amber-400 rounded-none inline-block" />
            WAIT: {waitMinutes}m ({waitPct.toFixed(1)}%)
          </span>
          <span className="text-rose-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 bg-rose-500 rounded-none inline-block" />
            STOP: {stopMinutes}m ({stopPct.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Segmented Timeline Bar */}
      <div className="relative pt-0.5 pb-1">
        <div className="h-5 w-full bg-[#070A10] rounded-none overflow-hidden flex border border-[#222F46]">
          {activeSegments.map((segment, idx) => {
            const pct = (segment.durationMinutes / totalSegmentMinutes) * 100;
            const style = getSegmentStyle(segment.state);
            return (
              <div
                key={idx}
                style={{ width: `${pct}%` }}
                className={`h-full ${style.bg} border-r border-[#0A0E17]/40 relative group cursor-help`}
                title={`${segment.label}: ${segment.durationMinutes}m (${pct.toFixed(1)}%)`}
              >
                <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap bg-[#0F172A] border border-slate-600 text-slate-100 text-[9.5px] font-mono px-2 py-0.5 shadow-md pointer-events-none">
                  {segment.label}: {segment.durationMinutes}m ({pct.toFixed(1)}%)
                </div>
              </div>
            );
          })}
        </div>

        {/* 2-Hour Time Markers */}
        <div className="flex justify-between text-[9px] text-slate-500 px-0.5 mt-0.5">
          <span>00:00 (Start)</span>
          <span>02:00</span>
          <span>04:00 (Mid-Shift)</span>
          <span>06:00</span>
          <span>08:00 (Handover)</span>
        </div>
      </div>
    </div>
  );
};
