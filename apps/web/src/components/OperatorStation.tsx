import React, { useState, useEffect } from 'react';
import { 
  Play, AlertOctagon, CheckCircle2, QrCode, 
  Cpu, Layers, ShieldCheck, ShieldAlert, ArrowRight,
  Radio, Clock, AlertTriangle, Disc
} from 'lucide-react';
import { STANDARD_DOWNTIME_REASONS } from '@mes/shared';
import { authService } from '../services/auth.service';

interface WorkCenter {
  id: string;
  code: string;
  name: string;
  area: string;
  type: string;
  current_state: string;
  current_batch_id?: string;
  current_program_name?: string;
  current_operator_id?: string;
  batch_number?: string;
  product_name?: string;
  operator_name?: string;
  module_count?: number;
  last_state_change_time: string;
}

interface FeederSlot {
  id: string;
  module_no: number;
  stage_no: number;
  slot_no: number;
  feeder_id: string;
  feeder_type: string;
  assigned_part_number: string;
  current_reel_id?: string;
  part_name?: string;
  supplier_name?: string;
  lot_number?: string;
  date_code?: string;
  reel_remaining_quantity?: number;
  msl_level?: number;
  msl_class?: string;
  floor_clock_state?: string;
  is_msl_expired?: boolean;
  bake_status?: string;
  msl_remaining_minutes?: number;
  status: string;
}

const FALLBACK_WORK_CENTERS: WorkCenter[] = [
  { id: 'wc-lsr-01', code: 'LSR-01', name: 'Laser Marker (2D Barcode)', area: 'SMT-01', type: 'LASER_MARKER', current_state: 'RUNNING', current_program_name: 'PROG-SM-METER-TOP-REV4', last_state_change_time: new Date().toISOString() },
  { id: 'wc-spg-01', code: 'PRN-01', name: 'Screen Printer (DEK 03iX)', area: 'SMT-01', type: 'SCREEN_PRINTER', current_state: 'RUNNING', current_program_name: 'PROG-SM-METER-TOP-REV4', last_state_change_time: new Date().toISOString() },
  { id: 'wc-spi-01', code: 'SPI-01', name: '3D SPI (Koh Young Aspire3)', area: 'SMT-01', type: 'SPI', current_state: 'RUNNING', current_program_name: 'PROG-SM-METER-TOP-REV4', last_state_change_time: new Date().toISOString() },
  { id: 'wc-nxt-01', code: 'MNT-01', name: 'Fuji NXT III M6 (Mounter Bay)', area: 'SMT-01', type: 'PICK_AND_PLACE', current_state: 'RUNNING', current_program_name: 'PROG-SM-METER-TOP-REV4', last_state_change_time: new Date().toISOString() }
];

const FALLBACK_FEEDERS: FeederSlot[] = [
  {
    id: 'fdr-1',
    module_no: 1,
    stage_no: 1,
    slot_no: 1,
    feeder_id: 'W08-0402-901',
    feeder_type: 'W08 Tape Feeder (8mm)',
    assigned_part_number: 'C0402-100NF-16V',
    current_reel_id: 'REEL-MUR-98125',
    part_name: 'Capacitor Ceramic 0.1µF 16V X7R 0402',
    supplier_name: 'Murata Electronics',
    lot_number: 'LOT-MUR-2601',
    date_code: '2604',
    reel_remaining_quantity: 8420,
    msl_level: 1,
    msl_class: 'MSL_1',
    floor_clock_state: 'ACTIVE',
    is_msl_expired: false,
    status: 'MOUNTED'
  },
  {
    id: 'fdr-2',
    module_no: 1,
    stage_no: 1,
    slot_no: 2,
    feeder_id: 'W08-0402-902',
    feeder_type: 'W08 Tape Feeder (8mm)',
    assigned_part_number: 'C0402-10PF-50V',
    current_reel_id: 'REEL-TDK-44102',
    part_name: 'Capacitor Ceramic 10pF 50V C0G 0402',
    supplier_name: 'TDK Corporation',
    lot_number: 'LOT-TDK-2512',
    date_code: '2548',
    reel_remaining_quantity: 4200,
    msl_level: 1,
    msl_class: 'MSL_1',
    floor_clock_state: 'ACTIVE',
    is_msl_expired: false,
    status: 'MOUNTED'
  },
  {
    id: 'fdr-3',
    module_no: 1,
    stage_no: 1,
    slot_no: 3,
    feeder_id: 'W08-0402-903',
    feeder_type: 'W08 Tape Feeder (8mm)',
    assigned_part_number: 'R0402-10K-1%',
    current_reel_id: 'REEL-YAG-11094',
    part_name: 'Thick Film Resistor 10kΩ 1% 0402',
    supplier_name: 'Yageo',
    lot_number: 'LOT-YAG-2602',
    date_code: '2606',
    reel_remaining_quantity: 2150,
    msl_level: 1,
    msl_class: 'MSL_1',
    floor_clock_state: 'ACTIVE',
    is_msl_expired: false,
    status: 'MOUNTED'
  },
  {
    id: 'fdr-4',
    module_no: 1,
    stage_no: 1,
    slot_no: 4,
    feeder_id: 'W12-0805-442',
    feeder_type: 'W12 Tape Feeder (12mm)',
    assigned_part_number: 'IND-0805-4.7UH',
    current_reel_id: 'REEL-COIL-7781',
    part_name: 'Power Inductor 4.7µH 1.2A 0805',
    supplier_name: 'Coilcraft',
    lot_number: 'LOT-CLC-2601',
    date_code: '2602',
    reel_remaining_quantity: 1800,
    msl_level: 2,
    msl_class: 'MSL_2',
    floor_clock_state: 'ACTIVE',
    is_msl_expired: false,
    msl_remaining_minutes: 8400,
    status: 'MOUNTED'
  },
  {
    id: 'fdr-5',
    module_no: 1,
    stage_no: 1,
    slot_no: 5,
    feeder_id: 'W16-SOIC-102',
    feeder_type: 'W16 Tape Feeder (16mm)',
    assigned_part_number: 'IC-SOIC8-EEPROM-24C02',
    current_reel_id: 'REEL-MCH-55201',
    part_name: 'I2C Serial EEPROM 2Kb SOIC-8',
    supplier_name: 'Microchip Technology',
    lot_number: 'LOT-MCP-2511',
    date_code: '2545',
    reel_remaining_quantity: 940,
    msl_level: 3,
    msl_class: 'MSL_3',
    floor_clock_state: 'ACTIVE',
    is_msl_expired: false,
    msl_remaining_minutes: 5820,
    status: 'MOUNTED'
  },
  {
    id: 'fdr-6',
    module_no: 1,
    stage_no: 1,
    slot_no: 6,
    feeder_id: 'W24-QFP-019',
    feeder_type: 'W24 Tape Feeder (24mm)',
    assigned_part_number: 'MCU-QFP64-STM32F401',
    current_reel_id: 'REEL-STM-99210',
    part_name: 'ARM Cortex-M4 84MHz 256KB LQFP-64',
    supplier_name: 'STMicroelectronics',
    lot_number: 'LOT-STM-2601',
    date_code: '2601',
    reel_remaining_quantity: 480,
    msl_level: 3,
    msl_class: 'MSL_3',
    floor_clock_state: 'ACTIVE',
    is_msl_expired: false,
    msl_remaining_minutes: 6100,
    status: 'MOUNTED'
  }
];

export const OperatorStation: React.FC = () => {
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>(FALLBACK_WORK_CENTERS);
  const [selectedWcId, setSelectedWcId] = useState<string>('wc-nxt-01');
  const [feeders, setFeeders] = useState<FeederSlot[]>(FALLBACK_FEEDERS);
  const [activeSlotNo, setActiveSlotNo] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Splicing Dock State
  const [scannedReelId, setScannedReelId] = useState<string>('REEL-MUR-98125-SPLICE');
  const [scannedPartNumber, setScannedPartNumber] = useState<string>('C0402-100NF-16V');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [spliceResult, setSpliceResult] = useState<{
    verified: boolean;
    status: 'IDLE' | 'VERIFIED' | 'TRIPPED';
    message: string;
  }>({
    verified: true,
    status: 'IDLE',
    message: 'Awaiting operator barcode scan...'
  });

  // Stoppage Drawer
  const [showStoppageDrawer, setShowStoppageDrawer] = useState<boolean>(false);
  const [stoppageComment, setStoppageComment] = useState<string>('');

  const fetchWorkCenters = async () => {
    try {
      const res = await authService.authFetch('/api/v1/work-centers');
      if (res.ok) {
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw : (raw?.data ?? []);
        if (Array.isArray(data) && data.length > 0) {
          setWorkCenters(data);
        }
      }
    } catch (err) {
      console.warn('Using simulation fallback for stations', err);
    }
  };

  const fetchFeeders = async () => {
    try {
      const res = await authService.authFetch(`/api/v1/smt/feeders?workCenterId=${selectedWcId}`);
      if (res.ok) {
        const raw = await res.json();
        const data: FeederSlot[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
        if (Array.isArray(data) && data.length > 0) {
          setFeeders(data);
          if (!data.find(s => s.slot_no === activeSlotNo)) {
            setActiveSlotNo(data[0].slot_no);
          }
        }
      }
    } catch (err) {
      console.warn('Using simulation fallback for feeders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkCenters();
    fetchFeeders();
    const interval = setInterval(() => {
      fetchWorkCenters();
      fetchFeeders();
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedWcId]);

  const activeWc = workCenters.find(w => w.id === selectedWcId) || workCenters[1] || workCenters[0];
  const activeSlot = feeders.find(s => s.slot_no === activeSlotNo) || feeders[0];

  const handleSelectSlot = (slot: FeederSlot) => {
    setActiveSlotNo(slot.slot_no);
    setScannedPartNumber(slot.assigned_part_number);
    setScannedReelId(`REEL-${slot.assigned_part_number.slice(0, 3)}-${Math.floor(10000 + Math.random() * 90000)}`);
    setSpliceResult({
      verified: true,
      status: 'IDLE',
      message: `Selected Slot ${slot.slot_no} (${slot.assigned_part_number}). Ready to scan splice reel.`
    });
  };

  const executeSplicingInterlock = async () => {
    setIsScanning(true);
    setSpliceResult({ verified: false, status: 'IDLE', message: 'Optical laser scanning reel barcode UID...' });

    await new Promise(r => setTimeout(r, 600));

    try {
      const res = await authService.authFetch('/api/v1/smt/splice-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workCenterId: selectedWcId,
          slotNo: activeSlotNo,
          scannedReelId,
          scannedPartNumber,
          operatorId: 'OP-SMT-01'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setSpliceResult({
          verified: false,
          status: 'TRIPPED',
          message: data.message || 'FATAL: Reel rejected. SMT feeder interlock engaged.'
        });
      } else {
        setSpliceResult({
          verified: true,
          status: 'VERIFIED',
          message: `SAFE TO SPLICE: Reel ${scannedReelId} verified against BOM program. Cassette unlocked.`
        });
        await fetchFeeders();
      }
    } catch (err: any) {
      setSpliceResult({
        verified: false,
        status: 'TRIPPED',
        message: `Network error: ${err.message}`
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleQuickStoppage = async (reasonCode: string, label: string) => {
    try {
      await authService.authFetch('/api/v1/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'STATE_CHANGED',
          workCenterId: selectedWcId,
          batchId: activeWc?.current_batch_id || 'JOB-SM-260901',
          operatorId: 'OP-SMT-01',
          sourceType: 'MANUAL_UI',
          sourceId: `tablet-${selectedWcId}`,
          payload: {
            previousState: activeWc?.current_state || 'RUNNING',
            currentState: 'STOPPED_UNPLANNED',
            reasonCategory: 'FEEDER_MECHANISM',
            reasonCode,
            comment: stoppageComment || label
          }
        })
      });
      setShowStoppageDrawer(false);
      setStoppageComment('');
      await fetchWorkCenters();
    } catch (err: any) {
      alert(`Failed to log stoppage: ${err.message}`);
    }
  };

  const handleResumeLine = async () => {
    try {
      await authService.authFetch('/api/v1/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'STATE_CHANGED',
          workCenterId: selectedWcId,
          operatorId: 'OP-SMT-01',
          sourceType: 'MANUAL_UI',
          sourceId: `tablet-${selectedWcId}`,
          payload: {
            previousState: activeWc?.current_state || 'STOPPED_UNPLANNED',
            currentState: 'RUNNING',
            comment: 'Operator confirmed feeder cassette cleared and safety guard latched'
          }
        })
      });
      await fetchWorkCenters();
    } catch (err: any) {
      alert(`Failed to resume: ${err.message}`);
    }
  };

  const isLineRunning = activeWc?.current_state === 'RUNNING';

  return (
    <div className="space-y-2 font-sans">
      {/* 1. SMT Line Sequential Machine Flow Ribbon */}
      <div 
        className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-3"
        style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
      >
        <div className="flex flex-wrap justify-between items-center mb-2 gap-2 text-xs font-mono">
          <div className="text-[10px] uppercase tracking-widest text-[var(--mes-text-muted)] flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[var(--mes-status-pass)]" />
            <span>IN-LINE CONVEYOR PROGRESSION • SMT LINE 01</span>
          </div>
          <div className="text-[11px] text-[var(--mes-text-secondary)]">
            Recipe: <strong className="text-[var(--mes-accent-primary)]">PROG-SM-METER-TOP-REV4</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {workCenters.map((wc, i) => {
            const isSelected = wc.id === selectedWcId;
            const isRun = wc.current_state === 'RUNNING';

            return (
              <button
                key={wc.id}
                type="button"
                onClick={() => setSelectedWcId(wc.id)}
                className={`p-2.5 rounded-[var(--mes-radius)] text-left transition-all border ${
                  isSelected 
                    ? 'bg-[var(--mes-accent-muted)] border-[var(--mes-accent-primary)] ring-1 ring-[var(--mes-accent-ring)]' 
                    : 'bg-[var(--mes-bg-well)] border-[var(--mes-border-subtle)] hover:border-[var(--mes-border-strong)]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9.5px] font-mono text-[var(--mes-text-muted)] tracking-wider">
                    STAGE 0{i + 1}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    isRun ? 'bg-[var(--mes-status-pass)] animate-pulse' : 'bg-[var(--mes-status-halt)] animate-pulse'
                  }`} />
                </div>
                <div className="text-xs font-bold text-[var(--mes-text-primary)] truncate font-sans">{wc.name}</div>
                <div className="text-[9.5px] font-mono text-[var(--mes-text-muted)] mt-1 flex justify-between">
                  <span>{wc.code}</span>
                  <span className={isRun ? 'text-[var(--mes-status-pass)] font-bold' : 'text-[var(--mes-status-halt)] font-bold'}>{wc.current_state}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Work Area: 2-Column Split (Feeder Bay Rack vs Splicing Reticle Dock) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        {/* Left Column (7 cols): Physical Feeder Rack Table */}
        <div className="lg:col-span-7 space-y-2">
          <div 
            className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-3.5 space-y-3"
            style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
          >
            <div className="flex flex-wrap justify-between items-center border-b border-[var(--mes-border-hairline)] pb-2.5 gap-2">
              <div>
                <h2 className="text-sm font-bold text-[var(--mes-text-primary)] flex items-center gap-2 font-mono">
                  <Layers className="w-4 h-4 text-[var(--mes-accent-primary)]" />
                  Fuji NXT III Feeder Table (Module 1 Bay)
                </h2>
                <p className="text-[11px] text-[var(--mes-text-muted)]">
                  Select any cassette to inspect component stock, MSL floor-life timer, or prepare a splice.
                </p>
              </div>

              {/* Station State & Emergency Action */}
              <div className="flex items-center gap-2">
                {isLineRunning ? (
                  <button
                    type="button"
                    onClick={() => setShowStoppageDrawer(true)}
                    className="bg-[var(--mes-status-halt-muted)] hover:opacity-90 text-[var(--mes-status-halt)] border border-[var(--mes-status-halt)] px-2.5 py-1 rounded-[var(--mes-radius)] text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>HALT / STOPPAGE</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResumeLine}
                    className="bg-[var(--mes-status-pass)] text-white hover:opacity-90 px-3 py-1 rounded-[var(--mes-radius)] text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>RESUME RUN</span>
                  </button>
                )}
              </div>
            </div>

            {/* Feeder Slot Rail Layout */}
            <div className="space-y-1.5 pt-0.5 max-h-[460px] overflow-y-auto">
              {feeders.map((slot) => {
                const isSelected = slot.slot_no === activeSlotNo;
                const isLowParts = (slot.reel_remaining_quantity || 0) < 4000;

                return (
                  <div
                    key={slot.id}
                    onClick={() => handleSelectSlot(slot)}
                    className={`p-2.5 rounded-[var(--mes-radius)] cursor-pointer transition-all flex flex-wrap items-center justify-between gap-3 border ${
                      isSelected 
                        ? 'border-[var(--mes-accent-primary)] bg-[var(--mes-accent-muted)] ring-1 ring-[var(--mes-accent-ring)]' 
                        : 'border-[var(--mes-border-hairline)] bg-[var(--mes-bg-well)] hover:border-[var(--mes-border-strong)]'
                    }`}
                  >
                    {/* Cassette Slot & Indicator Light */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-[var(--mes-radius)] bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] flex flex-col items-center justify-center font-mono">
                        <span className="text-[10px] text-[var(--mes-text-muted)] leading-none font-semibold">SLOT</span>
                        <span className="text-xs font-black text-[var(--mes-text-primary)] leading-none mt-0.5">
                          {slot.slot_no < 10 ? `0${slot.slot_no}` : slot.slot_no}
                        </span>
                      </div>

                      <div className={`w-2 h-2 rounded-full ${
                        isLowParts 
                          ? 'bg-[var(--mes-status-warn)] animate-pulse' 
                          : 'bg-[var(--mes-status-pass)]'
                      }`} />

                      <div>
                        <div className="text-xs font-bold font-mono text-[var(--mes-text-primary)] flex items-center gap-2">
                          <span>{slot.assigned_part_number}</span>
                          <span className="text-[10px] font-semibold text-[var(--mes-text-muted)] px-1.5 py-0.5 bg-[var(--mes-bg-surface)] rounded-[1px] border border-[var(--mes-border-hairline)]">
                            {slot.feeder_type.split(' ')[0]}
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--mes-text-muted)] font-sans truncate max-w-[200px]">
                          {slot.part_name}
                        </div>
                      </div>
                    </div>

                    {/* Stock, Reel Barcode, MSL Badge */}
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <div className="text-right">
                        <div className="text-[var(--mes-text-primary)] font-bold tabular-nums">
                          {(slot.reel_remaining_quantity || 0).toLocaleString()} <span className="text-[10px] text-[var(--mes-text-muted)]">PCS</span>
                        </div>
                        <div className="text-[10px] text-[var(--mes-text-muted)] truncate max-w-[110px]">
                          {slot.current_reel_id || 'NO REEL'}
                        </div>
                      </div>

                      {slot.msl_class && slot.msl_class !== 'MSL_1' ? (
                        <div className={`px-2 py-0.5 rounded-[var(--mes-radius)] border text-[10px] font-bold flex flex-col items-end ${
                          slot.is_msl_expired || (slot.msl_remaining_minutes ?? 999) <= 0
                            ? 'bg-[var(--mes-status-halt-muted)] border-[var(--mes-status-halt)] text-[var(--mes-status-halt)]'
                            : slot.floor_clock_state === 'DRY_STORAGE'
                            ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                            : 'bg-[var(--mes-status-warn-muted)] border-[var(--mes-status-warn)] text-[var(--mes-status-warn)]'
                        }`}>
                          <span>{slot.msl_class}</span>
                          <span className="text-[9.5px] font-normal opacity-90">{slot.floor_clock_state}</span>
                        </div>
                      ) : (
                        <div className="px-2 py-0.5 rounded-[var(--mes-radius)] bg-[var(--mes-bg-surface)] text-[var(--mes-text-muted)] text-[10px] font-semibold border border-[var(--mes-border-hairline)]">
                          MSL 1
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleSelectSlot(slot); }}
                        className="px-2 py-0.5 bg-[var(--mes-bg-surface)] hover:bg-[var(--mes-bg-well)] text-[var(--mes-text-primary)] text-[10.5px] font-mono rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle)] transition-colors"
                      >
                        Splice &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Laser Splicing Reticle Dock */}
        <div className="lg:col-span-5 space-y-2">
          <div 
            className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-3.5 space-y-3"
            style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
          >
            <div className="flex justify-between items-start border-b border-[var(--mes-border-hairline)] pb-2">
              <div>
                <span className="text-[9.5px] font-mono uppercase tracking-widest text-[var(--mes-accent-primary)] flex items-center gap-1.5 font-bold">
                  <Disc className="w-3.5 h-3.5 animate-spin" />
                  OPTICAL SPLICING INTERLOCK
                </span>
                <h3 className="text-sm font-bold text-[var(--mes-text-primary)] font-mono mt-0.5">
                  Slot 0{activeSlot?.slot_no} Verification Gate
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[var(--mes-text-muted)] bg-[var(--mes-bg-well)] px-2 py-0.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
                {activeSlot?.feeder_id}
              </span>
            </div>

            {/* Split Comparison Terminal */}
            <div className="space-y-2 font-mono text-xs">
              {/* Channel A: Recipe Expected Specification */}
              <div className="bg-[var(--mes-bg-well)] p-2.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)] space-y-0.5">
                <div className="text-[9.5px] uppercase tracking-widest text-[var(--mes-text-muted)] flex justify-between">
                  <span>CHANNEL A // EXPECTED BOM PART</span>
                  <span className="text-[var(--mes-status-pass)] font-bold">LOCKED</span>
                </div>
                <div className="text-xs font-black text-[var(--mes-text-primary)]">
                  {activeSlot?.assigned_part_number}
                </div>
                <div className="text-[10px] text-[var(--mes-text-muted)]">
                  Carrier: {activeSlot?.feeder_type} • Reel: {activeSlot?.current_reel_id}
                </div>
              </div>

              {/* Channel B: Optical Scanner Feed (Laser Reticle) */}
              <div className="bg-[var(--mes-bg-well)] p-2.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle)] space-y-2">
                <div className="text-[9.5px] uppercase tracking-widest text-[var(--mes-text-muted)] flex justify-between">
                  <span>CHANNEL B // SCANNED COMPONENT REEL</span>
                  <span className="text-[var(--mes-text-muted)]">OPTICAL INPUT</span>
                </div>

                <div>
                  <label className="text-[9.5px] text-[var(--mes-text-muted)] block mb-1">Scanned Manufacturer Part (MPN):</label>
                  <input
                    type="text"
                    value={scannedPartNumber}
                    onChange={(e) => setScannedPartNumber(e.target.value)}
                    className="w-full bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] text-[var(--mes-text-primary)] font-mono rounded-[var(--mes-radius)] px-2.5 py-1.5 text-xs font-bold focus:border-[var(--mes-accent-primary)] focus:outline-none"
                    placeholder="e.g. C0402-100NF-16V"
                  />
                </div>

                <div>
                  <label className="text-[9.5px] text-[var(--mes-text-muted)] block mb-1">Scanned Reel Barcode UID:</label>
                  <input
                    type="text"
                    value={scannedReelId}
                    onChange={(e) => setScannedReelId(e.target.value)}
                    className="w-full bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] text-[var(--mes-text-primary)] font-mono rounded-[var(--mes-radius)] px-2.5 py-1.5 text-xs font-bold focus:border-[var(--mes-accent-primary)] focus:outline-none"
                    placeholder="e.g. REEL-MUR-98125-SPLICE"
                  />
                </div>

                {/* Quick Simulation Toggles for the Demo */}
                <div className="flex items-center gap-2 text-[9.5px] text-[var(--mes-text-muted)] pt-0.5">
                  <span>Simulation:</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeSlot) {
                        setScannedPartNumber(activeSlot.assigned_part_number);
                        setScannedReelId(`REEL-MATCH-${Math.floor(1000 + Math.random() * 9000)}`);
                      }
                    }}
                    className="text-[var(--mes-status-pass)] hover:underline font-bold"
                  >
                    [MATCH]
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setScannedPartNumber('R0402-10K-WRONG');
                      setScannedReelId(`REEL-MISMATCH-${Math.floor(1000 + Math.random() * 9000)}`);
                    }}
                    className="text-[var(--mes-status-halt)] hover:underline font-bold"
                  >
                    [MISMATCH]
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeSlot) {
                        setScannedPartNumber(activeSlot.assigned_part_number);
                        setScannedReelId('REEL-EXPIRED-TEST-01');
                      }
                    }}
                    className="text-[var(--mes-status-warn)] hover:underline font-bold"
                  >
                    [EXPIRED MSL]
                  </button>
                </div>
              </div>

              {/* JEDEC MSL Floor-Life Controls for Active Reel */}
              {activeSlot?.current_reel_id && (
                <div className="bg-[var(--mes-bg-well)] p-2.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)] space-y-1.5">
                  <div className="flex items-center justify-between text-[9.5px] text-[var(--mes-text-muted)] font-mono uppercase">
                    <span>JEDEC J-STD-033D FLOOR-LIFE CONTROL</span>
                    <span className="text-[var(--mes-text-primary)] font-bold">{activeSlot.msl_class || 'MSL 1'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setFeeders(prev => prev.map(s => s.slot_no === activeSlotNo ? { ...s, floor_clock_state: 'DRY_STORAGE' } : s));
                      }}
                      className="px-2 py-0.5 rounded-[var(--mes-radius)] bg-[var(--mes-bg-surface)] hover:bg-[var(--mes-bg-well)] text-cyan-400 border border-cyan-500/30 transition-colors"
                    >
                      &rarr; DRY CABINET
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFeeders(prev => prev.map(s => s.slot_no === activeSlotNo ? { ...s, floor_clock_state: 'ACTIVE' } : s));
                      }}
                      className="px-2 py-0.5 rounded-[var(--mes-radius)] bg-[var(--mes-bg-surface)] hover:bg-[var(--mes-bg-well)] text-amber-400 border border-amber-500/30 transition-colors"
                    >
                      EXIT CABINET
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFeeders(prev => prev.map(s => s.slot_no === activeSlotNo ? { ...s, bake_status: 'BAKING', floor_clock_state: 'BAKING' } : s));
                      }}
                      className="px-2 py-0.5 rounded-[var(--mes-radius)] bg-[var(--mes-bg-surface)] hover:bg-[var(--mes-bg-well)] text-orange-400 border border-orange-500/30 transition-colors"
                    >
                      125°C BAKE
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Interlock Result Banner */}
            <div className={`p-2.5 rounded-[var(--mes-radius)] text-xs font-mono space-y-1 border ${
              spliceResult.status === 'VERIFIED'
                ? 'bg-[var(--mes-status-pass-muted)] border-[var(--mes-status-pass)] text-[var(--mes-status-pass)]'
                : spliceResult.status === 'TRIPPED'
                ? 'bg-[var(--mes-status-halt-muted)] border-[var(--mes-status-halt)] text-[var(--mes-status-halt)]'
                : 'bg-[var(--mes-bg-well)] border-[var(--mes-border-subtle)] text-[var(--mes-text-muted)]'
            }`}>
              <div className="font-bold flex items-center gap-1.5 text-[11px]">
                {spliceResult.status === 'VERIFIED' && <ShieldCheck className="w-3.5 h-3.5" />}
                {spliceResult.status === 'TRIPPED' && <ShieldAlert className="w-3.5 h-3.5" />}
                <span>
                  {spliceResult.status === 'VERIFIED' ? 'RELAY ENGAGED // OK TO SPLICE' :
                   spliceResult.status === 'TRIPPED' ? 'INTERLOCK TRIPPED // FEEDER INHIBITED' :
                   'INTERLOCK GATE: READY'}
                </span>
              </div>
              <div className="text-[10px] leading-relaxed">{spliceResult.message}</div>
            </div>

            {/* Verification Execute Button */}
            <button
              type="button"
              onClick={executeSplicingInterlock}
              disabled={isScanning}
              className="w-full bg-[var(--mes-accent-primary)] hover:bg-[var(--mes-accent-hover)] text-white font-bold font-mono py-2.5 rounded-[var(--mes-radius)] text-xs tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>{isScanning ? 'SCANNING REEL BARCODE...' : 'RUN LASER SCAN & VERIFY SPLICE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Stoppage Drawer (Tactile Operator Matrix) */}
      {showStoppageDrawer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div 
            className="bg-[var(--mes-bg-modal)] border border-[var(--mes-status-halt)] rounded-[var(--mes-radius)] max-w-lg w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 font-mono"
          >
            <div className="flex justify-between items-center border-b border-[var(--mes-border-subtle)] pb-2.5">
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-5 h-5 text-[var(--mes-status-halt)]" />
                <div>
                  <h3 className="text-sm font-bold text-[var(--mes-text-primary)]">Log Line 01 Stoppage</h3>
                  <p className="text-[10.5px] text-[var(--mes-text-muted)]">Immediate attribution for OEE Pareto</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowStoppageDrawer(false)}
                className="text-xs text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)] px-2 py-0.5 bg-[var(--mes-bg-well)] rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle)]"
              >
                ESC
              </button>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] uppercase tracking-widest text-[var(--mes-text-muted)] block">
                Select Shopfloor Stoppage Cause:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STANDARD_DOWNTIME_REASONS.slice(0, 6).map((r) => (
                  <button
                    key={r.code}
                    type="button"
                    onClick={() => handleQuickStoppage(r.code, r.label)}
                    className="p-2.5 rounded-[var(--mes-radius)] bg-[var(--mes-bg-well)] border border-[var(--mes-border-subtle)] hover:border-[var(--mes-status-halt)] text-left transition-all"
                  >
                    <div className="text-xs font-bold text-[var(--mes-text-primary)]">{r.label}</div>
                    <div className="text-[9.5px] text-[var(--mes-text-muted)] mt-0.5">{r.category}</div>
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Optional comment (e.g. Cleared tape peel jam at Slot 02)..."
                  value={stoppageComment}
                  onChange={(e) => setStoppageComment(e.target.value)}
                  className="w-full bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-2 text-xs text-[var(--mes-text-primary)] focus:border-[var(--mes-status-halt)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
