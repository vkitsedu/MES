// apps/web/src/components/traceability/ReworkLedger.tsx
import React from 'react';
import { Wrench, CheckCircle2, User, Clock, ArrowRight } from 'lucide-react';

interface ReworkLedgerProps {
  reworkHistory: Array<{
    defectId: string;
    refDes: string;
    disposition: string;
    dispositionReason: string;
    authorizedBy: string;
    dispositionAt: string;
    execution?: {
      technicianId: string;
      stationId: string;
      oldMpn: string;
      oldReelId?: string;
      replacementMpn: string;
      replacementReelId: string;
      reworkMethod: string;
      reworkCycle: number;
      reworkedAt: string;
    };
    postReworkInspection?: {
      result: string;
      inspectorId: string;
      inspectedAt: string;
    };
  }>;
}

export const ReworkLedger: React.FC<ReworkLedgerProps> = ({ reworkHistory }) => {
  if (!reworkHistory || reworkHistory.length === 0) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Wrench className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            CLEANROOM REWORK & COMPONENT REPLACEMENT LEDGER
          </h3>
        </div>
        <div className="py-6 text-center text-xs font-mono text-slate-500">
          Zero rework operations logged for this board unit (virgin assembly state).
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            CLEANROOM REWORK & COMPONENT REPLACEMENT LEDGER
          </h3>
        </div>

        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-[var(--mes-radius)] bg-purple-500/15 border border-purple-500/40 text-purple-400 font-bold">
          {reworkHistory.length} REWORK CYCLE(S)
        </span>
      </div>

      <div className="space-y-3">
        {reworkHistory.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-3.5 space-y-3 text-xs font-mono"
          >
            {/* Disposition Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100">RefDes: {item.refDes}</span>
                <span className="text-slate-500">•</span>
                <span className="text-purple-300 font-bold">DISPOSITION: {item.disposition}</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                <span>Auth by: <strong className="text-slate-200">{item.authorizedBy}</strong></span>
                <span>•</span>
                <span>{new Date(item.dispositionAt).toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic">
              "{item.dispositionReason}"
            </p>

            {/* Execution Details */}
            {item.execution && (
              <div className="bg-slate-950 p-2.5 rounded-[var(--mes-radius)] border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Method: <strong className="text-slate-200">{String(item.execution?.reworkMethod || 'MANUAL').replace(/_/g, ' ')}</strong>
                  </span>
                  <span className="text-slate-400">
                    Cycle: <strong className="text-slate-200">#{item.execution.reworkCycle}</strong>
                  </span>
                  <span className="text-slate-400">
                    Station: <strong className="text-slate-200">{item.execution.stationId}</strong>
                  </span>
                  <span className="text-slate-400">
                    Tech: <strong className="text-slate-200">{item.execution.technicianId}</strong>
                  </span>
                </div>

                {/* Replacement Material Flow */}
                <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-3 text-xs">
                  <div className="bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-[var(--mes-radius)]">
                    <span className="text-[10px] text-rose-400 block uppercase">Desoldered Reel</span>
                    <span className="text-rose-200 font-bold">{item.execution.oldReelId || 'N/A'}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <div className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-[var(--mes-radius)]">
                    <span className="text-[10px] text-emerald-400 block uppercase">Replacement Reel</span>
                    <span className="text-emerald-300 font-bold">{item.execution.replacementReelId}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Post-Rework Re-Qualification Inspection */}
            {item.postReworkInspection && (
              <div className="flex items-center justify-between text-[11px] bg-emerald-500/10 p-2 rounded-[var(--mes-radius)] border border-emerald-500/30 text-emerald-400">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  POST-REWORK OPTICAL RE-QUALIFICATION: {item.postReworkInspection.result}
                </div>
                <div className="text-[10px] text-emerald-300/70">
                  Inspector: {item.postReworkInspection.inspectorId} • {new Date(item.postReworkInspection.inspectedAt).toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
