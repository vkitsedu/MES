import React from 'react';
import { ArrowRight, AlertTriangle } from 'lucide-react';
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
  lineName = 'SMD_02 (FUJI NXT III M6)',
  targetCycleTimeSec = 18.0
}) => {
  const maxCycleTime = Math.max(...machines.map(m => m.cycleTimeSec || 0), 1);

  const getLampColors = (lamp: SmtMachineFlowItem['towerLamp']) => {
    switch (lamp) {
      case 'RUN':
        return {
          bg: 'bg-emerald-950/20',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          lampRed: 'bg-rose-950/40',
          lampAmber: 'bg-amber-950/40',
          lampGreen: 'bg-emerald-400 shadow-[0_0_6px_#10B981]'
        };
      case 'WAIT':
        return {
          bg: 'bg-amber-950/20',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          lampRed: 'bg-rose-950/40',
          lampAmber: 'bg-amber-400 shadow-[0_0_6px_#F59E0B]',
          lampGreen: 'bg-emerald-950/40'
        };
      case 'STOP':
        return {
          bg: 'bg-rose-950/30',
          border: 'border-rose-500/60',
          text: 'text-rose-400',
          lampRed: 'bg-rose-500 shadow-[0_0_8px_#EF4444] animate-pulse',
          lampAmber: 'bg-amber-950/40',
          lampGreen: 'bg-emerald-950/40'
        };
      default:
        return {
          bg: 'bg-slate-900/40',
          border: 'border-slate-800',
          text: 'text-slate-500',
          lampRed: 'bg-rose-950/20',
          lampAmber: 'bg-amber-950/20',
          lampGreen: 'bg-emerald-950/20'
        };
    }
  };

  return (
    <div 
      className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] overflow-hidden"
      style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
    >
      {/* Header Band */}
      <div className="bg-[var(--mes-bg-well)] px-3 py-1.5 border-b border-[var(--mes-border-hairline)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--mes-status-pass)]" />
          <span className="font-bold text-[var(--mes-text-primary)] uppercase tracking-wide">
            {lineName} · PHYSICAL EQUIPMENT FLOW & TOWER LAMPS
          </span>
          <span className="text-[10px] text-[var(--mes-text-muted)] bg-[var(--mes-bg-surface)] px-1.5 py-0.5 border border-[var(--mes-border-hairline)] rounded-[var(--mes-radius)]">
            Takt Target: {targetCycleTimeSec.toFixed(1)}s
          </span>
        </div>

        {/* Live Machine State Tallies */}
        <div className="flex items-center gap-4 text-[10.5px]">
          <span className="flex items-center gap-1.5 text-[var(--mes-status-pass)] font-bold">
            <span className="w-2 h-2 bg-[var(--mes-status-pass)] rounded-[1px]" />
            RUN: {machines.filter(m => m.towerLamp === 'RUN').length}
          </span>
          <span className="flex items-center gap-1.5 text-[var(--mes-status-warn)] font-bold">
            <span className="w-2 h-2 bg-[var(--mes-status-warn)] rounded-[1px]" />
            WAIT: {machines.filter(m => m.towerLamp === 'WAIT').length}
          </span>
          <span className="flex items-center gap-1.5 text-[var(--mes-status-halt)] font-bold">
            <span className="w-2 h-2 bg-[var(--mes-status-halt)] rounded-[1px]" />
            STOP: {machines.filter(m => m.towerLamp === 'STOP').length}
          </span>
        </div>
      </div>

      {/* Horizontal Strip */}
      <div className="p-2 flex items-center gap-1 overflow-x-auto bg-[var(--mes-bg-canvas)] scrollbar-thin">
        {machines.map((machine, index) => {
          const colors = getLampColors(machine.towerLamp);
          const isSelected = selectedMachineId === machine.id;
          const isBottleneck = machine.cycleTimeSec > 0 && machine.cycleTimeSec === maxCycleTime && machine.cycleTimeSec > targetCycleTimeSec;

          return (
            <React.Fragment key={machine.id}>
              {/* Machine Tile */}
              <button
                type="button"
                onClick={() => onSelectMachine?.(machine.id)}
                className={`flex flex-col text-left p-2 rounded-[var(--mes-radius)] border transition-all duration-100 min-w-[126px] cursor-pointer relative ${
                  isSelected
                    ? 'bg-[var(--mes-accent-muted)] border-[var(--mes-accent-primary)] ring-1 ring-[var(--mes-accent-primary)]'
                    : 'bg-[var(--mes-bg-surface)] hover:bg-[var(--mes-bg-well)] border-[var(--mes-border-subtle)]'
                }`}
              >
                {/* Machine Name & Tower Lamp */}
                <div className="flex items-center justify-between gap-1 w-full mb-1">
                  <span className="font-mono text-[11px] font-bold text-[var(--mes-text-primary)] truncate">
                    {machine.name}
                  </span>

                  {/* Discrete 3-Lamp Array */}
                  <div className="flex items-center gap-0.5 bg-[var(--mes-bg-well)] p-1 rounded-[1px] border border-[var(--mes-border-hairline)]">
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.lampRed}`} />
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.lampAmber}`} />
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.lampGreen}`} />
                  </div>
                </div>

                {/* Subtitle & State Badge */}
                <div className="flex items-center justify-between w-full mb-1.5 font-mono text-[9px]">
                  <span className="text-[var(--mes-text-muted)] truncate">{machine.equipmentCode}</span>
                  <span className={`px-1 py-0.2 font-bold uppercase rounded-[1px] border ${colors.bg} ${colors.text} ${colors.border}`}>
                    {machine.towerLamp}
                  </span>
                </div>

                {/* Telemetry Metrics */}
                <div className="space-y-0.5 pt-1 border-t border-[var(--mes-border-hairline)] font-mono text-[9.5px] w-full">
                  <div className="flex items-center justify-between text-[var(--mes-text-secondary)]">
                    <span className="text-[var(--mes-text-muted)]">C/Time:</span>
                    <span className={`font-bold tabular-nums ${machine.cycleTimeSec > targetCycleTimeSec ? 'text-[var(--mes-status-warn)]' : 'text-[var(--mes-text-primary)]'}`}>
                      {machine.cycleTimeSec > 0 ? `${machine.cycleTimeSec.toFixed(1)}s` : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--mes-text-muted)] text-[9px]">
                    <span>Stops:</span>
                    <span className="tabular-nums">{machine.stopCount}x ({machine.stopTimeMin.toFixed(1)}m)</span>
                  </div>
                </div>

                {/* Bottleneck Marker */}
                {isBottleneck && (
                  <div className="mt-1 w-full text-center">
                    <span className="px-1 py-0.2 text-[8px] font-mono font-bold text-[var(--mes-status-warn)] bg-[var(--mes-status-warn-muted)] border border-[var(--mes-status-warn)] rounded-[1px] uppercase tracking-wider block">
                      LOB BOTTLENECK
                    </span>
                  </div>
                )}
              </button>

              {/* Arrow Connector */}
              {index < machines.length - 1 && (
                <div className="text-[var(--mes-text-muted)] px-0.5 shrink-0">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
