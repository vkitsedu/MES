// apps/web/src/components/traceability/AoiInspectionCard.tsx
import React from 'react';
import { Crosshair, CheckCircle2, AlertOctagon, Image as ImageIcon } from 'lucide-react';

interface AoiInspectionCardProps {
  aoiInspections: Array<{
    inspectionId: string;
    phase: string;
    result: string;
    totalDefects: number;
    inspectedAt: string;
    opticalMachineId: string;
    unitDefects?: Array<{
      defectId: string;
      refDes: string;
      defectCategory: string;
      defectType: string;
      defectSignature: string;
      boardSide: string;
      status: string;
      imageRef?: string;
    }>;
  }>;
}

export const AoiInspectionCard: React.FC<AoiInspectionCardProps> = ({ aoiInspections }) => {
  if (!aoiInspections || aoiInspections.length === 0) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Crosshair className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            3D AUTOMATED OPTICAL INSPECTION (AOI)
          </h3>
        </div>
        <div className="py-6 text-center text-xs font-mono text-slate-500">
          Zero 3D AOI optical inspection scans available for this board unit.
        </div>
      </div>
    );
  }

  const latest = aoiInspections[aoiInspections.length - 1];
  const unitDefects = latest.unitDefects || [];
  const isPass = latest.result === 'PASS' && unitDefects.length === 0;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            3D AUTOMATED OPTICAL INSPECTION (AOI)
          </h3>
        </div>

        <span
          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-[var(--mes-radius)] border font-bold flex items-center gap-1 ${
            isPass
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse'
          }`}
        >
          {isPass ? <CheckCircle2 className="w-3 h-3" /> : <AlertOctagon className="w-3 h-3" />}
          {isPass ? 'PASS (0 DEFECTS)' : `DEFECTS FOUND (${unitDefects.length})`}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Inspection Phase</span>
          <span className="text-xs font-bold text-slate-100 block">{latest.phase}</span>
        </div>
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Panel Defects</span>
          <span className="text-xs font-bold text-slate-100 tabular-nums">{latest.totalDefects}</span>
        </div>
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Unit Defects</span>
          <span className={`text-xs font-bold tabular-nums ${unitDefects.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {unitDefects.length}
          </span>
        </div>
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Optical System</span>
          <span className="text-xs font-bold text-slate-200 truncate block" title={latest.opticalMachineId}>
            {latest.opticalMachineId}
          </span>
        </div>
      </div>

      {/* Discrete Unit Optical Defects List */}
      {unitDefects.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Optical Defect Signatures on this Unit
          </span>
          <div className="space-y-2">
            {unitDefects.map((def, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-rose-500/30 p-3 rounded-[var(--mes-radius)] text-xs font-mono flex flex-wrap items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[var(--mes-radius)] bg-rose-500/20 text-rose-400 font-bold text-[10px]">
                      {def.defectType}
                    </span>
                    <span className="text-slate-100 font-bold text-xs">RefDes: {def.refDes}</span>
                    <span className="text-[10px] text-slate-400">Side: {def.boardSide}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-xl" title={def.defectSignature}>
                    Signature: {def.defectSignature}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-[var(--mes-radius)] bg-slate-950 border border-slate-800 text-amber-300 font-bold">
                    STATUS: {def.status}
                  </span>
                  {def.imageRef && (
                    <span className="text-[10px] text-sky-400 flex items-center gap-1 hover:underline cursor-pointer">
                      <ImageIcon className="w-3 h-3" />
                      View Image
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
