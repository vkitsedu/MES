import React, { useState, useEffect, useCallback } from 'react';
import { 
  Minimize2, Activity, Clock, ShieldCheck, 
  Layers, Cpu, Zap, AlertTriangle, RefreshCw,
  Play, Pause, Sliders, Share2, Check,
  Flame, Droplets, Radio, Truck, EyeOff,
  Grid, ArrowRightLeft, X, Sparkles, DollarSign
} from 'lucide-react';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { SmtLineFlowStrip } from '../common/SmtLineFlowStrip';
import { ArcGaugeOee } from '../common/ArcGaugeOee';
import { MounterDropAnalysisCard } from '../common/MounterDropAnalysisCard';
import { ShiftGanttTimeline } from '../common/ShiftGanttTimeline';
import { SmtMachineFlowItem } from '@mes/shared';

export type KioskChannel = 
  | 'PRODUCTION_ANDON'
  | 'WAR_ROOM_2X2'
  | 'EXECUTIVE_BOARDROOM'
  | 'RECEPTION_LOBBY'
  | 'LOGISTICS_STAGING';

export type KioskLayout = 'SINGLE_TV' | 'GRID_2X2' | 'COCKPIT_1_2';

export type KioskWidgetId = 
  | 'SMT_FLOW'
  | 'OEE_GAUGES'
  | 'DROP_RATE'
  | 'GANTT_TIMELINE'
  | 'FUJI_DIAGNOSTICS'
  | 'SPI_MATRIX'
  | 'CLEANROOM_AIR'
  | 'EXECUTIVE_PL'
  | 'AGV_RADAR';

export interface WallKioskDisplayProps {
  onExitKiosk: () => void;
  initialChannel?: KioskChannel;
  initialLayout?: KioskLayout;
  initialLine?: 'LINE_01' | 'LINE_02';
  initialCarousel?: boolean;
  initialInterval?: number;
}

// Fallback machine flows for Line 01 and Line 02
const LINE_01_MACHINES: SmtMachineFlowItem[] = [
  { id: 'm1', name: 'Laser Marker', equipmentCode: 'LSR-01', type: 'LASER', towerLamp: 'RUN', cycleTimeSec: 12.4, stopCount: 2, stopTimeMin: 1.5, nozzleBypass: false },
  { id: 'm2', name: 'Screen Printer 1', equipmentCode: 'DEK-01', type: 'PRINTER', towerLamp: 'RUN', cycleTimeSec: 17.4, stopCount: 3, stopTimeMin: 2.1, nozzleBypass: false },
  { id: 'm3', name: '3D SPI (Koh Young)', equipmentCode: 'KY-SPI-01', type: 'SPI', towerLamp: 'RUN', cycleTimeSec: 14.2, stopCount: 1, stopTimeMin: 0.5, nozzleBypass: false },
  { id: 'm4', name: 'Fuji NXT III (M1)', equipmentCode: 'NXT-01-M1', type: 'MOUNTER', towerLamp: 'RUN', cycleTimeSec: 22.1, stopCount: 4, stopTimeMin: 3.2, nozzleBypass: false },
  { id: 'm5', name: 'Fuji NXT III (M2)', equipmentCode: 'NXT-01-M2', type: 'MOUNTER', towerLamp: 'WAIT', cycleTimeSec: 0.0, stopCount: 2, stopTimeMin: 1.8, nozzleBypass: false },
  { id: 'm6', name: 'Fuji NXT III (M3)', equipmentCode: 'NXT-01-M3', type: 'MOUNTER', towerLamp: 'RUN', cycleTimeSec: 21.8, stopCount: 1, stopTimeMin: 0.9, nozzleBypass: false },
  { id: 'm7', name: 'Reflow Oven (10-Zone)', equipmentCode: 'HELLER-1809', type: 'REFLOW', towerLamp: 'RUN', cycleTimeSec: 18.0, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false },
  { id: 'm8', name: '3D AOI (Post-Reflow)', equipmentCode: 'KY-AOI-01', type: 'AOI_POST', towerLamp: 'RUN', cycleTimeSec: 15.1, stopCount: 1, stopTimeMin: 0.4, nozzleBypass: false },
  { id: 'm9', name: '3D AXI X-Ray Inspection', equipmentCode: 'NORD-AXI-01', type: 'XRAY', towerLamp: 'RUN', cycleTimeSec: 16.5, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false }
];

const LINE_02_MACHINES: SmtMachineFlowItem[] = [
  { id: 'l2-m1', name: 'Laser Marker', equipmentCode: 'LSR-02', type: 'LASER', towerLamp: 'RUN', cycleTimeSec: 13.1, stopCount: 1, stopTimeMin: 0.8, nozzleBypass: false },
  { id: 'l2-m2', name: 'Screen Printer 2', equipmentCode: 'MPM-02', type: 'PRINTER', towerLamp: 'RUN', cycleTimeSec: 18.0, stopCount: 2, stopTimeMin: 1.4, nozzleBypass: false },
  { id: 'l2-m3', name: '3D SPI Inspection', equipmentCode: 'SPI-02', type: 'SPI', towerLamp: 'RUN', cycleTimeSec: 15.0, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false },
  { id: 'l2-m4', name: 'Fuji AIMEX IIIc (M1)', equipmentCode: 'AIMEX-01', type: 'MOUNTER', towerLamp: 'RUN', cycleTimeSec: 24.5, stopCount: 3, stopTimeMin: 2.9, nozzleBypass: false },
  { id: 'l2-m5', name: 'Fuji AIMEX IIIc (M2)', equipmentCode: 'AIMEX-02', type: 'MOUNTER', towerLamp: 'WAIT', cycleTimeSec: 0.0, stopCount: 1, stopTimeMin: 1.1, nozzleBypass: false },
  { id: 'l2-m6', name: 'Reflow 12-Zone', equipmentCode: 'RFW-02', type: 'REFLOW', towerLamp: 'RUN', cycleTimeSec: 19.2, stopCount: 0, stopTimeMin: 0.0, nozzleBypass: false },
  { id: 'l2-m7', name: '3D AOI Post-Reflow', equipmentCode: 'AOI-02', type: 'AOI_POST', towerLamp: 'RUN', cycleTimeSec: 16.0, stopCount: 1, stopTimeMin: 0.6, nozzleBypass: false }
];

const WIDGET_OPTIONS: { id: KioskWidgetId; label: string; description: string }[] = [
  { id: 'SMT_FLOW', label: 'SMT Line Flow Strip', description: 'Docked hardware bay with live 3-lamp towers and conveyor rail' },
  { id: 'OEE_GAUGES', label: 'Precision OEE Gauge Cluster', description: '5 micro-calibrated radial instruments with ambient glow' },
  { id: 'DROP_RATE', label: 'Mounter Drop Rate (PPM)', description: 'Vacuum vs vision reject ratio and 3-shift audit matrix' },
  { id: 'GANTT_TIMELINE', label: 'Shift Gantt & Pareto', description: 'Run/downtime breakdown with stoppage Pareto ranking' },
  { id: 'FUJI_DIAGNOSTICS', label: 'Fuji Nexim Diagnostics', description: 'PDERROR mispick rankings by nozzle and feeder slot' },
  { id: 'SPI_MATRIX', label: '3D SPI Inspection Matrix', description: 'Aperture height/volume capability and solder defect map' },
  { id: 'CLEANROOM_AIR', label: 'Cleanroom ISO Air & ESD', description: 'ISO 14644 Class 7 particulate count and ground sensor status' },
  { id: 'EXECUTIVE_PL', label: 'Executive P&L & Throughput', description: 'Daily financial output ($), scrap cost/hr, and capacity %' },
  { id: 'AGV_RADAR', label: 'AGV Logistics Fleet Map', description: 'Autonomous rover missions, dock locks, and reel replenishment' }
];

const CHANNELS_ORDER: KioskChannel[] = [
  'PRODUCTION_ANDON',
  'WAR_ROOM_2X2',
  'EXECUTIVE_BOARDROOM',
  'RECEPTION_LOBBY',
  'LOGISTICS_STAGING'
];

export const WallKioskDisplay: React.FC<WallKioskDisplayProps> = ({ 
  onExitKiosk,
  initialChannel = 'PRODUCTION_ANDON',
  initialLayout = 'SINGLE_TV',
  initialLine = 'LINE_01',
  initialCarousel = false,
  initialInterval = 30
}) => {
  // Navigation & Configuration State
  const [channel, setChannel] = useState<KioskChannel>(initialChannel);
  const [layout, setLayout] = useState<KioskLayout>(initialLayout);
  const [activeLine, setActiveLine] = useState<'LINE_01' | 'LINE_02'>(initialLine);
  const [currentTime, setCurrentTime] = useState<string>(() => new Date().toLocaleTimeString());
  const [isCarouselActive, setIsCarouselActive] = useState<boolean>(initialCarousel);
  const [carouselSecondsRemaining, setCarouselSecondsRemaining] = useState<number>(initialInterval);
  const [carouselInterval] = useState<number>(initialInterval);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  // Slot Assignment Configuration (Defaults for 2x2 and Cockpit 1+2)
  const [slots, setSlots] = useState<{
    slot1: KioskWidgetId;
    slot2: KioskWidgetId;
    slot3: KioskWidgetId;
    slot4: KioskWidgetId;
  }>({
    slot1: 'SMT_FLOW',
    slot2: 'OEE_GAUGES',
    slot3: 'DROP_RATE',
    slot4: 'GANTT_TIMELINE'
  });

  // Clock & Carousel Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());

      if (isCarouselActive) {
        setCarouselSecondsRemaining(prev => {
          if (prev <= 1) {
            // Advance to next channel in sequence
            setChannel(curr => {
              const idx = CHANNELS_ORDER.indexOf(curr);
              return CHANNELS_ORDER[(idx + 1) % CHANNELS_ORDER.length];
            });
            return carouselInterval;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isCarouselActive, carouselInterval]);

  // Keyboard shortcut: ESC exits kiosk
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExitKiosk();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExitKiosk]);

  // Copy Direct TV Deployment URL
  const copyTvDeploymentUrl = useCallback(() => {
    const origin = window.location.origin;
    const url = `${origin}/?kiosk=true&channel=${channel}&layout=${layout}&line=${activeLine}${isCarouselActive ? `&carousel=true&interval=${carouselInterval}` : ''}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }).catch(() => {});
  }, [channel, layout, activeLine, isCarouselActive, carouselInterval]);

  // Active machines based on selected line
  const machines = activeLine === 'LINE_01' ? LINE_01_MACHINES : LINE_02_MACHINES;
  const hasEmergencyStop = machines.some(m => m.towerLamp === 'STOP');

  // Widget Renderer Engine for Modular Slots
  const renderWidget = (widgetId: KioskWidgetId) => {
    switch (widgetId) {
      case 'SMT_FLOW':
        return (
          <div className="h-full flex flex-col justify-between">
            <SmtLineFlowStrip
              machines={machines}
              lineName={activeLine === 'LINE_01' ? 'SMT LINE 01 (FUJI NXT III M6)' : 'SMT LINE 02 (FUJI AIMEX IIIc)'}
              targetCycleTimeSec={18.0}
            />
          </div>
        );

      case 'OEE_GAUGES':
        return (
          <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-3 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-sans font-bold text-slate-100 uppercase tracking-wider text-[11.5px] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                SEMI E10 Precision Metric Instrument Cluster
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                LINE BALANCED
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 my-auto pt-2">
              <ArcGaugeOee value={88.4} target={85.0} label="LINE OEE" sublabel="SEMI E10" size={130} />
              <ArcGaugeOee value={91.2} target={90.0} label="AVAILABILITY" sublabel="420m / 44m" size={130} />
              <ArcGaugeOee value={99.6} target={88.0} label="PERFORMANCE" sublabel="44,820 CPH" size={130} />
              <ArcGaugeOee value={98.4} target={98.0} label="QUALITY YIELD" sublabel="142 OK / 2 Fail" size={130} />
              <ArcGaugeOee value={92.5} target={90.0} label="LINE BALANCE" sublabel="Mod Pacing PBR" size={130} />
            </div>
          </div>
        );

      case 'DROP_RATE':
        return (
          <div className="h-full">
            <MounterDropAnalysisCard
              dropData={{
                targetPpm: 310,
                actualPpm: 288,
                status: 'PASS',
                totalPickups: 1280450,
                totalErrors: 368,
                recogErrors: 144,
                pickupErrors: 224,
                recogDropRatePpm: 112,
                pickupDropRatePpm: 175
              }}
              lineName={activeLine === 'LINE_01' ? 'SMD_01' : 'SMD_02'}
            />
          </div>
        );

      case 'GANTT_TIMELINE':
        return (
          <div className="h-full flex flex-col justify-between">
            <ShiftGanttTimeline
              totalMinutes={480}
              shiftCode="SHIFT 1 (DAY PRODUCTION)"
            />
          </div>
        );

      case 'FUJI_DIAGNOSTICS':
        return (
          <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-3 text-slate-100 font-mono text-xs h-full flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-sans font-bold text-slate-100 uppercase tracking-wider text-[11.5px] flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Fuji PDERROR Mispick Diagnostics
              </span>
              <span className="text-[10px] text-slate-400">Live Hardware Bus</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block mb-1">Top Nozzle Mispicks</span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between"><span className="text-slate-200">H01-N04 (0402)</span><span className="text-rose-400 font-bold">14x (0.057%)</span></div>
                  <div className="flex justify-between"><span className="text-slate-200">H02-N08 (0201)</span><span className="text-rose-400 font-bold">9x (0.049%)</span></div>
                  <div className="flex justify-between"><span className="text-slate-200">H01-N02 (QFP)</span><span className="text-amber-400 font-bold">3x (0.034%)</span></div>
                </div>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block mb-1">Top Slot Misfires</span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between"><span className="text-slate-200">SLOT-04-L (100NF)</span><span className="text-amber-400 font-bold">18x (0.117%)</span></div>
                  <div className="flex justify-between"><span className="text-slate-200">SLOT-12-R (10K)</span><span className="text-amber-400 font-bold">12x (0.057%)</span></div>
                  <div className="flex justify-between"><span className="text-slate-200">SLOT-22-L (STM32)</span><span className="text-emerald-400 font-bold">4x (0.065%)</span></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'SPI_MATRIX':
        return (
          <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-3 text-slate-100 font-mono text-xs h-full flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-sans font-bold text-slate-100 uppercase tracking-wider text-[11.5px] flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                Koh Young 3D SPI Closed-Loop Volumetric Matrix
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Cpk: 1.58 (PASS)</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center pt-2">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Avg Solder Height</span>
                <span className="text-base font-bold text-slate-100 mt-0.5 block">124.5 µm</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Aperture Volume</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">98.2%</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Coplanarity</span>
                <span className="text-base font-bold text-slate-100 mt-0.5 block">2.1 µm</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Offset Shift X/Y</span>
                <span className="text-base font-bold text-cyan-400 mt-0.5 block">±3.2 µm</span>
              </div>
            </div>
          </div>
        );

      case 'CLEANROOM_AIR':
        return (
          <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-3 text-slate-100 font-mono text-xs h-full flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-sans font-bold text-slate-100 uppercase tracking-wider text-[11.5px] flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ISO 14644 Class 7 Cleanroom Environmental Telemetry
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                CERTIFIED COMPLIANT
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans font-semibold">0.5µm Particle Count</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">284,000 / m³</span>
                <span className="text-[10px] text-slate-500 block">Spec: &lt; 352,000</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans font-semibold">ESD Flooring Resistance</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">1.2 × 10⁶ Ω</span>
                <span className="text-[10px] text-slate-500 block">ANSI/ESD S20.20 Pass</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans font-semibold">Climate Temp / RH</span>
                <span className="text-lg font-black text-slate-100 mt-1 block">22.4°C · 48.5%</span>
                <span className="text-[10px] text-slate-500 block">JEDEC J-STD-033 Spec</span>
              </div>
            </div>
          </div>
        );

      case 'EXECUTIVE_PL':
        return (
          <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-3 text-slate-100 font-mono text-xs h-full flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-sans font-bold text-slate-100 uppercase tracking-wider text-[11.5px] flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Cleanroom Financial Throughput & Scrap Velocity
              </span>
              <span className="text-[10px] text-cyan-400">Shift 1 P&amp;L Rollup</span>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-2">
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Daily Output Value</span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">$142,800</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Scrap Loss Cost</span>
                <span className="text-xl font-black text-amber-400 mt-1 block">$128 / hr</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Capacity Utilization</span>
                <span className="text-xl font-black text-slate-100 mt-1 block">94.2%</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Shipment Adherence</span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">99.1%</span>
              </div>
            </div>
          </div>
        );

      case 'AGV_RADAR':
        return (
          <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-3 text-slate-100 font-mono text-xs h-full flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-sans font-bold text-slate-100 uppercase tracking-wider text-[11.5px] flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                Autonomous Mobile Robot (AMR) Logistics Queue
              </span>
              <span className="text-[10px] text-emerald-400">4 Active Rovers</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-100 block">ROVER-01 (Line 1 Staging)</span>
                  <span className="text-[10px] text-slate-400">Reel Replenishment (100NF Caps)</span>
                </div>
                <span className="text-emerald-400 font-bold">EN ROUTE (45s)</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-100 block">ROVER-02 (Paste Bay)</span>
                  <span className="text-[10px] text-slate-400">SnPb Stencil Jar Delivery</span>
                </div>
                <span className="text-cyan-400 font-bold">DOCK LOCKED</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06090e] text-slate-100 flex flex-col justify-between select-none font-sans overflow-hidden">
      {/* Top Display Director Control Ribbon (Tier-1 Mission Control Standard) */}
      <header className="bg-slate-950/95 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl shrink-0">
        {/* Left: Department Channel Switcher */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10B981]" />
            </span>
            <span className="font-mono text-[11px] font-bold text-slate-300 uppercase tracking-widest hidden sm:inline">
              KIOSK DIRECTOR
            </span>
          </div>

          <div className="flex bg-slate-900 p-0.5 border border-slate-800 rounded-[var(--mes-radius)] text-[10.5px] font-mono">
            <button
              type="button"
              onClick={() => { setChannel('PRODUCTION_ANDON'); setLayout('SINGLE_TV'); }}
              className={`px-2.5 py-1 font-bold rounded-[2px] transition-all ${
                channel === 'PRODUCTION_ANDON' ? 'bg-cyan-950/90 text-cyan-400 border border-cyan-500/50 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SHOP ANDON
            </button>
            <button
              type="button"
              onClick={() => { setChannel('WAR_ROOM_2X2'); setLayout('GRID_2X2'); }}
              className={`px-2.5 py-1 font-bold rounded-[2px] transition-all ${
                channel === 'WAR_ROOM_2X2' ? 'bg-cyan-950/90 text-cyan-400 border border-cyan-500/50 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2×2 WAR ROOM
            </button>
            <button
              type="button"
              onClick={() => { setChannel('EXECUTIVE_BOARDROOM'); setLayout('SINGLE_TV'); }}
              className={`px-2.5 py-1 font-bold rounded-[2px] transition-all ${
                channel === 'EXECUTIVE_BOARDROOM' ? 'bg-cyan-950/90 text-cyan-400 border border-cyan-500/50 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EXECUTIVE
            </button>
            <button
              type="button"
              onClick={() => { setChannel('RECEPTION_LOBBY'); setLayout('SINGLE_TV'); }}
              className={`px-2.5 py-1 font-bold rounded-[2px] transition-all ${
                channel === 'RECEPTION_LOBBY' ? 'bg-cyan-950/90 text-cyan-400 border border-cyan-500/50 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LOBBY SHOWCASE
            </button>
            <button
              type="button"
              onClick={() => { setChannel('LOGISTICS_STAGING'); setLayout('SINGLE_TV'); }}
              className={`px-2.5 py-1 font-bold rounded-[2px] transition-all ${
                channel === 'LOGISTICS_STAGING' ? 'bg-cyan-950/90 text-cyan-400 border border-cyan-500/50 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LOGISTICS BAY
            </button>
          </div>
        </div>

        {/* Center: Layout Switcher & Line Selector */}
        <div className="flex items-center gap-2 font-mono text-[10.5px]">
          {/* Layout Switcher */}
          <div className="flex bg-slate-900 p-0.5 border border-slate-800 rounded-[var(--mes-radius)]">
            <button
              type="button"
              onClick={() => setLayout('SINGLE_TV')}
              className={`px-2 py-0.5 font-bold rounded-[2px] transition-all ${
                layout === 'SINGLE_TV' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="1-TV Fullscreen Hero"
            >
              1-TV
            </button>
            <button
              type="button"
              onClick={() => setLayout('GRID_2X2')}
              className={`px-2 py-0.5 font-bold rounded-[2px] transition-all ${
                layout === 'GRID_2X2' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="2x2 Video Wall Matrix (4 Quadrants)"
            >
              2×2 GRID
            </button>
            <button
              type="button"
              onClick={() => setLayout('COCKPIT_1_2')}
              className={`px-2 py-0.5 font-bold rounded-[2px] transition-all ${
                layout === 'COCKPIT_1_2' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="1+2 Split Cockpit"
            >
              1+2 SPLIT
            </button>
          </div>

          {/* Line Toggle */}
          <button
            type="button"
            onClick={() => setActiveLine(prev => (prev === 'LINE_01' ? 'LINE_02' : 'LINE_01'))}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-[var(--mes-radius)] text-slate-300 font-bold flex items-center gap-1 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            {activeLine === 'LINE_01' ? 'LINE 01 (NXT III)' : 'LINE 02 (AIMEX)'}
          </button>

          {/* Carousel Toggle */}
          <button
            type="button"
            onClick={() => setIsCarouselActive(prev => !prev)}
            className={`px-2.5 py-1 rounded-[var(--mes-radius)] border flex items-center gap-1.5 font-bold transition-all ${
              isCarouselActive 
                ? 'bg-amber-950/70 border-amber-500/60 text-amber-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Auto-cycle through all department channels"
          >
            {isCarouselActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isCarouselActive ? `ROTATING (${carouselSecondsRemaining}s)` : 'CAROUSEL'}</span>
          </button>

          {/* Slot Customizer Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsSlotModalOpen(true)}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-[var(--mes-radius)] text-slate-300 font-bold flex items-center gap-1 transition-colors"
            title="Configure widget slot mapping"
          >
            <Sliders className="w-3 h-3 text-cyan-400" />
            <span>SLOTS</span>
          </button>
        </div>

        {/* Right: Digital Clock & Exit Button */}
        <div className="flex items-center gap-3 font-mono">
          {/* Public Redaction Indicator on Lobby Mode */}
          {channel === 'RECEPTION_LOBBY' && (
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[9.5px] font-bold uppercase rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/40">
              <EyeOff className="w-3 h-3" />
              CONFIDENTIAL REDACTED
            </span>
          )}

          {/* Copy Deployment URL */}
          <button
            type="button"
            onClick={copyTvDeploymentUrl}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-[var(--mes-radius)] text-slate-300 transition-colors"
            title="Copy zero-touch TV deployment URL to clipboard"
          >
            {copyFeedback ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          <div className="text-right">
            <span className="text-[11px] font-black text-slate-100 tabular-nums">
              {currentTime}
            </span>
          </div>

          <button
            onClick={onExitKiosk}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-[var(--mes-radius)] border border-slate-800 transition-colors"
            title="Exit Kiosk Mode (ESC)"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Emergency Andon Interlock Halt Banner (Appears dynamically on STOP) */}
      {hasEmergencyStop && (
        <div className="bg-rose-950 border-b-2 border-rose-500 px-6 py-2.5 flex items-center justify-between text-rose-100 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse shrink-0">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-400 block">
                CRITICAL ANDON INTERLOCK ACTIVE • EMERGENCY LINE HALT
              </span>
              <span className="font-sans font-black text-sm text-white">
                Downstream station trip detected on {activeLine}. Automated board infeed halted by SMEMA bus.
              </span>
            </div>
          </div>
          <span className="font-mono text-xs font-bold bg-rose-900 px-3 py-1 rounded border border-rose-400 text-white">
            SEMI E10: UNSCHEDULED DOWN
          </span>
        </div>
      )}

      {/* Main Content Area: Driven by Channel and Layout Matrix */}
      <main className="flex-1 p-3 overflow-hidden flex flex-col">
        {/* VIEW 1: PRODUCTION SHOP FLOOR ANDON (10-Meter Glanceability) */}
        {channel === 'PRODUCTION_ANDON' && layout === 'SINGLE_TV' && (
          <div className="h-full flex flex-col justify-between gap-3">
            {/* Top Giant Andon Beacon Banner */}
            <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 sm:p-5 flex items-center justify-between shadow-xl border-l-8 border-l-emerald-500 shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 border border-slate-800 shrink-0">
                  <span className="w-8 h-8 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
                  <span className="w-5 h-5 rounded-full bg-emerald-500 shadow-[0_0_15px_#10B981]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                    <span>ANDON BEACON: NORMAL RUNNING</span>
                    <span>•</span>
                    <span className="text-slate-400">SMT TAKT: 18.0s TARGET</span>
                  </div>
                  <h1 className="text-xl sm:text-3xl font-black font-sans text-slate-100 mt-0.5 tracking-tight">
                    {activeLine === 'LINE_01' ? 'SMT LINE 01 : FUJI NXT III M6' : 'SMT LINE 02 : FUJI AIMEX IIIc'} • PACING SYNCHRONIZED
                  </h1>
                </div>
              </div>
              <div className="hidden lg:block text-right font-mono text-xs text-slate-400">
                <span className="uppercase block">Active Program</span>
                <strong className="text-slate-100 text-base">PROG-SM-METER-TOP-REV4</strong>
              </div>
            </div>

            {/* 5 Giant Glanceable KPI Blocks */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 shrink-0 font-mono">
              <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 text-center">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Overall OEE</span>
                <div className="text-3xl sm:text-5xl font-black text-cyan-400 my-2 tabular-nums">
                  <AnimatedNumber value={88.4} decimals={1} />%
                </div>
                <span className="text-[11px] text-emerald-400 font-bold">Target: 85.0% (PASS)</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 text-center">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Placement Speed</span>
                <div className="text-3xl sm:text-5xl font-black text-slate-100 my-2 tabular-nums">
                  <AnimatedNumber value={44820} />
                </div>
                <span className="text-[11px] text-slate-400 font-bold">CPH (99.6% Rated)</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 text-center">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">First Pass Yield</span>
                <div className="text-3xl sm:text-5xl font-black text-emerald-400 my-2 tabular-nums">
                  <AnimatedNumber value={98.4} decimals={1} />%
                </div>
                <span className="text-[11px] text-emerald-400 font-bold">Target: 98.0% (PASS)</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 text-center">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Lot Output</span>
                <div className="text-3xl sm:text-5xl font-black text-slate-100 my-2 tabular-nums">
                  <AnimatedNumber value={892} />
                </div>
                <span className="text-[11px] text-slate-400 font-bold">/ 1,200 Panels (74%)</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 text-center col-span-2 lg:col-span-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Drop Rate</span>
                <div className="text-3xl sm:text-5xl font-black text-emerald-400 my-2 tabular-nums">
                  <AnimatedNumber value={288} />
                </div>
                <span className="text-[11px] text-emerald-400 font-bold">&lt; 310 PPM (PASS)</span>
              </div>
            </div>

            {/* Bottom: Continuous Docked Equipment Flow Strip */}
            <div className="flex-1 min-h-0 flex flex-col justify-end">
              <SmtLineFlowStrip
                machines={machines}
                lineName={activeLine === 'LINE_01' ? 'SMT LINE 01 (FUJI NXT III M6)' : 'SMT LINE 02 (FUJI AIMEX IIIc)'}
                targetCycleTimeSec={18.0}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: 2×2 VIDEO WALL MATRIX (4 Synchronized Operational Quadrants) */}
        {layout === 'GRID_2X2' && (
          <div className="h-full grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-2.5">
            <div className="overflow-hidden">{renderWidget(slots.slot1)}</div>
            <div className="overflow-hidden">{renderWidget(slots.slot2)}</div>
            <div className="overflow-hidden">{renderWidget(slots.slot3)}</div>
            <div className="overflow-hidden">{renderWidget(slots.slot4)}</div>
          </div>
        )}

        {/* VIEW 3: 1+2 COCKPIT SPLIT (Dominant Hero Left + 2 Stacked Cards Right) */}
        {layout === 'COCKPIT_1_2' && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-2.5">
            <div className="lg:col-span-7 h-full overflow-hidden flex flex-col justify-between">
              {renderWidget(slots.slot1)}
            </div>
            <div className="lg:col-span-5 h-full flex flex-col gap-2.5 overflow-hidden">
              <div className="flex-1 overflow-hidden">{renderWidget(slots.slot2)}</div>
              <div className="flex-1 overflow-hidden">{renderWidget(slots.slot3)}</div>
            </div>
          </div>
        )}

        {/* VIEW 4: EXECUTIVE BOARDROOM (Financial Velocity & Capacity Briefing) */}
        {channel === 'EXECUTIVE_BOARDROOM' && layout === 'SINGLE_TV' && (
          <div className="h-full flex flex-col justify-between gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-widest block">
                  EXECUTIVE BRIEFING • SMT PLANT VELOCITY & QUALITY ROLLUP
                </span>
                <h1 className="text-2xl font-black text-slate-100 mt-1">
                  Factory Financial Throughput & Yield Performance
                </h1>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-slate-400 uppercase block">Shift 1 P&amp;L Pace</span>
                <strong className="text-emerald-400 text-lg">ON TARGET (+4.2%)</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono">
              <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 text-center">
                <span className="text-slate-400 text-xs uppercase block">Daily Financial Value</span>
                <div className="text-4xl font-black text-emerald-400 my-2">$142,800</div>
                <span className="text-slate-400 text-xs">Target: $135,000</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 text-center">
                <span className="text-slate-400 text-xs uppercase block">Scrap Loss Cost</span>
                <div className="text-4xl font-black text-amber-400 my-2">$128 / hr</div>
                <span className="text-emerald-400 text-xs font-bold">-18% vs Last Week</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 text-center">
                <span className="text-slate-400 text-xs uppercase block">Capacity Utilization</span>
                <div className="text-4xl font-black text-slate-100 my-2">94.2%</div>
                <span className="text-emerald-400 text-xs font-bold">2 Lines Active</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 text-center">
                <span className="text-slate-400 text-xs uppercase block">Delivery Commitment</span>
                <div className="text-4xl font-black text-cyan-400 my-2">99.1%</div>
                <span className="text-slate-400 text-xs">On-Time Shipment</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0">
              <div className="overflow-hidden">
                {renderWidget('OEE_GAUGES')}
              </div>
              <div className="overflow-hidden">
                {renderWidget('CLEANROOM_AIR')}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: RECEPTION / PUBLIC LOBBY ("The Glass Factory" Sanitized Showcase) */}
        {channel === 'RECEPTION_LOBBY' && layout === 'SINGLE_TV' && (
          <div className="h-full flex flex-col justify-between gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-5 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-widest block">
                    APEX HIGH-TECH SMART FACTORY • PUBLIC SHOWCASE
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-100 mt-0.5">
                    Sustainable, Certified Cleanroom Electronics Manufacturing
                  </h1>
                </div>
              </div>
              <div className="text-right font-mono text-xs text-slate-400">
                <span className="uppercase block">Environmental Standard</span>
                <strong className="text-emerald-400 text-base">ISO 14644 CLASS 7 COMPLIANT</strong>
              </div>
            </div>

            {/* Macro High-Gloss Showcase Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
              <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-5 text-center">
                <span className="text-xs text-slate-400 uppercase block font-sans">Units Produced Today</span>
                <div className="text-4xl font-black text-slate-100 my-2">18,450</div>
                <span className="text-xs text-emerald-400 font-bold">100% Quality Inspected</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-5 text-center">
                <span className="text-xs text-slate-400 uppercase block font-sans">Cumulative Shipped</span>
                <div className="text-4xl font-black text-cyan-400 my-2">1,428,500</div>
                <span className="text-xs text-slate-400">Zero Critical Recalls</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-5 text-center">
                <span className="text-xs text-slate-400 uppercase block font-sans">Solar &amp; Green Energy</span>
                <div className="text-4xl font-black text-emerald-400 my-2">91.4%</div>
                <span className="text-xs text-emerald-400 font-bold">Carbon Offset Certified</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-5 text-center">
                <span className="text-xs text-slate-400 uppercase block font-sans">Cleanroom Particulate</span>
                <div className="text-4xl font-black text-emerald-400 my-2">0.5µm PASS</div>
                <span className="text-xs text-slate-400">Air Filtration Nominal</span>
              </div>
            </div>

            {/* Sanitized Live Equipment Flow Strip */}
            <div className="flex-1 min-h-0 flex flex-col justify-end">
              <SmtLineFlowStrip
                machines={LINE_01_MACHINES}
                lineName="APEX SMART LINE 01 • CONTINUOUS HIGH-SPEED PLACEMENT"
                targetCycleTimeSec={18.0}
              />
            </div>
          </div>
        )}

        {/* VIEW 6: LOGISTICS & WAREHOUSE AGV BAY */}
        {channel === 'LOGISTICS_STAGING' && layout === 'SINGLE_TV' && (
          <div className="h-full flex flex-col justify-between gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-widest block">
                  WAREHOUSE LOGISTICS • MATERIAL PREPARATION &amp; AGV QUEUE
                </span>
                <h1 className="text-2xl font-black text-slate-100 mt-1">
                  Solder Paste Thaw &amp; JEDEC MSD Floor Life Monitoring
                </h1>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/40 font-bold">
                LOGISTICS BUS: SYNCHRONIZED
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0">
              <div className="overflow-hidden">
                {renderWidget('AGV_RADAR')}
              </div>
              <div className="overflow-hidden">
                {renderWidget('CLEANROOM_AIR')}
              </div>
            </div>

            <div className="overflow-hidden shrink-0">
              {renderWidget('DROP_RATE')}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Footer Status Bar */}
      <footer className="bg-slate-950 px-4 py-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#10B981]" />
            Cleanroom Telemetry Bus: 1000ms WebSocket Cadence
          </span>
          <span>•</span>
          <span>Profile: <strong className="text-slate-200">{channel}</strong> ({layout})</span>
          <span>•</span>
          <span>Station: <strong className="text-cyan-400">{activeLine}</strong></span>
        </div>
        <div>
          <span>PRESS <kbd className="px-1 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-bold">ESC</kbd> TO EXIT KIOSK</span>
        </div>
      </footer>

      {/* Slot Customizer Modal / Drawer */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] w-full max-w-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="font-sans font-bold text-slate-100 text-sm uppercase tracking-wider">
                  Video Wall Slot Customizer &amp; Widget Matrix
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSlotModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-sans">
              Assign any cleanroom telemetry module to the 4 video wall quadrants. Changes apply immediately to the 2×2 Grid and 1+2 Split layouts.
            </p>

            {/* 4 Quadrant Slot Selectors */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-900 p-3 rounded border border-slate-800 space-y-1.5">
                <span className="text-[10.5px] font-bold text-cyan-400 uppercase block font-sans">Slot 1 (Quadrant 1 / Hero)</span>
                <select
                  value={slots.slot1}
                  onChange={(e) => setSlots({ ...slots, slot1: e.target.value as KioskWidgetId })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-bold"
                >
                  {WIDGET_OPTIONS.map(w => (
                    <option key={w.id} value={w.id}>{w.label}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-900 p-3 rounded border border-slate-800 space-y-1.5">
                <span className="text-[10.5px] font-bold text-cyan-400 uppercase block font-sans">Slot 2 (Quadrant 2)</span>
                <select
                  value={slots.slot2}
                  onChange={(e) => setSlots({ ...slots, slot2: e.target.value as KioskWidgetId })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-bold"
                >
                  {WIDGET_OPTIONS.map(w => (
                    <option key={w.id} value={w.id}>{w.label}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-900 p-3 rounded border border-slate-800 space-y-1.5">
                <span className="text-[10.5px] font-bold text-cyan-400 uppercase block font-sans">Slot 3 (Quadrant 3)</span>
                <select
                  value={slots.slot3}
                  onChange={(e) => setSlots({ ...slots, slot3: e.target.value as KioskWidgetId })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-bold"
                >
                  {WIDGET_OPTIONS.map(w => (
                    <option key={w.id} value={w.id}>{w.label}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-900 p-3 rounded border border-slate-800 space-y-1.5">
                <span className="text-[10.5px] font-bold text-cyan-400 uppercase block font-sans">Slot 4 (Quadrant 4)</span>
                <select
                  value={slots.slot4}
                  onChange={(e) => setSlots({ ...slots, slot4: e.target.value as KioskWidgetId })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-bold"
                >
                  {WIDGET_OPTIONS.map(w => (
                    <option key={w.id} value={w.id}>{w.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setSlots({
                    slot1: 'SMT_FLOW',
                    slot2: 'OEE_GAUGES',
                    slot3: 'DROP_RATE',
                    slot4: 'GANTT_TIMELINE'
                  });
                }}
                className="text-slate-400 hover:text-slate-200 underline"
              >
                Reset to Default Presets
              </button>

              <button
                type="button"
                onClick={() => setIsSlotModalOpen(false)}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded"
              >
                Apply Layout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
