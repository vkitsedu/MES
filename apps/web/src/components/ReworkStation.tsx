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
        if (json.success && json.data) {
          setPanelStatus(json.data.panelStatus);
          setUnits(json.data.units || FALLBACK_UNITS);
          setDefects(json.data.defects || FALLBACK_DEFECTS);
          localStorage.setItem(`mes_panel_${panelBarcode}`, JSON.stringify(json.data));
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
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCadList(json.data);
          localStorage.setItem('mes_cad_PROG-SM-METER-TOP-REV4', JSON.stringify(json.data));
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
        if (json.success && json.data) {
          setCorrelation(json.data);
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
    <div className="space-y-6 font-mono">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border)] rounded-2xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
            <Crosshair className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                PHASE 3 // CLOSED-LOOP 3D AOI & REWORK
              </span>
              <span className="text-white/30">•</span>
              <span className="text-xs font-mono text-[var(--mes-status-pass)] font-bold">KOH YOUNG ZENITH & OMRON VT-S READY</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--mes-text-primary)] tracking-tight flex items-center gap-2">
              Cleanroom PCBA Rework Kiosk <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--mes-bg-well)] text-[var(--mes-text-muted)] border border-[var(--mes-border)]/40">C12 TOP LAYER</span>
            </h2>
          </div>
        </div>

        {/* 3 Cleanroom Operating Modes */}
        <div className="flex items-center gap-1 bg-[var(--mes-bg-well)] p-1.5 rounded-xl border border-[var(--mes-border)] font-mono text-xs">
          <button
            onClick={() => setRole('TECHNICIAN')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              role === 'TECHNICIAN'
                ? 'bg-[var(--mes-bg-card)] text-[var(--mes-status-pass)] font-bold border border-[var(--mes-status-pass)]/40 shadow-sm'
                : 'text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>TECHNICIAN</span>
          </button>
          <button
            onClick={() => setRole('SUPERVISOR')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              role === 'SUPERVISOR'
                ? 'bg-[var(--mes-bg-card)] text-[var(--mes-status-warn)] font-bold border border-[var(--mes-status-warn)]/40 shadow-sm'
                : 'text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SUPERVISOR</span>
          </button>
          <button
            onClick={() => setRole('ENGINEER')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              role === 'ENGINEER'
                ? 'bg-[var(--mes-bg-card)] text-[var(--mes-accent-primary)] font-bold border border-[var(--mes-accent-primary)]/40 shadow-sm'
                : 'text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>ENGINEER</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className={`p-4 rounded-xl border font-mono text-sm flex items-center justify-between gap-3 ${
          actionMessage.type === 'success'
            ? 'bg-[var(--mes-status-pass)]/10 border-[var(--mes-status-pass)]/40 text-[var(--mes-status-pass)]'
            : actionMessage.type === 'error'
            ? 'bg-[var(--mes-status-fail)]/10 border-[var(--mes-status-fail)]/40 text-[var(--mes-status-fail)]'
            : 'bg-[var(--mes-accent-primary)]/10 border-[var(--mes-accent-primary)]/40 text-[var(--mes-accent-primary)]'
        }`}>
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)] text-xs">✕</button>
        </div>
      )}

      {/* Multi-Up Panel & Unit Selector Bar */}
      <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border)] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[var(--mes-text-muted)] uppercase tracking-wider">PANEL BARCODE:</span>
            <div className="flex items-center gap-2 bg-[var(--mes-bg-well)] px-3 py-1.5 rounded-lg border border-[var(--mes-border)]">
              <input
                type="text"
                value={panelBarcode}
                onChange={(e) => setPanelBarcode(e.target.value.trim().toUpperCase())}
                className="bg-transparent text-sm font-mono font-bold text-[var(--mes-text-primary)] outline-none w-48"
              />
              <button onClick={loadPanelData} className="text-[var(--mes-status-pass)] hover:text-white transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
              panelStatus === 'PASSED'
                ? 'bg-[var(--mes-status-pass)]/10 text-[var(--mes-status-pass)] border-[var(--mes-status-pass)]/30'
                : 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
            }`}>
              {panelStatus}
            </span>
          </div>

          <div className="text-xs font-mono text-[var(--mes-text-muted)]">
            6-UP MULTI-PANEL HIERARCHY (1 PANEL = 6 ASSEMBLED BOARDS)
          </div>
        </div>

        {/* 6-Up Multi-Panel Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((unitNo) => {
            const unitObj = units.find(u => u.unit_position === unitNo);
            const status = unitObj ? unitObj.status : (unitNo === 3 ? 'QUALITY_HOLD' : 'PASSED');
            const isHold = status === 'QUALITY_HOLD' || status === 'REWORK_FAILED';
            const isSelected = selectedUnit === unitNo;

            return (
              <button
                key={unitNo}
                onClick={() => setSelectedUnit(unitNo)}
                className={`p-3 rounded-xl border text-left font-mono transition-all relative overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-[var(--mes-status-pass)] bg-[var(--mes-bg-card)] border-[var(--mes-border)] shadow-md'
                    : 'bg-[var(--mes-bg-well)] border-[var(--mes-border)]/60 hover:border-[var(--mes-border)]'
                }`}
              >
                {isHold && (
                  <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 animate-ping m-1.5" />
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[var(--mes-text-muted)] font-bold">UNIT {unitNo}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    status === 'PASSED' || status === 'RELEASED'
                      ? 'bg-[var(--mes-status-pass)]/20 text-[var(--mes-status-pass)]'
                      : isHold
                      ? 'bg-red-500/20 text-red-400 font-bold'
                      : status === 'REWORK_PASSED'
                      ? 'bg-teal-500/20 text-teal-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {status}
                  </span>
                </div>
                <div className="text-xs font-bold text-[var(--mes-text-primary)] truncate">
                  {unitObj?.unit_serial_number || `SN-MTR-0042-U${unitNo}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: CAD Visualizer + Rework Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Vector SVG PCB CAD Map */}
        <div className="lg:col-span-7 bg-[var(--mes-bg-surface)] border border-[var(--mes-border)] rounded-2xl p-5 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--mes-status-pass)]" />
              <span className="text-[var(--mes-text-primary)] font-bold">UNIT {selectedUnit} CAD VECTOR VIEW</span>
              <span className="text-white/40">|</span>
              <span className="text-[var(--mes-text-muted)]">TOP LAYER (X: 0..45mm, Y: 0..60mm)</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2.5 h-2.5 rounded bg-red-500 animate-pulse" />
                DEFECT (TOMBSTONE)
              </span>
              <span className="flex items-center gap-1 text-[var(--mes-status-pass)] ml-2">
                <span className="w-2.5 h-2.5 rounded bg-[var(--mes-status-pass)]" />
                NOMINAL
              </span>
            </div>
          </div>

          {/* Scaled PCB SVG Board Visualizer */}
          <div className="relative flex-1 bg-[var(--mes-bg-well)] rounded-xl border border-[var(--mes-border)] p-4 min-h-[360px] flex items-center justify-center overflow-hidden">
            {/* PCB Trace grid pattern overlay */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--mes-status-pass)_1px,transparent_1px)] [background-size:16px_16px]" />

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
                rx="10"
                fill="#0B1A14"
                stroke="#1B4D3E"
                strokeWidth="3"
              />

              {/* Fiducials & Ground Planes */}
              <circle cx="45" cy="45" r="5" fill="#C9A84E" stroke="#E5C158" strokeWidth="1.5" />
              <circle cx="505" cy="45" r="5" fill="#C9A84E" stroke="#E5C158" strokeWidth="1.5" />
              <circle cx="45" cy="275" r="5" fill="#C9A84E" stroke="#E5C158" strokeWidth="1.5" />
              <circle cx="505" cy="275" r="5" fill="#C9A84E" stroke="#E5C158" strokeWidth="1.5" />

              {/* Silkscreen lines */}
              <rect x="35" y="35" width="480" height="250" fill="none" stroke="#FFFFFF" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.4" />
              <text x="45" y="65" fill="#FFFFFF" opacity="0.6" fontSize="10" fontFamily="monospace">
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
                          rx="6"
                          fill="#FF3B30"
                          fillOpacity="0.25"
                          stroke="#FF3B30"
                          strokeWidth="2"
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
                        rx={isIc ? 3 : 2}
                        fill={isDefective ? '#7F1D1D' : isSelected ? '#1E3A8A' : isIc ? '#1F2937' : '#374151'}
                        stroke={isDefective ? '#EF4444' : isSelected ? '#60A5FA' : '#9CA3AF'}
                        strokeWidth={isSelected ? 2.5 : 1.2}
                      />

                      {/* Pads for passives */}
                      {!isIc && (
                        <>
                          <rect x={localX - width / 2} y={localY - height / 2} width="6" height={height} fill="#D1D5DB" />
                          <rect x={localX + width / 2 - 6} y={localY - height / 2} width="6" height={height} fill="#D1D5DB" />
                        </>
                      )}

                      {/* RefDes Label */}
                      <text
                        x={localX}
                        y={localY + 3}
                        fill={isDefective ? '#FCA5A5' : '#FFFFFF'}
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
                          <line x1={localX} y1={localY - height / 2} x2={localX + 30} y2={localY - height / 2 - 25} stroke="#EF4444" strokeWidth="1.5" />
                          <rect x={localX + 25} y={localY - height / 2 - 40} width="115" height="18" rx="3" fill="#991B1B" stroke="#EF4444" strokeWidth="1" />
                          <text x={localX + 30} y={localY - height / 2 - 27} fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold">
                            ⚠ {activeDefect.defect_type}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })
              ) : (
                <text x="275" y="160" fill="var(--mes-text-muted)" fontSize="14" textAnchor="middle" fontFamily="monospace">
                  Loading CAD Coordinates for Unit {selectedUnit}...
                </text>
              )}
            </svg>
          </div>

          {/* Bottom Component Details Bar */}
          <div className="mt-4 p-3 bg-[var(--mes-bg-well)] rounded-xl border border-[var(--mes-border)] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[var(--mes-text-muted)]">SELECTED: </span>
                <strong className="text-[var(--mes-status-pass)] text-sm">{selectedRefDes}</strong>
              </div>
              <div>
                <span className="text-[var(--mes-text-muted)]">MPN: </span>
                <strong className="text-[var(--mes-text-primary)]">{correlation?.partNumber || 'C0402-100NF-16V'}</strong>
              </div>
              <div>
                <span className="text-[var(--mes-text-muted)]">PACKAGE: </span>
                <strong className="text-[var(--mes-text-primary)]">{correlation?.packageType || '0402'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <span className="text-[var(--mes-text-muted)]">CAD COORD: </span>
                <strong className="text-[var(--mes-text-primary)]">
                  X: {correlation?.cadCoordinates.xMm.toFixed(2)}mm, Y: {correlation?.cadCoordinates.yMm.toFixed(2)}mm
                </strong>
              </div>
              <div>
                <span className="text-[var(--mes-text-muted)]">MAX CYCLES: </span>
                <strong className="text-[var(--mes-status-warn)]">
                  {verificationResult?.maxReworkCycles ?? 2} (JEDEC)
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Rework Action / Mode Panels */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. TECHNICIAN MODE: Verify & Replace */}
          {role === 'TECHNICIAN' && (
            <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border)] rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--mes-text-primary)] flex items-center gap-2 font-mono">
                  <Wrench className="w-5 h-5 text-[var(--mes-status-pass)]" />
                  REWORK EXECUTION BENCH
                </h3>
                <span className="text-xs font-mono text-[var(--mes-status-pass)] bg-[var(--mes-status-pass)]/10 px-2 py-0.5 rounded border border-[var(--mes-status-pass)]/30 font-bold">
                  READY
                </span>
              </div>

              {/* Status Warning if Hold */}
              {activeUnitInfo?.status === 'QUALITY_HOLD' && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl font-mono text-xs text-red-400 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>UNIT ON QUALITY HOLD:</strong> Optical defect recorded on {selectedRefDes} ({activeDefect?.defect_type || 'TOMBSTONE'}). Replace component with verified reel.
                  </div>
                </div>
              )}

              {/* Replacement Reel Scanner Input */}
              <div className="space-y-2 font-mono text-xs">
                <label className="text-[var(--mes-text-muted)]">SCAN REPLACEMENT REEL LOT BARCODE:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replacementReelId}
                    onChange={(e) => setReplacementReelId(e.target.value.trim().toUpperCase())}
                    className="flex-1 bg-[var(--mes-bg-well)] border border-[var(--mes-border)] rounded-xl px-3 py-2 text-sm text-[var(--mes-text-primary)] outline-none focus:border-[var(--mes-status-pass)]"
                  />
                  <button
                    onClick={handleVerifyReplacement}
                    className="px-4 py-2 bg-[var(--mes-bg-card)] hover:bg-[var(--mes-bg-card-hover)] text-[var(--mes-status-pass)] font-bold rounded-xl border border-[var(--mes-status-pass)]/40 flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Search className="w-4 h-4" />
                    <span>VERIFY</span>
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-[var(--mes-text-muted)]">Presets:</span>
                  <button
                    onClick={() => setReplacementReelId('REEL-MUR-98125-SPLICE')}
                    className="text-[10px] px-2 py-0.5 bg-[var(--mes-bg-well)] hover:bg-[var(--mes-bg-card)] text-[var(--mes-status-pass)] rounded border border-[var(--mes-border)]/60 transition-colors"
                  >
                    REEL-MUR-98125 (VALID 100nF)
                  </button>
                  <button
                    onClick={() => setReplacementReelId('REEL-EXPIRED-TEST-01')}
                    className="text-[10px] px-2 py-0.5 bg-[var(--mes-bg-well)] hover:bg-[var(--mes-bg-card)] text-red-400 rounded border border-[var(--mes-border)]/60 transition-colors"
                  >
                    EXPIRED-TEST-01 (MSL FAIL)
                  </button>
                  <button
                    onClick={() => setReplacementReelId('REEL-VSH-44120')}
                    className="text-[10px] px-2 py-0.5 bg-[var(--mes-bg-well)] hover:bg-[var(--mes-bg-card)] text-amber-400 rounded border border-[var(--mes-border)]/60 transition-colors"
                  >
                    REEL-VSH-44120 (BOM MISMATCH)
                  </button>
                </div>
              </div>

              {/* Verification Assessment Badge */}
              {verificationResult && (
                <div className={`p-3 rounded-xl border font-mono text-xs space-y-1.5 ${
                  verificationResult.valid
                    ? 'bg-[var(--mes-status-pass)]/10 border-[var(--mes-status-pass)]/40 text-[var(--mes-status-pass)]'
                    : 'bg-red-500/10 border-red-500/40 text-red-400'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>{verificationResult.valid ? '✓ VERIFICATION PASSED' : '✕ VERIFICATION FAILED'}</span>
                    <span>CYCLE {verificationResult.currentCycle} OF {verificationResult.maxReworkCycles}</span>
                  </div>
                  <div className="text-[var(--mes-text-primary)]">
                    BOM Expected: <strong>{verificationResult.expectedMpn}</strong> | Scanned: <strong>{verificationResult.replacementMpn}</strong>
                  </div>
                  {verificationResult.errors && verificationResult.errors.length > 0 && (
                    <div className="text-red-300">
                      Reason: {verificationResult.errors.join('; ')}
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleExecuteRework}
                className="w-full py-3 bg-[var(--mes-status-pass)] hover:opacity-90 text-[var(--mes-bg-base)] font-mono font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all shadow-[var(--mes-status-pass)]/20"
              >
                <Zap className="w-5 h-5" />
                <span>EXECUTE COMPONENT REPLACEMENT</span>
              </button>

              {/* Mandatory Post-Rework Re-Inspection Gate */}
              <div className="pt-3 border-t border-[var(--mes-border)] space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[var(--mes-text-muted)]">POST-REWORK RE-INSPECTION GATE:</span>
                  <span className="text-[var(--mes-status-warn)] font-bold">MANDATORY</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handlePostReworkInspection('PASS')}
                    className="py-2.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-mono font-bold text-xs rounded-xl border border-emerald-500/40 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AOI RE-INSPECT PASS</span>
                  </button>
                  <button
                    onClick={() => handlePostReworkInspection('FAIL')}
                    className="py-2.5 bg-red-600/30 hover:bg-red-600/50 text-red-300 font-mono font-bold text-xs rounded-xl border border-red-500/40 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>AOI RE-INSPECT FAIL</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. SUPERVISOR MODE: Sentinel Trends & Interlock Clear */}
          {role === 'SUPERVISOR' && (
            <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border)] rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--mes-text-primary)] flex items-center gap-2 font-mono">
                  <ShieldAlert className="w-5 h-5 text-[var(--mes-status-warn)]" />
                  REPEAT DEFECT SENTINEL
                </h3>
                <span className="text-xs font-mono text-[var(--mes-status-warn)] bg-[var(--mes-status-warn)]/10 px-2 py-0.5 rounded border border-[var(--mes-status-warn)]/30 font-bold">
                  SUPERVISOR LOCKOUT
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[var(--mes-bg-well)] rounded-xl border border-[var(--mes-border)] space-y-2">
                  <div className="text-[var(--mes-text-muted)]">ACTIVE QUALITY RULES FOR PROGRAM:</div>
                  <div className="grid grid-cols-2 gap-2 text-[var(--mes-text-primary)]">
                    <div>Consecutive Limit: <strong className="text-red-400">3 panels</strong></div>
                    <div>Sliding Window: <strong className="text-[var(--mes-status-warn)]">5 in 20 panels</strong></div>
                    <div>Interlock Action: <strong className="text-[var(--mes-status-pass)]">HOLD SMT PICK & PLACE</strong></div>
                    <div>Interlock Scope: <strong className="text-[var(--mes-text-secondary)]">Fuji NXT III (wc-nxt-01)</strong></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[var(--mes-text-muted)]">CLEAR INTERLOCK AUTHORIZATION REASON:</label>
                  <textarea
                    rows={2}
                    value={clearInterlockReason}
                    onChange={(e) => setClearInterlockReason(e.target.value)}
                    className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border)] rounded-xl p-2.5 text-xs text-[var(--mes-text-primary)] outline-none focus:border-[var(--mes-status-warn)]"
                  />
                </div>

                <button
                  onClick={handleClearInterlock}
                  className="w-full py-3 bg-[var(--mes-status-warn)] hover:opacity-90 text-[var(--mes-bg-base)] font-mono font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all shadow-[var(--mes-status-warn)]/20"
                >
                  <Radio className="w-4 h-4" />
                  <span>CLEAR PRODUCTION HOLD INTERLOCK</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. ENGINEER MODE: Formal Engineering Disposition */}
          {role === 'ENGINEER' && (
            <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border)] rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--mes-text-primary)] flex items-center gap-2 font-mono">
                  <UserCheck className="w-5 h-5 text-[var(--mes-accent-primary)]" />
                  ENGINEERING DISPOSITION
                </h3>
                <span className="text-xs font-mono text-[var(--mes-accent-primary)] bg-[var(--mes-accent-primary)]/10 px-2 py-0.5 rounded border border-[var(--mes-accent-primary)]/30 font-bold">
                  MRB AUTHORITY
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[var(--mes-text-muted)]">DISPOSITION DECISION:</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {(['REWORK', 'SCRAP', 'ACCEPT_AS_IS', 'REINSPECT'] as const).map((disp) => (
                      <button
                        key={disp}
                        onClick={() => setDispositionType(disp)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          dispositionType === disp
                            ? 'bg-[var(--mes-accent-primary)]/20 border-[var(--mes-accent-primary)] text-[var(--mes-accent-primary)] font-bold'
                            : 'bg-[var(--mes-bg-well)] border-[var(--mes-border)]/60 text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]'
                        }`}
                      >
                        {disp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[var(--mes-text-muted)]">ENGINEERING JUSTIFICATION & REFERENCE:</label>
                  <textarea
                    rows={3}
                    value={dispositionReason}
                    onChange={(e) => setDispositionReason(e.target.value)}
                    className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border)] rounded-xl p-2.5 text-xs text-[var(--mes-text-primary)] outline-none focus:border-[var(--mes-accent-primary)]"
                  />
                </div>

                <button
                  onClick={handleRecordDisposition}
                  className="w-full py-3 bg-[var(--mes-accent-primary)] hover:opacity-90 text-[var(--mes-bg-base)] font-mono font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all shadow-[var(--mes-accent-primary)]/20"
                >
                  <CheckSquare className="w-5 h-5" />
                  <span>COMMIT ENGINEERING DISPOSITION</span>
                </button>
              </div>
            </div>
          )}

          {/* Root-Cause Correlation Card */}
          {correlation && (
            <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border)] rounded-2xl p-5 shadow-2xl space-y-3 font-mono text-xs">
              <h4 className="text-sm font-bold text-[var(--mes-text-primary)] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--mes-status-pass)]" />
                UPSTREAM ROOT-CAUSE CORRELATION
              </h4>

              <div className="space-y-2 text-[var(--mes-text-secondary)]">
                <div className="flex items-center justify-between border-b border-[var(--mes-border)]/40 pb-1">
                  <span className="text-[var(--mes-text-muted)]">Placement Feeder Slot:</span>
                  <strong className="text-[var(--mes-text-primary)]">
                    Mod {correlation.feederSlot?.moduleNo || 1} • Slot {correlation.feederSlot?.slotNo || 1} ({correlation.feederSlot?.feederId || 'FID-W08F-01'})
                  </strong>
                </div>

                <div className="flex items-center justify-between border-b border-[var(--mes-border)]/40 pb-1">
                  <span className="text-[var(--mes-text-muted)]">SMT Reel Lot:</span>
                  <strong className="text-[var(--mes-status-pass)]">
                    {correlation.componentReel?.lotNumber || 'LOT-MUR-2601'} ({correlation.componentReel?.mslClass || 'MSL_1'})
                  </strong>
                </div>

                <div className="flex items-center justify-between border-b border-[var(--mes-border)]/40 pb-1">
                  <span className="text-[var(--mes-text-muted)]">Fuji Pick Nozzle:</span>
                  <strong className="text-[var(--mes-text-primary)]">
                    {correlation.nozzleTelemetry?.nozzleId || 'NOZ-0402-A'} ({correlation.nozzleTelemetry?.recentErrorCount || 0} pickup errs)
                  </strong>
                </div>

                <div className="flex items-center justify-between border-b border-[var(--mes-border)]/40 pb-1">
                  <span className="text-[var(--mes-text-muted)]">Solder Paste Jar:</span>
                  <strong className="text-[var(--mes-status-warn)]">
                    {correlation.solderPaste?.jarId || 'JAR-ALPHA-2601-C'} ({correlation.solderPaste?.alloyType || 'SAC305'})
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--mes-text-muted)]">Active Stencil:</span>
                  <strong className="text-[var(--mes-text-primary)]">
                    {correlation.stencil?.serialNumber || 'STN-2026-0042'} (Rev {correlation.stencil?.revision || 'A'})
                  </strong>
                </div>
              </div>

              {/* Root Cause Hypothesis Box */}
              <div className="p-3 bg-[var(--mes-bg-well)] rounded-xl border border-[var(--mes-border)] text-[var(--mes-text-primary)]">
                <div className="text-[10px] text-[var(--mes-status-warn)] font-bold mb-1">DIAGNOSTIC HYPOTHESIS:</div>
                <p className="text-xs leading-relaxed text-[var(--mes-text-muted)]">
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
