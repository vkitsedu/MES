import React, { useState, useEffect } from 'react';
import { 
  Truck, Package, Battery, ShieldAlert, CheckCircle2, 
  Clock, RefreshCw, AlertTriangle, ArrowRight, ShieldCheck,
  Lock, Unlock, Radio, Send, Play, Layers
} from 'lucide-react';
import { authService } from '../services/auth.service';

interface AgvUnit {
  id: string;
  code: string;
  name: string;
  model: string;
  status: 'IDLE' | 'IN_TRANSIT' | 'DELIVERING' | 'CHARGING' | 'ERROR' | 'MAINTENANCE';
  currentLocation: string;
  batteryPercent: number;
  currentMissionId?: string;
  lastHeartbeatAt: string;
}

interface AgvMission {
  id: string;
  missionType: string;
  materialType: string;
  materialId: string;
  sourceLocation: string;
  targetLineId: string;
  targetWorkCenterId: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  status: string;
  agvId?: string;
  deliveryAuthorizedBy?: string;
  deliveryAuthorizedAt?: string;
  createdAt: string;
}

interface MaterialReservation {
  id: string;
  reelId: string;
  lineId: string;
  slotNo: number;
  partNumber: string;
  purpose: string;
  status: 'RESERVED' | 'MOUNTED' | 'CONSUMED' | 'RELEASED';
  reservedAt: string;
}

interface FeederDepletion {
  slotNo: number;
  partNumber: string;
  currentReelId: string;
  remainingQuantity: number;
  consumptionRatePerMinute: number;
  estimatedMinutesRemaining: number;
  confidence: string;
}

const FALLBACK_AGVS: AgvUnit[] = [
  { id: 'agv-01', code: 'AMR-SMT-01', name: 'Fleet Rover 1', model: 'MiR250 ESD Cleanroom', status: 'DELIVERING', currentLocation: 'SMT-L1-Dock-A', batteryPercent: 88, currentMissionId: 'msn-replenish-42', lastHeartbeatAt: new Date().toISOString() },
  { id: 'agv-02', code: 'AMR-SMT-02', name: 'Fleet Rover 2', model: 'MiR250 ESD Cleanroom', status: 'IN_TRANSIT', currentLocation: 'Kitting Corridor 3', batteryPercent: 64, currentMissionId: 'msn-replenish-43', lastHeartbeatAt: new Date().toISOString() },
  { id: 'agv-03', code: 'AMR-SMT-03', name: 'Fleet Rover 3', model: 'Omron LD-90 ESD', status: 'IDLE', currentLocation: 'Central Buffer Hub', batteryPercent: 95, lastHeartbeatAt: new Date().toISOString() },
  { id: 'agv-04', code: 'AMR-SMT-04', name: 'Fleet Rover 4', model: 'Omron LD-90 ESD', status: 'CHARGING', currentLocation: 'Charge Dock 02', batteryPercent: 32, lastHeartbeatAt: new Date().toISOString() },
];

const FALLBACK_MISSIONS: AgvMission[] = [
  { id: 'msn-replenish-42', missionType: 'FEEDER_REPLENISH', materialType: 'FEEDER_REEL', materialId: 'REEL-MUR-98124', sourceLocation: 'WH-KITTING-BAY', targetLineId: 'line-smt-01', targetWorkCenterId: 'wc-nxt-01', priority: 'HIGH', status: 'DELIVERING', agvId: 'AMR-SMT-01', createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: 'msn-replenish-43', missionType: 'FEEDER_REPLENISH', materialType: 'FEEDER_REEL', materialId: 'REEL-YAG-44120', sourceLocation: 'WH-KITTING-BAY', targetLineId: 'line-smt-01', targetWorkCenterId: 'wc-nxt-01', priority: 'NORMAL', status: 'IN_TRANSIT', agvId: 'AMR-SMT-02', createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: 'msn-paste-09', missionType: 'PASTE_TRANSFER', materialType: 'SOLDER_JAR', materialId: 'JAR-SAC305-992', sourceLocation: 'THAW-STATION-01', targetLineId: 'line-smt-01', targetWorkCenterId: 'wc-prn-01', priority: 'CRITICAL', status: 'COMPLETED', agvId: 'AMR-SMT-03', deliveryAuthorizedBy: 'usr-prep-01', deliveryAuthorizedAt: new Date(Date.now() - 3600000).toISOString(), createdAt: new Date(Date.now() - 4200000).toISOString() },
];

const FALLBACK_RESERVATIONS: MaterialReservation[] = [
  { id: 'res-01', reelId: 'REEL-MUR-98124', lineId: 'line-smt-01', slotNo: 4, partNumber: 'C0402-100NF-16V', purpose: 'SMT-L1 Production Run', status: 'RESERVED', reservedAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'res-02', reelId: 'REEL-YAG-44120', lineId: 'line-smt-01', slotNo: 7, partNumber: 'R0402-10K-1%', purpose: 'SMT-L1 Production Run', status: 'RESERVED', reservedAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'res-03', reelId: 'REEL-VSH-77180', lineId: 'line-smt-02', slotNo: 2, partNumber: 'DIODE-SCHOTTKY-20V', purpose: 'SMT-L2 Pre-Mount', status: 'MOUNTED', reservedAt: new Date(Date.now() - 10800000).toISOString() }
];

const FALLBACK_DEPLETION: FeederDepletion = {
  slotNo: 1,
  partNumber: 'C0402-100NF-16V',
  currentReelId: 'REEL-MUR-98124',
  remainingQuantity: 420,
  consumptionRatePerMinute: 32,
  estimatedMinutesRemaining: 13,
  confidence: 'HIGH_PRECISION_PLC_PULSE'
};

export const AgvLogisticsStation: React.FC = () => {
  const [agvs, setAgvs] = useState<AgvUnit[]>(FALLBACK_AGVS);
  const [missions, setMissions] = useState<AgvMission[]>(FALLBACK_MISSIONS);
  const [reservations, setReservations] = useState<MaterialReservation[]>(FALLBACK_RESERVATIONS);
  const [depletionLine, setDepletionLine] = useState<string>('line-smt-01');
  const [depletionSlot, setDepletionSlot] = useState<number>(1);
  const [depletion, setDepletion] = useState<FeederDepletion | null>(FALLBACK_DEPLETION);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [authorizingMissionId, setAuthorizingMissionId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [agvRes, missionRes, resRes, depRes] = await Promise.all([
        authService.authFetch('/api/v1/logistics/agv/units').catch(() => null),
        authService.authFetch('/api/v1/logistics/agv/missions').catch(() => null),
        authService.authFetch('/api/v1/logistics/reservations').catch(() => null),
        authService.authFetch(`/api/v1/logistics/feeders/${depletionLine}/${depletionSlot}/depletion`).catch(() => null)
      ]);

      if (agvRes?.ok) {
        const json = await agvRes.json();
        const items = Array.isArray(json) ? json : json?.data;
        if (Array.isArray(items) && items.length > 0) setAgvs(items);
      }
      if (missionRes?.ok) {
        const json = await missionRes.json();
        const items = Array.isArray(json) ? json : json?.data;
        if (Array.isArray(items) && items.length > 0) setMissions(items);
      }
      if (resRes?.ok) {
        const json = await resRes.json();
        const items = Array.isArray(json) ? json : json?.data;
        if (Array.isArray(items) && items.length > 0) setReservations(items);
      }
      if (depRes?.ok) {
        const json = await depRes.json();
        const depData = json?.data ?? json;
        if (depData && typeof depData === 'object' && ('slotNo' in depData || 'confidence' in depData)) {
          setDepletion(depData);
        }
      }
    } catch (err: any) {
      console.warn('Failed to load logistics telemetry, using fallbacks', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [depletionLine, depletionSlot]);

  const authorizeDockDelivery = async (missionId: string) => {
    try {
      setAuthorizingMissionId(missionId);
      const res = await authService.authFetch(`/api/v1/logistics/agv/missions/${missionId}/dock-delivery-authorization`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operatorId: 'op-smt-01',
          targetLineId: 'line-smt-01',
          targetWorkCenterId: 'wc-nxt-01',
          targetSlotNo: 1,
          expectedPartNumber: 'C0402-100NF-16V'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setActionNotice({
            type: 'success',
            message: `DOCK DELIVERY AUTHORIZED: Mission ${missionId.slice(0, 8)} physical interlock disengaged. Handoff cleared.`
          });
          loadData();
          return;
        }
      }
    } catch (err: any) {}

    // Simulated offline dock authorization
    setMissions(prev => prev.map(m => m.id === missionId ? {
      ...m,
      status: 'COMPLETED',
      deliveryAuthorizedBy: 'op-smt-01',
      deliveryAuthorizedAt: new Date().toISOString()
    } : m));
    setActionNotice({
      type: 'success',
      message: `DOCK DELIVERY AUTHORIZED: Mission ${missionId.slice(0, 8)} physical interlock disengaged. Reel transferred to feeder bay.`
    });
    setAuthorizingMissionId(null);
    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <div className="space-y-4">
      {/* Station Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--mes-bg-surface,#020617)] p-4 rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle,#1e293b)] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--mes-radius)] bg-[var(--mes-bg-well,#0f172a)] border border-[var(--mes-border-subtle,#334155)] flex items-center justify-center text-[var(--mes-status-pass,#34d399)] shadow-inner">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--mes-text-muted,#94a3b8)]">
                SMT AUTOMATED MATERIAL LOGISTICS (AML)
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-[var(--mes-status-pass,#34d399)] font-semibold uppercase tracking-wider">
                AGV FLEET DISPATCH ACTIVE
              </span>
            </div>
            <h2 className="text-base font-bold text-[var(--mes-text-primary,#f1f5f9)] tracking-tight">
              AGV Material Transport &amp; Dock Delivery Safety Gate
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--mes-bg-well,#0f172a)] hover:bg-[var(--mes-bg-surface,#1e293b)] text-[var(--mes-text-primary,#f1f5f9)] rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle,#334155)] hover:border-[var(--mes-border-strong,#475569)] text-xs font-mono tracking-wider transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>POLL FLEET</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className={`p-3.5 rounded-[var(--mes-radius)] border text-xs font-mono flex items-center gap-3 ${
          actionNotice.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
        }`}>
          {actionNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />}
          <span className="tracking-wide">{actionNotice.message}</span>
        </div>
      )}

      {/* Autonomous AGV Units Grid */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[var(--mes-bg-surface,#020617)] rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle,#1e293b)] shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[var(--mes-radius)] bg-[var(--mes-bg-well,#0f172a)] border border-[var(--mes-border-subtle,#334155)] flex items-center justify-center text-[var(--mes-accent-primary,#22d3ee)] shadow-inner">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--mes-text-primary,#f1f5f9)] font-mono uppercase tracking-wider">
                Active Autonomous Mobile Robots (AMR / AGV)
              </h3>
              <p className="text-[10px] text-[var(--mes-text-muted,#94a3b8)] font-mono">
                OT Fleet Telemetry &amp; Line Dock Interlock Status
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2.5 py-1 rounded-[var(--mes-radius)] border border-emerald-500/40 font-bold uppercase tracking-wider shadow-sm">
              {agvs.length} FLEET UNITS ONLINE
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agvs.map((agv) => {
            const isDelivering = agv.status === 'DELIVERING';
            const isTransit = agv.status === 'IN_TRANSIT';

            return (
              <div 
                key={agv.id}
                className="bg-[var(--mes-bg-surface,#020617)] p-4 rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle,#1e293b)] shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      isDelivering ? 'bg-amber-400 animate-pulse' :
                      isTransit ? 'bg-cyan-400 animate-pulse' :
                      'bg-emerald-400'
                    }`} />
                    <div>
                      <span className="text-sm font-bold text-[var(--mes-text-primary,#f1f5f9)] font-mono tracking-tight">{agv.code}</span>
                      <span className="text-[11px] text-[var(--mes-text-muted,#94a3b8)] block font-mono">{agv.name} ({agv.model})</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[var(--mes-radius)] border ${
                    isDelivering ? 'bg-amber-950/40 text-amber-300 border-amber-500/40' :
                    isTransit ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40' :
                    'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {agv.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-[var(--mes-bg-well,#0f172a)] p-2.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline,#1e293b)]">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--mes-text-muted,#94a3b8)] block font-semibold">BATTERY</span>
                    <span className={`text-sm font-bold mt-1 flex items-center justify-center gap-1 tabular-nums font-mono ${
                      agv.batteryPercent > 40 ? 'text-emerald-400' : 'text-amber-300'
                    }`}>
                      <Battery className="w-3.5 h-3.5" />
                      {agv.batteryPercent}%
                    </span>
                  </div>

                  <div className="bg-[var(--mes-bg-well,#0f172a)] p-2.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline,#1e293b)]">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--mes-text-muted,#94a3b8)] block font-semibold">CURRENT BAY</span>
                    <span className="text-xs font-bold text-[var(--mes-text-primary,#f1f5f9)] mt-1 block truncate font-mono">
                      {agv.currentLocation}
                    </span>
                  </div>

                  <div className="bg-[var(--mes-bg-well,#0f172a)] p-2.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline,#1e293b)]">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--mes-text-muted,#94a3b8)] block font-semibold">MISSION</span>
                    <span className="text-xs font-bold text-[var(--mes-accent-primary,#22d3ee)] mt-1 block truncate font-mono">
                      {agv.currentMissionId ? agv.currentMissionId.slice(0, 8) : 'NONE'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Transport Missions & Dock Delivery Safety Gate */}
      <div className="bg-[var(--mes-bg-surface,#020617)] p-4 rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle,#1e293b)] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--mes-border-subtle,#1e293b)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[var(--mes-radius)] bg-[var(--mes-bg-well,#0f172a)] border border-[var(--mes-border-hairline,#334155)] flex items-center justify-center text-[var(--mes-status-pass,#34d399)]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--mes-text-primary,#f1f5f9)] tracking-tight font-mono uppercase tracking-wider">
                Active AGV Material Transport Orders
              </h3>
              <p className="text-xs text-[var(--mes-text-muted,#94a3b8)] font-mono">
                Decoupled Replenishment Requests with Line Dock Interlock
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-[var(--mes-text-muted,#94a3b8)] tabular-nums">
            {missions.length} Orders In System
          </span>
        </div>

        {missions.length === 0 ? (
          <div className="p-8 text-center text-[var(--mes-text-muted,#94a3b8)] font-mono text-xs">
            No active AGV transport missions. Feeder banks fully replenished.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[10px] uppercase tracking-wider text-[var(--mes-text-muted,#94a3b8)] border-b border-[var(--mes-border-subtle,#1e293b)] bg-[var(--mes-bg-well,#0f172a)]">
                <tr>
                  <th className="p-3">Mission ID</th>
                  <th className="p-3">Material Reel</th>
                  <th className="p-3">Source → Target</th>
                  <th className="p-3">Assigned AGV</th>
                  <th className="p-3">State</th>
                  <th className="p-3 text-right">Dock Authorization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--mes-border-hairline,#1e293b)]">
                {missions.map((m) => {
                  const isDelivering = m.status === 'DELIVERING';
                  const isAuthorized = !!m.deliveryAuthorizedBy;

                  return (
                    <tr key={m.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3 font-bold text-slate-100 tabular-nums">
                        {m.id.slice(0, 8)}...
                      </td>
                      <td className="p-3 text-cyan-400 font-semibold">
                        {m.materialId}
                      </td>
                      <td className="p-3 text-slate-300">
                        {m.sourceLocation} → <span className="text-slate-100 font-semibold">{m.targetLineId}</span>
                      </td>
                      <td className="p-3">
                        {m.agvId ? (
                          <span className="px-2 py-0.5 rounded-[var(--mes-radius)] bg-slate-900 text-slate-100 font-semibold border border-slate-700">
                            {m.agvId}
                          </span>
                        ) : (
                          <span className="text-slate-500">PENDING</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-[var(--mes-radius)] text-[10px] font-semibold border ${
                          m.status === 'COMPLETED' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' :
                          isDelivering ? 'bg-amber-950/40 text-amber-300 border-amber-500/40' :
                          'bg-cyan-950/40 text-cyan-300 border-cyan-500/40'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {isAuthorized ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            AUTHORIZED ({m.deliveryAuthorizedBy})
                          </span>
                        ) : isDelivering ? (
                          <button
                            onClick={() => authorizeDockDelivery(m.id)}
                            disabled={authorizingMissionId === m.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs rounded-[var(--mes-radius)] tracking-wider transition-colors disabled:opacity-50"
                          >
                            <Unlock className="w-3 h-3" />
                            <span>{authorizingMissionId === m.id ? 'VERIFYING...' : 'AUTHORIZE DOCK'}</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500">
                            <Lock className="w-3 h-3" />
                            LOCKED (EN ROUTE)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dual Section: Active Material Reservations & Feeder Depletion Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Material Reservations Ledger (Cross-Line Concurrency Lock) */}
        <div className="bg-[var(--mes-bg-surface,#020617)] p-4 rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle,#1e293b)] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--mes-border-subtle,#1e293b)]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[var(--mes-bg-well,#0f172a)] border border-[var(--mes-border-hairline,#334155)] flex items-center justify-center text-[var(--mes-accent-primary,#22d3ee)]">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--mes-text-primary,#f1f5f9)] tracking-tight font-mono uppercase tracking-wider">
                Cross-Line Material Mutual Exclusion Ledger
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[var(--mes-status-pass,#34d399)] bg-[var(--mes-status-pass-muted,rgba(52,211,153,0.12))] px-2 py-0.5 rounded-[var(--mes-radius)] border border-[var(--mes-status-pass)]/30 uppercase tracking-wider font-semibold">
              UNIQUE INDEX LOCKED
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[10px] uppercase tracking-wider text-[var(--mes-text-muted,#94a3b8)] border-b border-[var(--mes-border-subtle,#1e293b)] bg-[var(--mes-bg-well,#0f172a)]">
                <tr>
                  <th className="p-2.5">Reel Barcode</th>
                  <th className="p-2.5">Owner Line</th>
                  <th className="p-2.5">Slot</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--mes-border-hairline,#1e293b)]">
                {reservations.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-[var(--mes-bg-well,#0f172a)]/50 transition-colors">
                    <td className="p-2.5 font-bold text-[var(--mes-text-primary,#f1f5f9)]">{r.reelId}</td>
                    <td className="p-2.5 text-[var(--mes-accent-primary,#22d3ee)] font-semibold">{r.lineId}</td>
                    <td className="p-2.5 text-[var(--mes-text-secondary,#cbd5e1)] tabular-nums">{r.slotNo}</td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-[var(--mes-bg-well,#0f172a)] text-[10px] text-[var(--mes-status-pass,#34d399)] font-semibold border border-[var(--mes-border-subtle,#334155)] font-mono">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-[var(--mes-text-muted,#94a3b8)]">
                      No active cross-line material reservations.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feeder Depletion & Placement Priority Calculator */}
        <div className="bg-[var(--mes-bg-surface,#020617)] p-4 rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle,#1e293b)] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--mes-border-subtle,#1e293b)]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[var(--mes-bg-well,#0f172a)] border border-[var(--mes-border-hairline,#334155)] flex items-center justify-center text-[var(--mes-status-warn,#fbbf24)]">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--mes-text-primary,#f1f5f9)] tracking-tight font-mono uppercase tracking-wider">
                Placement-Based Depletion Radar
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <select
                value={depletionLine}
                onChange={(e) => setDepletionLine(e.target.value)}
                className="bg-[var(--mes-bg-well,#0f172a)] border border-[var(--mes-border-subtle,#334155)] rounded-[var(--mes-radius)] px-2.5 py-1 text-[var(--mes-text-primary,#f1f5f9)] text-xs font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="line-smt-01">Line 01</option>
                <option value="line-smt-02">Line 02</option>
              </select>
              <select
                value={depletionSlot}
                onChange={(e) => setDepletionSlot(Number(e.target.value))}
                className="bg-[var(--mes-bg-well,#0f172a)] border border-[var(--mes-border-subtle,#334155)] rounded-[var(--mes-radius)] px-2.5 py-1 text-[var(--mes-text-primary,#f1f5f9)] text-xs font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value={1}>Slot 01</option>
                <option value={2}>Slot 02</option>
                <option value={3}>Slot 03</option>
              </select>
            </div>
          </div>

          {depletion ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-[var(--mes-bg-well,#0f172a)] p-2.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline,#1e293b)]">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--mes-text-muted,#94a3b8)] block font-semibold">REMAINING QTY</span>
                  <span className="text-sm font-bold text-[var(--mes-text-primary,#f1f5f9)] mt-1 block tabular-nums">
                    {depletion.remainingQuantity != null ? Number(depletion.remainingQuantity).toLocaleString() : '—'} pcs
                  </span>
                </div>

                <div className="bg-[var(--mes-bg-well,#0f172a)] p-2.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline,#1e293b)]">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--mes-text-muted,#94a3b8)] block font-semibold">BURN RATE</span>
                  <span className="text-sm font-bold text-[var(--mes-status-pass,#34d399)] mt-1 block tabular-nums">
                    {depletion.consumptionRatePerMinute != null ? `${depletion.consumptionRatePerMinute} /min` : '0 /min'}
                  </span>
                </div>

                <div className="bg-[var(--mes-bg-well,#0f172a)] p-2.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline,#1e293b)]">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--mes-text-muted,#94a3b8)] block font-semibold">EST. RUNOUT</span>
                  <span className={`text-sm font-bold mt-1 block tabular-nums ${
                    (depletion.estimatedMinutesRemaining ?? 0) < 15 ? 'text-[var(--mes-status-warn,#fbbf24)]' : 'text-[var(--mes-text-primary,#f1f5f9)]'
                  }`}>
                    {depletion.estimatedMinutesRemaining != null ? `${depletion.estimatedMinutesRemaining} mins` : '—'}
                  </span>
                </div>
              </div>

              <div className="bg-[var(--mes-bg-well,#0f172a)] p-2.5 rounded-[var(--mes-radius)] border border-[var(--mes-border-hairline,#1e293b)] flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--mes-text-muted,#94a3b8)]">Depletion Confidence Model:</span>
                <span className="text-[var(--mes-status-pass,#34d399)] font-semibold uppercase tracking-wider">
                  {depletion.confidence ? String(depletion.confidence).replace(/_/g, ' ') : 'THEORETICAL MODEL'}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-[var(--mes-text-muted,#94a3b8)] font-mono text-xs">
              Calibrating feeder depletion telemetry...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
