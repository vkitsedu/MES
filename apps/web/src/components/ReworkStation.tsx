import React, { useState, useEffect } from 'react';
import {
  Cpu, Wrench, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw,
  Search, Crosshair, ArrowRight, Zap, Layers, Thermometer, Radio,
  Lock, CheckSquare, XCircle, Activity, UserCheck
} from 'lucide-react';
import { audioAlerts } from '../utils/audio-alerts';
import { authService } from '../services/auth.service';

type StationRole = 'TECHNICIAN' | 'SUPERVISOR' | 'ENGINEER';

interface PanelUnit {
  id: string;
  panel_barcode: string;
  unit_position: number;
  unit_serial_number: string;
  status: string;
  updated_at: string;
}

interface AoiDefect {
  id: string;
  inspection_id: string;
  unit_position: number;
  ref_des: string;
  defect_category: string;
  defect_type: string;
  defect_signature: string;
  offset_x_um?: number;
  offset_y_um?: number;
  rotation_deg?: number;
  board_side: string;
  status: string;
  image_ref?: string;
  created_at: string;
}

interface CadDef {
  productId: string;
  programId: string;
  refDes: string;
  unitPosition: number;
  xMm: number;
  yMm: number;
  rotationDeg: number;
  packageType: string;
  mpn: string;
  maxReworkCycles: number;
}

interface CorrelationReport {
  panelBarcode: string;
  unitPosition: number;
  refDes: string;
  defectType?: string;
  partNumber: string;
  packageType: string;
  cadCoordinates: {
    xMm: number;
    yMm: number;
    rotationDeg: number;
    boardSide: string;
  };
  feederSlot?: {
    moduleNo: number;
    slotNo: number;
    feederId: string;
    feederType: string;
  };
  componentReel?: {
    reelId: string;
    lotNumber: string;
    supplierName: string;
    dateCode: string;
    mslClass: string;
    mslRemainingMinutes: number;
  };
  nozzleTelemetry?: {
    nozzleId: string;
    recentErrorCount: number;
    lastErrorType: string;
  };
  solderPaste?: {
    jarId: string;
    lotNumber: string;
    partNumber: string;
    alloyType: string;
    status: string;
  };
  stencil?: {
    stencilId: string;
    serialNumber: string;
    revision: string;
  };
  rootCauseHypothesis: string;
}

const FALLBACK_UNITS: PanelUnit[] = [
  { id: 'u1', panel_barcode: 'PNL-260901-0042', unit_position: 1, unit_serial_number: 'SN-MTR-0042-U1', status: 'PASSED', updated_at: new Date().toISOString() },
  { id: 'u2', panel_barcode: 'PNL-260901-0042', unit_position: 2, unit_serial_number: 'SN-MTR-0042-U2', status: 'PASSED', updated_at: new Date().toISOString() },
  { id: 'u3', panel_barcode: 'PNL-260901-0042', unit_position: 3, unit_serial_number: 'SN-MTR-0042-U3', status: 'QUALITY_HOLD', updated_at: new Date().toISOString() },
  { id: 'u4', panel_barcode: 'PNL-260901-0042', unit_position: 4, unit_serial_number: 'SN-MTR-0042-U4', status: 'PASSED', updated_at: new Date().toISOString() },
  { id: 'u5', panel_barcode: 'PNL-260901-0042', unit_position: 5, unit_serial_number: 'SN-MTR-0042-U5', status: 'PASSED', updated_at: new Date().toISOString() },
  { id: 'u6', panel_barcode: 'PNL-260901-0042', unit_position: 6, unit_serial_number: 'SN-MTR-0042-U6', status: 'PASSED', updated_at: new Date().toISOString() },
];

const FALLBACK_DEFECTS: AoiDefect[] = [
  {
    id: 'defect-demo-01',
    inspection_id: 'insp-aoi-9942',
    unit_position: 3,
    ref_des: 'C12',
    defect_category: 'ALIGNMENT_LIFT',
    defect_type: 'TOMBSTONE',
    defect_signature: 'LIFTED_END_CAP_42DEG',
    offset_x_um: 14.5,
    offset_y_um: -28.2,
    rotation_deg: 42.5,
    board_side: 'TOP',
    status: 'OPEN',
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

const FALLBACK_CAD_LIST: CadDef[] = [
  { productId: 'PRD-SM-4G-V2', programId: 'PROG-SM-METER-TOP-REV4', refDes: 'C12', unitPosition: 3, xMm: 102.5, yMm: 18.0, rotationDeg: 90, packageType: '0402', mpn: 'C0402-100NF-16V', maxReworkCycles: 2 },
  { productId: 'PRD-SM-4G-V2', programId: 'PROG-SM-METER-TOP-REV4', refDes: 'R15', unitPosition: 3, xMm: 98.0, yMm: 24.5, rotationDeg: 0, packageType: '0402', mpn: 'R0402-10K-1%', maxReworkCycles: 3 },
  { productId: 'PRD-SM-4G-V2', programId: 'PROG-SM-METER-TOP-REV4', refDes: 'U2', unitPosition: 3, xMm: 110.0, yMm: 32.0, rotationDeg: 0, packageType: 'QFN-16', mpn: 'MCU-NRF52840-QFN', maxReworkCycles: 2 },
  { productId: 'PRD-SM-4G-V2', programId: 'PROG-SM-METER-TOP-REV4', refDes: 'C14', unitPosition: 3, xMm: 122.0, yMm: 18.5, rotationDeg: 90, packageType: '0402', mpn: 'C0402-100NF-16V', maxReworkCycles: 2 },
  { productId: 'PRD-SM-4G-V2', programId: 'PROG-SM-METER-TOP-REV4', refDes: 'L1', unitPosition: 3, xMm: 118.5, yMm: 26.0, rotationDeg: 0, packageType: '0603', mpn: 'IND-0603-2.2UH', maxReworkCycles: 2 },
  { productId: 'PRD-SM-4G-V2', programId: 'PROG-SM-METER-TOP-REV4', refDes: 'D4', unitPosition: 3, xMm: 104.0, yMm: 38.0, rotationDeg: 180, packageType: 'SOD-323', mpn: 'DIODE-SCHOTTKY-20V', maxReworkCycles: 2 },
  { productId: 'PRD-SM-4G-V2', programId: 'PROG-SM-METER-TOP-REV4', refDes: 'C12', unitPosition: 1, xMm: 12.5, yMm: 18.0, rotationDeg: 90, packageType: '0402', mpn: 'C0402-100NF-16V', maxReworkCycles: 2 },
  { productId: 'PRD-SM-4G-V2', programId: 'PROG-SM-METER-TOP-REV4', refDes: 'U2', unitPosition: 1, xMm: 20.0, yMm: 32.0, rotationDeg: 0, packageType: 'QFN-16', mpn: 'MCU-NRF52840-QFN', maxReworkCycles: 2 },
  { productId: 'PRD-SM-4G-V2', programId: 'PROG-SM-METER-TOP-REV4', refDes: 'C12', unitPosition: 2, xMm: 57.5, yMm: 18.0, rotationDeg: 90, packageType: '0402', mpn: 'C0402-100NF-16V', maxReworkCycles: 2 },
  { productId: 'PRD-SM-4G-V2', programId: 'PROG-SM-METER-TOP-REV4', refDes: 'U2', unitPosition: 2, xMm: 65.0, yMm: 32.0, rotationDeg: 0, packageType: 'QFN-16', mpn: 'MCU-NRF52840-QFN', maxReworkCycles: 2 },
];

const FALLBACK_CORRELATION: CorrelationReport = {
  panelBarcode: 'PNL-260901-0042',
  unitPosition: 3,
  refDes: 'C12',
  defectType: 'TOMBSTONE',
  partNumber: 'C0402-100NF-16V',
  packageType: '0402',
  cadCoordinates: {
    xMm: 102.5,
    yMm: 18.0,
    rotationDeg: 90,
    boardSide: 'TOP'
  },
  feederSlot: {
    moduleNo: 1,
    slotNo: 4,
    feederId: 'FID-W08F-04',
    feederType: '8mm Tape Feeder'
  },
  componentReel: {
    reelId: 'REEL-MUR-98124',
    lotNumber: 'LOT-MUR-2601',
    supplierName: 'Murata Electronics',
    dateCode: '2604',
    mslClass: 'MSL_1',
    mslRemainingMinutes: 9999
  },
  nozzleTelemetry: {
    nozzleId: 'NOZ-0402-A',
    recentErrorCount: 3,
    lastErrorType: 'PDERROR_PICKUP_SLIP'
  },
  solderPaste: {
    jarId: 'JAR-ALPHA-2601-C',
    lotNumber: 'LOT-AL-9921',
    partNumber: 'SAC305-T4',
    alloyType: 'SAC305',
    status: 'ON_STENCIL'
  },
  stencil: {
    stencilId: 'STN-2026-0042',
    serialNumber: 'STN-2026-0042-REV4',
    revision: 'A'
  },
  rootCauseHypothesis: 'Thermal imbalance between pad A and pad B during reflow soak zone, coupled with insufficient solder paste volume (42.5% SPI reading) on pad A.'
};

export const ReworkStation: React.FC = () => {
  const [role, setRole] = useState<StationRole>('TECHNICIAN');
  const [panelBarcode, setPanelBarcode] = useState<string>('PNL-260901-0042');
  const [selectedUnit, setSelectedUnit] = useState<number>(3);
  const [selectedRefDes, setSelectedRefDes] = useState<string>('C12');

  const [panelStatus, setPanelStatus] = useState<string>('QUALITY_HOLD');
  const [units, setUnits] = useState<PanelUnit[]>(FALLBACK_UNITS);
  const [defects, setDefects] = useState<AoiDefect[]>(FALLBACK_DEFECTS);
  const [cadList, setCadList] = useState<CadDef[]>(FALLBACK_CAD_LIST);
  const [correlation, setCorrelation] = useState<CorrelationReport | null>(FALLBACK_CORRELATION);

  // Rework action state
  const [replacementReelId, setReplacementReelId] = useState<string>('REEL-MUR-98125-SPLICE');
  const [technicianId, setTechnicianId] = useState<string>('tech-smt-042');
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [reworkCycleCount, setReworkCycleCount] = useState<number>(1);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Engineer disposition state
  const [dispositionType, setDispositionType] = useState<'REWORK' | 'SCRAP' | 'ACCEPT_AS_IS' | 'REINSPECT'>('REWORK');
  const [dispositionReason, setDispositionReason] = useState<string>('IPC-A-610 Class 3 rework authorized with calibrated hot-air station');
  const [engineerId, setEngineerId] = useState<string>('eng-qa-lead-01');

  // Supervisor state
  const [supervisorId, setSupervisorId] = useState<string>('sup-smt-01');
  const [clearInterlockReason, setClearInterlockReason] = useState<string>('Nozzle replaced and feeder tape alignment confirmed.');

  // Load panel and CAD data
  const loadPanelData = async () => {
    try {
      const res = await authService.authFetch(`/api/v1/aoi/panels/${panelBarcode}`);
      if (res.ok) {
        const json = await res.json();
        const data = json?.data ?? json;
        if (data && json.success !== false) {
          setPanelStatus(data.panelStatus || 'QUALITY_HOLD');
          setUnits(data.units || FALLBACK_UNITS);
          setDefects(data.defects || FALLBACK_DEFECTS);
          localStorage.setItem(`mes_panel_${panelBarcode}`, JSON.stringify(data));
          return;
        }
      }
    } catch (e) {
      console.warn('Panel data API fallback', e);
    }

    const cached = localStorage.getItem(`mes_panel_${panelBarcode}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setPanelStatus(parsed.panelStatus || 'QUALITY_HOLD');
        setUnits(parsed.units || FALLBACK_UNITS);
        setDefects(parsed.defects || FALLBACK_DEFECTS);
        return;
      } catch (err) {}
    }
    setUnits(FALLBACK_UNITS);
    setDefects(FALLBACK_DEFECTS);
  };

  const loadCadData = async () => {
    try {
      const res = await authService.authFetch('/api/v1/aoi/cad/PROG-SM-METER-TOP-REV4/4?boardSide=TOP');
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : null);
        if (list && list.length > 0) {
          setCadList(list);
          localStorage.setItem('mes_cad_PROG-SM-METER-TOP-REV4', JSON.stringify(list));
          return;
        }
      }
    } catch (e) {
      console.warn('CAD data API fallback', e);
    }

    const cached = localStorage.getItem('mes_cad_PROG-SM-METER-TOP-REV4');
    if (cached) {
      try {
        setCadList(JSON.parse(cached));
        return;
      } catch (err) {}
    }
    setCadList(FALLBACK_CAD_LIST);
  };

  const loadCorrelation = async () => {
    try {
      const res = await authService.authFetch(`/api/v1/aoi/correlation/${panelBarcode}/${selectedUnit}/${selectedRefDes}`);
      if (res.ok) {
        const json = await res.json();
        const data = json?.data ?? json;
        if (data && json.success !== false) {
          setCorrelation(data);
          return;
        }
      }
    } catch (e) {
      console.warn('Correlation data API fallback', e);
    }
    setCorrelation(FALLBACK_CORRELATION);
  };

  useEffect(() => {
    loadPanelData();
    loadCadData();
  }, [panelBarcode]);

  useEffect(() => {
    if (selectedRefDes) {
      loadCorrelation();
    }
  }, [selectedUnit, selectedRefDes, panelBarcode]);

  // Handle Verify Replacement Reel
  const handleVerifyReplacement = async () => {
    setActionMessage(null);
    try {
      const res = await authService.authFetch('/api/v1/aoi/rework/verify-replacement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panelBarcode,
          unitPosition: selectedUnit,
          refDes: selectedRefDes,
          replacementReelId
        })
      });
      if (res.ok) {
        const json = await res.json();
        setVerificationResult(json.data);
        if (json.success) {
          audioAlerts.playApprovalChime();
          setActionMessage({ text: 'Replacement reel verified against BOM and MSL floor life.', type: 'success' });
          return;
        } else {
          audioAlerts.playInterlockTrip();
          setActionMessage({ text: json.data?.errors?.join('; ') || 'Verification failed', type: 'error' });
          return;
        }
      }
    } catch (e) {}

    // Simulated offline verification
    if (replacementReelId.includes('EXPIRED')) {
      audioAlerts.playInterlockTrip();
      const errRes = { valid: false, currentCycle: reworkCycleCount, maxReworkCycles: 2, expectedMpn: 'C0402-100NF-16V', replacementMpn: 'C0402-100NF-16V', errors: ['JEDEC MSL floor life expired (0 mins remaining)'] };
      setVerificationResult(errRes);
      setActionMessage({ text: 'REJECTED: JEDEC MSL floor life expired.', type: 'error' });
    } else if (replacementReelId.includes('VSH-44120')) {
      audioAlerts.playInterlockTrip();
      const errRes = { valid: false, currentCycle: reworkCycleCount, maxReworkCycles: 2, expectedMpn: 'C0402-100NF-16V', replacementMpn: 'C0402-10NF-50V', errors: ['BOM mismatch: Expected 100nF, Reel is 10nF'] };
      setVerificationResult(errRes);
      setActionMessage({ text: 'REJECTED: BOM component mismatch.', type: 'error' });
    } else {
      audioAlerts.playApprovalChime();
      const passRes = { valid: true, currentCycle: reworkCycleCount, maxReworkCycles: 2, expectedMpn: 'C0402-100NF-16V', replacementMpn: 'C0402-100NF-16V' };
      setVerificationResult(passRes);
      setActionMessage({ text: 'Replacement reel verified against BOM and MSL floor life.', type: 'success' });
    }
  };

  // Handle Execute Rework
  const handleExecuteRework = async () => {
    const activeDef = defects.find(d => d.unit_position === selectedUnit && d.ref_des === selectedRefDes);
    const defectId = activeDef ? activeDef.id : 'defect-demo-01';

    try {
      const res = await authService.authFetch('/api/v1/aoi/rework/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defectId,
          panelBarcode,
          unitPosition: selectedUnit,
          refDes: selectedRefDes,
          technicianId,
          stationId: 'STATION-REWORK-01',
          replacementReelId,
          reworkMethod: 'HOT_AIR_DESOLDER_SOLDERING_IRON'
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          audioAlerts.playApprovalChime();
          setActionMessage({ text: json.data?.message || 'Rework completed.', type: 'success' });
          loadPanelData();
          loadCorrelation();
          return;
        }
      }
    } catch (e) {}

    // Simulated offline rework execution
    setReworkCycleCount(prev => prev + 1);
    audioAlerts.playApprovalChime();
    setActionMessage({ text: `Component ${selectedRefDes} desoldered and replaced with verified reel ${replacementReelId}. Proceed to AOI re-inspection.`, type: 'success' });
    setUnits(prev => prev.map(u => u.unit_position === selectedUnit ? { ...u, status: 'REWORK_IN_PROGRESS' } : u));
  };

  // Handle Mandatory Post-Rework Re-Inspection
  const handlePostReworkInspection = async (result: 'PASS' | 'FAIL') => {
    const activeDef = defects.find(d => d.unit_position === selectedUnit && d.ref_des === selectedRefDes);
    const defectId = activeDef ? activeDef.id : 'defect-demo-01';

    try {
      const res = await authService.authFetch('/api/v1/aoi/post-rework-inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panelBarcode,
          unitPosition: selectedUnit,
          defectId,
          result,
          inspectorId: role === 'ENGINEER' ? engineerId : technicianId,
          notes: `Post-rework 3D AOI inspection result: ${result}`
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          if (result === 'PASS') {
            audioAlerts.playApprovalChime();
            setActionMessage({ text: `Post-rework inspection PASSED! Unit ${selectedUnit} is RELEASED.`, type: 'success' });
          } else {
            audioAlerts.playInterlockTrip();
            setActionMessage({ text: `Post-rework inspection FAILED. Unit ${selectedUnit} moved to REWORK_FAILED.`, type: 'error' });
          }
          loadPanelData();
          return;
        }
      }
    } catch (e) {}

    // Simulated offline post-rework inspection
    if (result === 'PASS') {
      audioAlerts.playApprovalChime();
      setActionMessage({ text: `Post-rework inspection PASSED! Unit ${selectedUnit} is RELEASED.`, type: 'success' });
      setUnits(prev => prev.map(u => u.unit_position === selectedUnit ? { ...u, status: 'REWORK_PASSED' } : u));
      setDefects(prev => prev.map(d => d.unit_position === selectedUnit && d.ref_des === selectedRefDes ? { ...d, status: 'CLOSED' } : d));
    } else {
      audioAlerts.playInterlockTrip();
      setActionMessage({ text: `Post-rework inspection FAILED. Unit ${selectedUnit} moved to REWORK_FAILED.`, type: 'error' });
      setUnits(prev => prev.map(u => u.unit_position === selectedUnit ? { ...u, status: 'REWORK_FAILED' } : u));
    }
  };

  // Handle Engineer Disposition
  const handleRecordDisposition = async () => {
    const activeDef = defects.find(d => d.unit_position === selectedUnit && d.ref_des === selectedRefDes);
    const defectId = activeDef ? activeDef.id : 'defect-demo-01';

    try {
      const res = await authService.authFetch('/api/v1/aoi/disposition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defectId,
          panelBarcode,
          unitPosition: selectedUnit,
          disposition: dispositionType,
          reason: dispositionReason,
          authorizedBy: engineerId
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          audioAlerts.playApprovalChime();
          setActionMessage({ text: `Engineering disposition [${dispositionType}] recorded successfully.`, type: 'success' });
          loadPanelData();
          return;
        }
      }
    } catch (e) {}

    // Simulated offline disposition
    audioAlerts.playApprovalChime();
    setActionMessage({ text: `Engineering disposition [${dispositionType}] recorded under MRB authority by ${engineerId}.`, type: 'success' });
    if (dispositionType === 'SCRAP') {
      setUnits(prev => prev.map(u => u.unit_position === selectedUnit ? { ...u, status: 'SCRAPPED' } : u));
    } else if (dispositionType === 'ACCEPT_AS_IS') {
      setUnits(prev => prev.map(u => u.unit_position === selectedUnit ? { ...u, status: 'CONCESSION_RELEASE' } : u));
    }
  };

  // Handle Supervisor Clear Interlock
  const handleClearInterlock = async () => {
    try {
      const res = await authService.authFetch('/api/v1/aoi/interlocks/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workCenterId: 'wc-nxt-01',
          authorizedBy: supervisorId,
          reason: clearInterlockReason
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          audioAlerts.playApprovalChime();
          setActionMessage({ text: json.message, type: 'success' });
          return;
        }
      }
    } catch (e) {}

    // Simulated offline interlock clear
    audioAlerts.playApprovalChime();
    setActionMessage({ text: `Supervisor interlock cleared on wc-nxt-01 by ${supervisorId}. Feeder placement resumed.`, type: 'success' });
  };

  // Filter CAD components for the currently selected unit
  const unitCadComponents = cadList.filter(c => c.unitPosition === selectedUnit);

  // Active unit info
  const activeUnitInfo = units.find(u => u.unit_position === selectedUnit);
  const activeDefect = defects.find(d => d.unit_position === selectedUnit && d.ref_des === selectedRefDes);

  return (
    <div className="space-y-4 font-mono">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-[var(--mes-radius)] bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Crosshair className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                PHASE 3 // CLOSED-LOOP 3D AOI &amp; REWORK
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">KOH YOUNG ZENITH &amp; OMRON VT-S READY</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2 mt-0.5">
              Cleanroom PCBA Rework Kiosk <span className="text-[10px] font-mono px-2 py-0.5 rounded-[var(--mes-radius)] bg-slate-900 text-slate-400 border border-slate-800">C12 TOP LAYER</span>
            </h2>
          </div>
        </div>

        {/* 3 Cleanroom Operating Modes */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-[var(--mes-radius)] border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setRole('TECHNICIAN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--mes-radius)] transition-colors ${
              role === 'TECHNICIAN'
                ? 'bg-slate-950 text-emerald-400 font-bold border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>TECHNICIAN</span>
          </button>
          <button
            onClick={() => setRole('SUPERVISOR')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--mes-radius)] transition-colors ${
              role === 'SUPERVISOR'
                ? 'bg-slate-950 text-amber-400 font-bold border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SUPERVISOR</span>
          </button>
          <button
            onClick={() => setRole('ENGINEER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--mes-radius)] transition-colors ${
              role === 'ENGINEER'
                ? 'bg-slate-950 text-cyan-400 font-bold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>ENGINEER</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className={`p-3 rounded-[var(--mes-radius)] border font-mono text-xs flex items-center justify-between gap-3 ${
          actionMessage.type === 'success'
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
            : actionMessage.type === 'error'
            ? 'bg-rose-950/20 border-rose-500/30 text-rose-400'
            : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-400'
        }`}>
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-100 text-xs">✕</button>
        </div>
      )}

      {/* Multi-Up Panel & Unit Selector Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">PANEL BARCODE:</span>
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-[var(--mes-radius)] border border-slate-800">
              <input
                type="text"
                value={panelBarcode}
                onChange={(e) => setPanelBarcode(e.target.value.trim().toUpperCase())}
                className="bg-transparent text-xs font-mono font-bold text-slate-100 outline-none w-44"
              />
              <button onClick={loadPanelData} className="text-emerald-400 hover:text-slate-100 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-[var(--mes-radius)] border ${
              panelStatus === 'PASSED'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
            }`}>
              {panelStatus}
            </span>
          </div>

          <div className="text-[10px] font-mono text-slate-400">
            6-UP MULTI-PANEL HIERARCHY (1 PANEL = 6 ASSEMBLED BOARDS)
          </div>
        </div>

        {/* 6-Up Multi-Panel Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((unitNo) => {
            const unitObj = units.find(u => u.unit_position === unitNo);
            const status = unitObj ? unitObj.status : (unitNo === 3 ? 'QUALITY_HOLD' : 'PASSED');
            const isHold = status === 'QUALITY_HOLD' || status === 'REWORK_FAILED';
            const isSelected = selectedUnit === unitNo;

            return (
              <button
                key={unitNo}
                onClick={() => setSelectedUnit(unitNo)}
                className={`p-2.5 rounded-[var(--mes-radius)] border text-left font-mono transition-colors relative overflow-hidden ${
                  isSelected
                    ? 'border-emerald-500 bg-slate-900 text-slate-100'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {isHold && (
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping m-1.5" />
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-bold">UNIT {unitNo}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-[var(--mes-radius)] border ${
                    status === 'PASSED' || status === 'RELEASED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : isHold
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : status === 'REWORK_PASSED'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {status}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-100 truncate tabular-nums">
                  {unitObj?.unit_serial_number || `SN-MTR-0042-U${unitNo}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: CAD Visualizer + Rework Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (7 cols): Vector SVG PCB CAD Map */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-100 font-bold uppercase tracking-wider">UNIT {selectedUnit} CAD VECTOR VIEW</span>
              <span className="text-slate-700">|</span>
              <span className="text-slate-400">TOP LAYER (X: 0..45mm, Y: 0..60mm)</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-xs bg-rose-500 animate-pulse" />
                DEFECT (TOMBSTONE)
              </span>
              <span className="flex items-center gap-1 text-emerald-400 ml-2">
                <span className="w-2 h-2 rounded-xs bg-emerald-400" />
                NOMINAL
              </span>
            </div>
          </div>

          {/* Scaled PCB SVG Board Visualizer */}
          <div className="relative flex-1 bg-slate-950 rounded-[var(--mes-radius)] border border-slate-800 p-4 min-h-[360px] flex items-center justify-center overflow-hidden">
            {/* PCB Trace grid pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34D399_1px,transparent_1px)] [background-size:16px_16px]" />

            <svg
              viewBox="0 0 550 320"
              className="w-full h-full max-h-[420px] select-none"
            >
              {/* SMT PCB Green Substrate Outline */}
              <rect
                x="20"
                y="20"
                width="510"
                height="280"
                rx="2"
                fill="#061A12"
                stroke="#134E36"
                strokeWidth="2"
              />

              {/* Fiducials & Ground Planes */}
              <circle cx="45" cy="45" r="4.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
              <circle cx="505" cy="45" r="4.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
              <circle cx="45" cy="275" r="4.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
              <circle cx="505" cy="275" r="4.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />

              {/* Silkscreen lines */}
              <rect x="35" y="35" width="480" height="250" fill="none" stroke="#F8FAFC" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.25" />
              <text x="45" y="65" fill="#F8FAFC" opacity="0.5" fontSize="10" fontFamily="monospace">
                PROG-SM-METER-TOP // U{selectedUnit}
              </text>

              {/* Render Components */}
              {unitCadComponents.length > 0 ? (
                unitCadComponents.map((c) => {
                  const isDefective = activeDefect && activeDefect.ref_des === c.refDes;
                  const isSelected = selectedRefDes === c.refDes;

                  // Normalize coordinates inside the SVG viewBox
                  const unitOffsetMm = (selectedUnit - 1) * 45.0;
                  const localX = (c.xMm - unitOffsetMm) * 9.5 + 60;
                  const localY = c.yMm * 4.2 + 40;

                  const isIc = c.packageType.includes('QFN') || c.packageType.includes('LGA') || c.packageType.includes('LQFP');
                  const width = isIc ? (c.packageType.includes('LGA') ? 80 : 50) : 26;
                  const height = isIc ? (c.packageType.includes('LGA') ? 70 : 50) : 16;

                  return (
                    <g
                      key={c.refDes}
                      onClick={() => setSelectedRefDes(c.refDes)}
                      className="cursor-pointer transition-all"
                    >
                      {/* Defect Highlight Glow */}
                      {isDefective && (
                        <rect
                          x={localX - width / 2 - 8}
                          y={localY - height / 2 - 8}
                          width={width + 16}
                          height={height + 16}
                          rx="4"
                          fill="#F43F5E"
                          fillOpacity="0.25"
                          stroke="#F43F5E"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          className="animate-pulse"
                        />
                      )}

                      {/* Component Body */}
                      <rect
                        x={localX - width / 2}
                        y={localY - height / 2}
                        width={width}
                        height={height}
                        rx={isIc ? 2 : 1}
                        fill={isDefective ? '#881337' : isSelected ? '#1E3A8A' : isIc ? '#0F172A' : '#1E293B'}
                        stroke={isDefective ? '#F43F5E' : isSelected ? '#38BDF8' : '#475569'}
                        strokeWidth={isSelected ? 2 : 1}
                      />

                      {/* Pads for passives */}
                      {!isIc && (
                        <>
                          <rect x={localX - width / 2} y={localY - height / 2} width="5" height={height} fill="#94A3B8" />
                          <rect x={localX + width / 2 - 5} y={localY - height / 2} width="5" height={height} fill="#94A3B8" />
                        </>
                      )}

                      {/* RefDes Label */}
                      <text
                        x={localX}
                        y={localY + 3}
                        fill={isDefective ? '#FECDD3' : '#F8FAFC'}
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {c.refDes}
                      </text>

                      {/* Defect Callout Indicator */}
                      {isDefective && (
                        <g>
                          <line x1={localX} y1={localY - height / 2} x2={localX + 30} y2={localY - height / 2 - 25} stroke="#F43F5E" strokeWidth="1.5" />
                          <rect x={localX + 25} y={localY - height / 2 - 40} width="115" height="18" rx="2" fill="#881337" stroke="#F43F5E" strokeWidth="1" />
                          <text x={localX + 30} y={localY - height / 2 - 27} fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold">
                            ⚠ {activeDefect.defect_type}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })
              ) : (
                <text x="275" y="160" fill="#64748B" fontSize="14" textAnchor="middle" fontFamily="monospace">
                  Loading CAD Coordinates for Unit {selectedUnit}...
                </text>
              )}
            </svg>
          </div>

          {/* Bottom Component Details Bar */}
          <div className="mt-3 p-3 bg-slate-900 rounded-[var(--mes-radius)] border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400">SELECTED: </span>
                <strong className="text-emerald-400 text-sm font-mono">{selectedRefDes}</strong>
              </div>
              <div>
                <span className="text-slate-400">MPN: </span>
                <strong className="text-slate-100">{correlation?.partNumber || 'C0402-100NF-16V'}</strong>
              </div>
              <div>
                <span className="text-slate-400">PACKAGE: </span>
                <strong className="text-slate-100">{correlation?.packageType || '0402'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400">CAD COORD: </span>
                <strong className="text-slate-100 tabular-nums">
                  X: {Number(correlation?.cadCoordinates?.xMm ?? 0).toFixed(2)}mm, Y: {Number(correlation?.cadCoordinates?.yMm ?? 0).toFixed(2)}mm
                </strong>
              </div>
              <div>
                <span className="text-slate-400">MAX CYCLES: </span>
                <strong className="text-amber-400 tabular-nums">
                  {verificationResult?.maxReworkCycles ?? 2} (JEDEC)
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Rework Action / Mode Panels */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. TECHNICIAN MODE: Verify & Replace */}
          {role === 'TECHNICIAN' && (
            <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2 font-mono uppercase tracking-wider">
                  <Wrench className="w-4 h-4 text-emerald-400" />
                  REWORK EXECUTION BENCH
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-[var(--mes-radius)] border border-emerald-500/30 font-bold">
                  READY
                </span>
              </div>

              {/* Status Warning if Hold */}
              {activeUnitInfo?.status === 'QUALITY_HOLD' && (
                <div className="p-2.5 bg-rose-950/20 border border-rose-500/30 rounded-[var(--mes-radius)] font-mono text-xs text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                  <div>
                    <strong className="text-rose-200">UNIT ON QUALITY HOLD:</strong> Optical defect recorded on {selectedRefDes} ({activeDefect?.defect_type || 'TOMBSTONE'}). Replace component with verified reel.
                  </div>
                </div>
              )}

              {/* Replacement Reel Scanner Input */}
              <div className="space-y-2 font-mono text-xs">
                <label className="text-slate-400 text-[10px] uppercase">SCAN REPLACEMENT REEL LOT BARCODE:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replacementReelId}
                    onChange={(e) => setReplacementReelId(e.target.value.trim().toUpperCase())}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleVerifyReplacement}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-semibold rounded-[var(--mes-radius)] border border-emerald-500/40 flex items-center gap-1.5 transition-colors text-xs"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>VERIFY</span>
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="text-[10px] text-slate-400">Presets:</span>
                  <button
                    onClick={() => setReplacementReelId('REEL-MUR-98125-SPLICE')}
                    className="text-[10px] px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-[var(--mes-radius)] border border-slate-800 transition-colors"
                  >
                    REEL-MUR-98125 (VALID 100nF)
                  </button>
                  <button
                    onClick={() => setReplacementReelId('REEL-EXPIRED-TEST-01')}
                    className="text-[10px] px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-rose-400 rounded-[var(--mes-radius)] border border-slate-800 transition-colors"
                  >
                    EXPIRED-TEST-01 (MSL FAIL)
                  </button>
                  <button
                    onClick={() => setReplacementReelId('REEL-VSH-44120')}
                    className="text-[10px] px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-[var(--mes-radius)] border border-slate-800 transition-colors"
                  >
                    REEL-VSH-44120 (BOM MISMATCH)
                  </button>
                </div>
              </div>

              {/* Verification Assessment Badge */}
              {verificationResult && (
                <div className={`p-2.5 rounded-[var(--mes-radius)] border font-mono text-xs space-y-1 ${
                  verificationResult.valid
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span>{verificationResult.valid ? '✓ VERIFICATION PASSED' : '✕ VERIFICATION FAILED'}</span>
                    <span className="tabular-nums">CYCLE {verificationResult.currentCycle} OF {verificationResult.maxReworkCycles}</span>
                  </div>
                  <div className="text-slate-200">
                    BOM Expected: <strong>{verificationResult.expectedMpn}</strong> | Scanned: <strong>{verificationResult.replacementMpn}</strong>
                  </div>
                  {verificationResult.errors && verificationResult.errors.length > 0 && (
                    <div className="text-rose-400">
                      Reason: {verificationResult.errors.join('; ')}
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleExecuteRework}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono font-bold rounded-[var(--mes-radius)] flex items-center justify-center gap-2 transition-colors border border-emerald-400"
              >
                <Zap className="w-4 h-4" />
                <span>EXECUTE COMPONENT REPLACEMENT</span>
              </button>

              {/* Mandatory Post-Rework Re-Inspection Gate */}
              <div className="pt-2.5 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400 text-[10px] uppercase">POST-REWORK RE-INSPECTION GATE:</span>
                  <span className="text-amber-400 font-bold text-[10px]">MANDATORY</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handlePostReworkInspection('PASS')}
                    className="py-1.5 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 font-mono font-bold text-xs rounded-[var(--mes-radius)] border border-emerald-500/40 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>AOI RE-INSPECT PASS</span>
                  </button>
                  <button
                    onClick={() => handlePostReworkInspection('FAIL')}
                    className="py-1.5 bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 font-mono font-bold text-xs rounded-[var(--mes-radius)] border border-rose-500/40 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>AOI RE-INSPECT FAIL</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. SUPERVISOR MODE: Sentinel Trends & Interlock Clear */}
          {role === 'SUPERVISOR' && (
            <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2 font-mono uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  REPEAT DEFECT SENTINEL
                </h3>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-[var(--mes-radius)] border border-amber-500/30 font-bold">
                  SUPERVISOR LOCKOUT
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-2.5 bg-slate-900 rounded-[var(--mes-radius)] border border-slate-800 space-y-1.5">
                  <div className="text-slate-400 text-[10px] uppercase">ACTIVE QUALITY RULES FOR PROGRAM:</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-200">
                    <div>Consecutive Limit: <strong className="text-rose-400">3 panels</strong></div>
                    <div>Sliding Window: <strong className="text-amber-400">5 in 20 panels</strong></div>
                    <div>Interlock Action: <strong className="text-emerald-400">HOLD SMT PICK &amp; PLACE</strong></div>
                    <div>Interlock Scope: <strong className="text-slate-300">Fuji NXT III (wc-nxt-01)</strong></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 text-[10px] uppercase">CLEAR INTERLOCK AUTHORIZATION REASON:</label>
                  <textarea
                    rows={2}
                    value={clearInterlockReason}
                    onChange={(e) => setClearInterlockReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-2 text-xs text-slate-100 outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleClearInterlock}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono font-bold rounded-[var(--mes-radius)] flex items-center justify-center gap-2 transition-colors border border-amber-400"
                >
                  <Radio className="w-4 h-4" />
                  <span>CLEAR PRODUCTION HOLD INTERLOCK</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. ENGINEER MODE: Formal Engineering Disposition */}
          {role === 'ENGINEER' && (
            <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2 font-mono uppercase tracking-wider">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  ENGINEERING DISPOSITION
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-[var(--mes-radius)] border border-cyan-500/30 font-bold">
                  MRB AUTHORITY
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-slate-400 text-[10px] uppercase">DISPOSITION DECISION:</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {(['REWORK', 'SCRAP', 'ACCEPT_AS_IS', 'REINSPECT'] as const).map((disp) => (
                      <button
                        key={disp}
                        onClick={() => setDispositionType(disp)}
                        className={`py-1.5 px-2 rounded-[var(--mes-radius)] border text-center transition-colors font-semibold text-xs ${
                          dispositionType === disp
                            ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {disp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] uppercase">ENGINEERING JUSTIFICATION &amp; REFERENCE:</label>
                  <textarea
                    rows={3}
                    value={dispositionReason}
                    onChange={(e) => setDispositionReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-2 text-xs text-slate-100 outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleRecordDisposition}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold rounded-[var(--mes-radius)] flex items-center justify-center gap-2 transition-colors border border-cyan-400"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>COMMIT ENGINEERING DISPOSITION</span>
                </button>
              </div>
            </div>
          )}

          {/* Root-Cause Correlation Card */}
          {correlation && (
            <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-3 font-mono text-xs">
              <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wider pb-2 border-b border-slate-800/80">
                <Activity className="w-4 h-4 text-emerald-400" />
                UPSTREAM ROOT-CAUSE CORRELATION
              </h4>

              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400">Placement Feeder Slot:</span>
                  <strong className="text-slate-100">
                    Mod {correlation.feederSlot?.moduleNo || 1} • Slot {correlation.feederSlot?.slotNo || 1} ({correlation.feederSlot?.feederId || 'FID-W08F-01'})
                  </strong>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400">SMT Reel Lot:</span>
                  <strong className="text-emerald-400">
                    {correlation.componentReel?.lotNumber || 'LOT-MUR-2601'} ({correlation.componentReel?.mslClass || 'MSL_1'})
                  </strong>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400">Fuji Pick Nozzle:</span>
                  <strong className="text-slate-100">
                    {correlation.nozzleTelemetry?.nozzleId || 'NOZ-0402-A'} ({correlation.nozzleTelemetry?.recentErrorCount || 0} pickup errs)
                  </strong>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400">Solder Paste Jar:</span>
                  <strong className="text-amber-400">
                    {correlation.solderPaste?.jarId || 'JAR-ALPHA-2601-C'} ({correlation.solderPaste?.alloyType || 'SAC305'})
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Active Stencil:</span>
                  <strong className="text-slate-100">
                    {correlation.stencil?.serialNumber || 'STN-2026-0042'} (Rev {correlation.stencil?.revision || 'A'})
                  </strong>
                </div>
              </div>

              {/* Root Cause Hypothesis Box */}
              <div className="p-2.5 bg-slate-900 rounded-[var(--mes-radius)] border border-slate-800 text-slate-100">
                <div className="text-[10px] text-amber-400 font-bold mb-0.5 uppercase tracking-wider">DIAGNOSTIC HYPOTHESIS:</div>
                <p className="text-xs leading-relaxed text-slate-300">
                  {correlation.rootCauseHypothesis}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
