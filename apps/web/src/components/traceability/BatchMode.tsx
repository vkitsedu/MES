// apps/web/src/components/traceability/BatchMode.tsx
import React, { useState } from 'react';
import { Layers, CheckCircle2, AlertTriangle, XCircle, Search, Package, ShieldCheck, ArrowRight } from 'lucide-react';

interface BatchModeProps {
  batchData: any | null;
  onSelectPanel?: (panelBarcode: string) => void;
}

export const BatchMode: React.FC<BatchModeProps> = ({ batchData, onSelectPanel }) => {
  const [panelFilter, setPanelFilter] = useState('');

  if (!batchData) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-[var(--mes-radius)] bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400">
          <Layers className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto">
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            No Batch Selected
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Enter a Batch / Job number above to inspect aggregated production yield, panel completions, and materials consumption.
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Try quick demo preset: <code className="text-emerald-400 font-bold">JOB-SM-260901</code>
        </div>
      </div>
    );
  }

  const { batch, dhr, summary, panels = [], materialsConsumed = [] } = batchData;
  const yieldPct = (summary?.totalUnits ?? 0) > 0
    ? (((summary.passedUnits ?? 0) / summary.totalUnits) * 100).toFixed(1)
    : '0.0';

  const filteredPanels = panels.filter((p: any) => {
    const q = panelFilter.trim().toLowerCase();
    if (!q) return true;
    return (p.panelBarcode || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Batch Header & Identity */}
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                BATCH PRODUCTION ROLLUP
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span className="text-[10px] font-mono text-sky-400 font-bold">{batch?.productCode || 'SMT-RUN'}</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 font-mono tracking-tight mt-0.5 flex items-center gap-3">
              Batch: <span className="text-emerald-400 font-mono">{batch?.batchNumber || 'N/A'}</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                WO: {batch?.workOrderNumber || 'N/A'}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">DHR Status:</span>
            <span className={`px-2 py-0.5 rounded-[var(--mes-radius)] border text-[11px] font-bold ${
              dhr?.status === 'RELEASED'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
            }`}>
              {dhr?.status || 'PENDING_QA_REVIEW'}
            </span>
          </div>
        </div>

        {/* Batch Yield & Volume KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-3">
            <span className="text-[10px] font-mono uppercase text-slate-400">Total Panels</span>
            <p className="text-lg font-mono font-bold text-slate-100 tabular-nums mt-1">{summary?.totalPanels ?? 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-3">
            <span className="text-[10px] font-mono uppercase text-slate-400">Total Units</span>
            <p className="text-lg font-mono font-bold text-slate-100 tabular-nums mt-1">{summary?.totalUnits ?? 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-3">
            <span className="text-[10px] font-mono uppercase text-emerald-400">Passed Units</span>
            <p className="text-lg font-mono font-bold text-emerald-400 tabular-nums mt-1">{summary?.passedUnits ?? 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-3">
            <span className="text-[10px] font-mono uppercase text-amber-400">Held Units</span>
            <p className="text-lg font-mono font-bold text-amber-400 tabular-nums mt-1">{summary?.heldUnits ?? 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-3">
            <span className="text-[10px] font-mono uppercase text-rose-400">Defects</span>
            <p className="text-lg font-mono font-bold text-rose-400 tabular-nums mt-1">{summary?.totalDefects ?? 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-3">
            <span className="text-[10px] font-mono uppercase text-purple-400">Reworks</span>
            <p className="text-lg font-mono font-bold text-purple-400 tabular-nums mt-1">{summary?.reworkCount ?? 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-3 col-span-2 sm:col-span-1 lg:col-span-1">
            <span className="text-[10px] font-mono uppercase text-emerald-400">Yield</span>
            <p className="text-lg font-mono font-bold text-emerald-400 tabular-nums mt-1">{yieldPct}%</p>
          </div>
        </div>
      </div>

      {/* Panels Summary Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
              PANELS IN BATCH ({panels.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual PCB panels assembled and processed under batch run.
            </p>
          </div>

          <div className="relative min-w-[200px]">
            <input
              type="text"
              value={panelFilter}
              onChange={(e) => setPanelFilter(e.target.value)}
              placeholder="Search panel..."
              className="w-full bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] pl-8 pr-3 py-1.5 text-xs text-slate-100 font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900/60">
                <th className="py-2.5 px-3">Panel Barcode</th>
                <th className="py-2.5 px-3">Units</th>
                <th className="py-2.5 px-3">Quality Status</th>
                <th className="py-2.5 px-3">Completion Time</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {filteredPanels.map((p: any) => (
                <tr key={p.panelBarcode} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-100 font-bold">{p.panelBarcode}</td>
                  <td className="py-2.5 px-3 text-slate-400 tabular-nums">{p.unitCount} Units</td>
                  <td className="py-2.5 px-3">
                    {p.hasDefects ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--mes-radius)] text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/50">
                        <AlertTriangle className="w-3 h-3 text-amber-400" /> DEFECT RECORDED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--mes-radius)] text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> PASSED
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 tabular-nums">
                    {p.completedAt ? new Date(p.completedAt).toLocaleString() : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {onSelectPanel && (
                      <button
                        onClick={() => onSelectPanel(p.panelBarcode)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--mes-radius)] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold transition-colors"
                      >
                        Inspect <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredPanels.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 text-xs">
                    No matching panels found in this batch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Materials Consumed Rollup Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
              MATERIALS CONSUMED IN BATCH ({materialsConsumed.length})
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Component reels and bulk lots consumed during pick-and-place assembly.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900/60">
                <th className="py-2.5 px-3">Part Number</th>
                <th className="py-2.5 px-3">Reel / Lot ID</th>
                <th className="py-2.5 px-3">Lot Number</th>
                <th className="py-2.5 px-3">Supplier</th>
                <th className="py-2.5 px-3 text-right">Qty Consumed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {materialsConsumed.map((m: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-100 font-bold">{m.partNumber}</td>
                  <td className="py-2.5 px-3 text-emerald-400">{m.reelId}</td>
                  <td className="py-2.5 px-3 text-slate-400">{m.lotNumber || '—'}</td>
                  <td className="py-2.5 px-3 text-slate-400">{m.supplierName || '—'}</td>
                  <td className="py-2.5 px-3 text-right text-slate-100 font-bold tabular-nums">
                    {m.quantityConsumed?.toLocaleString() ?? 0}
                  </td>
                </tr>
              ))}
              {materialsConsumed.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 text-xs">
                    No material consumption records found for this batch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
