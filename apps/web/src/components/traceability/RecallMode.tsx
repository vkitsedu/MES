// apps/web/src/components/traceability/RecallMode.tsx
import React from 'react';
import { GitFork, AlertCircle, HelpCircle } from 'lucide-react';
import { RecallDashboard } from './RecallDashboard';
import { RecallContainmentTable } from './RecallContainmentTable';

interface RecallModeProps {
  recallData: any | null;
  onSelectPanel?: (panelBarcode: string) => void;
}

export const RecallMode: React.FC<RecallModeProps> = ({ recallData, onSelectPanel }) => {
  if (!recallData) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-[var(--mes-radius)] bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <GitFork className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto">
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            No Active Containment Investigation
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Enter a Component Reel ID, Material Lot, Solder Paste Jar, or Stencil ID above to run a set-based containment trace across all production panels.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Try quick demo preset: <code className="text-emerald-400 font-bold">REEL-MUR-98124</code></span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Scope KPIs & Containment Status */}
      <RecallDashboard recallData={recallData} />

      {/* Affected Panels & Discrete Units Boundary */}
      <RecallContainmentTable
        affectedPanels={recallData.affectedPanels || []}
        affectedUnits={recallData.affectedUnits || []}
      />
    </div>
  );
};
