import React from 'react';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { SmtMachineFlowItem } from '@mes/shared';

export interface SmtLineFlowStripProps {
  machines: SmtMachineFlowItem[];
  selectedMachineId?: string;
  onSelectMachine?: (machineId: string) => void;
  lineName?: string;
  targetCycleTimeSec?: number;
}

export const SmtLineFlowStrip: React.FC<SmtLineFlowStripProps> = ({
  machines,
  selectedMachineId,
  onSelectMachine,
  lineName = 'SMD_01 (FUJI NXT III M6)',
  targetCycleTimeSec = 18.0
}) => {
  const maxCycleTime = Math.max(...machines.map(m => m.cycleTimeSec || 0), 1);

  const getLampColors = (lamp: SmtMachineFlowItem['towerLamp']) => {
    switch (lamp) {
      case 'RUN':
        return {
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/50',
          text: 'text-emerald-400',
          topBar: 'bg-emerald-500',
          lampRed: 'bg-rose-950/30 opacity-40',
          lampAmber: 'bg-amber-950/30 opacity-40',
          lampGreen: 'bg-emerald-400 shadow-[0_0_8px_#10B981] opacity-100'
        };
      case 'WAIT':
        return {
          bg: 'bg-amber-950/40',
          border: 'border-amber-500/50',
          text: 'text-amber-400',
          topBar: 'bg-amber-500',
          lampRed: 'bg-rose-950/30 opacity-40',
          lampAmber: 'bg-amber-400 shadow-[0_0_8px_#F59E0B] opacity-100',
          lampGreen: 'bg-emerald-950/30 opacity-40'
        };
      case 'STOP':
        return {
          bg: 'bg-rose-950/50',
          border: 'border-rose-500/70',
          text: 'text-rose-400',
          topBar: 'bg-rose-500',
          lampRed: 'bg-rose-500 shadow-[0_0_10px_#EF4444] animate-pulse opacity-100',
          lampAmber: 'bg-amber-950/30 opacity-40',
          lampGreen: 'bg-emerald-950/30 opacity-40'
        };
      default:
        return {
          bg: 'bg-slate-900/40',
          border: 'border-slate-800',
          text: 'text-slate-400',
          topBar: 'bg-slate-700',
          lampRed: 'bg-rose-950/20 opacity-30',
          lampAmber: 'bg-amber-950/20 opacity-30',
          lampGreen: 'bg-emerald-950/20 opacity-30'
        };
    }
  };

  return (
    <div 
      className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] overflow-hidden"
      style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
    >
      {/* Header Band */}
      <div className="bg-[var(--mes-bg-well)] px-4 py-2 border-b border-[var(--mes-border-hairline)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--mes-status-pass)] animate-pulse" />
          <span className="font-bold text-[var(--mes-text-primary)] uppercase tracking-wide text-xs sm:text-[12.5px]">
            {lineName} · PHYSICAL EQUIPMENT FLOW & TOWER LAMPS
          </span>
          <span className="text-[11px] text-[var(--mes-text-muted)] bg-[var(--mes-bg-surface)] px-2 py-0.5 border border-[var(--mes-border-hairline)] rounded-[var(--mes-radius)] font-semibold">
            Takt Target: <strong className="text-[var(--mes-text-primary)]">{targetCycleTimeSec.toFixed(1)}s</strong>
          </span>
        </div>

        {/* Live Machine State Tallies */}
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
            <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_6px_#10B981]" />
            RUN: {machines.filter(m => m.towerLamp === 'RUN').length}
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
            <span className="w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_6px_#F59E0B]" />
            WAIT: {machines.filter(m => m.towerLamp === 'WAIT').length}
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 font-bold font-mono">
            <span className="w-2 h-2 bg-rose-400 rounded-full shadow-[0_0_6px_#EF4444]" />
            STOP: {machines.filter(m => m.towerLamp === 'STOP').length}
          </span>
        </div>
      </div>

      {/* Horizontal Conveyor Lane Flow Strip */}
      <div className="p-3 flex items-center gap-2 overflow-x-auto bg-[var(--mes-bg-canvas)] scrollbar-thin">
        {machines.map((machine, index) => {
          const colors = getLampColors(machine.towerLamp);
          const isSelected = selectedMachineId === machine.id;
          const isBottleneck = machine.cycleTimeSec > 0 && machine.cycleTimeSec === maxCycleTime && machine.cycleTimeSec > targetCycleTimeSec;

          return (
            <React.Fragment key={machine.id}>
              {/* Machine Card */}
              <button
                type="button"
                onClick={() => onSelectMachine?.(machine.id)}
                className={`flex flex-col text-left p-3 rounded-[var(--mes-radius)] border transition-all duration-150 min-w-[164px] max-w-[185px] cursor-pointer relative overflow-hidden group select-none ${
                  isSelected
                    ? 'bg-[var(--mes-accent-muted)] border-[var(--mes-accent-primary)] ring-2 ring-[var(--mes-accent-primary)] shadow-md'
                    : isBottleneck
                      ? 'bg-[var(--mes-bg-surface)] hover:bg-[var(--mes-bg-well)] border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : 'bg-[var(--mes-bg-surface)] hover:bg-[var(--mes-bg-well)] border-[var(--mes-border-subtle)] hover:border-[var(--mes-border-strong)]'
                }`}
              >
                {/* Top Status Color Bar */}
                <div className={`absolute top-0 inset-x-0 h-1 ${colors.topBar}`} />

                {/* Machine Name & Tower Lamp Bezel */}
                <div className="flex items-center justify-between gap-1.5 w-full mb-1.5 pt-0.5">
                  <span className="font-sans text-[13px] font-bold text-[var(--mes-text-primary)] truncate tracking-tight" title={machine.name}>
                    {machine.name}
                  </span>

                  {/* 3-Lamp Precision Optical Bezel */}
                  <div className="flex items-center gap-1 bg-[var(--mes-bg-well)] px-1.5 py-1 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)] shrink-0">
                    <span className={`w-2 h-2 rounded-full transition-all ${colors.lampRed}`} />
                    <span className={`w-2 h-2 rounded-full transition-all ${colors.lampAmber}`} />
                    <span className={`w-2 h-2 rounded-full transition-all ${colors.lampGreen}`} />
                  </div>
                </div>

                {/* Equipment Code & State Pill */}
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-mono text-[10.5px] font-semibold text-[var(--mes-text-secondary)] bg-[var(--mes-bg-well)] px-1.5 py-0.5 rounded border border-[var(--mes-border-hairline)] truncate max-w-[100px]">
                    {machine.equipmentCode}
                  </span>
                  <span className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase rounded-[var(--mes-radius)] border ${colors.bg} ${colors.text} ${colors.border}`}>
                    {machine.towerLamp}
                  </span>
                </div>

                {/* Telemetry Metrics: High-Contrast & Readable */}
                <div className="space-y-1 pt-2 border-t border-[var(--mes-border-hairline)] font-mono text-xs w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[var(--mes-text-muted)] font-medium">Cycle Time:</span>
                    <span className={`text-[13px] font-black tabular-nums ${
                      machine.cycleTimeSec > targetCycleTimeSec 
                        ? 'text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]' 
                        : 'text-emerald-400'
                    }`}>
                      {machine.cycleTimeSec > 0 ? `${machine.cycleTimeSec.toFixed(1)}s` : '—'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[var(--mes-text-muted)]">Stops:</span>
                    <span className="text-[var(--mes-text-secondary)] font-semibold tabular-nums">
                      {machine.stopCount}x ({machine.stopTimeMin.toFixed(1)}m)
                    </span>
                  </div>
                </div>

                {/* Pacing Bottleneck Sentinel Flag */}
                {isBottleneck && (
                  <div className="mt-2 w-full">
                    <span className="py-1 px-1 text-[9px] font-mono font-bold text-amber-300 bg-amber-950/70 border border-amber-500/60 rounded-[var(--mes-radius)] uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm">
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>LINE BOTTLENECK</span>
                    </span>
                  </div>
                )}
              </button>

              {/* Conveyor Flow Chevron */}
              {index < machines.length - 1 && (
                <div className="text-[var(--mes-text-dim)] shrink-0 px-0.5 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
