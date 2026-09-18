import React, { useState, useEffect } from 'react';
import { 
  Maximize2, Minimize2, Activity, Clock, ShieldCheck, 
  Layers, Cpu, Zap, AlertTriangle, RefreshCw
} from 'lucide-react';
import { AnimatedNumber } from '../common/AnimatedNumber';

export interface WallKioskDisplayProps {
  onExitKiosk: () => void;
}

export const WallKioskDisplay: React.FC<WallKioskDisplayProps> = ({ onExitKiosk }) => {
  const [currentTime, setCurrentTime] = useState<string>(() => new Date().toLocaleTimeString());
  const [pulseCount, setPulseCount] = useState<number>(4);
  const [activeLine, setActiveLine] = useState<'LINE_01' | 'LINE_02'>('LINE_01');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      setPulseCount(prev => (prev <= 1 ? 4 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[var(--mes-bg-canvas)] text-[var(--mes-text-primary)] p-6 sm:p-10 flex flex-col justify-between select-none font-sans overflow-hidden">
      {/* Top Header Bar: Cleanroom Identity & Huge Digital Clock */}
      <div className="flex items-center justify-between border-b border-[var(--mes-border-strong)] pb-6">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 rounded-full bg-[var(--mes-status-pass)] animate-ping" />
          <div>
            <div className="text-xs sm:text-sm font-mono tracking-widest text-[var(--mes-text-muted)] uppercase">
              i-MES 2.0 • SHOP FLOOR CONTROL ROOM ANDON WALL
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-[var(--mes-text-primary)] mt-1">
              {activeLine === 'LINE_01' ? 'SMT LINE 01 : FUJI NXT III M6' : 'SMT LINE 02 : FUJI AIMEX IIIc'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Giant Clock */}
          <div className="text-right font-mono">
            <span className="text-[11px] text-[var(--mes-text-muted)] uppercase tracking-wider block">Shift 1 (Day)</span>
            <div className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--mes-text-primary)] tabular-nums">
              {currentTime}
            </div>
          </div>

          {/* Exit Kiosk Button */}
          <button
            onClick={onExitKiosk}
            className="p-3 bg-[var(--mes-bg-well)] hover:bg-[var(--mes-bg-surface)] text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)] rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle)] transition-colors"
            title="Exit Wall Kiosk Mode (ESC)"
          >
            <Minimize2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Center Giant Status Banner */}
      <div 
        className="my-6 p-6 rounded-[var(--mes-radius)] border bg-[var(--mes-status-pass-muted)] border-[var(--mes-status-pass)] text-[var(--mes-status-pass)] flex items-center justify-between shadow-2xl"
      >
        <div className="flex items-center gap-6">
          <div className="w-6 h-6 rounded-full bg-[var(--mes-status-pass)] animate-pulse" />
          <div>
            <span className="text-sm font-mono tracking-widest uppercase opacity-80">
              ANDON BEACON STATUS: NORMAL (RUNNING)
            </span>
            <h2 className="text-2xl sm:text-5xl font-black font-mono tracking-tight text-[var(--mes-text-primary)] mt-1">
              ALL 45 FEEDER CASSETTES IN SPEC • 0 DEFECT LOCKS
            </h2>
          </div>
        </div>

        <div className="hidden lg:block text-right font-mono text-sm">
          <span className="text-[var(--mes-text-muted)] uppercase block text-xs">Active Recipe</span>
          <strong className="text-[var(--mes-text-primary)] text-lg">PROG-SM-METER-TOP-REV4</strong>
        </div>
      </div>

      {/* 5 Giant KPI Columns - Visible from 10+ meters */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Metric 1: OEE */}
        <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-5 sm:p-8 flex flex-col justify-between text-center shadow-lg">
          <span className="text-xs sm:text-sm font-mono text-[var(--mes-text-muted)] uppercase tracking-wider">
            Overall OEE
          </span>
          <div className="my-4">
            <span className="text-4xl sm:text-6xl font-black font-mono text-[var(--mes-accent-primary)] tabular-nums">
              <AnimatedNumber value={88.4} decimals={1} />
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[var(--mes-accent-primary)] ml-1">%</span>
          </div>
          <span className="text-xs font-mono text-[var(--mes-status-pass)] font-bold">Target: 85.0% (PASS)</span>
        </div>

        {/* Metric 2: Speed CPH */}
        <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-5 sm:p-8 flex flex-col justify-between text-center shadow-lg">
          <span className="text-xs sm:text-sm font-mono text-[var(--mes-text-muted)] uppercase tracking-wider">
            Placement Speed
          </span>
          <div className="my-4">
            <span className="text-4xl sm:text-6xl font-black font-mono text-[var(--mes-text-primary)] tabular-nums">
              <AnimatedNumber value={44820} />
            </span>
            <span className="text-sm sm:text-base font-bold font-mono text-[var(--mes-text-muted)] block">CPH</span>
          </div>
          <span className="text-xs font-mono text-[var(--mes-status-pass)] font-bold">99.6% Rated Speed</span>
        </div>

        {/* Metric 3: First Pass Yield */}
        <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-5 sm:p-8 flex flex-col justify-between text-center shadow-lg">
          <span className="text-xs sm:text-sm font-mono text-[var(--mes-text-muted)] uppercase tracking-wider">
            First Pass Yield
          </span>
          <div className="my-4">
            <span className="text-4xl sm:text-6xl font-black font-mono text-[var(--mes-status-pass)] tabular-nums">
              <AnimatedNumber value={98.4} decimals={1} />
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[var(--mes-status-pass)] ml-1">%</span>
          </div>
          <span className="text-xs font-mono text-[var(--mes-status-pass)] font-bold">Target: 98.0% (PASS)</span>
        </div>

        {/* Metric 4: Units Done */}
        <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-5 sm:p-8 flex flex-col justify-between text-center shadow-lg">
          <span className="text-xs sm:text-sm font-mono text-[var(--mes-text-muted)] uppercase tracking-wider">
            Completed Panels
          </span>
          <div className="my-4">
            <span className="text-4xl sm:text-6xl font-black font-mono text-[var(--mes-text-primary)] tabular-nums">
              <AnimatedNumber value={892} />
            </span>
            <span className="text-xs sm:text-sm font-bold font-mono text-[var(--mes-text-muted)] block">/ 1,200 Plan</span>
          </div>
          <span className="text-xs font-mono text-[var(--mes-accent-primary)] font-bold">74.3% Lot Complete</span>
        </div>

        {/* Metric 5: Component Drop */}
        <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-5 sm:p-8 flex flex-col justify-between text-center shadow-lg col-span-2 lg:col-span-1">
          <span className="text-xs sm:text-sm font-mono text-[var(--mes-text-muted)] uppercase tracking-wider">
            Nozzle Drop Rate
          </span>
          <div className="my-4">
            <span className="text-4xl sm:text-6xl font-black font-mono text-[var(--mes-text-primary)] tabular-nums">
              <AnimatedNumber value={288} />
            </span>
            <span className="text-xs sm:text-sm font-bold font-mono text-[var(--mes-text-muted)] block">PPM</span>
          </div>
          <span className="text-xs font-mono text-[var(--mes-status-pass)] font-bold">&lt; 310 PPM Spec (PASS)</span>
        </div>
      </div>

      {/* Bottom Kiosk Footer */}
      <div className="border-t border-[var(--mes-border-strong)] pt-4 flex items-center justify-between text-xs font-mono text-[var(--mes-text-muted)]">
        <div className="flex items-center gap-4">
          <span>CLEANROOM OT BUS: ACTIVE</span>
          <span>•</span>
          <span>POLL TICK: {pulseCount}s</span>
          <span>•</span>
          <button 
            onClick={() => setActiveLine(activeLine === 'LINE_01' ? 'LINE_02' : 'LINE_01')}
            className="text-[var(--mes-accent-primary)] hover:underline font-bold"
          >
            Switch to {activeLine === 'LINE_01' ? 'Line 02 (AIMEX IIIc)' : 'Line 01 (NXT III)'}
          </button>
        </div>

        <div>
          <span>i-MES 2.0 AUTOMATION • PRESS ESC OR CLICK ICON TO RETURN</span>
        </div>
      </div>
    </div>
  );
};
