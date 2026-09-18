import React, { useState, useEffect, useCallback } from 'react';
import { 
  Cpu, Radio, Shield, Key, Lock, LogOut, UserCheck, Search,
  ChevronDown, Check, Activity, Sliders, Layers, Flame, Truck, 
  GitFork, Crosshair, Terminal, Split, RefreshCw, FileText, Settings, 
  Clock, BarChart3, AlertTriangle, Palette, Tv, User
} from 'lucide-react';
import { SolderPasteStation } from './components/SolderPasteStation';
import { OperatorStation } from './components/OperatorStation';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { TraceabilityStation } from './components/TraceabilityStation';
import { AuditTrailViewer } from './components/AuditTrailViewer';
import { CleanroomComplianceStation } from './components/CleanroomComplianceStation';
import { ReworkStation } from './components/ReworkStation';
import { SpiStation } from './components/SpiStation';
import { FleetDashboard } from './components/FleetDashboard';
import { AgvLogisticsStation } from './components/AgvLogisticsStation';
import { PredictiveIntelligenceStation } from './components/PredictiveIntelligenceStation';
import { ReflowThermalStation } from './components/ReflowThermalStation';
import { LineLayoutStudio } from './components/studio/LineLayoutStudio';
import { LoginModal } from './components/auth/LoginModal';
import { authService, OperatorProfile, OperatorRole } from './services/auth.service';
import { CollapsibleSidebar } from './components/navigation/CollapsibleSidebar';
import { OperatorKioskView } from './components/personas/OperatorKioskView';
import { ManagerExecutiveView } from './components/personas/ManagerExecutiveView';
import { EngineerDeepDiveView } from './components/personas/EngineerDeepDiveView';
import { WallKioskDisplay, KioskChannel, KioskLayout } from './components/personas/WallKioskDisplay';

import { 
  NavTab, 
  STATIONS, 
  isTabAllowed, 
  getInitialOrPermittedTab 
} from './config/navigation';
import { ShiftBriefingModal } from './components/navigation/ShiftBriefingModal';
import { StationModeModal, StationModes } from './components/navigation/StationModeModal';
import { FujiMachineLinkModal } from './components/navigation/FujiMachineLinkModal';
import { ThemePaletteModal } from './components/common/ThemePaletteModal';
import { CommandPaletteModal } from './components/common/CommandPaletteModal';
import { ThemeProvider, useTheme } from './themes/ThemeProvider';
import { useManagerKpis, generateShiftBriefingText } from './services/kpi-adapter';

const ROLE_BADGE_STYLES: Record<OperatorRole, { bg: string; text: string; border: string }> = {
  OPERATOR: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  MAINTENANCE: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  QUALITY_LEAD: { bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  LINE_LEAD: { bg: 'bg-sky-500/10', text: 'text-sky-300', border: 'border-sky-500/30' },
  SYSTEM_ADMIN: { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/30' }
};

interface MdiTabItem {
  id: NavTab;
  code: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hotkey: string;
}

const MDI_TABS: MdiTabItem[] = [
  { id: 'SUPERVISOR', code: 'SMD_01', label: 'SMT Line Realtime Flow', icon: Activity, hotkey: '1' },
  { id: 'STUDIO', code: 'STU-01', label: 'Line & Floor Studio', icon: Sliders, hotkey: 's' },
  { id: 'FLEET', code: 'NEXIM', label: 'Fuji Management Monitor', icon: Split, hotkey: '2' },
  { id: 'SPI', code: 'SPI-01', label: '3D SPI Inspection', icon: Sliders, hotkey: '3' },
  { id: 'OPERATOR', code: 'FDR-01', label: 'Feeder Bay Rails', icon: Cpu, hotkey: '4' },
  { id: 'SOLDER_PASTE', code: 'PST-01', label: 'Paste & MSL Thaw', icon: Layers, hotkey: '5' },
  { id: 'REFLOW', code: 'RFW-01', label: 'Reflow 10-Zone Oven', icon: Flame, hotkey: '6' },
  { id: 'GENEALOGY', code: 'TRC-01', label: 'Genealogy & Lot Recall', icon: GitFork, hotkey: '7' },
  { id: 'AUDIT_TRAIL', code: 'LOG-01', label: 'CFR 11 Hash Ledger', icon: Terminal, hotkey: '8' },
  { id: 'COMPLIANCE', code: 'DHR-01', label: 'Cleanroom eDHR Gate', icon: Shield, hotkey: '9' },
  { id: 'REWORK', code: 'RWK-01', label: 'AOI Defect Rework', icon: Crosshair, hotkey: '0' },
  { id: 'AGV_LOGISTICS', code: 'AGV-01', label: 'AGV Material Fleet', icon: Truck, hotkey: 'a' },
  { id: 'PREDICTIVE', code: 'SPC-01', label: 'Predictive SPC & Drift', icon: BarChart3, hotkey: 'p' },
];

export type ActivePersona = 'OPERATOR' | 'SUPERVISOR' | 'ENGINEER' | 'EXECUTIVE';

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const [operator, setOperator] = useState<OperatorProfile | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('SUPERVISOR');
  const [activePersona, setActivePersona] = useState<ActivePersona>('SUPERVISOR');
  const [isKioskMode, setIsKioskMode] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true);
  
  const [selectedLine, setSelectedLine] = useState<'LINE_01' | 'LINE_02'>('LINE_01');
  const [isLineMenuOpen, setIsLineMenuOpen] = useState(false);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isStationModeModalOpen, setIsStationModeModalOpen] = useState(false);
  const [isFujiLinkModalOpen, setIsFujiLinkModalOpen] = useState(false);
  const [fujiStatus, setFujiStatus] = useState<any>(null);
  const [stationModes, setStationModes] = useState<StationModes>({
    dbMode: 'STANDALONE',
    fujiMode: 'LIVE_TCP',
    spiMode: 'SIMULATED',
    aoiMode: 'SIMULATED',
    printerMode: 'SIMULATED',
    reflowMode: 'SIMULATED'
  });
  const [briefingText, setBriefingText] = useState('');
  const [briefingCopyError, setBriefingCopyError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>(() => new Date().toLocaleTimeString());
  const [kioskConfig, setKioskConfig] = useState<{
    initialChannel?: KioskChannel;
    initialLayout?: KioskLayout;
    initialLine?: 'LINE_01' | 'LINE_02';
    initialCarousel?: boolean;
    initialInterval?: number;
  }>({});

  // Parse URL query parameters on boot for zero-touch wall TV / kiosk deployment
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const kioskParam = params.get('kiosk');
      const channelParam = params.get('channel') as KioskChannel | null;
      const layoutParam = params.get('layout') as KioskLayout | null;
      const lineParam = params.get('line') as 'LINE_01' | 'LINE_02' | null;
      const carouselParam = params.get('carousel');
      const intervalParam = params.get('interval');

      if (kioskParam === 'true' || kioskParam === '1' || channelParam) {
        setIsKioskMode(true);
        setKioskConfig({
          initialChannel: channelParam || undefined,
          initialLayout: layoutParam || undefined,
          initialLine: lineParam === 'LINE_02' ? 'LINE_02' : lineParam === 'LINE_01' ? 'LINE_01' : undefined,
          initialCarousel: carouselParam === 'true' || carouselParam === '1',
          initialInterval: intervalParam ? parseInt(intervalParam, 10) : undefined
        });
      }
    } catch (e) {
      console.error('Failed to parse URL query parameters for Kiosk mode:', e);
    }
  }, []);

  // 1-second live clock update for industrial cockpit
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll Fuji Gateway status every 4 seconds
  useEffect(() => {
    const fetchFujiStatus = async () => {
      try {
        const res = await fetch('/api/v1/smt/fuji/config');
        if (res.ok) {
          const data = await res.json();
          if (data.status) {
            setFujiStatus(data.status);
          }
        }
      } catch {}
    };
    fetchFujiStatus();
    const timer = setInterval(fetchFujiStatus, 4000);
    return () => clearInterval(timer);
  }, []);

  // Live KPI hook adhering strictly to Anti-Fake-Success invariants
  const kpis = useManagerKpis(5000);

  // Subscribe to auth state changes and enforce deterministic fallback
  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      const newOp = state.operator;
      setOperator(newOp);

      setActiveTab((prev) => {
        if (!newOp) return prev;
        return getInitialOrPermittedTab(prev, newOp);
      });
    });
    return unsubscribe;
  }, []);

  // Global keyboard shortcuts (Cmd+K, Ctrl+K, '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle station selection - guarantees unconditional rendering of chosen station
  const handleSelectTab = useCallback((tab: NavTab) => {
    setActiveTab(tab);
    setActivePersona('SUPERVISOR');
  }, []);

  // Handle shift briefing export with clipboard fallback
  const handleExportBriefing = useCallback(async () => {
    const reportMarkdown = generateShiftBriefingText(kpis);
    setBriefingText(reportMarkdown);

    try {
      await navigator.clipboard.writeText(reportMarkdown);
      setBriefingCopyError(null);
      setToastMessage('Shift handover briefing copied to clipboard');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      setBriefingCopyError(err?.message || 'Clipboard access restricted');
      setIsBriefingModalOpen(true);
    }
  }, [kpis]);

  const currentStation = STATIONS[activeTab];
  const requiredRoles = currentStation?.requiredRoles ?? [];
  const isAllowed = isTabAllowed(activeTab, operator) || activeTab === 'SUPERVISOR' || activeTab === 'FLEET' || !operator;

  return (
    <div 
      className="w-full h-screen flex flex-col bg-[var(--mes-bg-canvas)] text-[var(--mes-text-primary)] font-sans selection:bg-[var(--mes-accent-muted)] selection:text-[var(--mes-accent-primary)] overflow-hidden select-none"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-6 z-50 bg-[var(--mes-bg-surface)] border border-[var(--mes-border-strong)] text-[var(--mes-text-primary)] px-3.5 py-2 rounded-[var(--mes-radius)] shadow-xl text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-3.5 h-3.5 text-[var(--mes-status-pass)]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Fixed Enterprise System Header (Height 38px) */}
      <header className="h-[38px] bg-slate-950 border-b border-slate-800 px-3 flex items-center justify-between gap-3 shrink-0 z-30 font-mono text-xs">
        {/* Left: Branding, Cluster, Line Selector & Protocol Link */}
        <div className="flex items-center gap-2.5">
          {/* System Badge */}
          <div className="px-2 py-0.5 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold text-[10.5px] tracking-wider flex items-center gap-1.5 rounded-[var(--mes-radius)] shadow-[0_0_8px_rgba(6,182,212,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>i-MES 2.0</span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-slate-100 tracking-tight">
              i-MES 2.0 · SMT MANUFACTURING EXECUTION SYSTEM
            </span>
            <span className="text-[10px] text-slate-500 hidden xl:inline">
              · CLEANROOM OPERATIONS
            </span>
          </div>

          <div className="h-3 w-px bg-slate-800 hidden sm:block" />

          {/* Line Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLineMenuOpen(!isLineMenuOpen)}
              className="text-[11px] font-bold text-slate-100 tracking-tight flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-[var(--mes-radius)] border border-slate-800 hover:border-slate-700 transition-colors"
              aria-haspopup="true"
              aria-expanded={isLineMenuOpen}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>
                {selectedLine === 'LINE_01' 
                  ? 'SMD_01: Fuji NXT III M6' 
                  : 'SMD_02: Fuji AIMEX IIIc'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {isLineMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] shadow-2xl py-1 z-50 w-64 text-xs font-mono">
                <button
                  onClick={() => {
                    setSelectedLine('LINE_01');
                    setIsLineMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-900 ${
                    selectedLine === 'LINE_01' ? 'text-slate-100 font-bold bg-cyan-950/40' : 'text-slate-400'
                  }`}
                >
                  <div>
                    <div className="font-bold text-[11px] text-slate-100">SMD_01: Fuji NXT III M6</div>
                    <div className="text-[9.5px] text-slate-500">High-Speed Smart Meter SMT</div>
                  </div>
                  {selectedLine === 'LINE_01' && <Check className="w-3 h-3 text-emerald-400" />}
                </button>

                <button
                  onClick={() => {
                    setSelectedLine('LINE_02');
                    setIsLineMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-900 ${
                    selectedLine === 'LINE_02' ? 'text-slate-100 font-bold bg-cyan-950/40' : 'text-slate-400'
                  }`}
                >
                  <div>
                    <div className="font-bold text-[11px] text-slate-100">SMD_02: Fuji AIMEX IIIc</div>
                    <div className="text-[9.5px] text-slate-500">Dual-Lane Flexible Placement</div>
                  </div>
                  {selectedLine === 'LINE_02' && <Check className="w-3 h-3 text-emerald-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Fuji OT Link Interactive Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => setIsFujiLinkModalOpen(true)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-slate-100 bg-slate-900 hover:bg-slate-850 px-2 py-0.5 rounded-[var(--mes-radius)] border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
              title="Click to configure Fuji Machine Link & OT Network IP/Port"
            >
              <Radio className={`w-3.5 h-3.5 ${fujiStatus?.isListening || fujiStatus?.isClientConnected ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="font-mono text-[10.5px]">TCP {fujiStatus?.port || 30040}:</span>
              <span className={`font-mono font-bold text-[9.5px] px-1 py-0.2 rounded-[1px] border ${
                fujiStatus?.activeConnections > 0
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : fujiStatus?.isListening
                    ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}>
                {fujiStatus?.activeConnections > 0
                  ? `CONNECTED (${fujiStatus.activeConnections})`
                  : fujiStatus?.isListening
                    ? 'LISTENING'
                    : 'OFFLINE'}
              </span>
            </button>
            <div className="flex items-center gap-1 text-slate-400 bg-slate-900 px-2 py-0.5 rounded-[var(--mes-radius)] border border-slate-800">
              <span>DB:</span>
              <span className="text-slate-200 font-bold">{stationModes.dbMode}</span>
            </div>
          </div>
        </div>

        {/* Right: Persona Switcher, Kiosk, Theme Studio, Command Jump, Operator Profile, Clock */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Persona View Switcher */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-[var(--mes-radius)] border border-slate-800 text-[10px] font-mono">
            <button
              onClick={() => {
                setActivePersona('OPERATOR');
                setActiveTab('OPERATOR');
              }}
              className={`px-2 py-0.5 rounded-[var(--mes-radius)] flex items-center gap-1 transition-all ${
                activePersona === 'OPERATOR'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Operator Persona (Shop floor / touchscreen tablet / high glanceability)"
            >
              <User className="w-3 h-3" />
              <span className="hidden sm:inline">Operator</span>
            </button>
            <button
              onClick={() => {
                setActivePersona('SUPERVISOR');
                setActiveTab('SUPERVISOR');
              }}
              className={`px-2 py-0.5 rounded-[var(--mes-radius)] flex items-center gap-1 transition-all ${
                activePersona === 'SUPERVISOR'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Supervisor Persona (Line flow, stations, multi-machine comparative view)"
            >
              <Activity className="w-3 h-3" />
              <span className="hidden sm:inline">Supervisor</span>
            </button>
            <button
              onClick={() => {
                setActivePersona('ENGINEER');
                setActiveTab('PREDICTIVE');
              }}
              className={`px-2 py-0.5 rounded-[var(--mes-radius)] flex items-center gap-1 transition-all ${
                activePersona === 'ENGINEER'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Engineer Persona (Deep diagnostics, vacuum misfires, reflow drift)"
            >
              <Sliders className="w-3 h-3" />
              <span className="hidden sm:inline">Engineer</span>
            </button>
            <button
              onClick={() => {
                setActivePersona('EXECUTIVE');
                setActiveTab('FLEET');
              }}
              className={`px-2 py-0.5 rounded-[var(--mes-radius)] flex items-center gap-1 transition-all ${
                activePersona === 'EXECUTIVE'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Plant Manager / Executive Persona (High-level OEE, FPY, scrap financial cost)"
            >
              <BarChart3 className="w-3 h-3" />
              <span className="hidden sm:inline">Executive</span>
            </button>
          </div>

          {/* Wall / Overhead Andon Kiosk Button */}
          <button
            onClick={() => setIsKioskMode(true)}
            className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 px-2 py-0.5 rounded-[var(--mes-radius)] border border-slate-800 text-[11px] font-mono transition-colors"
            title="Switch to Control-Room Wall Kiosk Mode"
          >
            <Tv className="w-3 h-3 text-emerald-400" />
            <span className="hidden xl:inline">Kiosk</span>
          </button>

          {/* Theme & Palette Studio Button */}
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 px-2 py-0.5 rounded-[var(--mes-radius)] border border-slate-800 hover:border-cyan-500/50 text-[11px] font-bold transition-all"
            title="Open Theme & Palette Studio"
          >
            <Palette className="w-3 h-3 text-cyan-400" />
            <span className="hidden md:inline uppercase text-[9.5px] tracking-wider text-cyan-400">
              {theme.name}
            </span>
          </button>

          {/* Jump to Station Search Button (Cmd+K) */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 px-2 py-0.5 rounded-[var(--mes-radius)] border border-slate-800 text-[11px] transition-colors"
            title="Jump to any station or command (⌘K)"
          >
            <Search className="w-3 h-3 text-slate-400" />
            <span className="hidden xl:inline">Jump</span>
            <kbd className="text-[9.5px] font-mono bg-slate-950 border border-slate-800 px-1 rounded-[1px] text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Shift Briefing Button */}
          <button
            onClick={handleExportBriefing}
            className="hidden md:flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 px-2 py-0.5 rounded-[var(--mes-radius)] border border-slate-800 text-[11px] font-mono transition-colors"
            title="SMT Shift Handover Briefing & Markdown Report"
          >
            <FileText className="w-3 h-3 text-cyan-400" />
            <span className="hidden xl:inline">Briefing</span>
          </button>

          {/* Station Protocol Adapter Status Mode Switcher Button */}
          <button
            onClick={() => setIsStationModeModalOpen(true)}
            className="hidden xl:flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 px-2 py-0.5 rounded-[var(--mes-radius)] border border-slate-800 text-[11px] font-mono transition-colors"
            title="Station Machine Driver & Protocol Mode Adapters"
          >
            <Settings className="w-3 h-3 text-amber-400" />
            <span>Adapters</span>
          </button>

          {/* Operator Authentication Trigger & Profile Badge */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--mes-radius)] border font-mono text-[10.5px] transition-all ${
              operator 
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700' 
                : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/70'
            }`}
            title={operator ? `Logged in as ${operator.name} (${operator.role})` : 'Click to Sign In / Authenticate'}
          >
            <Shield className="w-3 h-3 text-emerald-400" />
            {operator ? (
              <span className="truncate max-w-[90px]">{operator.name.split(' ')[0]}</span>
            ) : (
              <span className="font-bold">Sign In</span>
            )}
          </button>

          {/* High-Precision Cleanroom Realtime Clock */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-[var(--mes-radius)] border border-slate-800 text-[11px] font-mono font-bold text-slate-200">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span className="tabular-nums">{currentTime}</span>
          </div>
        </div>
      </header>

      {/* Docked Multi-Document Interface (MDI) Tab Bar (Height 32px) */}
      <nav 
        className="bg-slate-950 border-b border-slate-800 flex items-stretch overflow-x-auto shrink-0 select-none scrollbar-none z-20 font-mono text-xs"
        aria-label="SMT Cleanroom Instrument Stations"
      >
        {MDI_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`h-8 px-3 flex items-center gap-2 shrink-0 border-r border-slate-800 transition-colors ${
                isActive 
                  ? 'bg-slate-900 text-cyan-300 border-t-2 border-t-cyan-400 font-bold shadow-inner' 
                  : 'bg-slate-950 text-slate-400 border-t-2 border-t-transparent hover:bg-slate-900/60 hover:text-slate-200'
              }`}
              title={`${tab.label} (Press ${tab.hotkey})`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span className="text-[11px] tracking-tight whitespace-nowrap">{tab.label}</span>
              <span className="text-[9px] text-slate-500 bg-slate-950 px-1 rounded-[1px] border border-slate-800 hidden 2xl:inline">
                {tab.code}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Compact Realtime Telemetry Ribbon & Status Ticker (Height 26px) */}
      <div className="h-[26px] bg-slate-900/90 border-b border-slate-800 px-3 flex items-center justify-between text-[10.5px] font-mono shrink-0 z-10 overflow-x-auto scrollbar-none text-slate-300">
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-slate-400">
            RECIPE: <strong className="text-slate-100">PROG-SM-METER-TOP-REV4</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">
            PLAN: <strong className="text-slate-100">1,200</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">
            ACTUAL: <strong className="text-emerald-400">892 (74.3%)</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">
            TACT: <strong className="text-slate-100">18.2s</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">
            SPEED: <strong className="text-emerald-400">44,820 CPH (99.6%)</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">
            FPY: <strong className="text-emerald-400">98.4%</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">
            DROP: <strong className="text-emerald-400">12 PPM (PASS)</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">
            OEE: <strong className="text-cyan-400 font-bold">88.4% (SEMI E10)</strong>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-[1px] bg-emerald-400 shadow-[0_0_6px_#10B981]" />
            <span>ANDON: NORMAL (RUNNING)</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500 text-[10px]">POLL: 4s</span>
        </div>
      </div>

      {/* Main Full-Viewport Cleanroom Workspace with Collapsible Sidebar */}
      <div className="flex-1 flex w-full overflow-hidden">
        <CollapsibleSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapsed={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 overflow-auto p-2.5 bg-[#06090e] mes-wafer-grid">
          {activePersona === 'OPERATOR' && <OperatorKioskView />}
          {activePersona === 'ENGINEER' && <EngineerDeepDiveView />}
          {activePersona === 'EXECUTIVE' && <ManagerExecutiveView />}
          {activePersona === 'SUPERVISOR' && (
            !isAllowed ? (
              <div className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-strong)] rounded-[var(--mes-radius)] p-6 text-center flex flex-col items-center justify-center gap-3 max-w-md mx-auto mt-12 font-mono">
                <div className="w-10 h-10 rounded-[var(--mes-radius)] bg-[var(--mes-bg-well)] border border-[var(--mes-border-subtle)] flex items-center justify-center text-amber-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-[var(--mes-text-primary)] tracking-wider uppercase">
                    Access Restricted: Privileged Cleanroom Station
                  </h2>
                  <p className="text-[11px] text-[var(--mes-text-muted)] mt-1 font-sans">
                    Station <strong className="text-[var(--mes-text-primary)]">{currentStation?.label || activeTab}</strong> requires authorized cleanroom credentials.
                  </p>
                  <div className="flex flex-wrap justify-center gap-1 mt-2.5">
                    {requiredRoles.map((r) => (
                      <span key={r} className="text-[9.5px] px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-[var(--mes-bg-well)] border border-[var(--mes-border-subtle)] text-[var(--mes-text-secondary)]">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="mt-1 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-[var(--mes-radius)] transition-colors flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{operator ? 'Switch Operator / Override' : 'Operator Sign In'}</span>
                </button>
              </div>
            ) : (
              <div className="w-full">
                {activeTab === 'SUPERVISOR' && <SupervisorDashboard />}
                {activeTab === 'STUDIO' && <LineLayoutStudio />}
                {activeTab === 'FLEET' && <FleetDashboard />}
                {activeTab === 'SPI' && <SpiStation />}
                {activeTab === 'OPERATOR' && <OperatorStation />}
                {activeTab === 'SOLDER_PASTE' && <SolderPasteStation />}
                {activeTab === 'REFLOW' && <ReflowThermalStation />}
                {activeTab === 'GENEALOGY' && <TraceabilityStation />}
                {activeTab === 'AUDIT_TRAIL' && <AuditTrailViewer />}
                {activeTab === 'COMPLIANCE' && <CleanroomComplianceStation />}
                {activeTab === 'REWORK' && <ReworkStation />}
                {activeTab === 'AGV_LOGISTICS' && <AgvLogisticsStation />}
                {activeTab === 'PREDICTIVE' && <PredictiveIntelligenceStation />}
              </div>
            )
          )}
        </main>
      </div>

      {/* Control-Room Overhead Wall Kiosk Display */}
      {isKioskMode && (
        <WallKioskDisplay 
          onExitKiosk={() => setIsKioskMode(false)}
          initialChannel={kioskConfig.initialChannel}
          initialLayout={kioskConfig.initialLayout}
          initialLine={kioskConfig.initialLine}
          initialCarousel={kioskConfig.initialCarousel}
          initialInterval={kioskConfig.initialInterval}
        />
      )}

      {/* Operator Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          setToastMessage('Operator authenticated successfully');
          setTimeout(() => setToastMessage(null), 3000);
        }}
      />

      {/* Command Palette Modal (Ctrl+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={handleSelectTab}
        onSelectLine={setSelectedLine}
        currentLine={selectedLine}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenFujiLinkModal={() => setIsFujiLinkModalOpen(true)}
        onExportBriefing={handleExportBriefing}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Theme & Palette Studio Modal */}
      <ThemePaletteModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Shift Briefing Markdown Export Modal */}
      <ShiftBriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        briefingText={briefingText}
        copyError={briefingCopyError}
      />

      {/* Station Integration Modes Modal */}
      <StationModeModal
        isOpen={isStationModeModalOpen}
        onClose={() => setIsStationModeModalOpen(false)}
        modes={stationModes}
        onUpdateModes={(newModes) => {
          setStationModes(newModes);
          setToastMessage(`Updated to ${newModes.dbMode} mode`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
        onOpenFujiLink={() => setIsFujiLinkModalOpen(true)}
      />

      {/* Fuji Machine Link & OT Network Setup Modal */}
      <FujiMachineLinkModal
        isOpen={isFujiLinkModalOpen}
        onClose={() => setIsFujiLinkModalOpen(false)}
        onStatusChange={setFujiStatus}
      />

      {/* Micro-Telemetry Bottom HUD (Height 22px) */}
      <footer className="h-[22px] bg-[var(--mes-bg-header)] border-t border-[var(--mes-border-subtle)] px-3 flex items-center justify-between text-[10px] font-mono text-[var(--mes-text-muted)] shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span>i-MES 2.0 ENTERPRISE</span>
          <span>·</span>
          <span>FUJI NEXIM / i-MES INTERFACE</span>
          <span>·</span>
          <span>LOCAL SQLITE BUS</span>
          <span>·</span>
          <span className="text-[var(--mes-text-secondary)]">SHA-256 COMPLIANCE HASH: VERIFIED</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[var(--mes-status-pass)] font-bold">FUJI NXT III: RUNNING</span>
          <span>·</span>
          <span>SLOTS: 45/45 OK</span>
          <span>·</span>
          <span>0 DEFECT LOCKS</span>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};
