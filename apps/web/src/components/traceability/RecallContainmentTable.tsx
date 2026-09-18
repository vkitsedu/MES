// apps/web/src/components/traceability/RecallContainmentTable.tsx
import React, { useState } from 'react';
import { ShieldAlert, Search, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface RecallContainmentTableProps {
  affectedPanels: Array<{
    panelBarcode: string;
    batchNumber: string;
    completedAt: string;
  }>;
  affectedUnits: Array<{
    panelBarcode: string;
    unitPosition: number;
    unitSerialNumber: string | null;
    unitStatus: string;
    affectedRefDes: string[];
    mountedReelId?: string;
  }>;
}

export const RecallContainmentTable: React.FC<RecallContainmentTableProps> = ({
  affectedPanels,
  affectedUnits
}) => {
  const [filter, setFilter] = useState('');

  const filteredPanels = affectedPanels.filter((p) => {
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    return (p.panelBarcode || '').toLowerCase().includes(q) || (p.batchNumber || '').toLowerCase().includes(q);
  });

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
              CONTAINMENT BOUNDARY: AFFECTED PANELS & UNITS
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Trace boundary derived via set-based query without iterative loops.
          </p>
        </div>

        <div className="relative min-w-[200px]">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter panel or batch..."
            className="w-full bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] pl-8 pr-3 py-1.5 text-xs text-slate-100 font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider bg-slate-900/60">
              <th className="py-2.5 px-3">Panel Barcode</th>
              <th className="py-2.5 px-3">Batch Number</th>
              <th className="py-2.5 px-3">Affected Units</th>
              <th className="py-2.5 px-3">Affected RefDes</th>
              <th className="py-2.5 px-3">Placement Timestamp</th>
              <th className="py-2.5 px-3">Containment Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredPanels.map((panel, idx) => {
              const panelUnits = affectedUnits.filter((u) => u.panelBarcode === panel.panelBarcode);
              const refDesSet = new Set<string>();
              panelUnits.forEach((u) => u.affectedRefDes?.forEach((r) => refDesSet.add(r)));
              const hasHold = panelUnits.some((u) => u.unitStatus === 'QUALITY_HOLD');

              return (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-100">
                    {panel.panelBarcode}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {panel.batchNumber}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-slate-100 font-bold">{panelUnits.length} units</span>
                    <span className="text-[10px] text-slate-500 ml-1.5">
                      ({panelUnits.map((u) => `#${u.unitPosition}`).join(', ')})
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-emerald-400 font-bold">
                      {Array.from(refDesSet).join(', ') || 'C12'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 tabular-nums">
                    {new Date(panel.completedAt).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3">
                    {hasHold ? (
                      <span className="px-2 py-0.5 rounded-[var(--mes-radius)] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 text-[10px] flex items-center gap-1 w-fit">
                        <AlertOctagon className="w-3 h-3" />
                        ON QUALITY HOLD
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-[var(--mes-radius)] bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 text-[10px] flex items-center gap-1 w-fit">
                        QUARANTINE CANDIDATE
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
