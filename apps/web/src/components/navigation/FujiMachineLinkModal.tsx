import React, { useState, useEffect, useCallback } from 'react';
import { 
  Radio, Wifi, Server, Check, Copy, RefreshCw, X, AlertTriangle, 
  Terminal, ArrowDownLeft, ArrowUpRight, Clock, Activity, Cpu, 
  ShieldCheck, Zap, HelpCircle
} from 'lucide-react';

interface LocalInterface {
  name: string;
  address: string;
  netmask: string;
  mac: string;
  family: string;
  isInternal: boolean;
}

interface FujiWireLog {
  id: string;
  timestamp: string;
  direction: 'INBOUND' | 'OUTBOUND';
  remoteAddress: string;
  command: string;
  seqId: number;
  summary: string;
  rawPreview: string;
}

interface FujiRuntimeConfig {
  mode: 'LISTENER' | 'CLIENT';
  port: number;
  allowedSubnets: string[];
  idleTimeoutSeconds: number;
  clientTargetHost: string;
  clientTargetPort: number;
  machineName: string;
}

interface FujiMachineLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (status: any) => void;
}

export const FujiMachineLinkModal: React.FC<FujiMachineLinkModalProps> = ({
  isOpen,
  onClose,
  onStatusChange
}) => {
  const [config, setConfig] = useState<FujiRuntimeConfig>({
    mode: 'LISTENER',
    port: 30040,
    allowedSubnets: ['*'],
    idleTimeoutSeconds: 120,
    clientTargetHost: '192.168.1.100',
    clientTargetPort: 30040,
    machineName: 'NXTR1'
  });

  const [interfaces, setInterfaces] = useState<LocalInterface[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [wireLogs, setWireLogs] = useState<FujiWireLog[]>([]);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [autoRefreshLogs, setAutoRefreshLogs] = useState(true);
  const [selectedLog, setSelectedLog] = useState<FujiWireLog | null>(null);

  // Ping / connection test state
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; latencyMs?: number; error?: string } | null>(null);

  // Fetch configuration and status
  const fetchConfigAndStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/v1/smt/fuji/config');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
        }
        if (data.interfaces) {
          setInterfaces(data.interfaces);
        }
        if (data.status) {
          setStatus(data.status);
          onStatusChange?.(data.status);
        }
        if (data.recentLogs) {
          setWireLogs(data.recentLogs);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch Fuji config:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onStatusChange]);

  // Fetch wire logs polling
  const fetchWireLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/smt/fuji/wire-logs?limit=40');
      if (res.ok) {
        const data = await res.json();
        if (data.logs) {
          setWireLogs(data.logs);
        }
      }
    } catch (err) {
      // Silent catch during polling
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchConfigAndStatus();
    }
  }, [isOpen, fetchConfigAndStatus]);

  // Periodic wire logs refresh
  useEffect(() => {
    if (!isOpen || !autoRefreshLogs) return;
    const interval = setInterval(() => {
      fetchWireLogs();
    }, 1500);
    return () => clearInterval(interval);
  }, [isOpen, autoRefreshLogs, fetchWireLogs]);

  if (!isOpen) return null;

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const res = await fetch('/api/v1/smt/fuji/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccess(true);
        if (data.status) {
          setStatus(data.status);
          onStatusChange?.(data.status);
        }
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(data.error || 'Failed to save configuration');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Network error saving configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingPing(true);
    setPingResult(null);
    try {
      const res = await fetch('/api/v1/smt/fuji/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: config.clientTargetHost,
          port: config.clientTargetPort,
          timeoutMs: 3000
        })
      });
      const data = await res.json();
      setPingResult(data);
    } catch (err: any) {
      setPingResult({ success: false, error: err.message });
    } finally {
      setIsTestingPing(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      await fetch('/api/v1/smt/fuji/wire-logs/clear', { method: 'POST' });
      setWireLogs([]);
      setSelectedLog(null);
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn font-mono">
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-300 text-xs">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[var(--mes-radius)] bg-cyan-950/40 border border-cyan-500/40 text-cyan-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-100 text-sm tracking-wide uppercase tracking-wider">
                  FUJI MACHINE LINK & OT NETWORK SETUP
                </h2>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  NXT III / AIMEX IIIc / Nexim
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Configure TCP socket IP, port, subnet firewall whitelist, and inspect live STX/ETX wire protocol frames
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchConfigAndStatus}
              disabled={isLoading}
              className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-950 hover:bg-slate-850 rounded-[var(--mes-radius)] border border-slate-800 transition-colors"
              title="Refresh status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-950 hover:bg-slate-850 rounded-[var(--mes-radius)] border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Banner: Detected Local IP Addresses for Fuji Host Setup */}
          <div className="bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-3.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Wifi className="w-3.5 h-3.5" />
                <span>YOUR COMPUTER'S DETECTED IP ADDRESSES</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                Enter this in Fuji Nexim Host Settings
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed font-mono">
              To connect your Fuji NXT III or AIMEX machine to this simulator, open the Fuji machine's 
              <strong className="text-slate-100"> Line Controller &rarr; System &rarr; Host Interface Settings</strong>, 
              and enter one of the IP addresses below:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {interfaces.map((iface) => (
                <div
                  key={`${iface.name}-${iface.address}`}
                  className="bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-[var(--mes-radius)] p-2.5 flex items-center justify-between transition-colors"
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono truncate">
                      <span>{iface.name}</span>
                      {iface.isInternal && <span className="text-amber-300">(Loopback)</span>}
                    </div>
                    <div className="font-mono font-bold text-slate-100 text-xs tracking-wider truncate tabular-nums">
                      {iface.address}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyIp(iface.address)}
                    className="ml-2 px-2 py-1 bg-slate-900 hover:bg-cyan-950 text-cyan-300 hover:text-cyan-200 border border-cyan-800/60 rounded-[var(--mes-radius)] text-[10.5px] font-mono flex items-center gap-1 transition-colors flex-shrink-0"
                  >
                    {copiedIp === iface.address ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Mode A: Inbound Passive Listener */}
            <div
              onClick={() => setConfig({ ...config, mode: 'LISTENER' })}
              className={`p-3.5 rounded-[var(--mes-radius)] border cursor-pointer transition-all ${
                config.mode === 'LISTENER'
                  ? 'bg-cyan-950/30 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/20'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-100 text-xs uppercase tracking-wider">
                  <div className={`w-2 h-2 rounded-full ${config.mode === 'LISTENER' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span>MODE A: INBOUND PASSIVE LISTENER</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-cyan-900/60 text-cyan-300 border border-cyan-700 font-semibold uppercase">
                  Recommended for SMT Line
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-mono mt-1">
                MES acts as Host Server. The Fuji NXT/AIMEX machine opens a TCP socket connection directly to this PC on your specified port.
              </p>
            </div>

            {/* Mode B: Outbound Central Client */}
            <div
              onClick={() => setConfig({ ...config, mode: 'CLIENT' })}
              className={`p-3.5 rounded-[var(--mes-radius)] border cursor-pointer transition-all ${
                config.mode === 'CLIENT'
                  ? 'bg-emerald-950/30 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/20'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-100 text-xs uppercase tracking-wider">
                  <div className={`w-2 h-2 rounded-full ${config.mode === 'CLIENT' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span>MODE B: OUTBOUND CENTRAL CLIENT</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-emerald-900/60 text-emerald-300 border border-emerald-700 font-semibold uppercase">
                  Factory Nexim Server
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-mono mt-1">
                MES acts as Host Client. Connects outbound to a centralized Fuji Nexim server running on a factory host PC, executing SETEV 22-event handshake.
              </p>
            </div>
          </div>

          {/* Configuration Form based on Selected Mode */}
          <div className="bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-3.5 space-y-3">
            <h3 className="font-bold text-slate-100 text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>{config.mode === 'LISTENER' ? 'LISTENER SOCKET PARAMETERS' : 'NEXIM CENTRAL SERVER PARAMETERS'}</span>
            </h3>

            {config.mode === 'LISTENER' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Port */}
                <div>
                  <label className="block text-[10.5px] text-slate-400 mb-1 font-mono uppercase tracking-wider">
                    TCP Listening Port
                  </label>
                  <input
                    type="number"
                    value={config.port}
                    onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value, 10) || 30040 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-[var(--mes-radius)] px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500 tabular-nums"
                    placeholder="30040"
                  />
                  <div className="flex gap-1 mt-1">
                    {[30040, 30041, 5000].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setConfig({ ...config, port: p })}
                        className="text-[9.5px] font-mono px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 tabular-nums"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subnet Whitelist */}
                <div>
                  <label className="block text-[10.5px] text-slate-400 mb-1 font-mono uppercase tracking-wider">
                    Subnet / IP Whitelist
                  </label>
                  <input
                    type="text"
                    value={config.allowedSubnets.join(', ')}
                    onChange={(e) => setConfig({
                      ...config,
                      allowedSubnets: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-[var(--mes-radius)] px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    placeholder="*, 192.168.1.0/24"
                  />
                  <div className="flex gap-1 mt-1">
                    {['*', '192.168.0.0/16', '127.0.0.1'].map((rule) => (
                      <button
                        key={rule}
                        type="button"
                        onClick={() => setConfig({ ...config, allowedSubnets: [rule] })}
                        className="text-[9.5px] font-mono px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800"
                      >
                        {rule === '*' ? '* (All Subnets)' : rule}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Idle Timeout */}
                <div>
                  <label className="block text-[10.5px] text-slate-400 mb-1 font-mono uppercase tracking-wider">
                    Idle Socket Timeout
                  </label>
                  <select
                    value={config.idleTimeoutSeconds}
                    onChange={(e) => setConfig({ ...config, idleTimeoutSeconds: parseInt(e.target.value, 10) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-[var(--mes-radius)] px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value={0}>0 (Disabled - Infinite Keepalive)</option>
                    <option value={30}>30 seconds (Default OT Spec)</option>
                    <option value={60}>60 seconds</option>
                    <option value={120}>120 seconds (2 Minutes)</option>
                    <option value={300}>300 seconds (5 Minutes)</option>
                  </select>
                  <p className="text-[9.5px] text-slate-400 mt-1 font-mono">
                    0 prevents dropping idle connections during machine setup
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Target Host IP */}
                <div>
                  <label className="block text-[10.5px] text-slate-400 mb-1 font-mono uppercase tracking-wider">
                    Nexim Central Server IP / Host
                  </label>
                  <input
                    type="text"
                    value={config.clientTargetHost}
                    onChange={(e) => setConfig({ ...config, clientTargetHost: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-[var(--mes-radius)] px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500 tabular-nums"
                    placeholder="192.168.1.100"
                  />
                </div>

                {/* Target Port */}
                <div>
                  <label className="block text-[10.5px] text-slate-400 mb-1 font-mono uppercase tracking-wider">
                    Nexim Port
                  </label>
                  <input
                    type="number"
                    value={config.clientTargetPort}
                    onChange={(e) => setConfig({ ...config, clientTargetPort: parseInt(e.target.value, 10) || 30040 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-[var(--mes-radius)] px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500 tabular-nums"
                    placeholder="30040"
                  />
                </div>

                {/* Machine Name */}
                <div>
                  <label className="block text-[10.5px] text-slate-400 mb-1 font-mono uppercase tracking-wider">
                    Machine Name / ID
                  </label>
                  <input
                    type="text"
                    value={config.machineName}
                    onChange={(e) => setConfig({ ...config, machineName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-[var(--mes-radius)] px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    placeholder="NXTR1"
                  />
                </div>

                {/* Connection Ping Probe */}
                <div className="sm:col-span-3 flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTestingPing}
                    className="px-3 py-1 bg-slate-950 hover:bg-slate-850 text-cyan-300 rounded-[var(--mes-radius)] border border-cyan-700/60 font-mono text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Zap className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-bounce text-amber-400' : 'text-cyan-400'}`} />
                    <span>{isTestingPing ? 'Testing Reachability...' : 'Test TCP Reachability'}</span>
                  </button>

                  {pingResult && (
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      {pingResult.success ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Reachable ({pingResult.latencyMs}ms)
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Unreachable: {pingResult.error}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Live Wire Frame Log Terminal */}
          <div className="bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] flex flex-col overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-slate-100 text-[11px] font-mono tracking-wider uppercase">
                  LIVE OT WIRE FRAME LOG (STX / ETX)
                </span>
                <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                  [{wireLogs.length} events buffered]
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10.5px] font-mono">
                <label className="flex items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={autoRefreshLogs}
                    onChange={(e) => setAutoRefreshLogs(e.target.checked)}
                    className="rounded-[var(--mes-radius)] bg-slate-950 border-slate-700"
                  />
                  <span>Auto-Refresh (1.5s)</span>
                </label>

                <button
                  onClick={handleClearLogs}
                  className="px-2 py-0.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-rose-300 rounded-[var(--mes-radius)] border border-slate-800 font-mono text-[10px] transition-colors"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Wire Table */}
            <div className="max-h-52 overflow-y-auto font-mono text-[11px]">
              {wireLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-500">
                  <p>No wire frames received yet.</p>
                  <p className="text-[10px] text-slate-600 mt-1">
                    Connect Fuji NXT / AIMEX machine to port {config.port} to view real-time STX/ETX telemetry.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 bg-slate-950 uppercase tracking-wider">
                      <th className="py-1 px-2.5">TIME</th>
                      <th className="py-1 px-2">DIR</th>
                      <th className="py-1 px-2">COMMAND</th>
                      <th className="py-1 px-2">SEQ</th>
                      <th className="py-1 px-2">REMOTE</th>
                      <th className="py-1 px-2.5">SUMMARY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wireLogs.map((log) => {
                      const isSelected = selectedLog?.id === log.id;
                      return (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedLog(isSelected ? null : log)}
                          className={`border-b border-slate-800/60 hover:bg-slate-800/40 cursor-pointer transition-colors ${
                            isSelected ? 'bg-cyan-950/40' : ''
                          }`}
                        >
                          <td className="py-1 px-2.5 text-slate-400 text-[10px] whitespace-nowrap tabular-nums">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-1 px-2 whitespace-nowrap">
                            {log.direction === 'INBOUND' ? (
                              <span className="inline-flex items-center text-emerald-400 text-[10px] font-bold">
                                <ArrowDownLeft className="w-3 h-3 mr-0.5" /> IN
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-cyan-400 text-[10px] font-bold">
                                <ArrowUpRight className="w-3 h-3 mr-0.5" /> OUT
                              </span>
                            )}
                          </td>
                          <td className="py-1 px-2 font-bold text-slate-100 whitespace-nowrap">
                            <span className="px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-slate-950 border border-slate-800 text-[10px]">
                              {log.command}
                            </span>
                          </td>
                          <td className="py-1 px-2 text-slate-400 text-[10px] tabular-nums">
                            {log.seqId}
                          </td>
                          <td className="py-1 px-2 text-slate-400 text-[10px] truncate max-w-[120px] tabular-nums">
                            {log.remoteAddress}
                          </td>
                          <td className="py-1 px-2.5 text-slate-300 text-[10.5px] truncate max-w-[280px]">
                            {log.summary}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Selected Log Inspector */}
            {selectedLog && (
              <div className="p-2.5 bg-slate-950 border-t border-slate-800 font-mono text-[10.5px]">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider">
                    RAW PAYLOAD INSPECTION ({selectedLog.command})
                  </span>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    Close Preview
                  </button>
                </div>
                <pre className="bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-2 text-emerald-400 whitespace-pre-wrap break-all max-h-24 overflow-y-auto font-mono">
                  {selectedLog.rawPreview}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer / Action Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800 bg-slate-900 font-mono">
          <div className="flex items-center gap-2">
            {status && (
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <div className={`w-2 h-2 rounded-full ${status.isListening || status.isClientConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-slate-400 uppercase tracking-wider">Current Status:</span>
                <strong className={status.isListening || status.isClientConnected ? 'text-emerald-400' : 'text-rose-400'}>
                  {status.mode === 'LISTENER'
                    ? (status.isListening ? `LISTENING (Port ${status.port}, ${status.activeConnections} active clients)` : 'OFFLINE')
                    : (status.isClientConnected ? `CONNECTED TO ${status.clientTargetHost}:${status.clientTargetPort}` : 'CLIENT DISCONNECTED')}
                </strong>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs animate-fadeIn uppercase tracking-wider">
                <Check className="w-3.5 h-3.5" />
                <span>Configuration Saved & Applied!</span>
              </div>
            )}

            {saveError && (
              <div className="flex items-center gap-1 text-rose-400 font-bold text-xs animate-fadeIn uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{saveError}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1.5 text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-850 border border-slate-700 rounded-[var(--mes-radius)] text-xs font-mono font-bold tracking-wider transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-[var(--mes-radius)] shadow-sm font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Applying Settings...' : 'Save & Apply Configuration'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
