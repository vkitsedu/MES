// apps/web/src/components/traceability/RecallDashboard.tsx
import React, { useState } from 'react';
import { GitFork, AlertOctagon, ShieldAlert, FileText, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import { isFixtureModeEnabled } from '../../services/traceability.api';

interface RecallDashboardProps {
  recallData: {
    queryTarget: string;
    targetType: string;
    status: string;
    containmentRecommendation: string;
    affectedBatches: any[];
    affectedPanels: any[];
    affectedUnits: any[];
    summary: {
      totalBatchesAffected: number;
      totalPanelsAffected: number;
      totalUnitsAffected: number;
      quarantineScope: string;
    };
  };
}

export const RecallDashboard: React.FC<RecallDashboardProps> = ({ recallData }) => {
  const [recommendationGenerated, setRecommendationGenerated] = useState(false);
  const fixtureMode = isFixtureModeEnabled();

  const handleGenerateRecommendation = () => {
    setRecommendationGenerated(true);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-4">
      {/* Target & Containment Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-rose-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              CONTAINMENT RECALL SCOPE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span className="text-[10px] font-mono text-rose-400 font-bold">SET-BASED FORWARD TRACE</span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 font-mono tracking-tight mt-0.5 flex items-center gap-2">
            Target UID: <span className="text-emerald-400 font-mono">{recallData.queryTarget}</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              ({String(recallData.targetType || 'TARGET').replace(/_/g, ' ')})
            </span>
          </h2>
        </div>

        {/* Read-Only Safety Buttons */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={handleGenerateRecommendation}
            className="px-3.5 py-1.5 rounded-[var(--mes-radius)] bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border border-amber-500/50 font-bold font-mono text-xs transition-all active:scale-98 shadow-sm"
          >
            [ GENERATE QUARANTINE RECOMMENDATION ]
          </button>
          <button
            onClick={() => alert(`Containment manifest exported for ${recallData.queryTarget} (ALCOA+ audit compliant report).`)}
            className="px-3 py-1.5 rounded-[var(--mes-radius)] bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800 font-mono text-xs transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>EXPORT MANIFEST</span>
          </button>
        </div>
      </div>

      {/* Safety Notice Strip */}
      <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-[var(--mes-radius)] text-[10px] font-mono text-slate-400 flex items-center justify-between">
        <span>READ-ONLY CONTAINMENT INTERFACE • PRODUCTION STATE MUTATIONS REQUIRE QUALITY_HOLD_WRITE PERMISSION</span>
        {fixtureMode && (
          <span className="text-amber-400/90 font-bold">DEMO ACTION — NO PRODUCTION STATE CHANGE</span>
        )}
      </div>

      {/* Containment Metrics KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Affected Batches</span>
          <span className="text-lg font-bold text-slate-100 tabular-nums block mt-0.5">
            {recallData.summary.totalBatchesAffected}
          </span>
          <span className="text-[10px] text-slate-500 truncate block">
            {recallData.affectedBatches[0]?.batchNumber || '—'}
          </span>
        </div>

        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Affected Panels</span>
          <span className="text-lg font-bold text-amber-300 tabular-nums block mt-0.5">
            {recallData.summary.totalPanelsAffected}
          </span>
          <span className="text-[10px] text-slate-500 block">Across production line</span>
        </div>

        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Discrete Units</span>
          <span className="text-lg font-bold text-rose-400 tabular-nums block mt-0.5">
            {recallData.summary.totalUnitsAffected}
          </span>
          <span className="text-[10px] text-slate-500 block">Multi-up circuits</span>
        </div>

        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Containment Rec.</span>
          <span
            className={`text-xs font-bold block mt-1 uppercase ${
              recallData.containmentRecommendation === 'QUARANTINE_REQUIRED'
                ? 'text-rose-400'
                : 'text-emerald-400'
            }`}
          >
            {String(recallData.containmentRecommendation || 'HOLD').replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Quarantine Recommendation Review Box */}
      {recommendationGenerated && (
        <div className="bg-slate-950 border border-amber-500/40 border-l-4 border-l-amber-400 p-3.5 rounded-[var(--mes-radius)] space-y-2 text-xs font-mono shadow-sm">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>CONTAINMENT ACTION RECOMMENDATION GENERATED</span>
          </div>
          <p className="text-slate-300">
            Scope: {recallData.summary.quarantineScope}. Advise placing {recallData.summary.totalPanelsAffected} panels on immediate physical and optical hold. Forwarding recommendation to SMT Quality Inspector.
          </p>
        </div>
      )}
    </div>
  );
};
