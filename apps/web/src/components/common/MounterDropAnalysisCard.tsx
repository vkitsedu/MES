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

  // Realistic shift breakdown (benchmarked to i-MES 2.0 standard)
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
    <div 
      className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] overflow-hidden font-mono"
      style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
    >
      {/* Enterprise Filter & Header Band */}
      <div className="bg-[var(--mes-bg-well)] px-3 py-2 border-b border-[var(--mes-border-hairline)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--mes-text-primary)] uppercase tracking-wider">
            {lineName} · MOUNTER COMPONENT DROP ANALYSIS (PPM)
          </span>
          <span className="text-[10px] text-[var(--mes-text-muted)] bg-[var(--mes-bg-surface)] px-2 py-0.5 border border-[var(--mes-border-hairline)] rounded-[var(--mes-radius)]">
            Standard: i-MES 2.0 Specification
          </span>
        </div>

        {/* Global Compliance Status Badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-[var(--mes-radius)] border ${
          isPass 
            ? 'bg-[var(--mes-status-pass-muted)] text-[var(--mes-status-pass)] border-[var(--mes-status-pass)]' 
            : 'bg-[var(--mes-status-halt-muted)] text-[var(--mes-status-halt)] border-[var(--mes-status-halt)]'
        }`}>
          {isPass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          <span>PPM COMPLIANCE: {dropData.status}</span>
        </div>
      </div>

      {/* KPI Readout Grid (4 Columns, Razor 1px Steel Dividers) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--mes-border-hairline)] border-b border-[var(--mes-border-hairline)]">
        <div className="bg-[var(--mes-bg-surface)] p-2.5">
          <span className="text-[9.5px] text-[var(--mes-text-muted)] uppercase tracking-wider block">Target Ceiling</span>
          <div className="text-lg font-bold text-[var(--mes-text-primary)] mt-0.5 tabular-nums">
            {dropData.targetPpm} <span className="text-xs text-[var(--mes-text-muted)]">PPM</span>
          </div>
          <span className="text-[9px] text-[var(--mes-text-dim)] mt-0.5 block">Automotive Contractual Spec</span>
        </div>

        <div className="bg-[var(--mes-bg-surface)] p-2.5">
          <span className="text-[9.5px] text-[var(--mes-text-muted)] uppercase tracking-wider block">Actual Rate</span>
          <div className={`text-lg font-bold mt-0.5 tabular-nums ${isPass ? 'text-[var(--mes-status-pass)]' : 'text-[var(--mes-status-halt)]'}`}>
            {dropData.actualPpm} <span className="text-xs text-[var(--mes-text-muted)]">PPM</span>
          </div>
          <span className="text-[9px] text-[var(--mes-text-secondary)] mt-0.5 block">
            {variancePpm <= 0 ? (
              <span className="text-[var(--mes-status-pass)]">-{Math.abs(variancePpm)} PPM below ceiling</span>
            ) : (
              <span className="text-[var(--mes-status-halt)]">+{variancePpm} PPM violation</span>
            )}
          </span>
        </div>

        <div className="bg-[var(--mes-bg-surface)] p-2.5">
          <span className="text-[9.5px] text-[var(--mes-text-muted)] uppercase tracking-wider block">Total Pickups</span>
          <div className="text-lg font-bold text-[var(--mes-text-primary)] mt-0.5 tabular-nums">
            {dropData.totalPickups.toLocaleString()}
          </div>
          <span className="text-[9px] text-[var(--mes-text-dim)] mt-0.5 block">Components Mounted</span>
        </div>

        <div className="bg-[var(--mes-bg-surface)] p-2.5">
          <span className="text-[9.5px] text-[var(--mes-text-muted)] uppercase tracking-wider block">Scrapped / Dropped</span>
          <div className="text-lg font-bold text-[var(--mes-status-warn)] mt-0.5 tabular-nums">
            {totalErrors.toLocaleString()} <span className="text-xs text-[var(--mes-text-muted)]">pcs</span>
          </div>
          <span className="text-[9px] text-[var(--mes-text-dim)] mt-0.5 block">Dump Box Discarded</span>
        </div>
      </div>

      {/* Dual Classification Ratio Strip */}
      <div className="p-2.5 bg-[var(--mes-bg-well)] border-b border-[var(--mes-border-hairline)] space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-[var(--mes-text-secondary)]">
          <span className="font-bold uppercase tracking-wider">
            Optical Vision Reject vs. Vacuum Pick Miss Classification
          </span>
          <span className="text-[var(--mes-text-muted)]">
            Vacuum: <b className="text-[var(--mes-status-warn)]">{pickupPct.toFixed(1)}%</b> · Vision: <b className="text-[var(--mes-accent-primary)]">{recogPct.toFixed(1)}%</b>
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-2 w-full bg-[var(--mes-bg-canvas)] rounded-none overflow-hidden flex border border-[var(--mes-border-hairline)]">
          <div 
            style={{ width: `${pickupPct}%` }}
            className="bg-amber-500 h-full"
            title={`Vacuum Pick Miss: ${dropData.pickupErrors.toLocaleString()} pcs (${pickupPct.toFixed(1)}%)`}
          />
          <div 
            style={{ width: `${recogPct}%` }}
            className="bg-[var(--mes-accent-primary)] h-full"
            title={`Optical Vision Reject: ${dropData.recogErrors.toLocaleString()} pcs (${recogPct.toFixed(1)}%)`}
          />
        </div>

        <div className="flex items-center justify-between text-[9px] text-[var(--mes-text-muted)] pt-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-amber-500 rounded-none inline-block" />
            Vacuum Pick Miss: <b className="text-[var(--mes-status-warn)]">{dropData.pickupErrors.toLocaleString()} pcs</b> ({dropData.pickupDropRatePpm} PPM)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[var(--mes-accent-primary)] rounded-none inline-block" />
            Optical Vision Reject: <b className="text-[var(--mes-accent-primary)]">{dropData.recogErrors.toLocaleString()} pcs</b> ({dropData.recogDropRatePpm} PPM)
          </span>
        </div>
      </div>

      {/* Dense 3-Shift Data Table (Exact i-MES 2.0 Grid) */}
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
                  <td className="font-semibold text-[var(--mes-text-primary)]">{r.shiftCode}</td>
                  <td className="text-right tabular-nums text-[var(--mes-text-secondary)]">{r.pickups.toLocaleString()}</td>
                  <td className="text-right tabular-nums text-[var(--mes-status-warn)]">{r.pickupErrors.toLocaleString()}</td>
                  <td className="text-right tabular-nums text-[var(--mes-accent-primary)]">{r.recogErrors.toLocaleString()}</td>
                  <td className="text-right tabular-nums text-[var(--mes-text-primary)] font-bold">{r.totalErrors.toLocaleString()}</td>
                  <td className="text-right tabular-nums font-bold">
                    <span className={r.dropRatePpm > dropData.targetPpm ? 'text-[var(--mes-status-halt)]' : 'text-[var(--mes-status-pass)]'}>
                      {r.dropRatePpm}
                    </span>
                  </td>
                  <td className="text-right tabular-nums text-[var(--mes-text-muted)]">{dropData.targetPpm}</td>
                  <td className="text-center">
                    <span className={`px-1.5 py-0.2 text-[8.5px] font-bold rounded-[var(--mes-radius)] border uppercase ${
                      rowPass 
                        ? 'bg-[var(--mes-status-pass-muted)] text-[var(--mes-status-pass)] border-[var(--mes-status-pass)]' 
                        : 'bg-[var(--mes-status-halt-muted)] text-[var(--mes-status-halt)] border-[var(--mes-status-halt)]'
                    }`}>
                      {rowPass ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {/* Cumulative Summary Row */}
            <tr className="bg-[var(--mes-bg-well)] font-bold border-t-2 border-[var(--mes-border-strong)]">
              <td className="text-[var(--mes-text-primary)]">24-Hour Cumulative Total</td>
              <td className="text-right tabular-nums text-[var(--mes-text-primary)]">{dropData.totalPickups.toLocaleString()}</td>
              <td className="text-right tabular-nums text-[var(--mes-status-warn)]">{dropData.pickupErrors.toLocaleString()}</td>
              <td className="text-right tabular-nums text-[var(--mes-accent-primary)]">{dropData.recogErrors.toLocaleString()}</td>
              <td className="text-right tabular-nums text-[var(--mes-text-primary)]">{totalErrors.toLocaleString()}</td>
              <td className="text-right tabular-nums">
                <span className={dropData.actualPpm > dropData.targetPpm ? 'text-[var(--mes-status-halt)]' : 'text-[var(--mes-status-pass)]'}>
                  {dropData.actualPpm}
                </span>
              </td>
              <td className="text-right tabular-nums text-[var(--mes-text-muted)]">{dropData.targetPpm}</td>
              <td className="text-center">
                <span className={`px-1.5 py-0.2 text-[8.5px] rounded-[var(--mes-radius)] border uppercase ${
                  isPass 
                    ? 'bg-[var(--mes-status-pass-muted)] text-[var(--mes-status-pass)] border-[var(--mes-status-pass)]' 
                    : 'bg-[var(--mes-status-halt-muted)] text-[var(--mes-status-halt)] border-[var(--mes-status-halt)]'
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
