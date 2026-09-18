// apps/web/src/components/traceability/TraceabilityStatusBar.tsx
import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, ShieldAlert, Lock, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { TraceabilityDataSource, isFixtureModeEnabled, setFixtureModeEnabled } from '../../services/traceability.api';

interface TraceabilityStatusBarProps {
  source: TraceabilityDataSource;
  error?: string;
  fixtureId?: string;
  onRefresh?: () => void;
  onFixtureModeToggled?: () => void;
}

export const TraceabilityStatusBar: React.FC<TraceabilityStatusBarProps> = ({
  source,
  error,
  fixtureId,
  onRefresh,
  onFixtureModeToggled
}) => {
  const fixtureEnabled = isFixtureModeEnabled();

  const handleToggle = () => {
    setFixtureModeEnabled(!fixtureEnabled);
    if (onFixtureModeToggled) onFixtureModeToggled();
  };

  return (
    <div className="space-y-2">
      {/* Persistent Source State Banner */}
      {source === 'OFFLINE_FIXTURE' && (
        <div className="bg-slate-950 border border-amber-500/40 border-l-4 border-l-amber-400 text-slate-100 px-3.5 py-2.5 rounded-[var(--mes-radius)] text-xs font-mono flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <div>
              <span className="font-bold tracking-wider uppercase text-amber-300">⚠ OFFLINE / DEMO DATA — NOT LIVE</span>
              <span className="text-slate-300 ml-2">
                Live MES bus unavailable; displaying simulated test record: <span className="text-amber-400 font-bold">[{fixtureId || 'CANONICAL'}]</span>
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-amber-950/80 text-amber-300 px-2.5 py-0.5 rounded-[var(--mes-radius)] border border-amber-500/50 font-bold tracking-wider">
            DEMO MODE
          </span>
        </div>
      )}

      {source === 'AUTH_ERROR' && (
        <div className="bg-slate-950 border border-rose-500/40 border-l-4 border-l-rose-500 text-slate-100 px-3.5 py-2.5 rounded-[var(--mes-radius)] text-xs font-mono flex items-center gap-2.5 shadow-sm">
          <Lock className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <span className="font-bold tracking-wider uppercase text-rose-400">🔒 AUTHENTICATION REQUIRED (HTTP 401/403)</span>
            <span className="text-slate-300 ml-2">{error || 'Valid operator JWT or Permission.TRACEABILITY_READ required.'}</span>
          </div>
        </div>
      )}

      {source === 'OFFLINE_NO_DATA' && (
        <div className="bg-slate-950 border border-rose-500/40 border-l-4 border-l-rose-500 text-slate-100 px-3.5 py-2.5 rounded-[var(--mes-radius)] text-xs font-mono flex items-center gap-2.5 shadow-sm">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <span className="font-bold tracking-wider uppercase text-rose-400">⚠ LIVE MES API UNAVAILABLE</span>
            <span className="text-slate-300 ml-2">Production endpoint unreachable and offline fixtures are disabled.</span>
          </div>
        </div>
      )}

      {source === 'NOT_FOUND' && (
        <div className="bg-slate-950 border border-slate-800 border-l-4 border-l-slate-600 text-slate-300 px-3.5 py-2.5 rounded-[var(--mes-radius)] text-xs font-mono flex items-center gap-2">
          <span className="text-white font-bold">404 NOT FOUND:</span>
          <span className="text-slate-300">{error || 'No matching manufacturing records located for the requested identifier.'}</span>
        </div>
      )}

      {source === 'ERROR' && (
        <div className="bg-slate-950 border border-rose-500/40 border-l-4 border-l-rose-500 text-slate-100 px-3.5 py-2.5 rounded-[var(--mes-radius)] text-xs font-mono flex items-center gap-2">
          <span className="font-bold text-rose-400">SYSTEM ERROR:</span>
          <span className="text-slate-300">{error || 'Internal MES service communication failure.'}</span>
        </div>
      )}

      {/* Industrial Sub-Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-slate-950 px-3.5 py-2 rounded-[var(--mes-radius)] border border-slate-800">
        {/* Source Status Indicator */}
        <div className="flex items-center gap-2">
          {source === 'LIVE' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">● LIVE DATA</span>
              <span className="text-slate-500 text-[11px]">• Connected to MES API</span>
            </>
          ) : source === 'OFFLINE_FIXTURE' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-400 font-bold">● OFFLINE / DEMO FIXTURE</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-rose-400 font-bold">● DISCONNECTED</span>
            </>
          )}
        </div>

        {/* Factual Audit & Evidence Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">AUDIT LEDGER LINKED</span>
          </div>

          <div className="h-3 w-px bg-slate-800" />

          {/* Fixture Mode Toggle Switch */}
          <button
            onClick={handleToggle}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
            title="Toggle offline demo fixture fallback"
          >
            <span className="text-slate-400">DEMO FIXTURES:</span>
            {fixtureEnabled ? (
              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                ON <ToggleRight className="w-4 h-4 text-emerald-400" />
              </span>
            ) : (
              <span className="text-slate-500 font-bold flex items-center gap-0.5">
                OFF <ToggleLeft className="w-4 h-4 text-slate-500" />
              </span>
            )}
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
              title="Refresh dataset from API"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
