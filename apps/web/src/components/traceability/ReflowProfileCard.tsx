// apps/web/src/components/traceability/ReflowProfileCard.tsx
import React from 'react';
import { Flame, ShieldCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface ReflowProfileCardProps {
  reflowProfile: {
    profileRunId: string;
    overallPwi: number;
    complianceResult: 'PASS' | 'WARNING' | 'FAIL';
    worstCharacteristic?: string;
    recipeId: string;
    equipmentId: string;
    lineId: string;
    approvedBy?: string;
    approvedAt?: string;
    linkage: {
      source: string;
      confidence: string;
      detail?: string;
    };
  } | null;
}

export const ReflowProfileCard: React.FC<ReflowProfileCardProps> = ({ reflowProfile }) => {
  if (!reflowProfile) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            CLOSED-LOOP REFLOW THERMAL PROFILE
          </h3>
        </div>
        <div className="py-6 text-center text-xs font-mono text-slate-500">
          Zero reflow thermal profile linkage recorded for this checkout.
        </div>
      </div>
    );
  }

  const { linkage, overallPwi, complianceResult } = reflowProfile;
  const isDirectFk = linkage.source === 'DIRECT_FK' && linkage.confidence === 'EXACT';
  const isInferred = linkage.confidence === 'INFERRED';
  const isAmbiguous = linkage.confidence === 'AMBIGUOUS';

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            CLOSED-LOOP REFLOW THERMAL PROFILE
          </h3>
        </div>

        {/* Dynamic Linkage Provenance Badge — strictly data-driven */}
        <div className="flex items-center gap-2 font-mono text-[10px]">
          {isDirectFk ? (
            <span className="px-2.5 py-0.5 rounded-[var(--mes-radius)] bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              DIRECT FK • EXACT
            </span>
          ) : isInferred ? (
            <span className="px-2.5 py-0.5 rounded-[var(--mes-radius)] bg-amber-950/80 border border-amber-500/50 text-amber-300 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              TEMPORAL MATCH • INFERRED
            </span>
          ) : isAmbiguous ? (
            <span className="px-2.5 py-0.5 rounded-[var(--mes-radius)] bg-rose-950/80 border border-rose-500/50 text-rose-300 font-bold flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              OVERLAPPING RUNS • AMBIGUOUS
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-[var(--mes-radius)] bg-slate-900 border border-slate-800 text-slate-400">
              {linkage.source} • {linkage.confidence}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Profile Run UID</span>
          <span className="text-xs font-bold text-amber-400 truncate block" title={reflowProfile.profileRunId}>
            {reflowProfile.profileRunId}
          </span>
        </div>

        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Overall PWI</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-base font-bold tabular-nums ${overallPwi <= 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {overallPwi.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400">
              {overallPwi <= 100 ? '(COMPLIANT)' : '(PWI FAIL)'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Oven Work Center</span>
          <span className="text-xs font-bold text-slate-100 block">{reflowProfile.equipmentId}</span>
          <span className="text-[10px] text-slate-500">{reflowProfile.lineId}</span>
        </div>

        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Process Compliance</span>
          <span
            className={`text-xs font-bold flex items-center gap-1 mt-0.5 ${
              complianceResult === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {complianceResult === 'PASS' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {complianceResult}
          </span>
        </div>
      </div>

      {reflowProfile.worstCharacteristic && (
        <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2.5 rounded-[var(--mes-radius)] border border-slate-800 flex items-center justify-between">
          <span>Worst Process Window Index Characteristic:</span>
          <span className="text-slate-100 font-bold">{reflowProfile.worstCharacteristic}</span>
        </div>
      )}

      {linkage.detail && (
        <div className="text-[10px] font-mono text-slate-500 italic">
          Provenance Note: {linkage.detail}
        </div>
      )}
    </div>
  );
};
