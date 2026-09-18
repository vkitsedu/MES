import React, { useState } from 'react';
import { 
  Sliders, Cpu, AlertTriangle, ShieldCheck, 
  Layers, Thermometer, Filter, RefreshCw, BarChart2,
  FileCode, CheckCircle2, ChevronRight, Activity
} from 'lucide-react';
import { DataTable, ColumnDef } from '../common/DataTable';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface FeederMisfireRecord {
  id: string;
  slotNo: number;
  feederId: string;
  partNumber: string;
  componentValue: string;
  packageType: string;
  misfires: number;
  errorType: string;
  vacuumKpa: number;
  lastErrorTime: string;
  status: 'CRITICAL' | 'WARNING' | 'NORMAL';
}

interface ThermalDriftRecord {
  zone: string;
  type: string;
  setpointC: number;
  actualC: number;
  driftC: number;
  stabilityPct: number;
  status: 'STABLE' | 'WARNING' | 'ALERT';
}

export const EngineerDeepDiveView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'FEEDERS' | 'REFLOW_THERMAL' | 'SPI_VOLUME'>('FEEDERS');

  const feederMisfireData: FeederMisfireRecord[] = [
    { id: 'f1', slotNo: 4, feederId: 'W08-0402-991', partNumber: 'CAP-0402-100NF-50V', componentValue: '100nF', packageType: '0402', misfires: 14, errorType: 'PICKUP_VACUUM_LOW', vacuumKpa: -68.2, lastErrorTime: '14:22:10', status: 'WARNING' },
    { id: 'f2', slotNo: 12, feederId: 'W12-0805-442', partNumber: 'RES-0805-10K-1%', componentValue: '10kΩ', packageType: '0805', misfires: 8, errorType: 'RECOGNITION_SHIFT_X', vacuumKpa: -81.4, lastErrorTime: '13:58:45', status: 'WARNING' },
    { id: 'f3', slotNo: 18, feederId: 'W16-SOIC-102', partNumber: 'IC-SOIC8-EEPROM-24C02', componentValue: '24C02', packageType: 'SOIC-8', misfires: 2, errorType: 'ORIENTATION_REVERSE', vacuumKpa: -88.0, lastErrorTime: '12:30:11', status: 'NORMAL' },
    { id: 'f4', slotNo: 27, feederId: 'W08-0201-884', partNumber: 'RES-0201-0R-JUMP', componentValue: '0Ω', packageType: '0201', misfires: 29, errorType: 'PICKUP_MISSING_PARTS', vacuumKpa: -59.1, lastErrorTime: '14:31:02', status: 'CRITICAL' },
    { id: 'f5', slotNo: 35, feederId: 'W24-QFP-019', partNumber: 'MCU-QFP64-STM32F401', componentValue: 'STM32', packageType: 'LQFP-64', misfires: 1, errorType: 'LEAD_COPLANARITY_CHECK', vacuumKpa: -91.2, lastErrorTime: '10:14:20', status: 'NORMAL' },
    { id: 'f6', slotNo: 41, feederId: 'W08-0402-331', partNumber: 'CAP-0402-22PF-50V', componentValue: '22pF', packageType: '0402', misfires: 3, errorType: 'PICKUP_VACUUM_LOW', vacuumKpa: -77.5, lastErrorTime: '11:42:08', status: 'NORMAL' }
  ];

  const thermalDriftData: ThermalDriftRecord[] = [
    { zone: 'Zone 1 (Top)', type: 'PREHEAT_RAMP', setpointC: 150.0, actualC: 150.4, driftC: +0.4, stabilityPct: 99.7, status: 'STABLE' },
    { zone: 'Zone 2 (Top)', type: 'PREHEAT_SOAK', setpointC: 165.0, actualC: 164.8, driftC: -0.2, stabilityPct: 99.8, status: 'STABLE' },
    { zone: 'Zone 3 (Top)', type: 'SOAK_EQUILIBRIUM', setpointC: 180.0, actualC: 181.1, driftC: +1.1, stabilityPct: 99.1, status: 'STABLE' },
    { zone: 'Zone 4 (Top)', type: 'FLUX_ACTIVATION', setpointC: 195.0, actualC: 194.2, driftC: -0.8, stabilityPct: 99.3, status: 'STABLE' },
    { zone: 'Zone 5 (Top)', type: 'REFLOW_PEAK_1', setpointC: 220.0, actualC: 222.4, driftC: +2.4, stabilityPct: 97.6, status: 'WARNING' },
    { zone: 'Zone 6 (Top)', type: 'REFLOW_LIQUIDUS', setpointC: 245.0, actualC: 245.1, driftC: +0.1, stabilityPct: 99.9, status: 'STABLE' },
    { zone: 'Zone 7 (Top)', type: 'REFLOW_PEAK_MAX', setpointC: 250.0, actualC: 249.6, driftC: -0.4, stabilityPct: 99.6, status: 'STABLE' },
    { zone: 'Zone 8 (Top)', type: 'COOLING_CONTROLLED', setpointC: 180.0, actualC: 178.5, driftC: -1.5, stabilityPct: 98.5, status: 'STABLE' },
    { zone: 'Zone 9 (Top)', type: 'FAST_COOL_EXIT', setpointC: 120.0, actualC: 119.0, driftC: -1.0, stabilityPct: 98.9, status: 'STABLE' },
    { zone: 'Zone 10 (Top)', type: 'DISCHARGE_SAFE', setpointC: 60.0, actualC: 61.2, driftC: +1.2, stabilityPct: 98.2, status: 'STABLE' }
  ];

  const feederColumns: ColumnDef<FeederMisfireRecord>[] = [
    {
      key: 'slotNo',
      header: 'Slot',
      width: '70px',
      render: (row) => (
        <span className="font-mono font-bold text-[var(--mes-accent-primary)]">
          Slot {row.slotNo.toString().padStart(2, '0')}
        </span>
      )
    },
    {
      key: 'feederId',
      header: 'Feeder Barcode',
      render: (row) => (
        <div className="font-mono">
          <div className="text-[var(--mes-text-primary)] font-semibold">{row.feederId}</div>
          <div className="text-[10px] text-[var(--mes-text-muted)]">{row.packageType} Carrier</div>
        </div>
      )
    },
    {
      key: 'partNumber',
      header: 'Part Number & Value',
      render: (row) => (
        <div>
          <div className="font-mono text-xs text-[var(--mes-text-primary)]">{row.partNumber}</div>
          <div className="text-[10px] text-[var(--mes-text-secondary)]">{row.componentValue}</div>
        </div>
      )
    },
    {
      key: 'errorType',
      header: 'Fuji PDERROR Signature',
      render: (row) => (
        <span className="font-mono text-[10.5px] text-[var(--mes-text-secondary)] bg-[var(--mes-bg-well)] px-1.5 py-0.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
          {row.errorType}
        </span>
      )
    },
    {
      key: 'vacuumKpa',
      header: 'Vacuum (kPa)',
      align: 'right',
      render: (row) => (
        <span className={`font-mono tabular-nums font-bold ${row.vacuumKpa > -70 ? 'text-[var(--mes-status-halt)]' : 'text-[var(--mes-status-pass)]'}`}>
          {row.vacuumKpa.toFixed(1)} kPa
        </span>
      )
    },
    {
      key: 'misfires',
      header: 'Misfires',
      align: 'right',
      render: (row) => (
        <span className={`font-mono font-bold tabular-nums px-2 py-0.5 rounded-[var(--mes-radius)] text-xs border ${
          row.misfires > 20
            ? 'bg-[var(--mes-status-halt-muted)] text-[var(--mes-status-halt)] border-[var(--mes-status-halt)]'
            : row.misfires > 5
              ? 'bg-[var(--mes-status-warn-muted)] text-[var(--mes-status-warn)] border-[var(--mes-status-warn)]'
              : 'bg-[var(--mes-bg-well)] text-[var(--mes-text-secondary)] border-[var(--mes-border-hairline)]'
        }`}>
          {row.misfires}
        </span>
      )
    },
    {
      key: 'lastErrorTime',
      header: 'Last Misfire',
      align: 'right',
      render: (row) => <span className="font-mono text-[var(--mes-text-muted)] text-xs">{row.lastErrorTime}</span>
    }
  ];

  const thermalColumns: ColumnDef<ThermalDriftRecord>[] = [
    {
      key: 'zone',
      header: 'Oven Heating Zone',
      render: (row) => <span className="font-mono font-bold text-[var(--mes-text-primary)]">{row.zone}</span>
    },
    {
      key: 'type',
      header: 'Profile Segment',
      render: (row) => (
        <span className="text-[10px] font-mono text-[var(--mes-text-muted)] bg-[var(--mes-bg-well)] px-1.5 py-0.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline)]">
          {row.type}
        </span>
      )
    },
    {
      key: 'setpointC',
      header: 'Setpoint (°C)',
      align: 'right',
      render: (row) => <span className="font-mono tabular-nums text-[var(--mes-text-secondary)]">{row.setpointC.toFixed(1)}°C</span>
    },
    {
      key: 'actualC',
      header: 'Observed Sensor (°C)',
      align: 'right',
      render: (row) => <span className="font-mono tabular-nums font-bold text-[var(--mes-text-primary)]">{row.actualC.toFixed(1)}°C</span>
    },
    {
      key: 'driftC',
      header: 'Thermal Drift (Δ°C)',
      align: 'right',
      render: (row) => (
        <span className={`font-mono tabular-nums font-bold ${Math.abs(row.driftC) > 2.0 ? 'text-[var(--mes-status-warn)]' : 'text-[var(--mes-status-pass)]'}`}>
          {row.driftC > 0 ? `+${row.driftC.toFixed(1)}` : row.driftC.toFixed(1)}°C
        </span>
      )
    },
    {
      key: 'stabilityPct',
      header: 'Cpk Stability %',
      align: 'right',
      render: (row) => <span className="font-mono tabular-nums text-[var(--mes-accent-primary)] font-bold">{row.stabilityPct.toFixed(1)}%</span>
    },
    {
      key: 'status',
      header: 'Spec Window',
      align: 'center',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-[var(--mes-radius)] text-[10px] font-mono font-bold border ${
          row.status === 'WARNING'
            ? 'bg-[var(--mes-status-warn-muted)] text-[var(--mes-status-warn)] border-[var(--mes-status-warn)]'
            : 'bg-[var(--mes-status-pass-muted)] text-[var(--mes-status-pass)] border-[var(--mes-status-pass)]'
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-4 font-sans max-w-7xl mx-auto p-1 sm:p-2">
      {/* Top Banner */}
      <div 
        className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
        style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--mes-accent-primary)]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--mes-text-muted)]">
              QUALITY & PROCESS ENGINEERING DEEP DIVE
            </span>
            <span className="px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-[var(--mes-bg-well)] text-[var(--mes-text-secondary)] text-[9.5px] font-mono font-bold border border-[var(--mes-border-hairline)]">
              DIAGNOSTIC PROTOCOL
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--mes-text-primary)] font-mono mt-1">
            Machine Diagnostics, Vacuum Sensors & Thermal Windows
          </h1>
          <p className="text-xs text-[var(--mes-text-secondary)] mt-0.5">
            Root-cause telemetry parsed directly from Fuji NXT III PDERROR frames and Heller Reflow thermocouple sensors
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 bg-[var(--mes-bg-well)] p-1 rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle)] font-mono text-xs">
          <button
            onClick={() => setActiveSubTab('FEEDERS')}
            className={`px-3 py-1.5 rounded-[var(--mes-radius)] transition-colors font-semibold flex items-center gap-1.5 ${
              activeSubTab === 'FEEDERS'
                ? 'bg-[var(--mes-bg-surface)] text-[var(--mes-accent-primary)] shadow-sm'
                : 'text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Feeder Errors</span>
          </button>

          <button
            onClick={() => setActiveSubTab('REFLOW_THERMAL')}
            className={`px-3 py-1.5 rounded-[var(--mes-radius)] transition-colors font-semibold flex items-center gap-1.5 ${
              activeSubTab === 'REFLOW_THERMAL'
                ? 'bg-[var(--mes-bg-surface)] text-[var(--mes-accent-primary)] shadow-sm'
                : 'text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Reflow Zones</span>
          </button>
        </div>
      </div>

      {/* Main Table Display based on active subtab */}
      {activeSubTab === 'FEEDERS' ? (
        <DataTable
          title="Fuji NXT III M6 Pick-and-Place Feeder Cassette Diagnostics"
          subtitle="Real-time vacuum sensor threshold and vision recognition failure log (Slot 01 - 45)"
          data={feederMisfireData}
          columns={feederColumns}
          keyExtractor={(r) => r.id}
          searchablePlaceholder="Filter by part or slot..."
          defaultSortKey="misfires"
          defaultSortDirection="desc"
          exportFilename="feeder_cassette_diagnostics.csv"
        />
      ) : (
        <DataTable
          title="Reflow Oven 10-Zone Thermal Equilibrium & Drift Monitor"
          subtitle="Real-time closed-loop thermocouple readings vs IPC-7530 thermal profile process window"
          data={thermalDriftData}
          columns={thermalColumns}
          keyExtractor={(r) => r.zone}
          searchablePlaceholder="Filter by zone or segment..."
          exportFilename="reflow_thermal_drift.csv"
        />
      )}
    </div>
  );
};
