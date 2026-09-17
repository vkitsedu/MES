import React, { useState, useEffect, useCallback } from 'react';
import { 
  Cpu, Radio, Shield, Key, Lock, LogOut, UserCheck, Search,
  ChevronDown, Check, Activity, Sliders, Layers, Flame, Truck, 
  GitFork, Crosshair, Terminal, Split, RefreshCw, FileText, Settings, 
  Clock, BarChart3, AlertTriangle
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
import { LoginModal } from './components/auth/LoginModal';
import { authService, OperatorProfile, OperatorRole } from './services/auth.service';

import { 
  NavTab, 
  STATIONS, 
  isTabAllowed, 
  getInitialOrPermittedTab 
} from './config/navigation';
import { QuickStationSwitcher } from './components/navigation/QuickStationSwitcher';
import { ShiftBriefingModal } from './components/navigation/ShiftBriefingModal';
import { StationModeModal, StationModes } from './components/navigation/StationModeModal';
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

export const App: React.FC = () => {
  const [operator, setOperator] = useState<OperatorProfile | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>(() => getInitialOrPermittedTab('SUPERVISOR', null));
  
  const [selectedLine, setSelectedLine] = useState<'LINE_01' | 'LINE_02'>('LINE_01');
  const [isLineMenuOpen, setIsLineMenuOpen] = useState(false);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isStationSwitcherOpen, setIsStationSwitcherOpen] = useState(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isStationModeModalOpen, setIsStationModeModalOpen] = useState(false);
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

  // 1-second live clock update for industrial cockpit
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
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
        setIsStationSwitcherOpen(prev => !prev);
        return;
      }

      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setIsStationSwitcherOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle station selection
  const handleSelectTab = useCallback((tab: NavTab) => {
    setActiveTab(tab);
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
  const isAllowed = isTabAllowed(activeTab, operator);

  return (
    <div className="w-full h-screen flex flex-col bg-[#070B12] text-[#EDEDED] font-sans selection:bg-blue-600/30 selection:text-white overflow-hidden select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-6 z-50 bg-[#141C2C] border border-[#222F46] text-white px-3.5 py-2 rounded-sm shadow-xl text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Fixed Enterprise System Header (Height 38px) */}
      <header className="h-[38px] bg-[#0C121E] border-b border-[#222F46] px-3 flex items-center justify-between gap-3 shrink-0 z-30 font-mono text-xs">
        {/* Left: Branding, Cluster, Line Selector & Protocol Link */}
        <div className="flex items-center gap-2.5">
          {/* System Badge */}
          <div className="px-2 py-0.5 bg-[#142338] border border-[#233A5E] text-sky-400 font-bold text-[10.5px] tracking-wider flex items-center gap-1.5 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>G-MES 4.0</span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-white tracking-tight">
              APEX SMT MANUFACTURING EXECUTION SYSTEM
            </span>
            <span className="text-[10px] text-slate-500 hidden xl:inline">
              · NOIDA CLUSTER P4
            </span>
          </div>

          <div className="h-3 w-px bg-[#222F46] hidden sm:block" />

          {/* Line Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLineMenuOpen(!isLineMenuOpen)}
              className="text-[11px] font-bold text-slate-200 tracking-tight flex items-center gap-1 bg-[#111A29] px-2 py-0.5 rounded-sm border border-[#222F46] hover:bg-[#18253A] transition-colors"
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
              <div className="absolute top-full left-0 mt-1 bg-[#111A29] border border-[#222F46] rounded-sm shadow-2xl py-1 z-50 w-64 text-xs font-mono">
                <button
                  onClick={() => {
                    setSelectedLine('LINE_01');
                    setIsLineMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-[#18253A] ${
                    selectedLine === 'LINE_01' ? 'text-white font-bold bg-[#141F32]' : 'text-slate-400'
                  }`}
                >
                  <div>
                    <div className="font-bold text-white text-[11px]">SMD_01: Fuji NXT III M6</div>
                    <div className="text-[9.5px] text-slate-500">High-Speed Smart Meter SMT</div>
                  </div>
                  {selectedLine === 'LINE_01' && <Check className="w-3 h-3 text-emerald-400" />}
                </button>

                <button
                  onClick={() => {
                    setSelectedLine('LINE_02');
                    setIsLineMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-[#18253A] ${
                    selectedLine === 'LINE_02' ? 'text-white font-bold bg-[#141F32]' : 'text-slate-400'
                  }`}
                >
                  <div>
                    <div className="font-bold text-white text-[11px]">SMD_02: Fuji AIMEX IIIc</div>
                    <div className="text-[9.5px] text-slate-500">Flexible Mixed-Model SMT</div>
                  </div>
                  {selectedLine === 'LINE_02' && <Check className="w-3 h-3 text-emerald-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Machine Protocol Links */}
          <div className="hidden lg:flex items-center gap-2 text-[10.5px]">
            <div className="flex items-center gap-1 text-slate-400 bg-[#0B101C] px-2 py-0.5 rounded-sm border border-[#1C273A]">
              <Radio className="w-3 h-3 text-sky-400" />
              <span>TCP 30040:</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 bg-[#0B101C] px-2 py-0.5 rounded-sm border border-[#1C273A]">
              <span>DB:</span>
              <span className="text-white font-bold">{stationModes.dbMode}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions, Operator Profile, Clock */}
        <div className="flex items-center gap-2">
          {/* Shift Briefing Button */}
          <button
            onClick={handleExportBriefing}
            className="hidden sm:flex items-center gap-1 bg-[#111A29] hover:bg-[#18253A] text-slate-300 hover:text-white px-2 py-0.5 rounded-sm border border-[#222F46] text-[11px] transition-colors"
            title="Generate and copy shift briefing"
          >
            <FileText className="w-3 h-3 text-sky-400" />
            <span>Shift Briefing</span>
          </button>

          {/* Mode Settings Button */}
          <button
            onClick={() => setIsStationModeModalOpen(true)}
            className="flex items-center gap-1 bg-[#111A29] hover:bg-[#18253A] text-slate-300 hover:text-white px-2 py-0.5 rounded-sm border border-[#222F46] text-[11px] transition-colors"
            title="Configure integration modes"
          >
            <Settings className="w-3 h-3 text-slate-400" />
            <span className="hidden md:inline">Mode</span>
          </button>

          {/* Jump to Station Search Button (Cmd+K) */}
          <button
            onClick={() => setIsStationSwitcherOpen(true)}
            className="flex items-center gap-1.5 bg-[#111A29] hover:bg-[#18253A] text-slate-400 hover:text-white px-2 py-0.5 rounded-sm border border-[#222F46] text-[11px] transition-colors"
            title="Jump to any station (⌘K)"
          >
            <Search className="w-3 h-3 text-slate-400" />
            <span className="hidden xl:inline">Jump</span>
            <kbd className="text-[9.5px] font-mono bg-[#0B101C] border border-[#222F46] px-1 rounded-sm text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Operator Profile or Sign In */}
          {operator ? (
            <div className="flex items-center gap-1.5 bg-[#111A29] px-2 py-0.5 rounded-sm border border-[#222F46] text-[11px]">
              <UserCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-white font-bold">{operator.code}</span>
              <span className={`text-[9.5px] px-1 rounded-sm border font-bold ${ROLE_BADGE_STYLES[operator.role]?.bg || 'bg-white/5'} ${ROLE_BADGE_STYLES[operator.role]?.text || 'text-white'} ${ROLE_BADGE_STYLES[operator.role]?.border || 'border-white/10'}`}>
                {operator.role}
              </span>
              <button
                onClick={() => authService.logout()}
                className="text-slate-400 hover:text-rose-400 p-0.5 rounded-sm hover:bg-white/5 transition-colors ml-0.5"
                title="Sign out operator"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1 bg-[#142338] hover:bg-[#1E3250] text-sky-300 px-2 py-0.5 rounded-sm border border-[#233A5E] text-[11px] font-bold transition-colors"
            >
              <Key className="w-3 h-3" />
              <span>Sign In</span>
            </button>
          )}

          {/* Live Digital Clock */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-[#0B101C] px-2 py-0.5 rounded-sm border border-[#1C273A]">
            <Clock className="w-3 h-3 text-slate-500" />
            <span className="text-slate-200 tabular-nums">{currentTime}</span>
          </div>
        </div>
      </header>

      {/* Docked Multi-Document Interface (MDI) Tab Bar (Height 32px) */}
      <nav 
        className="bg-[#090E18] border-b border-[#222F46] flex items-stretch overflow-x-auto shrink-0 select-none scrollbar-none z-20 font-mono text-xs"
        aria-label="SMT Cleanroom Instrument Stations"
      >
        {MDI_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`h-8 px-3 flex items-center gap-2 shrink-0 border-r border-[#222F46] transition-colors ${
                isActive 
                  ? 'bg-[#16233B] text-white border-t-2 border-t-[#388BFD] font-bold shadow-inner' 
                  : 'bg-[#0B101C] text-[#8C9BB0] border-t-2 border-t-transparent hover:bg-[#121B2E] hover:text-slate-200'
              }`}
              title={`${tab.label} (Press ${tab.hotkey})`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
              <span className="text-[11px] tracking-tight whitespace-nowrap">{tab.label}</span>
              <span className="text-[9px] text-slate-600 bg-[#080C14] px-1 rounded-sm border border-[#1C273A] hidden 2xl:inline">
                {tab.code}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Compact Realtime Telemetry Ribbon & Status Ticker (Height 26px) */}
      <div className="h-[26px] bg-[#0E1422] border-b border-[#222F46] px-3 flex items-center justify-between text-[10.5px] font-mono shrink-0 z-10 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-slate-400">
            RECIPE: <strong className="text-slate-200">PROG-SM-METER-TOP-REV4</strong>
          </span>
          <span className="text-[#222F46]">|</span>
          <span className="text-slate-400">
            PLAN: <strong className="text-slate-200">1,200</strong>
          </span>
          <span className="text-[#222F46]">|</span>
          <span className="text-slate-400">
            ACTUAL: <strong className="text-emerald-400">892 (74.3%)</strong>
          </span>
          <span className="text-[#222F46]">|</span>
          <span className="text-slate-400">
            TACT: <strong className="text-slate-200">18.2s</strong>
          </span>
          <span className="text-[#222F46]">|</span>
          <span className="text-slate-400">
            SPEED: <strong className="text-emerald-400">44,820 CPH (99.6%)</strong>
          </span>
          <span className="text-[#222F46]">|</span>
          <span className="text-slate-400">
            FPY: <strong className="text-emerald-400">98.4%</strong>
          </span>
          <span className="text-[#222F46]">|</span>
          <span className="text-slate-400">
            DROP: <strong className="text-emerald-400">12 PPM (PASS)</strong>
          </span>
          <span className="text-[#222F46]">|</span>
          <span className="text-slate-400">
            OEE: <strong className="text-sky-400">88.4% (SEMI E10)</strong>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-sm bg-emerald-400" />
            <span>ANDON: NORMAL (RUNNING)</span>
          </div>
          <span className="text-[#222F46]">|</span>
          <span className="text-slate-500 text-[10px]">POLL: 4s</span>
        </div>
      </div>

      {/* Main Full-Viewport Cleanroom Instrument Workspace (Edge-to-Edge) */}
      <main className="flex-1 w-full overflow-auto p-2 bg-[#070B12]">
        {!isAllowed ? (
          <div className="bg-[#0E1422] border border-[#222F46] rounded-sm p-6 text-center flex flex-col items-center justify-center gap-3 max-w-md mx-auto mt-12 font-mono">
            <div className="w-10 h-10 rounded-sm bg-[#141C2C] border border-[#222F46] flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white tracking-wider uppercase">
                Access Restricted: Privileged Cleanroom Station
              </h2>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Station <strong className="text-white">{currentStation?.label || activeTab}</strong> requires authorized cleanroom credentials.
              </p>
              <div className="flex flex-wrap justify-center gap-1 mt-2.5">
                {requiredRoles.map((r) => (
                  <span key={r} className="text-[9.5px] px-1.5 py-0.5 rounded-sm bg-[#111827] border border-[#222F46] text-slate-400">
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="mt-1 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-sm transition-colors flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{operator ? 'Switch Operator / Override' : 'Operator Sign In'}</span>
            </button>
          </div>
        ) : (
          <div className="w-full">
            {activeTab === 'SUPERVISOR' && <SupervisorDashboard />}
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
        )}
      </main>

      {/* Operator Authentication Modal (Gate G-08) */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={(loggedOp) => {
          setOperator(loggedOp);
          setIsLoginModalOpen(false);
          setActiveTab(prev => getInitialOrPermittedTab(prev, loggedOp));
        }} 
      />

      {/* Quick Station Switcher Command Palette (Cmd+K) */}
      <QuickStationSwitcher
        isOpen={isStationSwitcherOpen}
        onClose={() => setIsStationSwitcherOpen(false)}
        activeTab={activeTab}
        onSelectStation={handleSelectTab}
        operator={operator}
      />

      {/* Shift Briefing Markdown Modal */}
      <ShiftBriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        briefingText={briefingText}
        copyError={briefingCopyError}
      />

      {/* Station Mode & Machine Integration Modal */}
      <StationModeModal
        isOpen={isStationModeModalOpen}
        onClose={() => setIsStationModeModalOpen(false)}
        modes={stationModes}
        onUpdateModes={(newModes) => {
          setStationModes(newModes);
          setToastMessage(`Updated to ${newModes.dbMode} mode`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
      />

      {/* Micro-Telemetry Bottom HUD (Height 22px) */}
      <footer className="h-[22px] bg-[#06090F] border-t border-[#222F46] px-3 flex items-center justify-between text-[10px] font-mono text-[#64748B] shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span>APEX G-MES 4.0 ENTERPRISE</span>
          <span>·</span>
          <span>FUJI iMES 4.0 PROTOCOL ENGINE</span>
          <span>·</span>
          <span>LOCAL SQLITE BUS</span>
          <span>·</span>
          <span className="text-slate-400">SHA-256 COMPLIANCE HASH: VERIFIED</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold">FUJI NXT III: RUNNING</span>
          <span>·</span>
          <span>SLOTS: 45/45 OK</span>
          <span>·</span>
          <span>0 DEFECT LOCKS</span>
        </div>
      </footer>
    </div>
  );
};
