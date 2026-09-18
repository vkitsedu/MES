import React, { useState } from 'react';
import { 
  Play, Pause, AlertTriangle, PhoneCall, CheckCircle2, 
  Layers, Cpu, Clock, RefreshCw, Sparkles, ShieldCheck, 
  HelpCircle, ChevronRight, Volume2
} from 'lucide-react';
import { AnimatedNumber } from '../common/AnimatedNumber';

export const OperatorKioskView: React.FC = () => {
  const [lineState, setLineState] = useState<'RUNNING' | 'PAUSED' | 'HOLD'>('RUNNING');
  const [alarmAcked, setAlarmAcked] = useState<boolean>(false);
  const [techCalled, setTechCalled] = useState<boolean>(false);
  const [actualPanels, setActualPanels] = useState<number>(892);
  const targetPanels = 1200;

  const handleCallTech = () => {
    setTechCalled(true);
    setTimeout(() => setTechCalled(false), 5000);
  };

  const pctComplete = Math.min(100, Math.round((actualPanels / targetPanels) * 100));

  return (
    <div className="space-y-3 font-sans max-w-7xl mx-auto p-1 sm:p-2">
      {/* Giant Status Banner - 3-Second Glanceability with Cleanroom High-Contrast */}
      <div 
        className={`p-4 sm:p-5 rounded-[var(--mes-radius)] border border-l-4 flex flex-wrap items-center justify-between gap-4 transition-all relative overflow-hidden ${
          lineState === 'RUNNING'
            ? 'bg-gradient-to-r from-[var(--mes-status-pass-muted)] via-[var(--mes-bg-surface)] to-[var(--mes-bg-surface)] border-[var(--mes-border-subtle)] border-l-[var(--mes-status-pass)]'
            : lineState === 'PAUSED'
              ? 'bg-gradient-to-r from-[var(--mes-status-warn-muted)] via-[var(--mes-bg-surface)] to-[var(--mes-bg-surface)] border-[var(--mes-border-subtle)] border-l-[var(--mes-status-warn)]'
              : 'bg-gradient-to-r from-[var(--mes-status-halt-muted)] via-[var(--mes-bg-surface)] to-[var(--mes-bg-surface)] border-[var(--mes-border-subtle)] border-l-[var(--mes-status-halt)]'
        }`}
        style={{ boxShadow: 'var(--mes-shadow-elevated)' }}
      >
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-subtle)]">
            <span 
              className={`w-3.5 h-3.5 rounded-full animate-ping absolute opacity-75 ${
                lineState === 'RUNNING' 
                  ? 'bg-[var(--mes-status-pass)]' 
                  : lineState === 'PAUSED' 
                    ? 'bg-[var(--mes-status-warn)]' 
                    : 'bg-[var(--mes-status-halt)]'
              }`} 
            />
            <span 
              className={`w-2.5 h-2.5 rounded-full relative shadow-[0_0_10px_currentColor] ${
                lineState === 'RUNNING' 
                  ? 'bg-[var(--mes-status-pass)] text-[var(--mes-status-pass)]' 
                  : lineState === 'PAUSED' 
                    ? 'bg-[var(--mes-status-warn)] text-[var(--mes-status-warn)]' 
                    : 'bg-[var(--mes-status-halt)] text-[var(--mes-status-halt)]'
              }`} 
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase font-semibold">
              <span className={
                lineState === 'RUNNING' 
                  ? 'text-[var(--mes-status-pass)]' 
                  : lineState === 'PAUSED' 
                    ? 'text-[var(--mes-status-warn)]' 
                    : 'text-[var(--mes-status-halt)]'
              }>
                SMD_01 MACHINE STATE
              </span>
              <span className="text-[var(--mes-border-strong)]">•</span>
              <span className="text-[var(--mes-text-secondary)]">FUJI NXT III M6</span>
              <span className="text-[var(--mes-border-strong)]">•</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase border ${
                lineState === 'RUNNING'
                  ? 'bg-[var(--mes-status-pass-muted)] text-[var(--mes-status-pass)] border-[var(--mes-status-pass)]'
                  : lineState === 'PAUSED'
                    ? 'bg-[var(--mes-status-warn-muted)] text-[var(--mes-status-warn)] border-[var(--mes-status-warn)]'
                    : 'bg-[var(--mes-status-halt-muted)] text-[var(--mes-status-halt)] border-[var(--mes-status-halt)]'
              }`}>
                {lineState === 'RUNNING' ? 'SEMI E10: PRD' : lineState === 'PAUSED' ? 'SEMI E10: SBY' : 'SEMI E10: UDT'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-[var(--mes-text-primary)] mt-0.5">
              {lineState === 'RUNNING' 
                ? 'Normal Operation — Placing at Rated Speed' 
                : lineState === 'PAUSED' 
                  ? 'Feeder Reel Depletion Pause — Splicing Needed' 
                  : 'Maintenance Interlock Active — Machine Halted'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={() => setLineState(lineState === 'RUNNING' ? 'PAUSED' : 'RUNNING')}
            className={`px-4 py-2.5 rounded-[var(--mes-radius)] text-xs font-bold flex items-center gap-2 border transition-all active:scale-95 cursor-pointer ${
              lineState === 'RUNNING'
                ? 'bg-[var(--mes-bg-well)] hover:bg-[var(--mes-bg-surface)] text-[var(--mes-text-primary)] hover:text-amber-400 border-[var(--mes-border-strong)] hover:border-amber-500/50 shadow-sm'
                : 'bg-[var(--mes-status-pass)] text-white hover:opacity-90 border-transparent shadow-[0_0_15px_rgba(16,185,129,0.35)]'
            }`}
          >
            {lineState === 'RUNNING' ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 fill-white text-white" />}
            <span>{lineState === 'RUNNING' ? 'PAUSE FEEDER' : 'RESUME RUN'}</span>
          </button>
        </div>
      </div>

      {/* Target vs Actual Progress Block (Finger-Friendly Touch Target Scale) */}
      <div 
        className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-4 sm:p-6"
        style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-mono text-[var(--mes-text-muted)] uppercase tracking-wider">
              ACTIVE WORK ORDER: <strong className="text-[var(--mes-text-primary)]">WO-2026-IMES-01</strong>
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[var(--mes-text-primary)] mt-0.5">
              Smart Meter Mainboard REV 4 • Top Side Placement
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-[var(--mes-text-muted)] uppercase">Completion</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[var(--mes-accent-primary)] tabular-nums">
              {pctComplete}%
            </div>
          </div>
        </div>

        {/* Huge High-Visibility Progress Bar */}
        <div className="w-full bg-[var(--mes-bg-well)] h-5 rounded-[var(--mes-radius)] overflow-hidden p-0.5 border border-[var(--mes-border-subtle)]">
          <div 
            className="h-full bg-gradient-to-r from-[var(--mes-accent-primary)] to-[var(--mes-status-pass)] rounded-[1px] transition-all duration-500"
            style={{ width: `${pctComplete}%` }}
          />
        </div>

        {/* 3 Metric Giant Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] p-3 rounded-[var(--mes-radius)]">
            <span className="text-[10.5px] font-mono text-[var(--mes-text-muted)] uppercase block">Actual Completed</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--mes-status-pass)] mt-0.5">
              <AnimatedNumber value={actualPanels} />
              <span className="text-xs text-[var(--mes-text-muted)] ml-1 font-normal">panels</span>
            </div>
          </div>

          <div className="bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] p-3 rounded-[var(--mes-radius)]">
            <span className="text-[10.5px] font-mono text-[var(--mes-text-muted)] uppercase block">Batch Target</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--mes-text-primary)] mt-0.5">
              <AnimatedNumber value={targetPanels} />
              <span className="text-xs text-[var(--mes-text-muted)] ml-1 font-normal">panels</span>
            </div>
          </div>

          <div className="bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] p-3 rounded-[var(--mes-radius)]">
            <span className="text-[10.5px] font-mono text-[var(--mes-text-muted)] uppercase block">Remaining To Run</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--mes-text-secondary)] mt-0.5">
              <AnimatedNumber value={Math.max(0, targetPanels - actualPanels)} />
              <span className="text-xs text-[var(--mes-text-muted)] ml-1 font-normal">panels</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Shop-Floor Essential Tiles: Speed, Yield, Drop, Solder */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10.5px] font-mono text-[var(--mes-text-muted)] uppercase">
            <span>Placement Rate</span>
            <span className="text-[var(--mes-status-pass)] font-bold">99.6%</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--mes-text-primary)] my-1">
            <AnimatedNumber value={44820} />
            <span className="text-xs text-[var(--mes-text-muted)] ml-1 font-normal">CPH</span>
          </div>
          <span className="text-[10px] text-[var(--mes-text-muted)]">Target: 45,000 CPH</span>
        </div>

        <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10.5px] font-mono text-[var(--mes-text-muted)] uppercase">
            <span>First Pass Yield</span>
            <span className="text-[var(--mes-status-pass)] font-bold">PASS</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--mes-status-pass)] my-1">
            <AnimatedNumber value={98.4} decimals={1} />
            <span className="text-xs text-[var(--mes-text-muted)] ml-1 font-normal">%</span>
          </div>
          <span className="text-[10px] text-[var(--mes-text-muted)]">0 Critical Defects Today</span>
        </div>

        <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10.5px] font-mono text-[var(--mes-text-muted)] uppercase">
            <span>Nozzle Drop Rate</span>
            <span className="text-[var(--mes-status-pass)] font-bold">&lt;310 PPM</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--mes-text-primary)] my-1">
            <AnimatedNumber value={288} />
            <span className="text-xs text-[var(--mes-text-muted)] ml-1 font-normal">PPM</span>
          </div>
          <span className="text-[10px] text-[var(--mes-text-muted)]">Slot 04 Vacuum Clean</span>
        </div>

        <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10.5px] font-mono text-[var(--mes-text-muted)] uppercase">
            <span>Solder Thaw Window</span>
            <span className="text-[var(--mes-accent-primary)] font-bold">STABLE</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--mes-accent-primary)] my-1">
            4h 12m
          </div>
          <span className="text-[10px] text-[var(--mes-text-muted)]">Lot: SAC305-J09</span>
        </div>
      </div>

      {/* Operator Large Touchscreen Action Bar (High Tactile Affordance) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <button
          onClick={handleCallTech}
          className={`p-4 rounded-[var(--mes-radius)] border text-left font-mono transition-all flex items-center justify-between ${
            techCalled
              ? 'bg-[var(--mes-accent-muted)] border-[var(--mes-accent-primary)] text-[var(--mes-accent-primary)] shadow-lg'
              : 'bg-[var(--mes-bg-surface)] hover:bg-[var(--mes-bg-well)] border-[var(--mes-border-strong)] text-[var(--mes-text-primary)]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-[var(--mes-accent-primary)]">
              <PhoneCall className="w-4 h-4" />
              <span>{techCalled ? 'LINE LEAD DISPATCHED' : 'CALL LINE LEAD / TECH'}</span>
            </div>
            <p className="text-[11px] text-[var(--mes-text-muted)] mt-1 font-sans">
              {techCalled ? 'Signal sent to shift supervisor badge' : 'Requests assistance at Fuji NXT III Mod 1'}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--mes-text-dim)]" />
        </button>

        <button
          onClick={() => setAlarmAcked(!alarmAcked)}
          className={`p-4 rounded-[var(--mes-radius)] border text-left font-mono transition-all flex items-center justify-between ${
            alarmAcked
              ? 'bg-[var(--mes-status-pass-muted)] border-[var(--mes-status-pass)] text-[var(--mes-status-pass)]'
              : 'bg-[var(--mes-bg-surface)] hover:bg-[var(--mes-bg-well)] border-[var(--mes-border-strong)] text-[var(--mes-text-primary)]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-[var(--mes-status-pass)]">
              <CheckCircle2 className="w-4 h-4" />
              <span>{alarmAcked ? 'ALARMS ACKNOWLEDGED' : 'ACKNOWLEDGE ALARMS'}</span>
            </div>
            <p className="text-[11px] text-[var(--mes-text-muted)] mt-1 font-sans">
              Silences audio and logs operator badge ID
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--mes-text-dim)]" />
        </button>

        <button
          onClick={() => setActualPanels(prev => prev + 1)}
          className="p-4 bg-[var(--mes-bg-surface)] hover:bg-[var(--mes-bg-well)] border border-[var(--mes-border-strong)] hover:border-[var(--mes-accent-primary)] rounded-[var(--mes-radius)] text-left font-mono transition-all flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-[var(--mes-text-primary)]">
              <RefreshCw className="w-4 h-4 text-[var(--mes-accent-primary)]" />
              <span>RECORD MANUAL PANEL INSPECT</span>
            </div>
            <p className="text-[11px] text-[var(--mes-text-muted)] mt-1 font-sans">
              Increments completed count (+1 panel)
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--mes-text-dim)]" />
        </button>
      </div>
    </div>
  );
};
