import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle, Barcode, CheckCircle2, Cpu, MessageSquare,
  Power, RefreshCw, Send, Shield, Truck, Wifi, XCircle, Zap
} from 'lucide-react';

interface TacticalOperatorKioskProps {
  onNavigateTab?: (tab: string) => void;
}

type SlotState = 'OK' | 'LOW' | 'CRITICAL' | 'EMPTY';

interface FeederSlot {
  id: number;
  partNumber: string;
  reels: number;
  maxReels: number;
  state: SlotState;
}

const generateSlots = (): FeederSlot[] =>
  Array.from({ length: 45 }, (_, i) => {
    const id = i + 1;
    const maxReels = 20;
    let reels = Math.floor(Math.random() * 20) + 1;
    let state: SlotState = 'OK';
    const lowSlots = new Set([4, 8, 15, 16, 21, 22]);
    const critSlots = new Set([8, 22]);
    const emptySlots = new Set([38, 40]);
    if (emptySlots.has(id)) { reels = 0; state = 'EMPTY'; }
    else if (critSlots.has(id)) { reels = 2; state = 'CRITICAL'; }
    else if (lowSlots.has(id)) { reels = Math.floor(Math.random() * 5) + 3; state = 'LOW'; }
    return {
      id,
      partNumber: state === 'EMPTY' ? '---' : `P-${id.toString().padStart(3,'0')}`,
      reels,
      maxReels,
      state
    };
  });

const SLOT_COLORS: Record<SlotState, string> = {
  OK:       'bg-emerald-900/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-800/50',
  LOW:      'bg-amber-900/40 border-amber-600/60 text-amber-300 hover:bg-amber-800/50',
  CRITICAL: 'bg-red-900/50 border-red-500/70 text-red-300 hover:bg-red-800/60',
  EMPTY:    'bg-gray-800/30 border-gray-700/30 text-gray-600',
};

const ACTION_TILES = [
  { icon: Barcode,       label: 'SCAN REEL BARCODE',     sub: 'Tap + scan', color: 'bg-cyan-900/40 border-cyan-600/60 text-cyan-300 hover:bg-cyan-800/50' },
  { icon: RefreshCw,     label: 'PURGE NOZZLE 02',       sub: 'Auto-cycle', color: 'bg-blue-900/40 border-blue-600/60 text-blue-300 hover:bg-blue-800/50' },
  { icon: CheckCircle2,  label: 'ACK SPI OFFSET',        sub: 'Confirm +8um', color: 'bg-violet-900/40 border-violet-600/60 text-violet-300 hover:bg-violet-800/50' },
  { icon: Shield,        label: 'REQUEST QC CHECK',      sub: 'Notify lead', color: 'bg-emerald-900/40 border-emerald-600/60 text-emerald-300 hover:bg-emerald-800/50' },
  { icon: MessageSquare, label: 'CALL SUPERVISOR',       sub: 'PA + badge', color: 'bg-gray-700/40 border-gray-500/60 text-gray-300 hover:bg-gray-600/50' },
];

export const TacticalOperatorKiosk: React.FC<TacticalOperatorKioskProps> = ({ onNavigateTab: _onNavigateTab }) => {
  const [slots] = useState<FeederSlot[]>(generateSlots);
  const [selectedSlot, setSelectedSlot] = useState<FeederSlot | null>(null);
  const [agvDispatched, setAgvDispatched] = useState(false);
  const [actionTapped, setActionTapped] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleDispatch = useCallback(() => {
    setAgvDispatched(true);
    setTimeout(() => setAgvDispatched(false), 4000);
  }, []);

  const handleAction = useCallback((label: string) => {
    setActionTapped(label);
    setTimeout(() => setActionTapped(null), 2000);
  }, []);

  const lowCount = slots.filter(s => s.state === 'LOW' || s.state === 'CRITICAL').length;
  const critCount = slots.filter(s => s.state === 'CRITICAL').length;

  return (
    <div className="flex flex-col h-full bg-[#070A10] text-gray-100 font-mono overflow-hidden select-none">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D121D] border-b border-[#1E2230] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-900/40 border border-cyan-600/50 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-black text-white tracking-wider">Badge: OP-8821 - VIPIN KUMAR - LINE LEAD</div>
            <div className="text-[10px] text-gray-500">PCB Recipe: [PROG-SM-METER-TOP-REV4]  |  Shift A - Day</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-emerald-400">LINE 01: RUNNING</div>
            <div className="text-[10px] text-gray-400">44,820 CPH  |  OEE 88.4%</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-mono text-cyan-300">{now.toLocaleTimeString('en-IN', { hour12: false })}</div>
            <div className="text-[9px] text-gray-500">{now.toLocaleDateString('en-IN')}</div>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-emerald-400">
            <Wifi className="w-3 h-3" />
            <span>OT LINK</span>
          </div>
        </div>
      </div>

      {(lowCount > 0) && (
        <div className="shrink-0 flex items-center gap-3 px-4 py-1.5 bg-amber-950/40 border-b border-amber-800/50">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-amber-300 text-xs font-bold">
            FEEDER ALERT: {critCount} CRITICAL + {lowCount - critCount} LOW slots require attention
          </span>
          <button onClick={handleDispatch} className="ml-auto px-3 py-1 text-[10px] font-bold rounded border border-amber-500 bg-amber-900/30 text-amber-300 hover:bg-amber-800/40 transition-colors flex items-center gap-1.5">
            <Truck className="w-3 h-3" />DISPATCH SPLICING AGV
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden min-h-0">
        <div className="flex-1 flex flex-col p-3 overflow-hidden min-h-0">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div className="text-[10px] font-bold text-cyan-300 tracking-wider uppercase">Interactive 45-Slot Feeder Rail Grid</div>
            <div className="flex items-center gap-2 text-[9px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-700 inline-block" />OK ({slots.filter(s => s.state === 'OK').length})</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-700 inline-block" />LOW ({slots.filter(s => s.state === 'LOW').length})</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-700 inline-block" />CRIT ({critCount})</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-gray-700 inline-block" />EMPTY ({slots.filter(s => s.state === 'EMPTY').length})</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(9, minmax(0, 1fr))' }}>
              {slots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(selectedSlot?.id === slot.id ? null : slot)}
                  className={`relative flex flex-col items-center justify-center rounded border p-1.5 transition-all cursor-pointer ${SLOT_COLORS[slot.state]} ${selectedSlot?.id === slot.id ? 'ring-2 ring-white/40 scale-105' : ''}`}
                  style={{ aspectRatio: '1' }}
                >
                  <span className="text-[9px] font-black leading-none">{slot.id.toString().padStart(2,'0')}</span>
                  {slot.state !== 'EMPTY' && (
                    <div className="w-full mt-0.5 h-1 rounded-full bg-black/30 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${slot.state === 'CRITICAL' ? 'bg-red-500' : slot.state === 'LOW' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${(slot.reels / slot.maxReels) * 100}%` }}
                      />
                    </div>
                  )}
                  {slot.state === 'CRITICAL' && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleDispatch}
            className={`mt-2 shrink-0 w-full py-4 text-base font-black rounded-lg border-2 transition-all ${
              agvDispatched
                ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300 animate-pulse'
                : 'bg-cyan-900/30 border-cyan-500 text-cyan-300 hover:bg-cyan-800/40 active:scale-[0.98]'
            }`}
          >
            {agvDispatched ? (
              <span className="flex items-center justify-center gap-2"><Truck className="w-5 h-5" />AGV-02 DISPATCHED — ETA 2m 14s</span>
            ) : (
              <span className="flex items-center justify-center gap-2"><Truck className="w-5 h-5" />DISPATCH SPLICING AGV</span>
            )}
          </button>
        </div>

        <div className="w-56 flex flex-col border-l border-[#1E2230] p-3 gap-2 overflow-y-auto">
          <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase shrink-0">Quick Actions</div>

          {ACTION_TILES.map(({ icon: Icon, label, sub, color }) => (
            <button
              key={label}
              onClick={() => handleAction(label)}
              className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg border font-bold transition-all active:scale-95 ${
                actionTapped === label ? 'bg-white/10 border-white/30 scale-95' : color
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] text-center leading-tight">{label}</span>
              <span className="text-[8px] opacity-60">{sub}</span>
              {actionTapped === label && (
                <span className="text-[9px] text-emerald-400 font-black">SENT</span>
              )}
            </button>
          ))}

          <div className="mt-auto shrink-0">
            <button className="w-full py-3 rounded-lg border-2 border-red-600 bg-red-950/60 text-red-400 font-black text-sm hover:bg-red-900/60 transition-all active:scale-95 flex items-center justify-center gap-2">
              <Power className="w-5 h-5" />EMERGENCY E-STOP
            </button>
          </div>
        </div>
      </div>

      {selectedSlot && (
        <div className="shrink-0 border-t border-[#1E2230] bg-[#0D121D] px-4 py-2.5 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${selectedSlot.state === 'CRITICAL' ? 'text-red-400' : selectedSlot.state === 'LOW' ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span className="text-sm font-bold text-white">SLOT {selectedSlot.id.toString().padStart(2,'0')}</span>
            <span className={`text-xs px-2 py-0.5 rounded border font-bold ${SLOT_COLORS[selectedSlot.state]}`}>{selectedSlot.state}</span>
          </div>
          <div className="text-xs text-gray-400">Part: <span className="text-white font-bold">{selectedSlot.partNumber}</span></div>
          <div className="text-xs text-gray-400">Stock: <span className={`font-bold ${selectedSlot.state === 'CRITICAL' ? 'text-red-400' : selectedSlot.state === 'LOW' ? 'text-amber-400' : 'text-emerald-400'}`}>{selectedSlot.reels} / {selectedSlot.maxReels} reels</span></div>
          <div className="ml-auto flex items-center gap-2">
            {(selectedSlot.state === 'LOW' || selectedSlot.state === 'CRITICAL') && (
              <button onClick={handleDispatch} className="px-3 py-1.5 text-xs font-bold rounded border border-cyan-600 bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800/40 transition-colors flex items-center gap-1.5">
                <Send className="w-3 h-3" />DISPATCH AGV TO SLOT {selectedSlot.id}
              </button>
            )}
            <button onClick={() => setSelectedSlot(null)} className="px-2 py-1.5 text-xs rounded border border-[#1E2230] text-gray-500 hover:bg-[#1E2230] transition-colors">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!selectedSlot && (
        <div className="shrink-0 border-t border-[#1E2230] bg-[#0D121D] px-4 py-1.5 flex items-center gap-4 text-[9px]">
          <span className="text-gray-500">Tap any feeder slot to inspect and dispatch</span>
          <span className="ml-auto text-gray-600">i-MES 2.0 Tactical Operator Kiosk — LINE LEAD VIEW — Touch-optimized</span>
        </div>
      )}
    </div>
  );
};

export default TacticalOperatorKiosk;