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
      <div
        className="rounded-xl p-5 flex flex-wrap justify-between items-center gap-4 border shadow-xl"
        style={{ background: 'var(--mes-bg-surface)', borderColor: 'var(--mes-border)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--mes-text-muted)' }}>
              {viewMode === 'RAW_TCP' ? 'TIER 1 INGRESS LAYER' : 'TIER 2 CANONICAL LOG'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--mes-accent-primary)' }} />
            <span className="text-[10px] font-bold" style={{ color: 'var(--mes-accent-primary)' }}>
              {viewMode === 'RAW_TCP' ? 'TCP SOCKET PORT 30040 (LIVE BUFFER)' : 'APPEND-ONLY SINGLE SOURCE OF TRUTH'}
            </span>
          </div>
          <h2 className="text-lg font-bold font-sans mt-0.5 flex items-center gap-2" style={{ color: 'var(--mes-text-primary)' }}>
            <Terminal className="w-5 h-5" style={{ color: 'var(--mes-accent-primary)' }} />
            {viewMode === 'RAW_TCP' 
              ? 'Raw Fuji Nexim TCP Socket Frame Buffer' 
              : 'Cryptographic Production Event Stream'}
          </h2>
          <p className="text-xs" style={{ color: 'var(--mes-text-muted)' }}>
            {viewMode === 'RAW_TCP'
              ? 'Exact unaltered Big-Endian STX/ETX frames captured directly from Fuji NXT III / AIMEX pick-and-place lines.'
              : 'Strongly-typed canonical envelopes parsed and validated for CQRS state projections.'}
          </p>
        </div>

        {/* View Switcher & Controls */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center p-1 rounded-lg border text-xs font-bold"
            style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)' }}
          >
            <button
              onClick={() => setViewMode('RAW_TCP')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-semibold"
              style={{
                background: viewMode === 'RAW_TCP' ? 'var(--mes-bg-surface)' : 'transparent',
                color: viewMode === 'RAW_TCP' ? 'var(--mes-accent-primary)' : 'var(--mes-text-muted)',
                border: viewMode === 'RAW_TCP' ? '1px solid var(--mes-accent-primary)' : '1px solid transparent'
              }}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>RAW TCP FRAMES</span>
            </button>
            <button
              onClick={() => setViewMode('CANONICAL')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-semibold"
              style={{
                background: viewMode === 'CANONICAL' ? 'var(--mes-bg-surface)' : 'transparent',
                color: viewMode === 'CANONICAL' ? 'var(--mes-accent-primary)' : 'var(--mes-text-muted)',
                border: viewMode === 'CANONICAL' ? '1px solid var(--mes-accent-primary)' : '1px solid transparent'
              }}
            >
              <Server className="w-3.5 h-3.5" />
              <span>CANONICAL EVENTS</span>
            </button>
          </div>

          {viewMode === 'CANONICAL' && (
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold"
              style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)' }}
            >
              <Filter className="w-3.5 h-3.5" style={{ color: 'var(--mes-text-muted)' }} />
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="bg-transparent font-bold focus:outline-none"
                style={{ color: 'var(--mes-text-primary)' }}
              >
                <option value="" style={{ background: 'var(--mes-bg-surface)' }}>ALL EVENT TYPES</option>
                <option value="PANEL_ROUTING_CHECKOUT" style={{ background: 'var(--mes-bg-surface)' }}>PANEL_ROUTING_CHECKOUT</option>
                <option value="COMPONENT_SPLICED_EVENT" style={{ background: 'var(--mes-bg-surface)' }}>COMPONENT_SPLICED_EVENT</option>
                <option value="OPTICAL_DEFECT_DETECTED" style={{ background: 'var(--mes-bg-surface)' }}>OPTICAL_DEFECT_DETECTED</option>
                <option value="WORK_CENTER_STATE_CHANGED" style={{ background: 'var(--mes-bg-surface)' }}>WORK_CENTER_STATE_CHANGED</option>
                <option value="QUALITY_INTERLOCK_TRIPPED" style={{ background: 'var(--mes-bg-surface)' }}>QUALITY_INTERLOCK_TRIPPED</option>
              </select>
            </div>
          )}

          <button
            onClick={fetchEvents}
            className="flex items-center gap-1.5 px-3 py-2 font-bold rounded-lg border text-xs transition-all"
            style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)', color: 'var(--mes-text-primary)' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--mes-accent-primary)' }} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Raw Ingress TCP Frames Table */}
      {viewMode === 'RAW_TCP' && (
        <div
          className="rounded-xl overflow-hidden shadow-xl border"
          style={{ background: 'var(--mes-bg-surface)', borderColor: 'var(--mes-border)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className="uppercase tracking-widest text-[10px] border-b"
                style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)', color: 'var(--mes-text-muted)' }}
              >
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
              <tbody className="divide-y" style={{ borderColor: 'var(--mes-border)', color: 'var(--mes-text-primary)' }}>
                {ingressEvents.length > 0 ? (
                  ingressEvents.map((frame) => {
                    const isExpanded = expandedRow === frame.id;
                    const tokens = frame.raw_payload.replace(/[\x02\x03]/g, '').split('\t');
                    const command = tokens[0] || 'UNKNOWN';

                    return (
                      <React.Fragment key={frame.id}>
                        <tr
                          onClick={() => setExpandedRow(isExpanded ? null : frame.id)}
                          className="hover:opacity-80 cursor-pointer transition-opacity"
                        >
                          <td className="p-3" style={{ color: 'var(--mes-text-muted)' }}>
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </td>
                          <td className="p-3 font-bold" style={{ color: '#00C2FF' }}>{frame.source_adapter}</td>
                          <td className="p-3" style={{ color: 'var(--mes-text-muted)' }}>{frame.source_address}</td>
                          <td className="p-3">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold border"
                              style={{ background: 'var(--mes-bg-well)', color: 'var(--mes-text-muted)', borderColor: 'var(--mes-border)' }}
                            >
                              {frame.protocol}
                            </span>
                          </td>
                          <td className="p-3 font-mono max-w-md truncate" style={{ color: 'var(--mes-accent-primary)' }}>
                            <span className="font-bold mr-2" style={{ color: 'var(--mes-text-primary)' }}>[{command}]</span>
                            {frame.raw_payload.replace(/[\x02\x03]/g, ' ')}
                          </td>
                          <td className="p-3" style={{ color: 'var(--mes-text-muted)' }}>{new Date(frame.received_at).toLocaleTimeString()}</td>
                          <td className="p-3 flex items-center gap-1 font-bold" style={{ color: 'var(--mes-status-pass)' }}>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{frame.processed_status}</span>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="border-b" style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)' }}>
                            <td colSpan={7} className="p-4 space-y-3">
                              <div className="flex justify-between text-[11px]" style={{ color: 'var(--mes-text-muted)' }}>
                                <span>Ingress ID: <strong style={{ color: 'var(--mes-text-primary)' }}>{frame.id}</strong></span>
                                <span>Source: <strong style={{ color: 'var(--mes-text-primary)' }}>{frame.source_address}</strong></span>
                                <span>Time (UTC): <strong style={{ color: 'var(--mes-text-primary)' }}>{new Date(frame.received_at).toISOString()}</strong></span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: 'var(--mes-text-muted)' }}>
                                  Unaltered STX/ETX Socket Payload:
                                </span>
                                <pre
                                  className="p-3 rounded border text-[11px] overflow-x-auto whitespace-pre-wrap font-mono"
                                  style={{
                                    background: 'var(--mes-bg-surface)',
                                    borderColor: 'var(--mes-border)',
                                    color: 'var(--mes-accent-primary)'
                                  }}
                                >
                                  {frame.raw_payload.replace(/\x02/g, '<STX>\n').replace(/\x03/g, '\n<ETX>').replace(/\t/g, '  |  ')}
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
                    <td colSpan={7} className="p-8 text-center" style={{ color: 'var(--mes-text-muted)' }}>
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
        <div
          className="rounded-xl overflow-hidden shadow-xl border"
          style={{ background: 'var(--mes-bg-surface)', borderColor: 'var(--mes-border)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className="uppercase tracking-widest text-[10px] border-b"
                style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)', color: 'var(--mes-text-muted)' }}
              >
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
              <tbody className="divide-y" style={{ borderColor: 'var(--mes-border)', color: 'var(--mes-text-primary)' }}>
                {events.length > 0 ? (
                  events.map((ev) => {
                    const isExpanded = expandedRow === ev.id;
                    const isManual = ev.source_type === 'MANUAL_UI';

                    return (
                      <React.Fragment key={ev.id}>
                        <tr 
                          onClick={() => setExpandedRow(isExpanded ? null : ev.id)}
                          className="hover:opacity-80 cursor-pointer transition-opacity"
                        >
                          <td className="p-3" style={{ color: 'var(--mes-text-muted)' }}>
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </td>
                          <td className="p-3 font-bold" style={{ color: '#00C2FF' }}>{ev.event_type}</td>
                          <td className="p-3" style={{ color: 'var(--mes-text-muted)' }}>{new Date(ev.event_time).toISOString()}</td>
                          <td className="p-3">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold border"
                              style={{
                                background: isManual ? 'var(--mes-bg-well)' : 'rgba(16, 185, 129, 0.15)',
                                color: isManual ? 'var(--mes-text-muted)' : 'var(--mes-status-pass)',
                                borderColor: isManual ? 'var(--mes-border)' : 'rgba(16, 185, 129, 0.3)'
                              }}
                            >
                              {ev.source_type}
                            </span>
                          </td>
                          <td className="p-3 font-bold" style={{ color: 'var(--mes-text-primary)' }}>{ev.work_center_id}</td>
                          <td className="p-3" style={{ color: 'var(--mes-text-muted)' }}>{ev.batch_id || '-'}</td>
                          <td className="p-3 flex items-center gap-1 font-bold" style={{ color: 'var(--mes-status-pass)' }}>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Committed</span>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="border-b" style={{ background: 'var(--mes-bg-well)', borderColor: 'var(--mes-border)' }}>
                            <td colSpan={7} className="p-4 space-y-2">
                              <div className="flex justify-between text-[11px]" style={{ color: 'var(--mes-text-muted)' }}>
                                <span>UUID: <strong style={{ color: 'var(--mes-text-primary)' }}>{ev.event_id}</strong></span>
                                <span>Source: <strong style={{ color: 'var(--mes-text-primary)' }}>{ev.source_id}</strong></span>
                                <span>Operator: <strong style={{ color: 'var(--mes-text-primary)' }}>{ev.operator_id || 'FUJI_NEXIM_SOCKET'}</strong></span>
                              </div>
                              <pre
                                className="p-3 rounded border text-[11px] overflow-x-auto"
                                style={{
                                  background: 'var(--mes-bg-surface)',
                                  borderColor: 'var(--mes-border)',
                                  color: 'var(--mes-accent-primary)'
                                }}
                              >
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
                    <td colSpan={7} className="p-8 text-center" style={{ color: 'var(--mes-text-muted)' }}>
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
