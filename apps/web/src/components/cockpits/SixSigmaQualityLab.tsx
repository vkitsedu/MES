import React, { useState, useCallback } from 'react';
import {
  Activity, AlertTriangle, BarChart3, CheckCircle2,
  ClipboardCheck, FileText, Lock, Shield, Target, TrendingDown, TrendingUp, XCircle
} from 'lucide-react';

interface SixSigmaQualityLabProps {
  onNavigateTab?: (tab: string) => void;
}

const CPK = 1.48;
const PPK = 1.42;
const DEFECT_PPM = 288;
const FPY = 98.4;
const GAUGE_RR = 6.2;
const SIGMA_LEVEL = 4.2;

const XBAR_UCL = 108.4;
const XBAR_CL  = 100.0;
const XBAR_LCL =  91.6;

const xbarPoints = [
  99.1, 101.4, 100.8, 103.2, 98.7, 104.1, 99.8, 101.6,
  97.3, 105.8, 100.4, 102.1, 99.5, 106.9, 101.2, 98.4,
  100.7, 103.5, 99.0, 104.4, 100.1, 97.8, 101.9, 109.1, 100.6
];
const weRuleViolations = new Set([9, 13, 23]);

const weibullPoints: [number, number][] = Array.from({ length: 40 }, (_, i) => {
  const t = 500 + i * 300;
  const beta = 2.4, eta = 8760;
  const cdf = 1 - Math.exp(-Math.pow(t / eta, beta));
  return [t, cdf];
});

function gaussian(x: number, mu: number, sigma: number) {
  return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)) / (sigma * Math.sqrt(2 * Math.PI));
}

const MU = 100.0;
const SIGMA_PASTE = 4.2;
const USL = 113.0;
const LSL = 87.0;
const gaussX = Array.from({ length: 100 }, (_, i) => LSL - 4 + i * ((USL + 4 - (LSL - 4)) / 99));
const gaussY = gaussX.map(x => gaussian(x, MU, SIGMA_PASTE));
const maxGauss = Math.max(...gaussY);

export const SixSigmaQualityLab: React.FC<SixSigmaQualityLabProps> = ({ onNavigateTab: _onNavigateTab }) => {
  const [sigModalOpen, setSigModalOpen] = useState(false);
  const [sigName, setSigName] = useState('');
  const [sigText, setSigText] = useState('');
  const [sigSubmitted, setSigSubmitted] = useState(false);

  const handleSign = useCallback(() => {
    if (sigName.trim() && sigText.trim()) {
      setSigSubmitted(true);
      setTimeout(() => { setSigModalOpen(false); setSigSubmitted(false); setSigName(''); setSigText(''); }, 2500);
    }
  }, [sigName, sigText]);

  const chartW = 420, chartH = 160;
  const pad = { t: 16, r: 16, b: 28, l: 44 };
  const plotW = chartW - pad.l - pad.r;
  const plotH = chartH - pad.t - pad.b;
  const gMinX = gaussX[0], gMaxX = gaussX[gaussX.length - 1];
  const toSvgX = (x: number) => pad.l + ((x - gMinX) / (gMaxX - gMinX)) * plotW;
  const toSvgY = (y: number) => pad.t + plotH - (y / maxGauss) * plotH;
  const bellPath = gaussX.map((x, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(x).toFixed(1)},${toSvgY(gaussY[i]).toFixed(1)}`).join(' ');
  const usLX = toSvgX(USL), lsLX = toSvgX(LSL);
  const mX = toSvgX(MU);

  const xbW = 420, xbH = 150;
  const xbPad = { t: 14, r: 12, b: 28, l: 48 };
  const xbPlotW = xbW - xbPad.l - xbPad.r;
  const xbPlotH = xbH - xbPad.t - xbPad.b;
  const xbMin = 88, xbMax = 112;
  const xbToX = (i: number) => xbPad.l + (i / (xbarPoints.length - 1)) * xbPlotW;
  const xbToY = (v: number) => xbPad.t + xbPlotH - ((v - xbMin) / (xbMax - xbMin)) * xbPlotH;
  const xbPath = xbarPoints.map((v, i) => `${i === 0 ? 'M' : 'L'}${xbToX(i).toFixed(1)},${xbToY(v).toFixed(1)}`).join(' ');
  const xbUCLy = xbToY(XBAR_UCL), xbCLy = xbToY(XBAR_CL), xbLCLy = xbToY(XBAR_LCL);

  const wbW = 300, wbH = 140;
  const wbPad = { t: 14, r: 12, b: 28, l: 44 };
  const wbPlotW = wbW - wbPad.l - wbPad.r;
  const wbPlotH = wbH - wbPad.t - wbPad.b;
  const wbMinT = weibullPoints[0][0], wbMaxT = weibullPoints[weibullPoints.length - 1][0];
  const wbToX = (t: number) => wbPad.l + ((t - wbMinT) / (wbMaxT - wbMinT)) * wbPlotW;
  const wbToY = (cdf: number) => wbPad.t + wbPlotH - cdf * wbPlotH;
  const wbPath = weibullPoints.map(([t, c], i) => `${i === 0 ? 'M' : 'L'}${wbToX(t).toFixed(1)},${wbToY(c).toFixed(1)}`).join(' ');
  const b10t = weibullPoints.find(([, c]) => c >= 0.10)?.[0] ?? 3000;
  const b10x = wbToX(b10t), b10y = wbToY(0.1);

  const scoreCards = [
    { icon: Target, label: 'Process Capability', value: `Cpk ${CPK}`, sub: `Ppk ${PPK}`, badge: 'PASS', bc: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/50', vc: 'text-emerald-300', ic: 'text-violet-400' },
    { icon: TrendingDown, label: 'Defect Rate', value: `${DEFECT_PPM} PPM`, sub: 'Target < 500 PPM', badge: 'PASS', bc: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/50', vc: 'text-emerald-300', ic: 'text-cyan-400' },
    { icon: CheckCircle2, label: 'First Pass Yield', value: `${FPY}%`, sub: 'Target > 98.0%', badge: 'PASS', bc: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/50', vc: 'text-emerald-300', ic: 'text-emerald-400' },
    { icon: Activity, label: 'Gauge R&R', value: `${GAUGE_RR}%`, sub: 'Target < 10%', badge: 'PASS', bc: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/50', vc: 'text-emerald-300', ic: 'text-amber-400' },
    { icon: Shield, label: 'Sigma Level', value: `${SIGMA_LEVEL}σ`, sub: 'World Class >= 4σ', badge: 'WORLD CLASS', bc: 'text-violet-300 bg-violet-900/40 border-violet-700/50', vc: 'text-violet-300', ic: 'text-violet-400' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#070A10] text-gray-100 font-mono overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0D121D] border-b border-[#1E2230] shrink-0">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-violet-400" />
          <span className="text-violet-300 font-black text-sm tracking-widest uppercase">Six Sigma SPC Quality Lab</span>
          <span className="text-[10px] text-gray-500 ml-1">IPC-A-610 / ISO 9001 / 21 CFR Part 11</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-violet-900/40 border border-violet-700/50 text-violet-300">BATCH: LOT-2026-09-20-001</span>
          <span className="px-2 py-0.5 rounded bg-emerald-900/40 border border-emerald-700/50 text-emerald-300">SPC ENGINE RUNNING</span>
          <button onClick={() => setSigModalOpen(true)} className="px-3 py-1 text-xs rounded border border-emerald-600 bg-emerald-900/30 text-emerald-300 hover:bg-emerald-800/40 transition-colors flex items-center gap-1.5">
            <Lock className="w-3 h-3" />21 CFR BATCH SIGN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1 p-2 shrink-0">
        {scoreCards.map(({ icon: Icon, label, value, sub, badge, bc, vc, ic }) => (
          <div key={label} className="bg-[#0D121D] border border-[#1E2230] rounded p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Icon className={`w-3.5 h-3.5 ${ic}`} />
              <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${bc}`}>{badge}</span>
            </div>
            <div className={`text-lg font-black leading-tight ${vc}`}>{value}</div>
            <div className="text-[9px] text-gray-400 leading-tight">{label}</div>
            <div className="text-[9px] text-gray-500">{sub}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-3 gap-1 p-2 overflow-hidden min-h-0">
        <div className="bg-[#0D121D] border border-[#1E2230] rounded p-3 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div className="text-[10px] font-bold text-cyan-300 tracking-wider uppercase">3D SPI Paste Volume Distribution</div>
            <div className="text-[9px] text-gray-500">mu={MU} sigma={SIGMA_PASTE}</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center min-h-0">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
              <rect x={usLX} y={pad.t} width={pad.l + plotW - usLX} height={plotH} fill="rgba(239,68,68,0.08)" />
              <rect x={pad.l} y={pad.t} width={lsLX - pad.l} height={plotH} fill="rgba(239,68,68,0.08)" />
              <path d={`${bellPath} L${toSvgX(gMaxX).toFixed(1)},${(pad.t + plotH).toFixed(1)} L${toSvgX(gMinX).toFixed(1)},${(pad.t + plotH).toFixed(1)} Z`} fill="rgba(139,92,246,0.15)" />
              <path d={bellPath} fill="none" stroke="#a78bfa" strokeWidth="1.5" />
              <line x1={usLX} y1={pad.t} x2={usLX} y2={pad.t + plotH} stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4,3" />
              <text x={usLX + 3} y={pad.t + 10} fill="#ef4444" fontSize="8" fontFamily="monospace">USL</text>
              <line x1={lsLX} y1={pad.t} x2={lsLX} y2={pad.t + plotH} stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4,3" />
              <text x={lsLX - 22} y={pad.t + 10} fill="#ef4444" fontSize="8" fontFamily="monospace">LSL</text>
              <line x1={mX} y1={pad.t} x2={mX} y2={pad.t + plotH} stroke="#34d399" strokeWidth="1" strokeDasharray="3,3" />
              {[LSL, MU, USL].map(v => (<text key={v} x={toSvgX(v)} y={chartH - 4} textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="monospace">{v}</text>))}
              <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + plotH} stroke="#1E2230" strokeWidth="1" />
              <line x1={pad.l} y1={pad.t + plotH} x2={pad.l + plotW} y2={pad.t + plotH} stroke="#1E2230" strokeWidth="1" />
            </svg>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1E2230] text-[9px] shrink-0">
            <span className="text-violet-300">Cpk = {CPK} PASS</span>
            <span className="text-gray-500">3-sigma = {(MU - 3*SIGMA_PASTE).toFixed(1)} to {(MU + 3*SIGMA_PASTE).toFixed(1)}</span>
          </div>
        </div>

        <div className="bg-[#0D121D] border border-[#1E2230] rounded p-3 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-1 shrink-0">
            <div className="text-[10px] font-bold text-amber-300 tracking-wider uppercase">Shewhart X-bar Control Chart</div>
            <div className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-400" /><span className="text-[9px] text-red-400">{weRuleViolations.size} WE Violations</span></div>
          </div>
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center">
            <svg viewBox={`0 0 ${xbW} ${xbH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
              <rect x={xbPad.l} y={xbPad.t} width={xbPlotW} height={xbUCLy - xbPad.t} fill="rgba(239,68,68,0.05)" />
              <rect x={xbPad.l} y={xbLCLy} width={xbPlotW} height={xbPad.t + xbPlotH - xbLCLy} fill="rgba(239,68,68,0.05)" />
              {[{ y: xbUCLy, color: '#ef4444', label: `UCL ${XBAR_UCL}` }, { y: xbCLy, color: '#34d399', label: `CL ${XBAR_CL}` }, { y: xbLCLy, color: '#ef4444', label: `LCL ${XBAR_LCL}` }].map(({ y, color, label }) => (
                <g key={label}>
                  <line x1={xbPad.l} y1={y} x2={xbPad.l + xbPlotW} y2={y} stroke={color} strokeWidth="1" strokeDasharray="5,4" />
                  <text x={xbPad.l - 3} y={y + 3} textAnchor="end" fill={color} fontSize="7" fontFamily="monospace">{label}</text>
                </g>
              ))}
              <path d={xbPath} fill="none" stroke="#60a5fa" strokeWidth="1.5" />
              {xbarPoints.map((v, i) => {
                const cx = xbToX(i), cy = xbToY(v);
                const isViol = weRuleViolations.has(i);
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r={isViol ? 4 : 2.5} fill={isViol ? '#ef4444' : '#93c5fd'} />
                    {isViol && (<><circle cx={cx} cy={cy} r={7} fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.6" /><text x={cx} y={cy - 10} textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="monospace">WE</text></>)}
                  </g>
                );
              })}
              <line x1={xbPad.l} y1={xbPad.t} x2={xbPad.l} y2={xbPad.t + xbPlotH} stroke="#1E2230" />
              <line x1={xbPad.l} y1={xbPad.t + xbPlotH} x2={xbPad.l + xbPlotW} y2={xbPad.t + xbPlotH} stroke="#1E2230" />
              {[0, 6, 12, 18, 24].map(i => (<text key={i} x={xbToX(i)} y={xbH - 4} textAnchor="middle" fill="#6b7280" fontSize="7" fontFamily="monospace">S{i+1}</text>))}
            </svg>
          </div>
          <div className="mt-1 pt-2 border-t border-[#1E2230] flex items-center gap-3 text-[9px] shrink-0">
            <span className="text-blue-300">Sample points</span>
            <span className="text-red-400">WE Rule violation</span>
            <span className="text-gray-500 ml-auto">n=5 subgroup, 25 samples</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 overflow-hidden">
          <div className="bg-[#0D121D] border border-[#1E2230] rounded p-3 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-1 shrink-0">
              <div className="text-[10px] font-bold text-cyan-300 tracking-wider uppercase">Weibull Reliability Curve</div>
              <div className="text-[9px] text-gray-500">beta=2.4 eta=8760h</div>
            </div>
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <svg viewBox={`0 0 ${wbW} ${wbH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
                {[0.25, 0.5, 0.75, 1.0].map(c => (<line key={c} x1={wbPad.l} y1={wbToY(c)} x2={wbPad.l + wbPlotW} y2={wbToY(c)} stroke="#1E2230" strokeWidth="0.7" />))}
                <path d={`${wbPath} L${wbToX(wbMaxT).toFixed(1)},${wbToY(0).toFixed(1)} L${wbToX(wbMinT).toFixed(1)},${wbToY(0).toFixed(1)} Z`} fill="rgba(34,211,153,0.08)" />
                <path d={wbPath} fill="none" stroke="#34d399" strokeWidth="1.5" />
                <line x1={b10x} y1={wbPad.t} x2={b10x} y2={wbToY(0)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" />
                <text x={b10x + 3} y={b10y - 4} fill="#f59e0b" fontSize="7" fontFamily="monospace">B10</text>
                {weibullPoints.filter((_, i) => i % 4 === 0).map(([t, c]) => (<circle key={t} cx={wbToX(t)} cy={wbToY(c)} r="2" fill="#6ee7b7" />))}
                <line x1={wbPad.l} y1={wbPad.t} x2={wbPad.l} y2={wbPad.t + wbPlotH} stroke="#1E2230" />
                <line x1={wbPad.l} y1={wbPad.t + wbPlotH} x2={wbPad.l + wbPlotW} y2={wbPad.t + wbPlotH} stroke="#1E2230" />
                <text x={wbPad.l - 3} y={wbToY(0) + 4} textAnchor="end" fill="#6b7280" fontSize="7" fontFamily="monospace">0%</text>
                <text x={wbPad.l - 3} y={wbToY(1) + 4} textAnchor="end" fill="#6b7280" fontSize="7" fontFamily="monospace">100%</text>
                {[3000, 6000, 9000, 12000].map(t => (<text key={t} x={wbToX(t)} y={wbH - 4} textAnchor="middle" fill="#6b7280" fontSize="7" fontFamily="monospace">{t/1000}kh</text>))}
              </svg>
            </div>
            <div className="text-[9px] text-gray-500 text-center shrink-0">Solder joint fatigue CDF - B10 ~3,800h</div>
          </div>
          <div className="bg-[#0D121D] border border-[#1E2230] rounded p-3 shrink-0">
            <div className="flex items-center gap-1.5 mb-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-300 tracking-wider uppercase">21 CFR Part 11 - Batch Approval</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[9px]"><ClipboardCheck className="w-3 h-3 text-gray-500" /><span className="text-gray-400">LOT-2026-09-20-001 - 840 panels - Cpk 1.48</span></div>
              <div className="flex items-center gap-2 text-[9px]"><FileText className="w-3 h-3 text-gray-500" /><span className="text-gray-400">SHA-256: 3a4f8bd9e1c52a...f7b381</span></div>
              <div className="flex items-center gap-2 mt-1">
                <button onClick={() => setSigModalOpen(true)} className="flex-1 py-1.5 text-[10px] font-bold rounded border border-emerald-600 bg-emerald-900/30 text-emerald-300 hover:bg-emerald-800/40 transition-colors flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3" />ELECTRONIC SIGNATURE
                </button>
                <span className="text-[9px] text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />PENDING</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-4 py-1.5 bg-[#0D121D] border-t border-[#1E2230] flex items-center gap-4 text-[9px]">
        <span className="text-gray-500 font-bold uppercase tracking-wider">WE Rules Active:</span>
        <span className="text-red-400">Rule 1: Point beyond 3-sigma (S10, S14, S24)</span>
        <span className="text-amber-400">Rule 2: 2 of 3 beyond 2-sigma</span>
        <div className="ml-auto flex items-center gap-2"><TrendingUp className="w-3 h-3 text-violet-400" /><span className="text-violet-300">CAPABILITY REPORT - SHIFT A - 2026-09-20</span></div>
      </div>

      {sigModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0D121D] border border-emerald-700/60 rounded-lg p-6 w-96 font-mono shadow-2xl">
            <div className="flex items-center gap-2 mb-4"><Lock className="w-4 h-4 text-emerald-400" /><h2 className="text-sm font-black text-emerald-300 uppercase tracking-wider">21 CFR Part 11 Electronic Signature</h2></div>
            {sigSubmitted ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <p className="text-sm text-emerald-300 font-bold">Batch Approved and Sealed</p>
                <p className="text-[10px] text-gray-500">SHA-256 hash recorded to immutable audit ledger</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div><label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Signee Name and Badge ID</label><input type="text" value={sigName} onChange={e => setSigName(e.target.value)} placeholder="e.g. VIPIN KUMAR - QC-LEAD-001" className="w-full bg-[#070A10] border border-[#1E2230] rounded px-3 py-2 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-emerald-600" /></div>
                  <div><label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Timestamp: {new Date().toISOString()}</label></div>
                  <div><label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Electronic Signature Statement</label><textarea value={sigText} onChange={e => setSigText(e.target.value)} placeholder="I certify this batch record is accurate and complete per 21 CFR Part 11..." rows={3} className="w-full bg-[#070A10] border border-[#1E2230] rounded px-3 py-2 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-emerald-600 resize-none" /></div>
                  <div className="text-[9px] text-gray-500 bg-[#070A10] rounded p-2 border border-[#1E2230]">By signing, you confirm this constitutes a legally binding electronic signature under 21 CFR Part 11 sec 11.100.</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleSign} disabled={!sigName.trim() || !sigText.trim()} className="flex-1 py-2 text-xs font-bold rounded border border-emerald-600 bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">SIGN AND SEAL BATCH</button>
                  <button onClick={() => setSigModalOpen(false)} className="px-4 py-2 text-xs rounded border border-[#1E2230] text-gray-400 hover:bg-[#1E2230] transition-colors"><XCircle className="w-4 h-4" /></button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SixSigmaQualityLab;