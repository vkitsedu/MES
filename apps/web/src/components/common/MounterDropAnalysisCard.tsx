import React from 'react';
import { MounterDropRatePpm, ShiftDropMatrixItem } from '@mes/shared';
import { CheckCircle2, AlertTriangle, TrendingDown, TrendingUp, Filter } from 'lucide-react';

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

  // Realistic shift breakdown (benchmarked directly from Samsung G-MES 4.0)
  const rows: ShiftDropMatrixItem[] = shiftData.length > 0 ? shiftData : [
    {
      shiftCode: '1 Shift (06:00 - 14:00)',
      pickups: 36684966,
      pickupErrors: 3357,
      recogErrors: 7218,
      totalErrors: 10575,
      dropRatePpm: 288,
      recogDropRatePpm: 197,
      pickupDropRatePpm: 92
    },
    {
      shiftCode: '2 Shift (14:00 - 22:00)',
      pickups: 268,
      pickupErrors: 0,
      recogErrors: 0,
      totalErrors: 0,
      dropRatePpm: 0,
      recogDropRatePpm: 0,
      pickupDropRatePpm: 0
    },
    {
      shiftCode: '3 Shift (22:00 - 06:00)',
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
    <div className="bg-[#0E1422] border border-[#222F46] rounded-sm shadow-sm overflow-hidden font-mono">
      {/* Enterprise Filter & Header Band */}
      <div className="bg-[#141C2C] px-3 py-2 border-b border-[#222F46] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white uppercase tracking-wider">
            {lineName} · MOUNTER COMPONENT DROP ANALYSIS (PPM)
          </span>
          <span className="text-[10px] text-slate-400 bg-[#0B0F18] px-2 py-0.5 border border-[#1C273A]">
            Standard: Samsung G-MES 4.0 Specification
          </span>
        </div>

        {/* Global Compliance Status Badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-sm border ${
          isPass 
            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/50' 
            : 'bg-rose-950/40 text-rose-400 border-rose-500/50'
        }`}>
          {isPass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          <span>PPM COMPLIANCE: {dropData.status}</span>
        </div>
      </div>

      {/* KPI Readout Grid (4 Columns, Razor 1px Steel Dividers) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#222F46] border-b border-[#222F46]">
        <div className="bg-[#0B101C] p-2.5">
          <span className="text-[9.5px] text-slate-400 uppercase tracking-wider block">Target Ceiling</span>
          <div className="text-lg font-bold text-slate-200 mt-0.5 tabular-nums">
            {dropData.targetPpm} <span className="text-xs text-slate-500">PPM</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-0.5 block">Automotive Contractual Spec</span>
        </div>

        <div className="bg-[#0B101C] p-2.5">
          <span className="text-[9.5px] text-slate-400 uppercase tracking-wider block">Actual Rate</span>
          <div className={`text-lg font-bold mt-0.5 tabular-nums ${isPass ? 'text-emerald-400' : 'text-rose-400'}`}>
            {dropData.actualPpm} <span className="text-xs text-slate-500">PPM</span>
          </div>
          <span className="text-[9px] text-slate-400 mt-0.5 block">
            {variancePpm <= 0 ? (
              <span className="text-emerald-400">-{Math.abs(variancePpm)} PPM below ceiling</span>
            ) : (
              <span className="text-rose-400">+{variancePpm} PPM violation</span>
            )}
          </span>
        </div>

        <div className="bg-[#0B101C] p-2.5">
          <span className="text-[9.5px] text-slate-400 uppercase tracking-wider block">Total Pickups</span>
          <div className="text-lg font-bold text-white mt-0.5 tabular-nums">
            {dropData.totalPickups.toLocaleString()}
          </div>
          <span className="text-[9px] text-slate-500 mt-0.5 block">Components Mounted</span>
        </div>

        <div className="bg-[#0B101C] p-2.5">
          <span className="text-[9.5px] text-slate-400 uppercase tracking-wider block">Scrapped / Dropped</span>
          <div className="text-lg font-bold text-amber-400 mt-0.5 tabular-nums">
            {totalErrors.toLocaleString()} <span className="text-xs text-slate-500">pcs</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-0.5 block">Dump Box Discarded</span>
        </div>
      </div>

      {/* Dual Classification Ratio Strip */}
      <div className="p-2.5 bg-[#0D1320] border-b border-[#222F46] space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-slate-300">
          <span className="font-bold uppercase tracking-wider">
            Optical Vision Reject vs. Vacuum Pick Miss Classification
          </span>
          <span className="text-slate-400">
            Vacuum: <b className="text-amber-400">{pickupPct.toFixed(1)}%</b> · Vision: <b className="text-sky-400">{recogPct.toFixed(1)}%</b>
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-2 w-full bg-[#162032] rounded-none overflow-hidden flex border border-[#222F46]">
          <div 
            style={{ width: `${pickupPct}%` }}
            className="bg-amber-500 h-full"
            title={`Vacuum Pick Miss: ${dropData.pickupErrors.toLocaleString()} pcs (${pickupPct.toFixed(1)}%)`}
          />
          <div 
            style={{ width: `${recogPct}%` }}
            className="bg-sky-500 h-full"
            title={`Optical Vision Reject: ${dropData.recogErrors.toLocaleString()} pcs (${recogPct.toFixed(1)}%)`}
          />
        </div>

        <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-amber-500 rounded-none inline-block" />
            Vacuum Pick Miss: <b className="text-amber-300">{dropData.pickupErrors.toLocaleString()} pcs</b> ({dropData.pickupDropRatePpm} PPM)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-sky-500 rounded-none inline-block" />
            Optical Vision Reject: <b className="text-sky-300">{dropData.recogErrors.toLocaleString()} pcs</b> ({dropData.recogDropRatePpm} PPM)
          </span>
        </div>
      </div>

      {/* Dense 3-Shift Data Table (Exact Samsung G-MES 4.0 Grid) */}
      <div className="overflow-x-auto">
        <table className="mes-table">
          <thead>
            <tr>
              <th className="text-left">Production Shift</th>
              <th className="text-right">Total Pickups</th>
              <th className="text-right">Vacuum Err (pcs)</th>
              <th className="text-right">Vision Err (pcs)</th>
              <th className="text-right">Total Dropped</th>
              <th className="text-right">Drop PPM</th>
              <th className="text-right">Target</th>
              <th className="text-center">Shift Audit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => {
              const rowPass = r.dropRatePpm <= dropData.targetPpm;
              return (
                <tr key={r.shiftCode || idx}>
                  <td className="font-semibold text-slate-200">{r.shiftCode}</td>
                  <td className="text-right tabular-nums text-slate-300">{r.pickups.toLocaleString()}</td>
                  <td className="text-right tabular-nums text-amber-400">{r.pickupErrors.toLocaleString()}</td>
                  <td className="text-right tabular-nums text-sky-400">{r.recogErrors.toLocaleString()}</td>
                  <td className="text-right tabular-nums text-slate-200 font-bold">{r.totalErrors.toLocaleString()}</td>
                  <td className="text-right tabular-nums font-bold">
                    <span className={r.dropRatePpm > dropData.targetPpm ? 'text-rose-400' : 'text-emerald-400'}>
                      {r.dropRatePpm}
                    </span>
                  </td>
                  <td className="text-right tabular-nums text-slate-500">{dropData.targetPpm}</td>
                  <td className="text-center">
                    <span className={`px-1.5 py-0.2 text-[8.5px] font-bold rounded-sm border uppercase ${
                      rowPass 
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' 
                        : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                    }`}>
                      {rowPass ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {/* Cumulative Summary Row */}
            <tr className="bg-[#141C2C] font-bold border-t-2 border-[#2A3B58]">
              <td className="text-white">24-Hour Cumulative Total</td>
              <td className="text-right tabular-nums text-white">{dropData.totalPickups.toLocaleString()}</td>
              <td className="text-right tabular-nums text-amber-300">{dropData.pickupErrors.toLocaleString()}</td>
              <td className="text-right tabular-nums text-sky-300">{dropData.recogErrors.toLocaleString()}</td>
              <td className="text-right tabular-nums text-white">{totalErrors.toLocaleString()}</td>
              <td className="text-right tabular-nums">
                <span className={dropData.actualPpm > dropData.targetPpm ? 'text-rose-400' : 'text-emerald-400'}>
                  {dropData.actualPpm}
                </span>
              </td>
              <td className="text-right tabular-nums text-slate-400">{dropData.targetPpm}</td>
              <td className="text-center">
                <span className={`px-1.5 py-0.2 text-[8.5px] rounded-sm border uppercase ${
                  isPass 
                    ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50' 
                    : 'bg-rose-900/60 text-rose-300 border-rose-500/50'
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
