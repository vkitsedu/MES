// apps/web/src/components/traceability/PanelUnitMatrix.tsx
import React from 'react';
import { Cpu, CheckCircle2, AlertOctagon, Wrench, Slash, Layers } from 'lucide-react';

interface PanelUnitMatrixProps {
  panelBarcode: string;
  checkout: {
    workCenterId: string;
    programName: string;
    cycleTimeSeconds: number;
    completedAt: string;
    blockCount: number;
    profileRunId?: string | null;
  };
  units: Array<{
    unitPosition: number;
    unitSerialNumber: string | null;
    unitStatus: string;
    aoiInspections?: Array<{
      unitDefects?: any[];
      totalDefects?: number;
    }>;
    reworkHistory?: any[];
  }>;
  selectedUnitPosition: number;
  onSelectUnit: (unitPosition: number) => void;
}

export const PanelUnitMatrix: React.FC<PanelUnitMatrixProps> = ({
  panelBarcode,
  checkout,
  units,
  selectedUnitPosition,
  onSelectUnit
}) => {
  const getStatusBadge = (status: string, hasDefect: boolean, hasRework: boolean) => {
    switch (status) {
      case 'PASSED':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-[var(--mes-radius)] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3 h-3" />
            PASSED
          </span>
        );
      case 'QUALITY_HOLD':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-[var(--mes-radius)] bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold animate-pulse">
            <AlertOctagon className="w-3 h-3" />
            QUALITY HOLD
          </span>
        );
      case 'REWORKED':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-[var(--mes-radius)] bg-purple-500/15 border border-purple-500/40 text-purple-400 font-bold">
            <Wrench className="w-3 h-3" />
            REWORKED
          </span>
        );
      case 'SCRAPPED':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-[var(--mes-radius)] bg-slate-800 border border-slate-700 text-slate-400 font-bold">
            <Slash className="w-3 h-3" />
            SCRAPPED
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-[var(--mes-radius)] bg-slate-900 border border-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-4">
      {/* Panel Hardware Metadata Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[var(--mes-radius)] bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                PANEL BARCODE:
              </span>
              <span className="text-xs font-mono font-bold text-slate-100 bg-slate-900 px-2 py-0.5 rounded-[var(--mes-radius)] border border-slate-800">
                {panelBarcode}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
              <span>Work Center: <strong className="text-slate-100">{checkout.workCenterId}</strong></span>
              <span>•</span>
              <span>Program: <strong className="text-slate-100">{checkout.programName}</strong></span>
              <span>•</span>
              <span>Cycle: <strong className="text-slate-100 font-mono tabular-nums">{checkout.cycleTimeSeconds}s</strong></span>
              {checkout.profileRunId && (
                <>
                  <span>•</span>
                  <span>Reflow Run: <strong className="text-amber-400">{checkout.profileRunId}</strong></span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Multi-Circuit Array
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
            {units.length} Discrete Units
          </span>
        </div>
      </div>

      {/* Multi-Up Discrete Circuit Matrix */}
      <div>
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Multi-Up PCB Discretization Array (Click to Inspect Unit)</span>
          <span className="text-[10px] text-slate-500">O(1) in-memory selection • Zero network roundtrips</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {units.map((u) => {
            const isSelected = u.unitPosition === selectedUnitPosition;
            const defectCount = u.aoiInspections?.reduce((acc, ins) => acc + (ins.unitDefects?.length || 0), 0) || 0;
            const hasRework = (u.reworkHistory && u.reworkHistory.length > 0) || false;

            return (
              <button
                key={u.unitPosition}
                onClick={() => onSelectUnit(u.unitPosition)}
                className={`text-left p-3 rounded-[var(--mes-radius)] border transition-all duration-150 flex flex-col justify-between gap-2.5 active:scale-[0.98] ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500/60 shadow-sm'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-100'}`}>
                    UNIT #{u.unitPosition}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-mono font-bold bg-emerald-400 text-slate-950 px-1.5 py-0.5 rounded-[var(--mes-radius)]">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 truncate" title={u.unitSerialNumber || 'UNSERIALIZED'}>
                    {u.unitSerialNumber || 'SN: N/A'}
                  </div>
                  <div>
                    {getStatusBadge(u.unitStatus, defectCount > 0, hasRework)}
                  </div>
                </div>

                <div className="text-[10px] font-mono pt-1 border-t border-slate-800 flex items-center justify-between text-slate-400">
                  <span className="tabular-nums">{defectCount > 0 ? `${defectCount} Defect(s)` : '0 Defects'}</span>
                  {hasRework && <span className="text-purple-400 font-bold">Reworked</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
