// apps/web/src/components/traceability/PlacementChainTable.tsx
import React, { useState } from 'react';
import { Cpu, Search, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

interface PlacementChainTableProps {
  placementChain: Array<{
    refDes: string;
    partNumber: string;
    packageType: string;
    cadCoordinates: {
      xMm: number;
      yMm: number;
      rotationDeg: number;
      boardSide: string;
    };
    feederSlot: {
      moduleNo: number;
      slotNo: number;
      feederId: string;
      feederType: string;
    };
    componentReel: {
      reelId: string;
      lotNumber: string;
      supplierName: string;
      dateCode: string;
      mslClass: string;
      mslRemainingMinutes: number;
    };
    linkage: {
      source: string;
      confidence: string;
      detail?: string;
    };
  }>;
}

/**
 * MSL Presentation Rule:
 * Never expose sentinel values like 999999m.
 * Render "—" for MSL 1 / untracked.
 * Render human-readable remaining hours/days for tracked MSL.
 */
export const formatMslFloorLife = (mslClass: string, remainingMinutes: number) => {
  if (!mslClass || mslClass === 'MSL_1' || remainingMinutes >= 900000) {
    return { text: '—', badge: 'bg-slate-900 border-slate-800 text-slate-500', status: 'UNLIMITED' };
  }

  if (remainingMinutes <= 0) {
    return { text: '0m (EXPIRED)', badge: 'bg-rose-500/20 border-rose-500/40 text-rose-400 font-bold', status: 'EXPIRED' };
  }

  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;
  const isWarning = hours < 24;

  const formatted = hours > 48 ? `${Math.floor(hours / 24)}d ${hours % 24}h` : `${hours}h ${mins}m`;

  return {
    text: formatted,
    badge: isWarning ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    status: 'ACTIVE'
  };
};

export const PlacementChainTable: React.FC<PlacementChainTableProps> = ({ placementChain }) => {
  const [filter, setFilter] = useState('');

  const filteredItems = placementChain.filter((item) => {
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    return (
      (item.refDes || '').toLowerCase().includes(q) ||
      (item.partNumber || '').toLowerCase().includes(q) ||
      (item.componentReel?.reelId || '').toLowerCase().includes(q) ||
      (item.componentReel?.lotNumber || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-4">
      {/* Table Header & Search Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
              PLACEMENT / AS-BUILT COMPONENT CHAIN
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full physical traceability chain: RefDes → CAD coordinates → Feeder Slot → Component Reel UID → MSL Floor Life.
          </p>
        </div>

        <div className="relative min-w-[200px]">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter RefDes, Reel, or Part..."
            className="w-full bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] pl-8 pr-3 py-1.5 text-xs text-slate-100 font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Structured Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider bg-slate-900/60">
              <th className="py-2.5 px-3">RefDes</th>
              <th className="py-2.5 px-3">CAD X/Y/θ</th>
              <th className="py-2.5 px-3">Part Number</th>
              <th className="py-2.5 px-3">Feeder Slot</th>
              <th className="py-2.5 px-3">Component Reel ID</th>
              <th className="py-2.5 px-3">Material Lot</th>
              <th className="py-2.5 px-3">JEDEC MSL</th>
              <th className="py-2.5 px-3">Remaining Life</th>
              <th className="py-2.5 px-3">Linkage Attribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-slate-500 text-xs">
                  Zero placement records matching filter.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => {
                const msl = formatMslFloorLife(item.componentReel.mslClass, item.componentReel.mslRemainingMinutes);
                const isExact = item.linkage.confidence === 'EXACT';

                return (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-100">
                      {item.refDes}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 tabular-nums">
                      ({item.cadCoordinates.xMm.toFixed(1)}, {item.cadCoordinates.yMm.toFixed(1)}, {item.cadCoordinates.rotationDeg}°)
                    </td>
                    <td className="py-2.5 px-3 text-slate-200">
                      <div>{item.partNumber}</div>
                      <div className="text-[10px] text-slate-500">{item.packageType}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      <div>M{item.feederSlot.moduleNo}: Slot {item.feederSlot.slotNo}</div>
                      <div className="text-[10px] text-slate-500">{item.feederSlot.feederId}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-[var(--mes-radius)] border border-emerald-500/30">
                        {item.componentReel.reelId}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      <div>{item.componentReel.lotNumber}</div>
                      <div className="text-[10px] text-slate-500">{item.componentReel.supplierName}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-slate-900 border border-slate-800 text-slate-300">
                        {String(item.componentReel?.mslClass || 'MSL_1').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-[var(--mes-radius)] border tabular-nums ${msl.badge}`}>
                        {msl.text}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-[var(--mes-radius)] border flex items-center gap-1 w-fit ${
                          isExact
                            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 font-bold'
                            : 'bg-amber-950/80 border-amber-500/50 text-amber-300 font-bold'
                        }`}
                        title={item.linkage.detail || item.linkage.source}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {item.linkage.source === 'HISTORICAL_ASSIGNMENT' ? 'INTERVAL ATTR' : item.linkage.source}
                        {' • '}
                        {item.linkage.confidence}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
