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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#12161F] border border-white/[0.12] rounded-xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#171C26]">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">Cleanroom Deployment & Machine Link Modes</h2>
              <p className="text-[11px] text-[#6B7280]">Toggle between isolated field simulation & live equipment integration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#6B7280] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Database Mode Card */}
          <div className="p-3.5 rounded-lg border border-white/[0.08] bg-white/[0.02] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">Database Architecture Mode</span>
              </div>
              <button
                onClick={toggleDbMode}
                className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition-colors"
              >
                {modes.dbMode === 'STANDALONE' ? (
                  <>
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">STANDALONE (SQLite)</span>
                  </>
                ) : (
                  <>
                    <Server className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-sky-300">CONNECTED (Postgres)</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
              {modes.dbMode === 'STANDALONE'
                ? 'Running in zero-dependency embedded SQLite mode (mes_local.db). Completely safe for offline field testing on laptops without touching plant production servers.'
                : 'Connected to centralized plant PostgreSQL instance. Shop floor events, traceability logs, and batch completions stream directly into enterprise ERP.'}
            </p>
          </div>

          {/* Machine Integration Matrix */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-white/90 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-indigo-400" />
              Machine Protocol Adapters
            </h3>

            {/* Fuji P&P */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.015]">
              <div>
                <div className="text-xs font-medium text-white flex items-center gap-2">
                  <span>Fuji NXT III / AIMEX Pick & Place</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-[#8E95A2]">TCP Host / Client</span>
                </div>
                <div className="text-[11px] text-[#6B7280]">STX/ETX Fuji Host Protocol V2.8.0</div>
              </div>
              <div className="flex items-center gap-2">
                {onOpenFujiLink && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenFujiLink();
                    }}
                    className="text-xs font-mono px-2.5 py-1 rounded border border-sky-500/40 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors"
                  >
                    Configure IP / Port
                  </button>
                )}
                <button
                  onClick={toggleFujiMode}
                  className={`text-xs font-mono px-2.5 py-1 rounded border transition-colors ${
                    modes.fujiMode === 'LIVE_TCP'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}
                >
                  {modes.fujiMode === 'LIVE_TCP' ? '● LIVE TCP' : '○ SIMULATED'}
                </button>
              </div>
            </div>

            {/* 3D SPI */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.015]">
              <div>
                <div className="text-xs font-medium text-white flex items-center gap-2">
                  <span>3D Solder Paste Inspection (SPI)</span>
                </div>
                <div className="text-[11px] text-[#6B7280]">Koh Young / CyberOptics IPC-CFX AMQP or XML/JSON Drop</div>
              </div>
              <button
                onClick={toggleSpiMode}
                className={`text-xs font-mono px-2.5 py-1 rounded border transition-colors ${
                  modes.spiMode !== 'SIMULATED'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                {modes.spiMode !== 'SIMULATED' ? '? LIVE DROP' : '? SIMULATED'}
              </button>
            </div>

            {/* 3D AOI */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.015]">
              <div>
                <div className="text-xs font-medium text-white flex items-center gap-2">
                  <span>3D Optical Inspection (AOI)</span>
                </div>
                <div className="text-[11px] text-[#6B7280]">Koh Young / Omron Inspection Result Ingest</div>
              </div>
              <button
                onClick={toggleAoiMode}
                className={`text-xs font-mono px-2.5 py-1 rounded border transition-colors ${
                  modes.aoiMode !== 'SIMULATED'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                {modes.aoiMode !== 'SIMULATED' ? '? LIVE WATCHER' : '? SIMULATED'}
              </button>
            </div>

            {/* Screen Printer */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.015]">
              <div>
                <div className="text-xs font-medium text-white flex items-center gap-2">
                  <span>Screen Printer (DEK / Fuji GPX)</span>
                </div>
                <div className="text-[11px] text-[#6B7280]">IPC-CFX-2591 Squeegee Remote Tuning & Stencil Wipe</div>
              </div>
              <button
                onClick={togglePrinterMode}
                className={`text-xs font-mono px-2.5 py-1 rounded border transition-colors ${
                  modes.printerMode !== 'SIMULATED'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                {modes.printerMode !== 'SIMULATED' ? '? LIVE AMQP' : '? SIMULATED'}
              </button>
            </div>

            {/* Reflow Oven */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.015]">
              <div>
                <div className="text-xs font-medium text-white flex items-center gap-2">
                  <span>Reflow Oven Profiler</span>
                </div>
                <div className="text-[11px] text-[#6B7280]">KIC / Datapaq .kic / .paq Thermal Run Ingestion</div>
              </div>
              <button
                onClick={toggleReflowMode}
                className={`text-xs font-mono px-2.5 py-1 rounded border transition-colors ${
                  modes.reflowMode !== 'SIMULATED'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                {modes.reflowMode !== 'SIMULATED' ? '? LIVE AUTO-IMPORT' : '? SIMULATED'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] flex items-center justify-between bg-[#171C26]">
          <span className="text-[11px] font-mono text-[#6B7280]">Config synced to runtime</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-medium transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
