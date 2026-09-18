import React, { useState } from 'react';
import { X, Server, Radio, Database, ToggleLeft, ToggleRight, Check, HardDrive, Cpu } from 'lucide-react';

export interface StationModes {
  dbMode: 'STANDALONE' | 'CONNECTED';
  fujiMode: 'LIVE_TCP' | 'SIMULATED';
  spiMode: 'SIMULATED' | 'CFX_AMQP' | 'FILE_WATCHER';
  aoiMode: 'SIMULATED' | 'FILE_WATCHER';
  printerMode: 'SIMULATED' | 'CFX_AMQP';
  reflowMode: 'SIMULATED' | 'FILE_WATCHER';
}

interface StationModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  modes: StationModes;
  onUpdateModes: (newModes: StationModes) => void;
  onOpenFujiLink?: () => void;
}

export const StationModeModal: React.FC<StationModeModalProps> = ({
  isOpen,
  onClose,
  modes,
  onUpdateModes,
  onOpenFujiLink
}) => {
  if (!isOpen) return null;

  const toggleDbMode = () => {
    onUpdateModes({
      ...modes,
      dbMode: modes.dbMode === 'STANDALONE' ? 'CONNECTED' : 'STANDALONE'
    });
  };

  const toggleFujiMode = () => {
    onUpdateModes({
      ...modes,
      fujiMode: modes.fujiMode === 'LIVE_TCP' ? 'SIMULATED' : 'LIVE_TCP'
    });
  };

  const toggleSpiMode = () => {
    onUpdateModes({
      ...modes,
      spiMode: modes.spiMode === 'SIMULATED' ? 'FILE_WATCHER' : 'SIMULATED'
    });
  };

  const toggleAoiMode = () => {
    onUpdateModes({
      ...modes,
      aoiMode: modes.aoiMode === 'SIMULATED' ? 'FILE_WATCHER' : 'SIMULATED'
    });
  };

  const togglePrinterMode = () => {
    onUpdateModes({
      ...modes,
      printerMode: modes.printerMode === 'SIMULATED' ? 'CFX_AMQP' : 'SIMULATED'
    });
  };

  const toggleReflowMode = () => {
    onUpdateModes({
      ...modes,
      reflowMode: modes.reflowMode === 'SIMULATED' ? 'FILE_WATCHER' : 'SIMULATED'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Cleanroom Deployment & Machine Link Modes</h2>
              <p className="text-[11px] text-slate-400 font-mono">Toggle between isolated field simulation & live equipment integration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[var(--mes-radius)] text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Database Mode Card */}
          <div className="p-3.5 rounded-[var(--mes-radius)] border border-slate-800 bg-slate-900 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">Database Architecture Mode</span>
              </div>
              <button
                onClick={toggleDbMode}
                className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-[var(--mes-radius)] bg-slate-950 hover:bg-slate-850 border border-slate-700 transition-colors"
              >
                {modes.dbMode === 'STANDALONE' ? (
                  <>
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-semibold uppercase tracking-wider">STANDALONE (SQLite)</span>
                  </>
                ) : (
                  <>
                    <Server className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-300 font-semibold uppercase tracking-wider">CONNECTED (Postgres)</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              {modes.dbMode === 'STANDALONE'
                ? 'Running in zero-dependency embedded SQLite mode (mes_local.db). Completely safe for offline field testing on laptops without touching plant production servers.'
                : 'Connected to centralized plant PostgreSQL instance. Shop floor events, traceability logs, and batch completions stream directly into enterprise ERP.'}
            </p>
          </div>

          {/* Machine Integration Matrix */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Machine Protocol Adapters</span>
            </h3>

            {/* Fuji P&P */}
            <div className="flex items-center justify-between p-3 rounded-[var(--mes-radius)] border border-slate-800 bg-slate-900">
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <span>Fuji NXT III / AIMEX Pick & Place</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-slate-950 text-slate-400 border border-slate-800">TCP Host / Client</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">STX/ETX Fuji Host Protocol V2.8.0</div>
              </div>
              <div className="flex items-center gap-2">
                {onOpenFujiLink && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenFujiLink();
                    }}
                    className="text-xs font-mono px-2.5 py-1 rounded-[var(--mes-radius)] border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/40 font-semibold transition-colors"
                  >
                    Configure IP / Port
                  </button>
                )}
                <button
                  onClick={toggleFujiMode}
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-[var(--mes-radius)] border transition-colors ${
                    modes.fujiMode === 'LIVE_TCP'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  }`}
                >
                  {modes.fujiMode === 'LIVE_TCP' ? '● LIVE TCP' : '○ SIMULATED'}
                </button>
              </div>
            </div>

            {/* 3D SPI */}
            <div className="flex items-center justify-between p-3 rounded-[var(--mes-radius)] border border-slate-800 bg-slate-900">
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <span>3D Solder Paste Inspection (SPI)</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">Koh Young / CyberOptics IPC-CFX AMQP or XML/JSON Drop</div>
              </div>
              <button
                onClick={toggleSpiMode}
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-[var(--mes-radius)] border transition-colors ${
                  modes.spiMode !== 'SIMULATED'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                }`}
              >
                {modes.spiMode !== 'SIMULATED' ? '● LIVE DROP' : '○ SIMULATED'}
              </button>
            </div>

            {/* 3D AOI */}
            <div className="flex items-center justify-between p-3 rounded-[var(--mes-radius)] border border-slate-800 bg-slate-900">
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <span>3D Optical Inspection (AOI)</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">Koh Young / Omron Inspection Result Ingest</div>
              </div>
              <button
                onClick={toggleAoiMode}
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-[var(--mes-radius)] border transition-colors ${
                  modes.aoiMode !== 'SIMULATED'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                }`}
              >
                {modes.aoiMode !== 'SIMULATED' ? '● LIVE WATCHER' : '○ SIMULATED'}
              </button>
            </div>

            {/* Screen Printer */}
            <div className="flex items-center justify-between p-3 rounded-[var(--mes-radius)] border border-slate-800 bg-slate-900">
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <span>Screen Printer (DEK / Fuji GPX)</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">IPC-CFX-2591 Squeegee Remote Tuning & Stencil Wipe</div>
              </div>
              <button
                onClick={togglePrinterMode}
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-[var(--mes-radius)] border transition-colors ${
                  modes.printerMode !== 'SIMULATED'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                }`}
              >
                {modes.printerMode !== 'SIMULATED' ? '● LIVE AMQP' : '○ SIMULATED'}
              </button>
            </div>

            {/* Reflow Oven */}
            <div className="flex items-center justify-between p-3 rounded-[var(--mes-radius)] border border-slate-800 bg-slate-900">
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <span>Reflow Oven Profiler</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">KIC / Datapaq .kic / .paq Thermal Run Ingestion</div>
              </div>
              <button
                onClick={toggleReflowMode}
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-[var(--mes-radius)] border transition-colors ${
                  modes.reflowMode !== 'SIMULATED'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                }`}
              >
                {modes.reflowMode !== 'SIMULATED' ? '● LIVE AUTO-IMPORT' : '○ SIMULATED'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-900 font-mono">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider">Config synced to runtime</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-[var(--mes-radius)] bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono uppercase tracking-wider transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
