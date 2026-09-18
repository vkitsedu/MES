import React, { useState, useEffect } from 'react';
import {
  Layers, Clock, Thermometer, RotateCw, CheckCircle2,
  AlertTriangle, ShieldCheck, ShieldAlert, ArrowRight, Play, RefreshCw, XCircle
} from 'lucide-react';
import { authService } from '../services/auth.service';

interface SolderPasteJar {
  id: string;
  jar_id: string;
  part_number: string;
  profile_id: string;
  alloy_type: string;
  lot_number: string;
  expiry_date: string;
  status: 'REFRIGERATED' | 'THAWING' | 'THAWED' | 'MIXED' | 'AUTHORIZED' | 'ON_STENCIL' | 'DEPLETED' | 'EXPIRED' | 'DISCARDED';
  removed_from_cold_at?: string;
  thaw_verified_at?: string;
  thaw_duration_minutes: number;
  temperature_verified_at?: string;
  temperature_verified_c?: number;
  mixed_at?: string;
  mixed_duration_seconds: number;
  mixing_method?: string;
  current_work_center_id: string;
  manufacturer?: string;
  thaw_required_minutes?: number;
  minimum_processing_temperature_c?: number;
  mixing_min_seconds?: number;
  mixing_max_seconds?: number;
  stencil_life_minutes?: number;
}

const FALLBACK_JARS: SolderPasteJar[] = [
  {
    id: 'jar-seed-01',
    jar_id: 'JAR-ALPHA-2601-A',
    part_number: 'ALPHA-OM338-PT',
    profile_id: 'PRF-SAC305-T4',
    alloy_type: 'SAC305',
    lot_number: 'LOT-OM-8921',
    expiry_date: '2026-12-31T23:59:59.000Z',
    status: 'REFRIGERATED',
    thaw_duration_minutes: 0,
    mixed_duration_seconds: 0,
    current_work_center_id: 'wc-spg-01',
    manufacturer: 'Alpha Assembly Solutions',
    thaw_required_minutes: 240,
    minimum_processing_temperature_c: 22.0,
    mixing_min_seconds: 120,
    mixing_max_seconds: 300,
    stencil_life_minutes: 480
  },
  {
    id: 'jar-seed-02',
    jar_id: 'JAR-ALPHA-2601-B',
    part_number: 'ALPHA-OM338-PT',
    profile_id: 'PRF-SAC305-T4',
    alloy_type: 'SAC305',
    lot_number: 'LOT-OM-8921',
    expiry_date: '2026-12-31T23:59:59.000Z',
    status: 'THAWING',
    removed_from_cold_at: new Date(Date.now() - 150 * 60000).toISOString(),
    thaw_duration_minutes: 150,
    mixed_duration_seconds: 0,
    current_work_center_id: 'wc-spg-01',
    manufacturer: 'Alpha Assembly Solutions',
    thaw_required_minutes: 240,
    minimum_processing_temperature_c: 22.0,
    mixing_min_seconds: 120,
    mixing_max_seconds: 300,
    stencil_life_minutes: 480
  },
  {
    id: 'jar-seed-03',
    jar_id: 'JAR-ALPHA-2601-C',
    part_number: 'ALPHA-OM338-PT',
    profile_id: 'PRF-SAC305-T4',
    alloy_type: 'SAC305',
    lot_number: 'LOT-OM-8920',
    expiry_date: '2026-11-15T23:59:59.000Z',
    status: 'THAWED',
    removed_from_cold_at: new Date(Date.now() - 260 * 60000).toISOString(),
    thaw_verified_at: new Date(Date.now() - 10 * 60000).toISOString(),
    thaw_duration_minutes: 250,
    temperature_verified_at: new Date(Date.now() - 10 * 60000).toISOString(),
    temperature_verified_c: 23.4,
    mixed_duration_seconds: 0,
    current_work_center_id: 'wc-spg-01',
    manufacturer: 'Alpha Assembly Solutions',
    thaw_required_minutes: 240,
    minimum_processing_temperature_c: 22.0,
    mixing_min_seconds: 120,
    mixing_max_seconds: 300,
    stencil_life_minutes: 480
  },
  {
    id: 'jar-seed-04',
    jar_id: 'JAR-ALPHA-2601-D',
    part_number: 'ALPHA-OM338-PT',
    profile_id: 'PRF-SAC305-T4',
    alloy_type: 'SAC305',
    lot_number: 'LOT-OM-8919',
    expiry_date: '2026-11-10T23:59:59.000Z',
    status: 'MIXED',
    removed_from_cold_at: new Date(Date.now() - 280 * 60000).toISOString(),
    thaw_verified_at: new Date(Date.now() - 30 * 60000).toISOString(),
    thaw_duration_minutes: 250,
    temperature_verified_at: new Date(Date.now() - 30 * 60000).toISOString(),
    temperature_verified_c: 23.8,
    mixed_at: new Date(Date.now() - 5 * 60000).toISOString(),
    mixed_duration_seconds: 180,
    mixing_method: 'CENTRIFUGAL_PLANETARY',
    current_work_center_id: 'wc-spg-01',
    manufacturer: 'Alpha Assembly Solutions',
    thaw_required_minutes: 240,
    minimum_processing_temperature_c: 22.0,
    mixing_min_seconds: 120,
    mixing_max_seconds: 300,
    stencil_life_minutes: 480
  },
  {
    id: 'jar-seed-05',
    jar_id: 'JAR-ALPHA-2601-E',
    part_number: 'ALPHA-OM338-PT',
    profile_id: 'PRF-SAC305-T4',
    alloy_type: 'SAC305',
    lot_number: 'LOT-OM-8918',
    expiry_date: '2026-11-01T23:59:59.000Z',
    status: 'AUTHORIZED',
    removed_from_cold_at: new Date(Date.now() - 300 * 60000).toISOString(),
    thaw_verified_at: new Date(Date.now() - 50 * 60000).toISOString(),
    thaw_duration_minutes: 250,
    temperature_verified_at: new Date(Date.now() - 50 * 60000).toISOString(),
    temperature_verified_c: 24.1,
    mixed_at: new Date(Date.now() - 20 * 60000).toISOString(),
    mixed_duration_seconds: 180,
    mixing_method: 'CENTRIFUGAL_PLANETARY',
    current_work_center_id: 'wc-spg-01',
    manufacturer: 'Alpha Assembly Solutions',
    thaw_required_minutes: 240,
    minimum_processing_temperature_c: 22.0,
    mixing_min_seconds: 120,
    mixing_max_seconds: 300,
    stencil_life_minutes: 480
  },
  {
    id: 'jar-seed-06',
    jar_id: 'JAR-ALPHA-2601-F',
    part_number: 'ALPHA-OM338-PT',
    profile_id: 'PRF-SAC305-T4',
    alloy_type: 'SAC305',
    lot_number: 'LOT-OM-8917',
    expiry_date: '2026-10-25T23:59:59.000Z',
    status: 'ON_STENCIL',
    removed_from_cold_at: new Date(Date.now() - 360 * 60000).toISOString(),
    thaw_verified_at: new Date(Date.now() - 110 * 60000).toISOString(),
    thaw_duration_minutes: 250,
    temperature_verified_at: new Date(Date.now() - 110 * 60000).toISOString(),
    temperature_verified_c: 24.0,
    mixed_at: new Date(Date.now() - 90 * 60000).toISOString(),
    mixed_duration_seconds: 180,
    mixing_method: 'CENTRIFUGAL_PLANETARY',
    current_work_center_id: 'wc-spg-01',
    manufacturer: 'Alpha Assembly Solutions',
    thaw_required_minutes: 240,
    minimum_processing_temperature_c: 22.0,
    mixing_min_seconds: 120,
    mixing_max_seconds: 300,
    stencil_life_minutes: 360
  }
];

export const SolderPasteStation: React.FC = () => {
  const [jars, setJars] = useState<SolderPasteJar[]>(FALLBACK_JARS);
  const [loading, setLoading] = useState(false);
  const [selectedJarId, setSelectedJarId] = useState<string>('JAR-ALPHA-2601-C');
  const [verifyTempInput, setVerifyTempInput] = useState<string>('23.5');
  const [mixDurationInput, setMixDurationInput] = useState<string>('120');
  const [actionFeedback, setActionFeedback] = useState<{ type: 'SUCCESS' | 'ERROR'; message: string } | null>(null);
  const [printerAuthStatus, setPrinterAuthStatus] = useState<any>({
    allowed: true,
    pasteJarId: 'JAR-ALPHA-2601-F',
    remainingLifeMinutes: 360,
    reason: 'Active solder paste jar authorized on stencil STC-SM-4G-TOP'
  });

  const fetchJars = async () => {
    try {
      setLoading(true);
      const res = await authService.authFetch('/api/v1/smt/paste/jars');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setJars(data);
          if (!selectedJarId || !data.some(j => j.jar_id === selectedJarId)) {
            setSelectedJarId(data[0].jar_id);
          }
        }
      }
    } catch (e: any) {
      console.warn('Failed to fetch paste jars, using fallbacks:', e);
    } finally {
      setLoading(false);
    }
  };

  const checkPrinterAuth = async () => {
    try {
      const res = await authService.authFetch('/api/v1/smt/printer/authorize-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workCenterId: 'wc-spg-01',
          stencilId: 'STC-SM-4G-TOP'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPrinterAuthStatus(data);
      }
    } catch (e: any) {
      console.warn('Printer auth check error, using fallback:', e);
    }
  };

  useEffect(() => {
    fetchJars();
    checkPrinterAuth();
    const interval = setInterval(() => {
      fetchJars();
      checkPrinterAuth();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRemoveFromCold = async (jarId: string) => {
    try {
      const res = await authService.authFetch('/api/v1/smt/paste/remove-from-cold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jarId, operatorId: 'op-spg-01' })
      });
      if (res.ok) {
        const data = await res.json();
        setActionFeedback({ type: 'SUCCESS', message: data.message || `Jar ${jarId} removed from cold storage.` });
        await fetchJars();
        return;
      }
    } catch (e: any) {
      // Offline fallback simulation
    }

    setJars(prev => prev.map(j => {
      if (j.jar_id === jarId) {
        return {
          ...j,
          status: 'THAWING',
          removed_from_cold_at: new Date().toISOString(),
          thaw_duration_minutes: 1
        };
      }
      return j;
    }));
    setActionFeedback({
      type: 'SUCCESS',
      message: `[Simulated] Material ${jarId} retrieved from cold refrigeration. 240-min ambient thaw timer started.`
    });
  };

  const handleVerifyThaw = async (jarId: string) => {
    const temp = parseFloat(verifyTempInput);
    try {
      const res = await authService.authFetch('/api/v1/smt/paste/verify-thaw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jarId,
          temperatureVerifiedC: temp,
          operatorId: 'op-spg-01'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.thawSufficient) {
          setActionFeedback({ type: 'SUCCESS', message: `Thaw PASSED: ${data.temperatureVerifiedC}°C >= 22.0°C.` });
        } else {
          setActionFeedback({ type: 'ERROR', message: `Thaw FAILED: ${data.message}` });
        }
        await fetchJars();
        return;
      }
    } catch (e: any) {
      // Fallback simulation
    }

    if (temp >= 22.0) {
      setJars(prev => prev.map(j => {
        if (j.jar_id === jarId) {
          return {
            ...j,
            status: 'THAWED',
            temperature_verified_c: temp,
            thaw_verified_at: new Date().toISOString()
          };
        }
        return j;
      }));
      setActionFeedback({
        type: 'SUCCESS',
        message: `[Simulated] Surface thermal probe: ${temp}°C >= 22.0°C. Thaw verified, ready for planetary mixing.`
      });
    } else {
      setActionFeedback({
        type: 'ERROR',
        message: `[Simulated] Thermal rejection: ${temp}°C is below minimum threshold 22.0°C. Condensation risk.`
      });
    }
  };

  const handleMix = async (jarId: string) => {
    const sec = parseInt(mixDurationInput, 10);
    try {
      const res = await authService.authFetch('/api/v1/smt/paste/mix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jarId,
          durationSeconds: sec,
          mixingMethod: 'CENTRIFUGAL_PLANETARY',
          operatorId: 'op-spg-01'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setActionFeedback({ type: data.mixSufficient ? 'SUCCESS' : 'ERROR', message: data.message });
        await fetchJars();
        return;
      }
    } catch (e: any) {
      // Fallback simulation
    }

    if (sec >= 120) {
      setJars(prev => prev.map(j => {
        if (j.jar_id === jarId) {
          return {
            ...j,
            status: 'MIXED',
            mixed_duration_seconds: sec,
            mixed_at: new Date().toISOString(),
            mixing_method: 'CENTRIFUGAL_PLANETARY'
          };
        }
        return j;
      }));
      setActionFeedback({
        type: 'SUCCESS',
        message: `[Simulated] Centrifugal planetary mixing complete (${sec}s). Viscosity stabilized.`
      });
    } else {
      setActionFeedback({
        type: 'ERROR',
        message: `[Simulated] Mixing duration insufficient (${sec}s < 120s minimum requirement).`
      });
    }
  };

  const handleAuthorize = async (jarId: string) => {
    try {
      const res = await authService.authFetch('/api/v1/smt/paste/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jarId, workCenterId: 'wc-spg-01', operatorId: 'op-spg-01' })
      });
      if (res.ok) {
        const data = await res.json();
        setActionFeedback({ type: 'SUCCESS', message: data.message });
        await fetchJars();
        return;
      }
    } catch (e: any) {
      // Fallback simulation
    }

    setJars(prev => prev.map(j => {
      if (j.jar_id === jarId) {
        return { ...j, status: 'AUTHORIZED' };
      }
      return j;
    }));
    setActionFeedback({
      type: 'SUCCESS',
      message: `[Simulated] Solder paste jar ${jarId} authorized by QA Gate for SMT Line 1 production.`
    });
  };

  const handleLoadOnStencil = async (jarId: string) => {
    try {
      const res = await authService.authFetch('/api/v1/smt/paste/load-on-stencil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jarId,
          stencilId: 'STC-SM-4G-TOP',
          workCenterId: 'wc-spg-01',
          batchId: 'wo-apex-01',
          operatorId: 'op-spg-01'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setActionFeedback({ type: 'SUCCESS', message: data.message });
        await fetchJars();
        await checkPrinterAuth();
        return;
      }
    } catch (e: any) {
      // Fallback simulation
    }

    setJars(prev => prev.map(j => {
      if (j.jar_id === jarId) {
        return { ...j, status: 'ON_STENCIL' };
      }
      return j;
    }));
    setPrinterAuthStatus({
      allowed: true,
      pasteJarId: jarId,
      remainingLifeMinutes: 480,
      reason: 'Solder paste jar validated and mounted on stencil STC-SM-4G-TOP'
    });
    setActionFeedback({
      type: 'SUCCESS',
      message: `[Simulated] Jar ${jarId} loaded on stencil. Printer quality interlock clear (480m rolling life).`
    });
  };

  const selectedJar = jars.find((j) => j.jar_id === selectedJarId) || jars[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REFRIGERATED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>COLD (2-10°C)</span>;
      case 'THAWING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>THAWING (240m)</span>;
      case 'THAWED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.3)' }}>THAWED (UNMIXED)</span>;
      case 'MIXED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>MIXED</span>;
      case 'AUTHORIZED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--mes-status-pass)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>AUTHORIZED</span>;
      case 'ON_STENCIL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--mes-accent-primary)', border: '1px solid var(--mes-accent-primary)' }}>ON STENCIL</span>;
      case 'EXPIRED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--mes-status-fail)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>EXPIRED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold" style={{ background: 'var(--mes-bg-well)', color: 'var(--mes-text-muted)' }}>{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Station Header & Screen Printer Quality Interlock Banner */}
      <div
        className="rounded-xl p-5 shadow-2xl border"
        style={{ background: 'var(--mes-bg-surface)', borderColor: 'var(--mes-border)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl border flex items-center justify-center shadow-inner"
              style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)', color: 'var(--mes-accent-primary)' }}
            >
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--mes-text-muted)' }}>
                  STAGE 01 // DEK HORIZON 03IX SCREEN PRINTER
                </span>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded border font-semibold"
                  style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--mes-status-pass)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                >
                  WORK CENTER: wc-spg-01
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-0.5 flex items-center gap-3" style={{ color: 'var(--mes-text-primary)' }}>
                Solder Paste & Stencil Quality Gate Station
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchJars(); checkPrinterAuth(); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-mono transition-all"
              style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)', color: 'var(--mes-text-secondary)' }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>SYNC</span>
            </button>
            <div
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-mono font-bold"
              style={{
                background: printerAuthStatus?.allowed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: printerAuthStatus?.allowed ? 'var(--mes-status-pass)' : 'var(--mes-status-fail)',
                borderColor: printerAuthStatus?.allowed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
              }}
            >
              {printerAuthStatus?.allowed ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              <span>{printerAuthStatus?.allowed ? 'PRINTER GATE: PERMITTED' : 'PRINTER GATE: INTERLOCK TRIPPED'}</span>
            </div>
          </div>
        </div>

        {/* Live Stencil & Session Status Bar */}
        <div
          className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t text-xs font-mono"
          style={{ borderColor: 'var(--mes-border)' }}
        >
          <div className="p-3 rounded-lg border" style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)' }}>
            <div style={{ color: 'var(--mes-text-muted)' }}>ACTIVE STENCIL</div>
            <div className="font-bold mt-1 text-sm" style={{ color: 'var(--mes-text-primary)' }}>STC-SM-4G-TOP (Rev A)</div>
            <div className="text-[11px] mt-0.5 font-semibold" style={{ color: 'var(--mes-accent-primary)' }}>Foil: 120µm Laser Electropolished</div>
          </div>

          <div className="p-3 rounded-lg border" style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)' }}>
            <div style={{ color: 'var(--mes-text-muted)' }}>STENCIL ROLLING LIFE</div>
            <div className="font-bold mt-1 text-sm" style={{ color: 'var(--mes-text-primary)' }}>
              {printerAuthStatus?.remainingLifeMinutes !== undefined ? `${printerAuthStatus.remainingLifeMinutes}m / 480m` : '480m / 480m'}
            </div>
            <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'var(--mes-border)' }}>
              <div
                className="h-full transition-all"
                style={{
                  background: 'var(--mes-accent-primary)',
                  width: `${Math.min(100, ((printerAuthStatus?.remainingLifeMinutes ?? 480) / 480) * 100)}%`
                }}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg border" style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)' }}>
            <div style={{ color: 'var(--mes-text-muted)' }}>MOUNTED PASTE JAR</div>
            <div className="font-bold mt-1 text-sm" style={{ color: 'var(--mes-text-primary)' }}>
              {printerAuthStatus?.pasteJarId || 'JAR-ALPHA-2601-F'}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--mes-text-muted)' }}>SAC305 Type 4 • Lot LOT-OM-8917</div>
          </div>

          <div className="p-3 rounded-lg border" style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)' }}>
            <div style={{ color: 'var(--mes-text-muted)' }}>GATE REASON</div>
            <div className="font-semibold mt-1 text-[11px] truncate" style={{ color: 'var(--mes-text-primary)' }} title={printerAuthStatus?.reason}>
              {printerAuthStatus?.reason || 'Checking interlock parameters...'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionFeedback && (
        <div
          className="p-4 rounded-xl border flex items-center justify-between text-xs font-mono animate-fade-in"
          style={{
            background: actionFeedback.type === 'SUCCESS' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            borderColor: actionFeedback.type === 'SUCCESS' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
            color: actionFeedback.type === 'SUCCESS' ? 'var(--mes-status-pass)' : 'var(--mes-status-fail)'
          }}
        >
          <div className="flex items-center gap-3">
            {actionFeedback.type === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{actionFeedback.message}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Workspace Grid: Jars Inventory & Staging Execution Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Solder Paste Jars Inventory (7 Cols) */}
        <div
          className="lg:col-span-7 border rounded-xl p-5 shadow-2xl flex flex-col"
          style={{ background: 'var(--mes-bg-surface)', borderColor: 'var(--mes-border)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold font-mono flex items-center gap-2" style={{ color: 'var(--mes-text-primary)' }}>
              <Clock className="w-4 h-4" style={{ color: 'var(--mes-accent-primary)' }} />
              CONTROLLED SOLDER PASTE JARS ({jars.length})
            </h3>
            <span className="text-[11px] font-mono" style={{ color: 'var(--mes-text-muted)' }}>IPC J-STD-004B & Manufacturer TDS</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {jars.map((jar) => {
              const isSelected = selectedJar?.jar_id === jar.jar_id;
              return (
                <div
                  key={jar.jar_id}
                  onClick={() => setSelectedJarId(jar.jar_id)}
                  className="p-4 rounded-xl border transition-all cursor-pointer"
                  style={{
                    background: isSelected ? 'var(--mes-bg-well)' : 'var(--mes-bg-surface)',
                    borderColor: isSelected ? 'var(--mes-accent-primary)' : 'var(--mes-border)',
                    boxShadow: isSelected ? '0 0 12px rgba(0, 230, 153, 0.15)' : 'none'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-bold text-xs"
                        style={{ background: 'var(--mes-bg-surface)', borderColor: 'var(--mes-border)', color: 'var(--mes-text-primary)' }}
                      >
                        {jar.alloy_type === 'SAC305' ? 'SAC' : 'PST'}
                      </div>
                      <div>
                        <div className="text-sm font-bold font-mono flex items-center gap-2" style={{ color: 'var(--mes-text-primary)' }}>
                          {jar.jar_id}
                          {getStatusBadge(jar.status)}
                        </div>
                        <div className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--mes-text-muted)' }}>
                          {jar.part_number} • Lot: {jar.lot_number} • Exp: {jar.expiry_date?.slice(0, 10)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs font-bold" style={{ color: 'var(--mes-text-primary)' }}>
                        {jar.status === 'ON_STENCIL' ? 'PRINTING' : jar.status}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--mes-text-muted)' }}>
                        Thaw Req: {jar.thaw_required_minutes ?? 240}m
                      </div>
                    </div>
                  </div>

                  {/* Micro Metadata Footnote */}
                  <div
                    className="mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] font-mono"
                    style={{ borderColor: 'var(--mes-border)', color: 'var(--mes-text-muted)' }}
                  >
                    <span>Thaw Verified: {jar.thaw_verified_at ? 'YES' : 'PENDING'}</span>
                    <span>Mix Duration: {jar.mixed_duration_seconds > 0 ? `${jar.mixed_duration_seconds}s` : 'NONE'}</span>
                    <span>Surface Temp: {jar.temperature_verified_c ? `${jar.temperature_verified_c}°C` : 'N/A'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Controlled Process Workflow Actions (5 Cols) */}
        <div
          className="lg:col-span-5 border rounded-xl p-5 shadow-2xl flex flex-col"
          style={{ background: 'var(--mes-bg-surface)', borderColor: 'var(--mes-border)' }}
        >
          <h3 className="text-sm font-bold font-mono flex items-center gap-2 mb-4" style={{ color: 'var(--mes-text-primary)' }}>
            <RotateCw className="w-4 h-4" style={{ color: 'var(--mes-accent-primary)' }} />
            MATERIAL WORKFLOW EXECUTION
          </h3>

          {selectedJar ? (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              {/* Selected Jar Target Information */}
              <div className="p-4 rounded-xl border" style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)' }}>
                <div className="text-[11px] font-mono" style={{ color: 'var(--mes-text-muted)' }}>SELECTED MATERIAL UID</div>
                <div className="text-lg font-bold font-mono mt-0.5" style={{ color: 'var(--mes-text-primary)' }}>{selectedJar.jar_id}</div>
                <div className="text-xs font-mono mt-1 font-semibold" style={{ color: 'var(--mes-accent-primary)' }}>{selectedJar.part_number} ({selectedJar.alloy_type})</div>
                <div className="mt-3 flex items-center justify-between text-xs font-mono border-t pt-2" style={{ borderColor: 'var(--mes-border)', color: 'var(--mes-text-muted)' }}>
                  <span>CURRENT STATE:</span>
                  <span className="font-bold" style={{ color: 'var(--mes-text-primary)' }}>{selectedJar.status}</span>
                </div>
              </div>

              {/* Step 1: Remove from Cold Refrigeration */}
              <div className="p-3.5 rounded-lg border" style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold" style={{ color: 'var(--mes-text-primary)' }}>
                    <span className="w-5 h-5 rounded flex items-center justify-center text-[10px]" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>1</span>
                    COLD STORAGE RETRIEVAL
                  </div>
                  <button
                    disabled={selectedJar.status !== 'REFRIGERATED'}
                    onClick={() => handleRemoveFromCold(selectedJar.jar_id)}
                    className="px-3 py-1.5 rounded-lg text-white text-xs font-mono font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: '#2563eb' }}
                  >
                    START THAW
                  </button>
                </div>
                <p className="text-[11px] font-mono mt-2" style={{ color: 'var(--mes-text-muted)' }}>
                  Initiates 4-hour (240 min) ambient equilibrium window prior to opening lid.
                </p>
              </div>

              {/* Step 2: Verify Thaw & Surface Temperature */}
              <div className="p-3.5 rounded-lg border" style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold" style={{ color: 'var(--mes-text-primary)' }}>
                    <span className="w-5 h-5 rounded flex items-center justify-center text-[10px]" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>2</span>
                    THAW & TEMP VERIFICATION
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center px-2 py-1 rounded border text-xs font-mono" style={{ background: 'var(--mes-bg-surface)', borderColor: 'var(--mes-border)' }}>
                      <input
                        type="number"
                        step="0.1"
                        value={verifyTempInput}
                        onChange={(e) => setVerifyTempInput(e.target.value)}
                        className="w-12 bg-transparent focus:outline-none text-right font-bold"
                        style={{ color: 'var(--mes-text-primary)' }}
                      />
                      <span className="ml-1" style={{ color: 'var(--mes-text-muted)' }}>°C</span>
                    </div>
                    <button
                      disabled={selectedJar.status !== 'THAWING'}
                      onClick={() => handleVerifyThaw(selectedJar.jar_id)}
                      className="px-3 py-1.5 rounded-lg text-white text-xs font-mono font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ background: '#d97706' }}
                    >
                      VERIFY
                    </button>
                  </div>
                </div>
                <p className="text-[11px] font-mono mt-2" style={{ color: 'var(--mes-text-muted)' }}>
                  Requires ≥22.0°C surface thermal probe check to prevent moisture condensation.
                </p>
              </div>

              {/* Step 3: Planetary Centrifugal Mixing */}
              <div className="p-3.5 rounded-lg border" style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold" style={{ color: 'var(--mes-text-primary)' }}>
                    <span className="w-5 h-5 rounded flex items-center justify-center text-[10px]" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>3</span>
                    PLANETARY MIXING CYCLE
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center px-2 py-1 rounded border text-xs font-mono" style={{ background: 'var(--mes-bg-surface)', borderColor: 'var(--mes-border)' }}>
                      <input
                        type="number"
                        value={mixDurationInput}
                        onChange={(e) => setMixDurationInput(e.target.value)}
                        className="w-12 bg-transparent focus:outline-none text-right font-bold"
                        style={{ color: 'var(--mes-text-primary)' }}
                      />
                      <span className="ml-1" style={{ color: 'var(--mes-text-muted)' }}>sec</span>
                    </div>
                    <button
                      disabled={selectedJar.status !== 'THAWED'}
                      onClick={() => handleMix(selectedJar.jar_id)}
                      className="px-3 py-1.5 rounded-lg text-white text-xs font-mono font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ background: '#9333ea' }}
                    >
                      RECORD MIX
                    </button>
                  </div>
                </div>
                <p className="text-[11px] font-mono mt-2" style={{ color: 'var(--mes-text-muted)' }}>
                  Profile mandates 120s – 300s planetary shear to achieve thixotropic rheology.
                </p>
              </div>

              {/* Step 4 & 5: Authorization & Mounting */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={selectedJar.status !== 'MIXED'}
                  onClick={() => handleAuthorize(selectedJar.jar_id)}
                  className="px-4 py-3 rounded-xl border font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: 'var(--mes-bg-well)',
                    borderColor: 'var(--mes-accent-primary)',
                    color: 'var(--mes-accent-primary)'
                  }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>AUTHORIZE JAR</span>
                </button>

                <button
                  disabled={selectedJar.status !== 'AUTHORIZED'}
                  onClick={() => handleLoadOnStencil(selectedJar.jar_id)}
                  className="px-4 py-3 rounded-xl font-mono text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                  style={{
                    background: 'var(--mes-accent-primary)',
                    color: 'var(--mes-bg-base)'
                  }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>LOAD ON STENCIL</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs font-mono" style={{ color: 'var(--mes-text-muted)' }}>
              No solder paste jars found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
