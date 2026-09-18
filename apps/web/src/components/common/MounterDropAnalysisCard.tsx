import React from 'react';
import { MounterDropRatePpm, ShiftDropMatrixItem } from '@mes/shared';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export interface MounterDropAnalysisCardProps {
  dropData: MounterDropRatePpm;
  shiftData?: ShiftDropMatrixItem[];
  lineName?: string;
}

export const MounterDropAnalysisCard: React.FC<MounterDropAnalysisCardProps> = ({
  dropData,
  shiftData = [],
  lineName = 'SMD_02 (FUJI NXT III)'
}) => {
  const isPass = dropData.status === 'PASS';
  const totalErrors = dropData.totalErrors || (dropData.pickupErrors + dropData.recogErrors);
  const pickupPct = totalErrors > 0 ? (dropData.pickupErrors / totalErrors) * 100 : 0;
  const recogPct = totalErrors > 0 ? (dropData.recogErrors / totalErrors) * 100 : 0;
  const variancePpm = dropData.actualPpm - dropData.targetPpm;

  // Realistic shift breakdown (benchmarked to i-MES 2.0 standard)
  const rows: ShiftDropMatrixItem[] = shiftData.length > 0 ? shiftData : [
    {
      shiftCode: 'Shift 1 (06:00 - 14:00)',
      pickups: 36684966,
      pickupErrors: 3357,
      recogErrors: 7218,
      totalErrors: 10575,
      dropRatePpm: 288,
      recogDropRatePpm: 197,
      pickupDropRatePpm: 92
    },
    {
      shiftCode: 'Shift 2 (14:00 - 22:00)',
      pickups: 268,
      pickupErrors: 0,
      recogErrors: 0,
      totalErrors: 0,
      dropRatePpm: 0,
      recogDropRatePpm: 0,
      pickupDropRatePpm: 0
    },
    {
      shiftCode: 'Shift 3 (22:00 - 06:00)',
      pickups: 88673,
      pickupErrors: 0,
      recogErrors: 31,
      totalErrors: 31,
      dropRatePpm: 350,
      recogDropRatePpm: 350,
      pickupDropRatePpm: 0
    }
  ];

  return (
    <div 
      className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] overflow-hidden text-slate-100"
      style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.6)' }}
    >
      {/* Enterprise Filter & Header Band */}
      <div className="bg-slate-900/90 px-3.5 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="font-sans font-bold text-slate-100 uppercase tracking-wider text-[12px]">
            {lineName} · MOUNTER COMPONENT DROP ANALYSIS (PPM)
          </span>
          <span className="text-[10.5px] font-mono text-slate-400 bg-slate-800/90 px-2 py-0.5 border border-slate-700/60 rounded-[var(--mes-radius)] font-medium">
            Standard: i-MES 2.0 Specification
          </span>
        </div>

        {/* Global Compliance Status Badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-[var(--mes-radius)] border ${
          isPass 
            ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.25)]' 
            : 'bg-rose-950/80 text-rose-400 border-rose-500/70 shadow-[0_0_8px_rgba(239,68,68,0.25)]'
        }`}>
          {isPass ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
          <span>PPM COMPLIANCE: {dropData.status}</span>
        </div>
      </div>

      {/* KPI Readout Grid (4 Columns, Razor 1px Dividers) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800/80 border-b border-slate-800/80 font-mono">
        <div className="bg-slate-900/90 p-3">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Target Ceiling</span>
          <div className="text-xl font-bold text-slate-100 mt-0.5 tabular-nums">
            {dropData.targetPpm} <span className="text-xs text-slate-400 font-normal">PPM</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Automotive Contractual Spec</span>
        </div>

        <div className="bg-slate-900/90 p-3">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Actual Rate</span>
          <div className={`text-xl font-black mt-0.5 tabular-nums ${isPass ? 'text-emerald-400' : 'text-rose-400'}`}>
            {dropData.actualPpm} <span className="text-xs text-slate-400 font-normal">PPM</span>
          </div>
          <span className="text-[10.5px] mt-0.5 block font-semibold">
            {variancePpm <= 0 ? (
              <span className="text-emerald-400">-{Math.abs(variancePpm)} PPM below ceiling</span>
            ) : (
              <span className="text-rose-400">+{variancePpm} PPM violation</span>
            )}
          </span>
        </div>

        <div className="bg-slate-900/90 p-3">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Total Pickups</span>
          <div className="text-xl font-bold text-slate-100 mt-0.5 tabular-nums">
            {dropData.totalPickups.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Components Mounted</span>
        </div>

        <div className="bg-slate-900/90 p-3">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Scrapped / Dropped</span>
          <div className="text-xl font-bold text-amber-400 mt-0.5 tabular-nums">
            {totalErrors.toLocaleString()} <span className="text-xs text-slate-400 font-normal">pcs</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Dump Box Discarded</span>
        </div>
      </div>

      {/* Dual Classification Ratio Strip */}
      <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
          <span className="font-sans font-bold uppercase tracking-wider text-slate-200">
            Optical Vision Reject vs. Vacuum Pick Miss Classification
          </span>
          <span className="text-slate-400">
            Vacuum: <strong className="text-amber-400 font-bold">{pickupPct.toFixed(1)}%</strong> · Vision: <strong className="text-cyan-400 font-bold">{recogPct.toFixed(1)}%</strong>
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-2.5 w-full bg-slate-950 rounded-none overflow-hidden flex border border-slate-800">
          <div 
            style={{ width: `${pickupPct}%` }}
            className="bg-amber-500 h-full transition-all"
            title={`Vacuum Pick Miss: ${dropData.pickupErrors.toLocaleString()} pcs (${pickupPct.toFixed(1)}%)`}
          />
          <div 
            style={{ width: `${recogPct}%` }}
            className="bg-cyan-500 h-full transition-all"
            title={`Optical Vision Reject: ${dropData.recogErrors.toLocaleString()} pcs (${recogPct.toFixed(1)}%)`}
          />
        </div>

        <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 pt-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-none inline-block shadow-[0_0_4px_#F59E0B]" />
            Vacuum Pick Miss: <strong className="text-amber-300">{dropData.pickupErrors.toLocaleString()} pcs</strong> ({dropData.pickupDropRatePpm} PPM)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-cyan-500 rounded-none inline-block shadow-[0_0_4px_#06B6D4]" />
            Optical Vision Reject: <strong className="text-cyan-300">{dropData.recogErrors.toLocaleString()} pcs</strong> ({dropData.recogDropRatePpm} PPM)
          </span>
        </div>
      </div>

      {/* Dense 3-Shift Data Table (Exact i-MES 2.0 Grid) */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800 text-[10.5px] text-slate-400 uppercase tracking-wider font-semibold">
              <th className="text-left px-3 py-2">Production Shift</th>
              <th className="text-right px-3 py-2">Total Pickups</th>
              <th className="text-right px-3 py-2">Vacuum Err (pcs)</th>
              <th className="text-right px-3 py-2">Vision Err (pcs)</th>
              <th className="text-right px-3 py-2">Total Dropped</th>
              <th className="text-right px-3 py-2">Drop PPM</th>
              <th className="text-right px-3 py-2">Target</th>
              <th className="text-center px-3 py-2">Shift Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {rows.map((r, idx) => {
              const rowPass = r.dropRatePpm <= dropData.targetPpm;
              return (
                <tr key={r.shiftCode || idx} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-3 py-2 font-sans font-semibold text-slate-200">{r.shiftCode}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-300">{r.pickups.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-amber-400">{r.pickupErrors.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-cyan-400">{r.recogErrors.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-100 font-bold">{r.totalErrors.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-bold">
                    <span className={r.dropRatePpm > dropData.targetPpm ? 'text-rose-400' : 'text-emerald-400'}>
                      {r.dropRatePpm}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-400">{dropData.targetPpm}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-[2px] border uppercase ${
                      rowPass 
                        ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/60' 
                        : 'bg-rose-950/80 text-rose-400 border-rose-500/70'
                    }`}>
                      {rowPass ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {/* Cumulative Summary Row */}
            <tr className="bg-slate-900 font-bold border-t-2 border-slate-700">
              <td className="px-3 py-2 text-slate-100 font-sans">24-Hour Cumulative Total</td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-100">{dropData.totalPickups.toLocaleString()}</td>
              <td className="px-3 py-2 text-right tabular-nums text-amber-400">{dropData.pickupErrors.toLocaleString()}</td>
              <td className="px-3 py-2 text-right tabular-nums text-cyan-400">{dropData.recogErrors.toLocaleString()}</td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-100 font-extrabold">{totalErrors.toLocaleString()}</td>
              <td className="px-3 py-2 text-right tabular-nums font-extrabold">
                <span className={dropData.actualPpm > dropData.targetPpm ? 'text-rose-400' : 'text-emerald-400'}>
                  {dropData.actualPpm}
                </span>
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-400">{dropData.targetPpm}</td>
              <td className="px-3 py-2 text-center">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-[2px] border uppercase ${
                  isPass 
                    ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/60' 
                    : 'bg-rose-950/80 text-rose-400 border-rose-500/70'
                }`}>
                  {dropData.status}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
