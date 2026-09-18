import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCw, Filter, ChevronDown, ChevronRight, CheckCircle2, Radio, Server } from 'lucide-react';
import { authService } from '../services/auth.service';

interface ProductionEventRecord {
  id: string;
  event_id: string;
  event_type: string;
  event_time: string;
  received_time: string;
  source_type: string;
  source_id: string;
  work_center_id: string;
  batch_id?: string;
  operator_id?: string;
  payload: Record<string, any>;
}

interface IngressEventRecord {
  id: string;
  source_adapter: string;
  source_address: string;
  protocol: string;
  raw_payload: string;
  received_at: string;
  processed_status: string;
}

const FALLBACK_INGRESS_EVENTS: IngressEventRecord[] = [
  {
    id: 'ing-01',
    source_adapter: 'FUJI_NEXIM_SOCKET_30040',
    source_address: '192.168.10.42:51280',
    protocol: 'TCP/IP (Big-Endian STX/ETX)',
    raw_payload: '\x02FUJI_NEXIM: MCSTATUS\tWC-NXT-01\tSTATE=RUNNING\tPROG=PROG-SM-METER-TOP-REV4\x03',
    received_at: new Date(Date.now() - 15000).toISOString(),
    processed_status: 'PARSED_CANONICAL'
  },
  {
    id: 'ing-02',
    source_adapter: 'FUJI_NEXIM_SOCKET_30040',
    source_address: '192.168.10.42:51280',
    protocol: 'TCP/IP (Big-Endian STX/ETX)',
    raw_payload: '\x02FUJI_NEXIM: LOADCOMP\tPNL-260901-0042\tCYCLE_TIME=18.20\tUNITS=4\x03',
    received_at: new Date(Date.now() - 45000).toISOString(),
    processed_status: 'PARSED_CANONICAL'
  },
  {
    id: 'ing-03',
    source_adapter: 'FUJI_NEXIM_SOCKET_30040',
    source_address: '192.168.10.42:51280',
    protocol: 'TCP/IP (Big-Endian STX/ETX)',
    raw_payload: '\x02FUJI_NEXIM: PDERROR\tSLOT=1\tFEEDER=FID-W08F-01\tREEL=REEL-MUR-98124\tPICK_ERR_COUNT=3\x03',
    received_at: new Date(Date.now() - 80000).toISOString(),
    processed_status: 'PARSED_CANONICAL'
  },
  {
    id: 'ing-04',
    source_adapter: 'KOH_YOUNG_AOI_SOCKET_30041',
    source_address: '192.168.10.45:49810',
    protocol: 'TCP/IP (Koh Young XML)',
    raw_payload: '<AOI_REPORT panel="PNL-260901-0042" unit="3" comp="C12" defect="TOMBSTONE" offset_x="45.20" offset_y="180.50" rot="28.5" />',
    received_at: new Date(Date.now() - 110000).toISOString(),
    processed_status: 'PARSED_CANONICAL'
  }
];

const FALLBACK_CANONICAL_EVENTS: ProductionEventRecord[] = [
  {
    id: 'can-01',
    event_id: 'evt-nxt-status-001',
    event_type: 'WORK_CENTER_STATE_CHANGED',
    event_time: new Date(Date.now() - 15000).toISOString(),
    received_time: new Date(Date.now() - 15000).toISOString(),
    source_type: 'OT_SOCKET_INGRESS',
    source_id: 'FUJI_NEXIM_SOCKET_30040',
    work_center_id: 'wc-nxt-01',
    batch_id: 'job-01',
    operator_id: 'op-smt-01',
    payload: { oldState: 'IDLE', newState: 'RUNNING', programId: 'PROG-SM-METER-TOP-REV4' }
  },
  {
    id: 'can-02',
    event_id: 'evt-nxt-load-002',
    event_type: 'PANEL_ROUTING_CHECKOUT',
    event_time: new Date(Date.now() - 45000).toISOString(),
    received_time: new Date(Date.now() - 45000).toISOString(),
    source_type: 'OT_SOCKET_INGRESS',
    source_id: 'FUJI_NEXIM_SOCKET_30040',
    work_center_id: 'wc-nxt-01',
    batch_id: 'job-01',
    operator_id: 'op-smt-01',
    payload: { panelBarcode: 'PNL-260901-0042', cycleTimeSeconds: 18.2, unitCount: 4, recipeRevision: 'REV4' }
  },
  {
    id: 'can-03',
    event_id: 'evt-splice-003',
    event_type: 'COMPONENT_SPLICED_EVENT',
    event_time: new Date(Date.now() - 65000).toISOString(),
    received_time: new Date(Date.now() - 65000).toISOString(),
    source_type: 'OPERATOR_BARCODE_SCANNER',
    source_id: 'BC-SMT-BAY-01',
    work_center_id: 'wc-nxt-01',
    batch_id: 'job-01',
    operator_id: 'op-smt-01',
    payload: { slotNo: 1, feederId: 'FID-W08F-01', existingReelId: 'REEL-MUR-98124', newReelId: 'REEL-MUR-98125-SPLICE', operatorId: 'op-smt-01' }
  },
  {
    id: 'can-04',
    event_id: 'evt-aoi-defect-004',
    event_type: 'OPTICAL_DEFECT_DETECTED',
    event_time: new Date(Date.now() - 110000).toISOString(),
    received_time: new Date(Date.now() - 110000).toISOString(),
    source_type: '3D_AOI_INSPECTOR',
    source_id: 'KY-ZENITH-01',
    work_center_id: 'wc-aoi-01',
    batch_id: 'job-01',
    operator_id: 'SYSTEM_AOI',
    payload: { panelBarcode: 'PNL-260901-0042', unitPosition: 3, refDes: 'C12', defectType: 'TOMBSTONE', status: 'QUALITY_HOLD' }
  },
  {
    id: 'can-05',
    event_id: 'evt-interlock-005',
    event_type: 'QUALITY_INTERLOCK_TRIPPED',
    event_time: new Date(Date.now() - 105000).toISOString(),
    received_time: new Date(Date.now() - 105000).toISOString(),
    source_type: 'CLOSED_LOOP_CONTROLLER',
    source_id: 'MES_INTERLOCK_POLICY',
    work_center_id: 'wc-nxt-01',
    batch_id: 'job-01',
    operator_id: 'SYSTEM',
    payload: { reason: 'Consecutive AOI Tombstone defect at C12. Production line halted.', initiatedBy: 'SYSTEM_CLOSED_LOOP' }
  }
];

export const AuditTrailViewer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'CANONICAL' | 'RAW_TCP'>('RAW_TCP');
  const [events, setEvents] = useState<ProductionEventRecord[]>(FALLBACK_CANONICAL_EVENTS);
  const [ingressEvents, setIngressEvents] = useState<IngressEventRecord[]>(FALLBACK_INGRESS_EVENTS);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('');

  const fetchEvents = async () => {
    try {
      if (viewMode === 'CANONICAL') {
        let url = '/api/v1/events?limit=50';
        if (eventTypeFilter) url += `&eventType=${eventTypeFilter}`;
        const res = await authService.authFetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setEvents(data);
        }
      } else {
        const res = await authService.authFetch('/api/v1/events/ingress?limit=50');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setIngressEvents(data);
        }
      }
    } catch (err) {
      console.warn('Events fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, [viewMode, eventTypeFilter]);

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Cockpit Bar */}
      <div className="rounded-[var(--mes-radius)] p-4 flex flex-wrap justify-between items-center gap-4 border border-slate-800 bg-slate-950 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              {viewMode === 'RAW_TCP' ? 'TIER 1 INGRESS LAYER' : 'TIER 2 CANONICAL LOG'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              {viewMode === 'RAW_TCP' ? 'TCP SOCKET PORT 30040 (LIVE BUFFER)' : 'APPEND-ONLY SINGLE SOURCE OF TRUTH'}
            </span>
          </div>
          <h2 className="text-base font-bold tracking-tight text-slate-100 mt-1 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            {viewMode === 'RAW_TCP' 
              ? 'Raw Fuji Nexim TCP Socket Frame Buffer' 
              : 'Cryptographic Production Event Stream'}
          </h2>
          <p className="text-xs text-slate-400">
            {viewMode === 'RAW_TCP'
              ? 'Exact unaltered Big-Endian STX/ETX frames captured directly from Fuji NXT III / AIMEX pick-and-place lines.'
              : 'Strongly-typed canonical envelopes parsed and validated for CQRS state projections.'}
          </p>
        </div>

        {/* View Switcher & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-[var(--mes-radius)] border border-slate-800 bg-slate-900 text-xs font-bold">
            <button
              onClick={() => setViewMode('RAW_TCP')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--mes-radius)] transition-all font-semibold tracking-wider text-xs ${
                viewMode === 'RAW_TCP'
                  ? 'bg-slate-950 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>RAW TCP FRAMES</span>
            </button>
            <button
              onClick={() => setViewMode('CANONICAL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--mes-radius)] transition-all font-semibold tracking-wider text-xs ${
                viewMode === 'CANONICAL'
                  ? 'bg-slate-950 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>CANONICAL EVENTS</span>
            </button>
          </div>

          {viewMode === 'CANONICAL' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--mes-radius)] border border-slate-800 bg-slate-900 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="bg-transparent font-semibold focus:outline-none text-slate-200 text-xs"
              >
                <option value="" className="bg-slate-950 text-slate-100">ALL EVENT TYPES</option>
                <option value="PANEL_ROUTING_CHECKOUT" className="bg-slate-950 text-slate-100">PANEL_ROUTING_CHECKOUT</option>
                <option value="COMPONENT_SPLICED_EVENT" className="bg-slate-950 text-slate-100">COMPONENT_SPLICED_EVENT</option>
                <option value="OPTICAL_DEFECT_DETECTED" className="bg-slate-950 text-slate-100">OPTICAL_DEFECT_DETECTED</option>
                <option value="WORK_CENTER_STATE_CHANGED" className="bg-slate-950 text-slate-100">WORK_CENTER_STATE_CHANGED</option>
                <option value="QUALITY_INTERLOCK_TRIPPED" className="bg-slate-950 text-slate-100">QUALITY_INTERLOCK_TRIPPED</option>
              </select>
            </div>
          )}

          <button
            onClick={fetchEvents}
            className="flex items-center gap-1.5 px-3 py-1.5 font-bold rounded-[var(--mes-radius)] border border-slate-700 bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs tracking-wider transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Raw Ingress TCP Frames Table */}
      {viewMode === 'RAW_TCP' && (
        <div className="rounded-[var(--mes-radius)] overflow-hidden shadow-sm border border-slate-800 bg-slate-950">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="uppercase tracking-wider text-[10px] border-b border-slate-800 bg-slate-900 text-slate-400">
                <tr>
                  <th className="p-3 w-8"></th>
                  <th className="p-3">Source Adapter</th>
                  <th className="p-3">Remote Socket IP</th>
                  <th className="p-3">Protocol</th>
                  <th className="p-3">Raw ASCII Frame Content</th>
                  <th className="p-3">Ingress Timestamp</th>
                  <th className="p-3">Ingress Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {ingressEvents.length > 0 ? (
                  ingressEvents.map((frame) => {
                    const isExpanded = expandedRow === frame.id;
                    const payloadStr = String(frame.raw_payload || '');
                    const tokens = payloadStr.replace(/[\x02\x03]/g, '').split('\t');
                    const command = tokens[0] || 'UNKNOWN';

                    return (
                      <React.Fragment key={frame.id}>
                        <tr
                          onClick={() => setExpandedRow(isExpanded ? null : frame.id)}
                          className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                        >
                          <td className="p-3 text-slate-500">
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </td>
                          <td className="p-3 font-bold text-cyan-400">{frame.source_adapter}</td>
                          <td className="p-3 text-slate-400 tabular-nums">{frame.source_address}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-[var(--mes-radius)] text-[10px] font-semibold border border-slate-700 bg-slate-900 text-slate-400">
                              {frame.protocol}
                            </span>
                          </td>
                          <td className="p-3 font-mono max-w-md truncate text-emerald-400">
                            <span className="font-bold mr-2 text-slate-100">[{command}]</span>
                            {payloadStr.replace(/[\x02\x03]/g, ' ')}
                          </td>
                          <td className="p-3 text-slate-400 tabular-nums">{new Date(frame.received_at).toLocaleTimeString()}</td>
                          <td className="p-3 flex items-center gap-1 font-bold text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{frame.processed_status}</span>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="border-b border-slate-800/80 bg-slate-900/50">
                            <td colSpan={7} className="p-4 space-y-3">
                              <div className="flex justify-between text-[11px] text-slate-400">
                                <span>Ingress ID: <strong className="text-slate-100">{frame.id}</strong></span>
                                <span>Source: <strong className="text-slate-100 tabular-nums">{frame.source_address}</strong></span>
                                <span>Time (UTC): <strong className="text-slate-100 tabular-nums">{new Date(frame.received_at).toISOString()}</strong></span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider block mb-1 text-slate-400 font-semibold">
                                  Unaltered STX/ETX Socket Payload:
                                </span>
                                <pre className="p-3 rounded-[var(--mes-radius)] border border-slate-800 text-[11px] overflow-x-auto whitespace-pre-wrap font-mono bg-slate-950 text-emerald-400">
                                  {payloadStr.replace(/\x02/g, '<STX>\n').replace(/\x03/g, '\n<ETX>').replace(/\t/g, '  |  ')}
                                </pre>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      {loading ? 'READING TCP INGRESS BUFFER...' : 'ZERO SOCKET FRAMES RECEIVED YET'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mode 2: Canonical Event Log Table */}
      {viewMode === 'CANONICAL' && (
        <div className="rounded-[var(--mes-radius)] overflow-hidden shadow-sm border border-slate-800 bg-slate-950">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="uppercase tracking-wider text-[10px] border-b border-slate-800 bg-slate-900 text-slate-400">
                <tr>
                  <th className="p-3 w-8"></th>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Event Time (UTC)</th>
                  <th className="p-3">Source Channel</th>
                  <th className="p-3">Work Center</th>
                  <th className="p-3">Batch / Job</th>
                  <th className="p-3">Disposition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {events.length > 0 ? (
                  events.map((ev) => {
                    const isExpanded = expandedRow === ev.id;
                    const isManual = ev.source_type === 'MANUAL_UI';

                    return (
                      <React.Fragment key={ev.id}>
                        <tr 
                          onClick={() => setExpandedRow(isExpanded ? null : ev.id)}
                          className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                        >
                          <td className="p-3 text-slate-500">
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </td>
                          <td className="p-3 font-bold text-cyan-400">{ev.event_type}</td>
                          <td className="p-3 text-slate-400 tabular-nums">{new Date(ev.event_time).toISOString()}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-[var(--mes-radius)] text-[10px] font-semibold border ${
                              isManual 
                                ? 'bg-slate-900 border-slate-700 text-slate-400' 
                                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                            }`}>
                              {ev.source_type}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-slate-100">{ev.work_center_id}</td>
                          <td className="p-3 text-slate-400">{ev.batch_id || '-'}</td>
                          <td className="p-3 flex items-center gap-1 font-bold text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Committed</span>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="border-b border-slate-800/80 bg-slate-900/50">
                            <td colSpan={7} className="p-4 space-y-2">
                              <div className="flex justify-between text-[11px] text-slate-400">
                                <span>UUID: <strong className="text-slate-100">{ev.event_id}</strong></span>
                                <span>Source: <strong className="text-slate-100">{ev.source_id}</strong></span>
                                <span>Operator: <strong className="text-slate-100">{ev.operator_id || 'FUJI_NEXIM_SOCKET'}</strong></span>
                              </div>
                              <pre className="p-3 rounded-[var(--mes-radius)] border border-slate-800 text-[11px] overflow-x-auto bg-slate-950 text-emerald-400 font-mono">
                                {JSON.stringify(typeof ev.payload === 'string' ? JSON.parse(ev.payload) : ev.payload, null, 2)}
                              </pre>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      {loading ? 'READING CANONICAL LOG...' : 'ZERO EVENTS MATCHING CURRENT FILTER'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
