// apps/web/src/components/traceability/SpiInspectionCard.tsx
import React from 'react';
import { Sliders, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface SpiInspectionCardProps {
  spiInspection: {
    inspectionId: string;
    result: 'PASS' | 'WARNING' | 'FAIL';
    totalPads: number;
    defectivePads: number;
    meanVolumePct?: number;
    sigmaVolumePct?: number;
    inspectedAt: string;
    opticalMachineId: string;
    unitCriticalPads?: Array<{
      padId: string;
      refDes: string;
      volumeRatioPct: number;
      heightUm: number;
      areaRatioPct: number;
      offsetXUm: number;
      offsetYUm: number;
      defectType?: string;
    }>;
  } | null;
}

export const SpiInspectionCard: React.FC<SpiInspectionCardProps> = ({ spiInspection }) => {
  if (!spiInspection) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sliders className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            3D SOLDER PASTE INSPECTION (SPI)
          </h3>
        </div>
        <div className="py-6 text-center text-xs font-mono text-slate-500">
          No 3D SPI optical inspection records registered for this panel.
        </div>
      </div>
    );
  }

  const isPass = spiInspection.result === 'PASS';

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            3D SOLDER PASTE INSPECTION (SPI)
          </h3>
        </div>

        <span
          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-[var(--mes-radius)] border font-bold flex items-center gap-1 ${
            isPass
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-400'
          }`}
        >
          {isPass ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {spiInspection.result}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Inspected Pads</span>
          <span className="text-sm font-bold text-slate-100 tabular-nums">{spiInspection.totalPads}</span>
        </div>
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Defective Pads</span>
          <span className={`text-sm font-bold tabular-nums ${spiInspection.defectivePads > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {spiInspection.defectivePads}
          </span>
        </div>
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mean Volume</span>
          <span className="text-sm font-bold text-sky-400 tabular-nums">
            {spiInspection.meanVolumePct ? `${spiInspection.meanVolumePct}%` : '—'}
          </span>
        </div>
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Optical System</span>
          <span className="text-xs font-bold text-slate-200 truncate block" title={spiInspection.opticalMachineId}>
            {spiInspection.opticalMachineId}
          </span>
        </div>
      </div>

      {/* Critical Pad Geometry Samples */}
      {spiInspection.unitCriticalPads && spiInspection.unitCriticalPads.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Critical RefDes Aperture Measurements
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase bg-slate-900/60">
                  <th className="py-1.5 px-2">Pad ID</th>
                  <th className="py-1.5 px-2">RefDes</th>
                  <th className="py-1.5 px-2">Volume %</th>
                  <th className="py-1.5 px-2">Height (µm)</th>
                  <th className="py-1.5 px-2">Area %</th>
                  <th className="py-1.5 px-2">XY Offset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {spiInspection.unitCriticalPads.map((pad, i) => (
                  <tr key={i}>
                    <td className="py-1.5 px-2 text-slate-400">{pad.padId}</td>
                    <td className="py-1.5 px-2 font-bold text-slate-100">{pad.refDes}</td>
                    <td className="py-1.5 px-2 text-sky-400 tabular-nums">{pad.volumeRatioPct.toFixed(1)}%</td>
                    <td className="py-1.5 px-2 text-slate-300 tabular-nums">{pad.heightUm.toFixed(1)} µm</td>
                    <td className="py-1.5 px-2 text-slate-300 tabular-nums">{pad.areaRatioPct.toFixed(1)}%</td>
                    <td className="py-1.5 px-2 text-slate-400 tabular-nums">
                      ({pad.offsetXUm.toFixed(1)}, {pad.offsetYUm.toFixed(1)}) µm
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
