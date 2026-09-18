import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
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
          topBar: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]',
          badge: 'bg-emerald-950/70 text-emerald-400 border-emerald-500/60',
          lampRed: 'bg-rose-950/30 opacity-30',
          lampAmber: 'bg-amber-950/30 opacity-30',
          lampGreen: 'bg-emerald-400 shadow-[0_0_10px_#10B981] opacity-100 ring-1 ring-emerald-300'
        };
      case 'WAIT':
        return {
          topBar: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]',
          badge: 'bg-amber-950/70 text-amber-400 border-amber-500/60',
          lampRed: 'bg-rose-950/30 opacity-30',
          lampAmber: 'bg-amber-400 shadow-[0_0_10px_#F59E0B] opacity-100 ring-1 ring-amber-300',
          lampGreen: 'bg-emerald-950/30 opacity-30'
        };
      case 'STOP':
        return {
          topBar: 'bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]',
          badge: 'bg-rose-950/80 text-rose-400 border-rose-500/70 animate-pulse',
          lampRed: 'bg-rose-500 shadow-[0_0_12px_#EF4444] opacity-100 ring-1 ring-rose-400 animate-pulse',
          lampAmber: 'bg-amber-950/30 opacity-30',
          lampGreen: 'bg-emerald-950/30 opacity-30'
        };
      default:
        return {
          topBar: 'bg-slate-700',
          badge: 'bg-slate-900/60 text-slate-400 border-slate-700/60',
          lampRed: 'bg-rose-950/20 opacity-20',
          lampAmber: 'bg-amber-950/20 opacity-20',
          lampGreen: 'bg-emerald-950/20 opacity-20'
        };
    }
  };

  const bottleneckMachine = machines.find(
    m => m.cycleTimeSec > 0 && m.cycleTimeSec === maxCycleTime && m.cycleTimeSec > targetCycleTimeSec
  );

  return (
    <div 
      className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] overflow-hidden text-slate-100"
      style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.6)' }}
    >
      {/* Precision Header Control Band */}
      <div className="bg-slate-900/90 px-3.5 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-sans font-bold text-slate-100 uppercase tracking-wider text-[12px]">
            {lineName}
          </span>
          <span className="text-[10.5px] font-mono text-slate-400 bg-slate-800/90 px-2 py-0.5 border border-slate-700/70 rounded-[var(--mes-radius)] font-semibold">
            Takt Target: <strong className="text-emerald-400 font-bold">{targetCycleTimeSec.toFixed(1)}s</strong>
          </span>
          {bottleneckMachine && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10.5px] font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 border border-amber-500/40 rounded-[var(--mes-radius)]">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Bottleneck: {bottleneckMachine.equipmentCode} ({bottleneckMachine.cycleTimeSec.toFixed(1)}s)
            </span>
          )}
        </div>

        {/* Live Machine State Tallies & Pacing Readout */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
            <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_6px_#10B981]" />
            RUN: {machines.filter(m => m.towerLamp === 'RUN').length}
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
            <span className="w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_6px_#F59E0B]" />
            WAIT: {machines.filter(m => m.towerLamp === 'WAIT').length}
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 font-bold bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
            <span className="w-2 h-2 bg-rose-400 rounded-full shadow-[0_0_6px_#EF4444]" />
            STOP: {machines.filter(m => m.towerLamp === 'STOP').length}
          </span>
        </div>
      </div>

      {/* Docked Modular Equipment Bay: Seamless Chassis with Integrated Conveyor Rail */}
      <div className="p-2 bg-black/40 overflow-x-auto scrollbar-thin">
        <div className="flex items-stretch gap-1.5 min-w-max">
          {machines.map((machine, index) => {
            const colors = getLampColors(machine.towerLamp);
            const isSelected = selectedMachineId === machine.id;
            const isBottleneck = machine.cycleTimeSec > 0 && machine.cycleTimeSec === maxCycleTime && machine.cycleTimeSec > targetCycleTimeSec;
            const cycleDelta = machine.cycleTimeSec > 0 ? machine.cycleTimeSec - targetCycleTimeSec : 0;
            const isOverTakt = machine.cycleTimeSec > targetCycleTimeSec;

            return (
              <button
                key={machine.id}
                type="button"
                onClick={() => onSelectMachine?.(machine.id)}
                className={`flex flex-col justify-between text-left p-2.5 rounded-[var(--mes-radius)] border transition-all duration-150 w-[184px] shrink-0 cursor-pointer relative overflow-hidden group select-none ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/50 shadow-[0_0_16px_rgba(6,182,212,0.25)]'
                    : isBottleneck
                      ? 'bg-slate-900/95 hover:bg-slate-900 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Precision Top Edge Status Laser Bar */}
                <div className={`absolute top-0 inset-x-0 h-1 ${colors.topBar}`} />

                {/* Card Top: Hardware Code & 3-Lamp Tower Lamp Optical Bezel */}
                <div className="w-full">
                  <div className="flex items-center justify-between w-full mb-1.5 pt-0.5">
                    {/* Hardware Code & Station Sequence */}
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-800/90 px-1.5 py-0.5 rounded-[2px] border border-slate-700/60">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-slate-200 tracking-tight">
                        {machine.equipmentCode}
                      </span>
                    </div>

                    {/* 3-Lamp Optical Tower Lamp & Status State Badge */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5 bg-black/60 px-1 py-0.5 rounded-[2px] border border-slate-800 shrink-0">
                        <span className={`w-1.5 h-1.5 rounded-full transition-all ${colors.lampRed}`} />
                        <span className={`w-1.5 h-1.5 rounded-full transition-all ${colors.lampAmber}`} />
                        <span className={`w-1.5 h-1.5 rounded-full transition-all ${colors.lampGreen}`} />
                      </div>
                      <span className={`px-1.5 py-0.5 font-mono text-[9.5px] font-extrabold uppercase rounded-[2px] border ${colors.badge}`}>
                        {machine.towerLamp}
                      </span>
                    </div>
                  </div>

                  {/* Station Name - 100% Full Width, ZERO Truncation */}
                  <div className="w-full mb-2">
                    <div 
                      className="font-sans text-[13px] font-bold text-slate-100 leading-snug break-words"
                      title={machine.name}
                    >
                      {machine.name}
                    </div>
                    <div className="text-[9.5px] font-mono text-slate-400 mt-0.5 flex items-center gap-1">
                      <span className="text-slate-500">TYPE:</span>
                      <span className="text-slate-300 font-semibold">{machine.type}</span>
                    </div>
                  </div>
                </div>

                {/* Telemetry & Bottom Rail */}
                <div className="w-full">
                  {/* Telemetry Readout Grid */}
                  <div className="pt-2 border-t border-slate-800/80 font-mono text-xs w-full space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Cycle Time</span>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-[13.5px] font-black tabular-nums ${
                          isOverTakt 
                            ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]' 
                            : 'text-emerald-400'
                        }`}>
                          {machine.cycleTimeSec > 0 ? `${machine.cycleTimeSec.toFixed(1)}s` : '—'}
                        </span>
                        {machine.cycleTimeSec > 0 && (
                          <span className={`text-[9.5px] font-bold ${isOverTakt ? 'text-amber-400' : 'text-emerald-500'}`}>
                            {cycleDelta > 0 ? `+${cycleDelta.toFixed(1)}s` : `${cycleDelta.toFixed(1)}s`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="text-slate-400 uppercase tracking-wider">Stops</span>
                      <span className="text-slate-300 font-bold tabular-nums">
                        {machine.stopCount}x <span className="text-slate-500 font-normal">({machine.stopTimeMin.toFixed(1)}m)</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottleneck Sentinel Banner or Normal Pacing */}
                  {isBottleneck ? (
                    <div className="mt-2 w-full">
                      <div className="py-1 px-1.5 text-[9.5px] font-mono font-black text-amber-300 bg-amber-950/90 border border-amber-500/80 rounded-[2px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>LINE BOTTLENECK</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 w-full">
                      <div className="py-0.5 px-1.5 text-[9px] font-mono font-medium text-slate-400 bg-slate-950/70 border border-slate-800/60 rounded-[2px] flex items-center justify-between">
                        <span className="text-slate-500">PACING</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          BALANCED
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Integrated SMEMA Hardware Conveyor Rail Line */}
                  <div className="mt-2 pt-1 border-t border-slate-800/50 flex items-center justify-between text-[8.5px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${machine.towerLamp === 'RUN' ? 'bg-emerald-500 shadow-[0_0_4px_#10B981]' : 'bg-slate-600'}`} />
                      SMEMA
                    </span>
                    <span className="text-slate-600 tracking-widest flex items-center">
                      <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Integrated Conveyor Rail Baseline Strip */}
      <div className="bg-slate-900/70 px-3.5 py-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-0.5 bg-cyan-400 inline-block" />
          <span className="uppercase tracking-wider font-semibold text-slate-300">
            Hermes / SMEMA Dual-Lane Synchronized Conveyor Rail
          </span>
          <span className="text-slate-500 hidden md:inline">· Direction: L ▶ R (Board Travel)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Line Stations: <strong className="text-slate-200">{machines.length} Units</strong>
          </span>
          <span className="text-slate-400">
            Bottleneck Pacing: <strong className={bottleneckMachine ? 'text-amber-400' : 'text-emerald-400'}>
              {maxCycleTime.toFixed(1)}s
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};
