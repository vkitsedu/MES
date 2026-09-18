// apps/web/src/components/traceability/TraceabilitySearch.tsx
import React, { useState } from 'react';
import { Search, AlertCircle, Layers, GitFork, Package, AlertTriangle } from 'lucide-react';
import { isFixtureModeEnabled } from '../../services/traceability.api';

export type StationMode = 'GENEALOGY' | 'RECALL' | 'BATCH';

interface TraceabilitySearchProps {
  mode: StationMode;
  onModeChange: (mode: StationMode) => void;
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (overrideQuery?: string, overrideMode?: StationMode) => void;
  loading: boolean;
  ambiguousDetail?: string;
  onSelectDisambiguation?: (namespace: string) => void;
}

export const TraceabilitySearch: React.FC<TraceabilitySearchProps> = ({
  mode,
  onModeChange,
  query,
  onQueryChange,
  onSearch,
  loading,
  ambiguousDetail,
  onSelectDisambiguation
}) => {
  const fixtureMode = isFixtureModeEnabled();
  const demoPrefix = fixtureMode ? '[DEMO] ' : '';

  const presets = [
    { label: `${demoPrefix}PNL-260901-0042 (Defect U3)`, val: 'PNL-260901-0042', targetMode: 'GENEALOGY' as StationMode },
    { label: `${demoPrefix}PNL-SM-00140 (Clean Pass)`, val: 'PNL-SM-00140', targetMode: 'GENEALOGY' as StationMode },
    { label: `${demoPrefix}REEL-MUR-98124 (Reel Recall)`, val: 'REEL-MUR-98124', targetMode: 'RECALL' as StationMode },
    { label: `${demoPrefix}JOB-SM-260901 (Batch Yield)`, val: 'JOB-SM-260901', targetMode: 'BATCH' as StationMode }
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handlePresetClick = (presetVal: string, targetMode: StationMode) => {
    onQueryChange(presetVal);
    onModeChange(targetMode);
    onSearch(presetVal, targetMode);
  };

  const getPlaceholderText = () => {
    switch (mode) {
      case 'GENEALOGY':
        return 'Scan Panel Barcode (PNL-...) or Unit Serial (SN-...)...';
      case 'RECALL':
        return 'Scan Component Reel ID (REEL-...), Lot (LOT-...), or Stencil Serial (STN-...)...';
      case 'BATCH':
        return 'Enter Batch Job Number (JOB-... or WO-...)...';
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-4">
      {/* Station Title & Workflow Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              HIGH-SPEED SMT TRACEABILITY
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold">AS-BUILT LINEAGE</span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 font-mono tracking-tight mt-0.5 flex items-center gap-2">
            As-Built Genealogy & Containment Recall Station
          </h2>
        </div>

        {/* Tactical 3-Mode Controller */}
        <div className="flex bg-slate-900 p-0.5 rounded-[var(--mes-radius)] border border-slate-800 text-xs font-mono">
          <button
            onClick={() => onModeChange('GENEALOGY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--mes-radius)] transition-all ${
              mode === 'GENEALOGY'
                ? 'bg-slate-800 text-emerald-400 font-bold border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>01 // AS-BUILT GENEALOGY</span>
          </button>

          <button
            onClick={() => onModeChange('RECALL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--mes-radius)] transition-all ${
              mode === 'RECALL'
                ? 'bg-slate-800 text-rose-400 font-bold border border-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>02 // SET RECALL</span>
          </button>

          <button
            onClick={() => onModeChange('BATCH')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--mes-radius)] transition-all ${
              mode === 'BATCH'
                ? 'bg-slate-800 text-sky-400 font-bold border border-sky-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>03 // BATCH SUMMARY</span>
          </button>
        </div>
      </div>

      {/* Cross-Namespace Ambiguity Alert (when backend returns collision) */}
      {ambiguousDetail && (
        <div className="bg-slate-950 border border-amber-500/40 border-l-4 border-l-amber-400 text-slate-100 p-3.5 rounded-[var(--mes-radius)] text-xs font-mono flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-amber-300">AMBIGUOUS IDENTIFIER RESOLUTION</span>
            <p className="text-slate-300">{ambiguousDetail}</p>
            {onSelectDisambiguation && (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => onSelectDisambiguation('COMPONENT_REEL')}
                  className="px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 rounded-[var(--mes-radius)] border border-amber-500/50 text-[11px] font-bold transition-colors"
                >
                  Query as Component Reel
                </button>
                <button
                  onClick={() => onSelectDisambiguation('PANEL_BARCODE')}
                  className="px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 rounded-[var(--mes-radius)] border border-amber-500/50 text-[11px] font-bold transition-colors"
                >
                  Query as Panel Barcode
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Omni-Search Input & Execute Button */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[280px] relative">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholderText()}
            className="w-full bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] pl-10 pr-4 py-2 text-xs text-slate-100 font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
        </div>

        <button
          onClick={() => onSearch()}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs px-5 py-2 rounded-[var(--mes-radius)] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? 'ANALYZING BUS...' : 'RUN TRACE'}
        </button>
      </div>

      {/* Quick Presets Strip */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          Quick Presets:
        </span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handlePresetClick(p.val, p.targetMode)}
            className="text-[11px] font-mono px-2.5 py-1 rounded-[var(--mes-radius)] bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};
