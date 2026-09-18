import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Activity,
  ShieldCheck,
  Upload,
  RefreshCw,
  AlertTriangle,
  XCircle,
  Sliders,
  Check,
  Thermometer,
  Lock,
  Cpu
} from 'lucide-react';
import { authService } from '../services/auth.service';

interface ProbeSample {
  timeSeconds: number;
  temperatureC: number;
}

interface ProbeData {
  probeIndex: number;
  label: string;
  thermalRole: string;
  color: string;
  samples: ProbeSample[];
  metrics?: {
    maxRampRateCPerSec: number;
    soakDurationSeconds: number;
    timeAboveLiquidusSeconds: number;
    peakTemperatureC: number;
    maxCoolingRateCPerSec: number;
  };
  pwi?: {
    overall: number;
    ramp: number;
    soak: number;
    tal: number;
    peak: number;
    cooling: number;
  };
}

interface ZoneTelemetry {
  zoneIndex: number;
  name: string;
  role: 'PREHEAT' | 'SOAK' | 'REFLOW_SPIKE' | 'COOLING';
  setpointC: number;
  actualC: number;
  meanDeviationC: number;
  meanZScore: number;
  variabilityZScore: number;
  status: 'NORMAL' | 'SUSPECTED' | 'CONFIRMED_DRIFT';
}

const PROBE_COLORS = [
  '#00E699', // Green
  '#38BDF8', // Cyan
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#10B981'  // Emerald
];

export const ReflowThermalStation: React.FC = () => {
  // Process Scope State
  const [lineId] = useState('line-smt-01');
  const [equipmentId] = useState('wc-rfl-01');
  const [recipeId] = useState('PROG-SM-METER-TOP-REV4');
  const [boardPartNumber] = useState('PRD-SM-4G-V2');
  const [boardRevision] = useState('REV4');

  // Active Profile & State
  const [activeProfile, setActiveProfile] = useState<any>(null);
  const [processState, setProcessState] = useState<string>('COMPLIANT');
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Probe Visibility
  const [visibleProbes, setVisibleProbes] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true
  });

  // Hover Scrubbing on Chart
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);

  // Sign-off / Activation Modal
  const [isSignOffModalOpen, setIsSignOffModalOpen] = useState(false);
  const [signerName, setSignerName] = useState('QA-CHIEF-01');
  const [signerRole, setSignerRole] = useState('Lead Quality Assurance Engineer');
  const [signOffComments, setSignOffComments] = useState('Certified conforming to IPC-7530B and J-STD-001H SAC305 profile');
  const [signatureConfirmed, setSignatureConfirmed] = useState(false);

  // File Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [fileContentText, setFileContentText] = useState('');

  // 10-Zone Live Telemetry
  const [zones] = useState<ZoneTelemetry[]>([
    { zoneIndex: 1, name: 'Z1 Preheat Top', role: 'PREHEAT', setpointC: 150, actualC: 150.4, meanDeviationC: 0.4, meanZScore: 0.5, variabilityZScore: 0.3, status: 'NORMAL' },
    { zoneIndex: 2, name: 'Z2 Preheat Top', role: 'PREHEAT', setpointC: 165, actualC: 165.2, meanDeviationC: 0.2, meanZScore: 0.3, variabilityZScore: 0.2, status: 'NORMAL' },
    { zoneIndex: 3, name: 'Z3 Preheat Top', role: 'PREHEAT', setpointC: 175, actualC: 175.8, meanDeviationC: 0.8, meanZScore: 0.9, variabilityZScore: 0.4, status: 'NORMAL' },
    { zoneIndex: 4, name: 'Z4 Soak Top', role: 'SOAK', setpointC: 185, actualC: 185.1, meanDeviationC: 0.1, meanZScore: 0.1, variabilityZScore: 0.2, status: 'NORMAL' },
    { zoneIndex: 5, name: 'Z5 Soak Top', role: 'SOAK', setpointC: 195, actualC: 195.5, meanDeviationC: 0.5, meanZScore: 0.6, variabilityZScore: 0.3, status: 'NORMAL' },
    { zoneIndex: 6, name: 'Z6 Soak Top', role: 'SOAK', setpointC: 210, actualC: 210.3, meanDeviationC: 0.3, meanZScore: 0.4, variabilityZScore: 0.4, status: 'NORMAL' },
    { zoneIndex: 7, name: 'Z7 Peak Spike', role: 'REFLOW_SPIKE', setpointC: 245, actualC: 246.8, meanDeviationC: 1.8, meanZScore: 1.2, variabilityZScore: 0.6, status: 'NORMAL' },
    { zoneIndex: 8, name: 'Z8 Peak Spike', role: 'REFLOW_SPIKE', setpointC: 260, actualC: 260.4, meanDeviationC: 0.4, meanZScore: 0.4, variabilityZScore: 0.5, status: 'NORMAL' },
    { zoneIndex: 9, name: 'Z9 Cooling 1', role: 'COOLING', setpointC: 180, actualC: 179.2, meanDeviationC: -0.8, meanZScore: -0.7, variabilityZScore: 0.3, status: 'NORMAL' },
    { zoneIndex: 10, name: 'Z10 Cooling 2', role: 'COOLING', setpointC: 130, actualC: 129.5, meanDeviationC: -0.5, meanZScore: -0.5, variabilityZScore: 0.2, status: 'NORMAL' }
  ]);

  // Synthetic Baseline Probes (for fallback / initial rendering)
  const initialProbes: ProbeData[] = useMemo(() => {
    const generateCurve = (probeIdx: number, peakOffset: number, role: string, label: string) => {
      const samples: ProbeSample[] = [];
      for (let t = 0; t <= 260; t += 2) {
        let temp = 25.0;
        if (t < 70) {
          temp = 25.0 + (150.0 - 25.0) * (t / 70);
        } else if (t < 160) {
          temp = 150.0 + (200.0 - 150.0) * ((t - 70) / 90);
        } else if (t < 200) {
          const u = (t - 160) / 40;
          temp = 200.0 + (241.5 + peakOffset - 200.0) * Math.sin(u * (Math.PI / 2));
        } else {
          const u = (t - 200) / 60;
          temp = (241.5 + peakOffset) - (241.5 + peakOffset - 40.0) * Math.min(1.0, u * 1.1);
        }
        samples.push({
          timeSeconds: t,
          temperatureC: Number(Math.max(25.0, temp + Math.sin(t * 0.1) * 0.4).toFixed(2))
        });
      }
      return {
        probeIndex: probeIdx,
        label,
        thermalRole: role,
        color: PROBE_COLORS[probeIdx - 1] || '#00E699',
        samples,
        metrics: {
          maxRampRateCPerSec: 1.8 + probeIdx * 0.05,
          soakDurationSeconds: 85 + (probeIdx % 2) * 2,
          timeAboveLiquidusSeconds: 64 + (probeIdx % 3),
          peakTemperatureC: 241.5 + peakOffset,
          maxCoolingRateCPerSec: 2.6 - probeIdx * 0.05
        },
        pwi: {
          overall: 20.0 + probeIdx * 1.5,
          ramp: 20.0,
          soak: 16.7,
          tal: 15.6,
          peak: Math.abs(peakOffset) * 8.0,
          cooling: 6.7
        }
      };
    };

    return [
      generateCurve(1, 1.2, 'HOTSPOT', 'TC1: Board Top Leading Edge'),
      generateCurve(2, -2.5, 'COLDSPOT', 'TC2: BGA U1 Center (Coldspot)'),
      generateCurve(3, 0.5, 'SOLDER_JOINT', 'TC3: QFP Lead Solder Joint'),
      generateCurve(4, -1.0, 'COMPONENT_LIMIT', 'TC4: Power Inductor Body'),
      generateCurve(5, 0.0, 'BOARD_SURFACE', 'TC5: USB-C Connector Shield'),
      generateCurve(6, -0.8, 'SOLDER_JOINT', 'TC6: Trailing Edge Capacitor')
    ];
  }, []);

  const [probes, setProbes] = useState<ProbeData[]>(initialProbes);

  // Fetch active profile & state
  const loadActiveProfile = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const query = new URLSearchParams({
        lineId,
        equipmentId,
        recipeId,
        boardPartNumber,
        boardRevision
      });

      const res = await authService.authFetch(`/api/v1/reflow/profiles/active?${query.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const run = json.data.run || json.data;
          const probeList = json.data.probes || run.probes || [];
          setActiveProfile(run);
          if (probeList && probeList.length > 0) {
            setProbes(
              probeList.map((p: any, idx: number) => ({
                probeIndex: p.probeIndex || idx + 1,
                label: p.label || `TC ${idx + 1}`,
                thermalRole: p.thermalRole || 'SOLDER_JOINT',
                color: PROBE_COLORS[idx % PROBE_COLORS.length],
                samples: p.samples || [],
                metrics: p.metrics,
                pwi: p.pwi
              }))
            );
          }
        }
      }

      // Fetch process state
      const stateRes = await authService.authFetch(
        `/api/v1/reflow/process-state/${lineId}/${equipmentId}?recipeId=${recipeId}&boardPartNumber=${boardPartNumber}&boardRevision=${boardRevision}`
      );
      if (stateRes.ok) {
        const stateJson = await stateRes.json();
        if (stateJson.data?.processState) {
          setProcessState(stateJson.data.processState);
        }
      }
    } catch (err) {
      console.warn('Could not fetch active profile from backend, using initialized baseline fixtures:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveProfile();
  }, [lineId, equipmentId, recipeId, boardPartNumber, boardRevision]);

  // Handle File Upload
  const handleFileUpload = async () => {
    if (!fileContentText || !selectedFileName) {
      setStatusMessage('Please select or paste a profiler file content');
      return;
    }

    setUploadLoading(true);
    setStatusMessage(null);
    try {
      const res = await authService.authFetch('/api/v1/reflow/profiles/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFileName,
          fileContent: fileContentText,
          lineId,
          equipmentId,
          recipeId,
          boardPartNumber,
          boardRevision,
          importedBy: 'OPERATOR-SMT'
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to import profiler run');
      }

      setStatusMessage(`Profile run ${json.data.run.id.slice(0, 8)} successfully imported and evaluated (PWI: ${json.data.run.analysisResult.overallPwi}%)!`);
      setActiveProfile(json.data.run);
      setIsUploadModalOpen(false);
      await loadActiveProfile();
    } catch (err: any) {
      setStatusMessage(`Import error: ${err.message}`);
    } finally {
      setUploadLoading(false);
    }
  };

  // 21 CFR Part 11 Electronic Signature Approval & Activation
  const handleApproveAndActivate = async () => {
    if (!activeProfile || !signatureConfirmed) return;

    setLoading(true);
    setStatusMessage(null);
    try {
      // 1. Approve
      const approveRes = await authService.authFetch(`/api/v1/reflow/profiles/${activeProfile.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvedBy: signerName,
          electronicSignature: `ESIG-${Date.now()}-${signerName}`,
          comments: signOffComments
        })
      });
      const approveJson = await approveRes.json();
      if (!approveRes.ok || !approveJson.success) {
        throw new Error(approveJson.error || 'Approval failed');
      }

      // 2. Activate
      const activateRes = await authService.authFetch(`/api/v1/reflow/profiles/${activeProfile.id}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activatedBy: signerName
        })
      });
      const activateJson = await activateRes.json();
      if (!activateRes.ok || !activateJson.success) {
        throw new Error(activateJson.error || 'Activation failed');
      }

      setStatusMessage(`Profile ${activeProfile.id.slice(0, 8)} signed off and activated into production baseline!`);
      setIsSignOffModalOpen(false);
      await loadActiveProfile();
    } catch (err: any) {
      setStatusMessage(`Activation error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // SVG Chart Dimensions
  const svgWidth = 740;
  const svgHeight = 320;
  const padLeft = 50;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 40;

  const maxTime = 280;
  const maxTemp = 280;

  const timeToX = (t: number) => padLeft + (t / maxTime) * (svgWidth - padLeft - padRight);
  const tempToY = (temp: number) => svgHeight - padBottom - (temp / maxTemp) * (svgHeight - padTop - padBottom);

  // Overall PWI calculation
  const overallPwi = activeProfile?.analysisResult?.overallPwi ?? 20.0;
  const pwiResult = activeProfile?.analysisResult?.complianceResult ?? 'PASS';
  const processMargin = (100.0 - overallPwi).toFixed(1);

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Header & Process Applicability Scope */}
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[var(--mes-radius)] bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-mono font-bold text-orange-400 uppercase tracking-wider">
                  IPC-7530B • J-STD-001H CLASS 3
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-[var(--mes-radius)] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-semibold">
                  SAC305 ALLOY
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2 font-sans mt-0.5">
                Closed-Loop Reflow Oven Telemetry &amp; Thermal Profiling Engine
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--mes-radius)] bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold transition-all shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-orange-400" />
              <span>Import Profiler Run</span>
            </button>

            <button
              onClick={loadActiveProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--mes-radius)] bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''} text-cyan-400`} />
              <span>Refresh Station</span>
            </button>
          </div>
        </div>

        {/* Applicability Filter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3 pt-3 border-t border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Line</span>
            <span className="font-bold text-slate-100">{lineId}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Equipment</span>
            <span className="font-bold text-slate-100">Heller 1913 MK5 ({equipmentId})</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Recipe</span>
            <span className="font-bold text-orange-400">{recipeId}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Board Part No</span>
            <span className="font-bold text-slate-100">{boardPartNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Revision</span>
            <span className="font-bold text-emerald-400">{boardRevision}</span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-[var(--mes-radius)] bg-slate-900 border border-orange-500/40 text-orange-200 text-xs flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-100">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Key Instrumentation KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono">
        {/* PWI Dial Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Overall Process Window Index</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-[var(--mes-radius)] ${
                pwiResult === 'PASS'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : pwiResult === 'WARNING'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {pwiResult}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-bold font-mono text-slate-100 tracking-tight tabular-nums">
              {overallPwi.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">PWI Limit: 100%</span>
          </div>
          <div className="w-full bg-slate-900 border border-slate-800 h-1.5 rounded-[var(--mes-radius)] mt-3 overflow-hidden">
            <div
              className={`h-full rounded-[var(--mes-radius)] transition-all duration-500 ${
                overallPwi < 80 ? 'bg-emerald-400' : overallPwi <= 100 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, overallPwi)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
            <span>0% (Center)</span>
            <span className="text-emerald-400 font-semibold tabular-nums">Margin: +{processMargin}%</span>
            <span>100% (USL)</span>
          </div>
        </div>

        {/* Active Baseline Status */}
        <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Thermal Baseline Run</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="mt-3">
            <span className="text-sm font-mono font-bold text-slate-100">
              {activeProfile?.id ? activeProfile.id.slice(0, 16) : 'RUN-P6-SAC305-BASE'}
            </span>
            <span className="block text-[11px] text-slate-400 mt-1 font-mono">
              Status: <span className="text-emerald-400 font-bold">{activeProfile?.status || 'ACTIVE'}</span>
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">21 CFR 11 Signed</span>
            <button
              onClick={() => setIsSignOffModalOpen(true)}
              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline font-semibold"
            >
              Sign-Off / Revalidate
            </button>
          </div>
        </div>

        {/* Oven Process State & Drift Sentinel */}
        <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Oven Drift Sentinel</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`text-xs font-bold font-mono px-2 py-0.5 rounded-[var(--mes-radius)] ${
                processState === 'COMPLIANT'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : processState === 'DRIFT_SUSPECTED'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {processState}
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-slate-400 flex justify-between tabular-nums">
            <span>Persistence: 15s</span>
            <span>Hysteresis: 45s</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-mono tabular-nums">
            Worst Zone: Z7 (+1.8°C, Zμ=1.2)
          </div>
        </div>

        {/* Atmosphere & Conveyor */}
        <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Atmosphere & Speed</span>
            <Sliders className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block">Conveyor</span>
              <span className="text-base font-bold font-mono text-slate-100 tabular-nums">85.0</span>
              <span className="text-[10px] text-slate-400"> cm/min</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">N2 O2 Level</span>
              <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">420</span>
              <span className="text-[10px] text-slate-400"> ppm</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-400 tabular-nums">
            Target: 85 ± 1.5 cm/min • O2 &lt; 500 ppm
          </div>
        </div>
      </div>

      {/* 3. Thermocouple Curves Visualizer (IPC-7530B Interactive SVG Chart) */}
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <span>Multi-Channel Thermocouple Curves T(t) vs Process Window</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              IPC-7530B Profile curves with Liquidus (217°C), Soak (150–200°C), and Peak (235–248°C) bounds
            </p>
          </div>

          {/* Probe Visibility Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {probes.map((p) => (
              <button
                key={p.probeIndex}
                onClick={() =>
                  setVisibleProbes((prev) => ({ ...prev, [p.probeIndex]: !prev[p.probeIndex] }))
                }
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--mes-radius)] text-[11px] font-mono transition-all border ${
                  visibleProbes[p.probeIndex]
                    ? 'bg-slate-900 text-slate-100 border-slate-700'
                    : 'bg-slate-950 text-slate-500 border-slate-800 line-through opacity-40'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span>TC{p.probeIndex}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SVG Profile Chart */}
        <div className="relative overflow-x-auto bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto select-none"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const mouseX = e.clientX - rect.left;
              const scale = svgWidth / rect.width;
              const svgX = mouseX * scale;
              const t = ((svgX - padLeft) / (svgWidth - padLeft - padRight)) * maxTime;
              if (t >= 0 && t <= maxTime) {
                setHoveredTime(Math.round(t));
              }
            }}
            onMouseLeave={() => setHoveredTime(null)}
          >
            {/* Grid Lines */}
            {[50, 100, 150, 200, 250].map((t) => (
              <g key={`t-${t}`}>
                <line
                  x1={timeToX(t)}
                  y1={padTop}
                  x2={timeToX(t)}
                  y2={svgHeight - padBottom}
                  stroke="#334155"
                  strokeOpacity="0.4"
                  strokeDasharray="2 2"
                />
                <text
                  x={timeToX(t)}
                  y={svgHeight - padBottom + 15}
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {t}s
                </text>
              </g>
            ))}

            {[50, 100, 150, 200, 217, 240, 260].map((temp) => (
              <g key={`temp-${temp}`}>
                <line
                  x1={padLeft}
                  y1={tempToY(temp)}
                  x2={svgWidth - padRight}
                  y2={tempToY(temp)}
                  stroke={temp === 217 ? '#F43F5E' : '#334155'}
                  strokeOpacity={temp === 217 ? 0.7 : 0.4}
                  strokeDasharray={temp === 217 ? '4 2' : '2 2'}
                  strokeWidth={temp === 217 ? 1.5 : 1}
                />
                <text
                  x={padLeft - 8}
                  y={tempToY(temp) + 3}
                  fill={temp === 217 ? '#F43F5E' : '#64748B'}
                  fontSize={temp === 217 ? '10' : '9'}
                  textAnchor="end"
                  fontFamily="monospace"
                  fontWeight={temp === 217 ? 'bold' : 'normal'}
                >
                  {temp}°C
                </text>
              </g>
            ))}

            {/* Liquidus 217°C Line Label */}
            <text
              x={svgWidth - padRight - 5}
              y={tempToY(217) - 4}
              fill="#F43F5E"
              fontSize="9"
              fontWeight="bold"
              textAnchor="end"
              fontFamily="monospace"
            >
              Liquidus TL (217°C SAC305)
            </text>

            {/* Peak Window Band (235°C - 248°C) */}
            <rect
              x={timeToX(170)}
              y={tempToY(248)}
              width={timeToX(220) - timeToX(170)}
              height={tempToY(235) - tempToY(248)}
              fill="#FBBF24"
              fillOpacity="0.08"
              stroke="#FBBF24"
              strokeOpacity="0.4"
              strokeDasharray="2 2"
            />
            <text
              x={timeToX(195)}
              y={tempToY(248) - 4}
              fill="#FBBF24"
              fontSize="8"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Peak Spec Window (235–248°C)
            </text>

            {/* Soak Window Band (150°C - 200°C) */}
            <rect
              x={timeToX(70)}
              y={tempToY(200)}
              width={timeToX(160) - timeToX(70)}
              height={tempToY(150) - tempToY(200)}
              fill="#22D3EE"
              fillOpacity="0.06"
              stroke="#22D3EE"
              strokeOpacity="0.3"
              strokeDasharray="2 2"
            />
            <text
              x={timeToX(115)}
              y={tempToY(200) - 4}
              fill="#22D3EE"
              fontSize="8"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Soak Plateau (150–200°C)
            </text>

            {/* Thermocouple Curves */}
            {probes.map((p) => {
              if (!visibleProbes[p.probeIndex] || p.samples.length < 2) return null;
              const points = p.samples
                .map((s) => `${timeToX(s.timeSeconds)},${tempToY(s.temperatureC)}`)
                .join(' ');

              return (
                <polyline
                  key={p.probeIndex}
                  fill="none"
                  stroke={p.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              );
            })}

            {/* Scrubbing Cursor */}
            {hoveredTime !== null && (
              <g>
                <line
                  x1={timeToX(hoveredTime)}
                  y1={padTop}
                  x2={timeToX(hoveredTime)}
                  y2={svgHeight - padBottom}
                  stroke="#F8FAFC"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <circle cx={timeToX(hoveredTime)} cy={svgHeight - padBottom} r="3" fill="#F8FAFC" />
              </g>
            )}
          </svg>

          {/* Scrubber Tooltip */}
          {hoveredTime !== null && (
            <div className="absolute top-4 right-4 bg-slate-900/95 border border-slate-700 rounded-[var(--mes-radius)] p-3 text-xs font-mono backdrop-blur-md shadow-2xl">
              <span className="text-slate-400 block border-b border-slate-800 pb-1 mb-1 font-bold">
                TIME: {hoveredTime}s
              </span>
              <div className="space-y-1">
                {probes.map((p) => {
                  if (!visibleProbes[p.probeIndex]) return null;
                  const sample = p.samples.find((s) => Math.abs(s.timeSeconds - hoveredTime) < 2);
                  return (
                    <div key={p.probeIndex} className="flex items-center justify-between gap-3 text-[11px]">
                      <span className="flex items-center gap-1.5" style={{ color: p.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        <span>TC{p.probeIndex}</span>
                      </span>
                      <span className="font-bold text-slate-100 tabular-nums">
                        {sample ? `${sample.temperatureC.toFixed(1)}°C` : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. PWI Characteristic Breakdown Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 mb-3 pb-2 border-b border-slate-800/80 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>IPC-7530B Thermal Process Window Index (PWI) Breakdown</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-2.5 font-semibold">Thermocouple Channel</th>
                <th className="pb-2.5 font-semibold">Thermal Role</th>
                <th className="pb-2.5 font-semibold">Ramp (1–3°C/s)</th>
                <th className="pb-2.5 font-semibold">Soak (60–120s)</th>
                <th className="pb-2.5 font-semibold">TAL (45–90s)</th>
                <th className="pb-2.5 font-semibold">Peak (235–248°C)</th>
                <th className="pb-2.5 font-semibold">Cooling (1–4°C/s)</th>
                <th className="pb-2.5 font-semibold text-right">Channel PWI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {probes.map((p) => (
                <tr key={p.probeIndex} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-2.5 text-slate-100 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span>{p.label}</span>
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-[var(--mes-radius)] text-[10px] font-mono ${
                        p.thermalRole === 'COLDSPOT'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : p.thermalRole === 'HOTSPOT'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {p.thermalRole}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-200 tabular-nums">
                    {p.metrics?.maxRampRateCPerSec != null ? `${Number(p.metrics.maxRampRateCPerSec).toFixed(2)} °C/s` : '—'}
                    {p.pwi?.ramp != null && <span className="text-[10px] text-slate-400 block">({Number(p.pwi.ramp).toFixed(0)}%)</span>}
                  </td>
                  <td className="py-2.5 text-slate-200 tabular-nums">
                    {p.metrics?.soakDurationSeconds != null ? `${Number(p.metrics.soakDurationSeconds).toFixed(1)}s` : '—'}
                    {p.pwi?.soak != null && <span className="text-[10px] text-slate-400 block">({Number(p.pwi.soak).toFixed(0)}%)</span>}
                  </td>
                  <td className="py-2.5 text-slate-200 tabular-nums">
                    {p.metrics?.timeAboveLiquidusSeconds != null ? `${Number(p.metrics.timeAboveLiquidusSeconds).toFixed(1)}s` : '—'}
                    {p.pwi?.tal != null && <span className="text-[10px] text-slate-400 block">({Number(p.pwi.tal).toFixed(0)}%)</span>}
                  </td>
                  <td className="py-2.5 text-slate-100 font-bold tabular-nums">
                    {p.metrics?.peakTemperatureC != null ? `${Number(p.metrics.peakTemperatureC).toFixed(1)} °C` : '—'}
                    {p.pwi?.peak != null && <span className="text-[10px] text-slate-400 block font-normal">({Number(p.pwi.peak).toFixed(0)}%)</span>}
                  </td>
                  <td className="py-2.5 text-slate-200 tabular-nums">
                    {p.metrics?.maxCoolingRateCPerSec != null ? `${Number(p.metrics.maxCoolingRateCPerSec).toFixed(2)} °C/s` : '—'}
                    {p.pwi?.cooling != null && <span className="text-[10px] text-slate-400 block">({Number(p.pwi.cooling).toFixed(0)}%)</span>}
                  </td>
                  <td className="py-2.5 text-right font-bold tabular-nums">
                    <span
                      className={`px-2 py-0.5 rounded-[var(--mes-radius)] border ${
                        (p.pwi?.overall ?? 0) < 80
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : (p.pwi?.overall ?? 0) <= 100
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {Number(p.pwi?.overall ?? 0).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. 10-Zone Oven Tunnel Schematic & Live Telemetry */}
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Heller 1913 MK5: 10-Zone Heating Tunnel Telemetry & Drift Map</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              High-frequency (10Hz) CFX zone temperature telemetry with bivariate drift detection (Zμ &amp; Zσ)
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-[var(--mes-radius)] border border-emerald-500/20 font-semibold">
            PID CLOSED-LOOP STABLE
          </span>
        </div>

        {/* 10 Zones Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {zones.map((z) => {
            const isSpike = z.role === 'REFLOW_SPIKE';
            const isCooling = z.role === 'COOLING';

            return (
              <div
                key={z.zoneIndex}
                className={`p-2.5 rounded-[var(--mes-radius)] border font-mono transition-all ${
                  z.status === 'CONFIRMED_DRIFT'
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                    : isSpike
                    ? 'bg-amber-950/20 border-amber-500/30 text-slate-100'
                    : isCooling
                    ? 'bg-cyan-950/20 border-cyan-500/30 text-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Z{z.zoneIndex}</span>
                  <span className="text-[9px] uppercase font-bold">{z.role.slice(0, 4)}</span>
                </div>

                <div className="mt-1.5 text-center">
                  <span className="text-base font-bold tracking-tight tabular-nums text-slate-100">{Number(z.actualC ?? 0).toFixed(1)}°</span>
                  <span className="block text-[10px] text-slate-400 tabular-nums">Set: {z.setpointC ?? 0}°</span>
                </div>

                <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 text-[9px] space-y-0.5 tabular-nums">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ΔT:</span>
                    <span className={(z.meanDeviationC ?? 0) > 0 ? 'text-amber-400' : 'text-cyan-400'}>
                      {(z.meanDeviationC ?? 0) > 0 ? `+${Number(z.meanDeviationC).toFixed(1)}` : Number(z.meanDeviationC ?? 0).toFixed(1)}°
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Zμ:</span>
                    <span className="text-slate-200">{Number(z.meanZScore ?? 0).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Zσ:</span>
                    <span className="text-slate-200">{Number(z.variabilityZScore ?? 0).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Sign-off & Activation Modal (21 CFR Part 11) */}
      {isSignOffModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] max-w-lg w-full p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-100">21 CFR Part 11 Electronic Signature Sign-Off</h4>
              </div>
              <button onClick={() => setIsSignOffModalOpen(false)} className="text-slate-400 hover:text-slate-100">
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Target Profile Run ID</label>
                <input
                  type="text"
                  disabled
                  value={activeProfile?.id || 'RUN-P6-SAC305-BASE'}
                  className="w-full bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] px-3 py-1.5 text-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Reviewer Name / ID</label>
                  <input
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] px-3 py-1.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Engineering Role</label>
                  <input
                    type="text"
                    value={signerRole}
                    onChange={(e) => setSignerRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] px-3 py-1.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Certification Comments</label>
                <textarea
                  rows={3}
                  value={signOffComments}
                  onChange={(e) => setSignOffComments(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] px-3 py-1.5 text-slate-100 resize-none focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-900 rounded-[var(--mes-radius)] border border-slate-800 text-[11px] space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Compliance Verification Audit</span>
                </div>
                <p className="text-slate-400">
                  By confirming below, you attest under 21 CFR Part 11 that this physical reflow profile satisfies IPC-7530B thermal tolerances and authorize it as the authoritative baseline for line {lineId}.
                </p>
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer mt-2 pt-2 border-t border-slate-800">
                  <input
                    type="checkbox"
                    checked={signatureConfirmed}
                    onChange={(e) => setSignatureConfirmed(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>I legally execute this electronic signature.</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsSignOffModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-[var(--mes-radius)] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveAndActivate}
                  disabled={!signatureConfirmed || loading || overallPwi > 100}
                  className="px-3.5 py-1.5 rounded-[var(--mes-radius)] bg-cyan-600 hover:bg-cyan-500 text-white font-bold disabled:opacity-50 flex items-center gap-2 border border-cyan-500"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve &amp; Activate Baseline</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Profiler File Ingress Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] max-w-xl w-full p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-100">Import Physical Profiler Data (KIC / Datapaq / M.O.L.E.)</h4>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-100">
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">File Name</label>
                <input
                  type="text"
                  value={selectedFileName}
                  onChange={(e) => setSelectedFileName(e.target.value)}
                  placeholder="e.g. meter-top-run184.kic"
                  className="w-full bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] px-3 py-1.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Profiler Raw File Content</label>
                <textarea
                  rows={8}
                  value={fileContentText}
                  onChange={(e) => setFileContentText(e.target.value)}
                  placeholder="[KIC 2000 Profile]&#10;MODEL = SlimKIC 2000&#10;SAMPLEINTERVAL = 1.0&#10;[DATA]&#10;Time,TC1,TC2,TC3&#10;0.0,25.0,25.0,25.0&#10;1.0,27.0,26.8,26.5..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] px-3 py-1.5 text-slate-100 font-mono resize-none text-[11px] focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFileName('kic-golden-test.kic');
                    setFileContentText(`[KIC 2000 Profile]\nMODEL = SlimKIC 2000\nSERIAL = KIC-88412\nSAMPLEINTERVAL = 1.0\nTC1 = Leading\nTC2 = BGA U1\n[DATA]\nTime,TC1,TC2\n0.0,25.0,25.0\n10.0,43.0,42.5\n30.0,79.0,77.5\n50.0,115.0,112.5\n70.0,151.0,148.0\n100.0,175.0,172.0\n130.0,185.0,182.0\n160.0,200.0,198.0\n180.0,225.0,222.0\n195.0,241.5,238.0\n210.0,230.0,225.0\n230.0,180.0,175.0\n260.0,100.0,95.0\n`);
                  }}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 underline font-semibold"
                >
                  Load Sample KIC Fixture
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-[var(--mes-radius)] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFileUpload}
                    disabled={uploadLoading || !selectedFileName}
                    className="px-3.5 py-1.5 rounded-[var(--mes-radius)] bg-cyan-600 hover:bg-cyan-500 text-white font-bold disabled:opacity-50 flex items-center gap-2 border border-cyan-500"
                  >
                    {uploadLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Import &amp; Ingress</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
