// apps/web/src/components/traceability/SolderPasteCard.tsx
import React from 'react';
import { Layers, Thermometer, ShieldCheck } from 'lucide-react';

interface SolderPasteCardProps {
  solderPaste: Array<{
    jarId: string;
    lotNumber: string;
    alloyType: string;
    thawVerifiedAt?: string;
    mixedAt?: string;
    temperatureVerifiedC?: number | null;
    linkage: {
      source: string;
      confidence: string;
      detail?: string;
    };
  }>;
  stencil: {
    stencilId: string;
    serialNumber: string;
    revision: string;
    sessionStartedAt: string;
    linkage: {
      source: string;
      confidence: string;
      detail?: string;
    };
  } | null;
}

export const SolderPasteCard: React.FC<SolderPasteCardProps> = ({ solderPaste, stencil }) => {
  const paste = solderPaste?.[0];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            STENCIL & SOLDER PASTE LIFECYCLE
          </h3>
        </div>
        {paste?.linkage && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-[var(--mes-radius)] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3 h-3" />
            {paste.linkage.source} • {paste.linkage.confidence}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        {/* Stencil Master Data */}
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800 space-y-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
            SMT Foil Stencil
          </span>
          {stencil ? (
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Stencil ID:</span>
                <span className="text-slate-100 font-bold">{stencil.stencilId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Serial Number:</span>
                <span className="text-emerald-400 font-bold">{stencil.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Revision:</span>
                <span className="text-slate-200">Rev {stencil.revision}</span>
              </div>
              <div className="flex justify-between text-[11px] pt-1.5 border-t border-slate-800/60 text-slate-400">
                <span>Session Started:</span>
                <span className="tabular-nums">{new Date(stencil.sessionStartedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 py-3 text-center">No active stencil session mapped.</div>
          )}
        </div>

        {/* Solder Paste Jar */}
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800 space-y-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
            Solder Paste Jar
          </span>
          {paste ? (
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Jar ID:</span>
                <span className="text-slate-100 font-bold">{paste.jarId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paste Lot:</span>
                <span className="text-slate-100 font-bold">{paste.lotNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Alloy:</span>
                <span className="text-slate-200">{paste.alloyType}</span>
              </div>
              {paste.temperatureVerifiedC && (
                <div className="flex justify-between text-[11px] pt-1.5 border-t border-slate-800/60 text-slate-400">
                  <span>Verified Temp:</span>
                  <span className="text-emerald-400 font-bold tabular-nums">{paste.temperatureVerifiedC}°C</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 py-3 text-center">No paste jar assigned.</div>
          )}
        </div>
      </div>
    </div>
  );
};
