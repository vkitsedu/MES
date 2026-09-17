import { MesEventEnvelope } from './events';
import { EquipmentState } from './state-machine';

export const FUJI_FRAMING = {
  STX: 0x02,
  ETX: 0x03,
  HEADER_SIZE: 4, // 4-byte Big-Endian total packet length
  DEFAULT_PORTS: {
    CENTRAL_SERVER: 30040,
    SETUP_STATION: 30041,
    PARTS_REGISTRATION: 30042,
    VERIFIER_CLIENT: 30500
  },
  KEEPALIVE_INTERVAL_SEC: 120,
  KEEPALIVE_TIMEOUT_SEC: 30,
  RECIPE_VERIFY_TIMEOUT_SEC: 20,
  SPLICING_VERIFY_TIMEOUT_SEC: 20
};

/**
 * Complete Fuji NEXIM iMES 4.0 Event Catalog (22 Events Subscribed via SETEV).
 */
export const FUJI_IMES_SUBSCRIBED_EVENTS = [
  'MCSTATECHANGEII',
  'MCALARMON',
  'MCALARMOFF',
  'PGCHANGEII',
  'AUTOPGCHANGE',
  'BOMLIST',
  'PCBCHECKIN',
  'PCBCHECKOUTIII',
  'PRODSTARTED',
  'PRODCOMPLETED',
  'PRODSTOPPED',
  'LOADCOMP',
  'UNLOADCOMP',
  'CHANGECOMP',
  'PARTSUSAGE',
  'PARTSREMOVE',
  'PDERROR',
  'RECOVERYUP',
  'NOZZLEUSAGE',
  'NOZZLECOUNT',
  'FEEDERUSAGE',
  'HEADUSAGE'
] as const;

export type FujiCommand =
  | 'SETEV'
  | 'SETEV_ACK'
  | 'STARTEV'
  | 'STARTEV_ACK'
  | 'KEEPALIVE'
  | 'KEEPALIVE_ACK'
  | 'PGCHANGE'
  | 'PGCHANGEII'
  | 'PGCHANGEII_ACK'
  | 'AUTOPGCHANGE'
  | 'AUTOPGCHANGE_ACK'
  | 'BOMLIST'
  | 'BOMLIST_ACK'
  | 'PCBCHECKIN'
  | 'PCBCHECKIN_ACK'
  | 'PCBCHECKOUT'
  | 'PCBCHECKOUTIII'
  | 'PCBCHECKOUTIII_ACK'
  | 'LOADCOMP'
  | 'LOADCOMP_ACK'
  | 'LOADCOMPIV'
  | 'LOADCOMPIV_ACK'
  | 'UNLOADCOMP'
  | 'UNLOADCOMP_ACK'
  | 'CHANGECOMP'
  | 'CHANGECOMP_ACK'
  | 'CHANGECOMPII'
  | 'CHANGECOMPII_ACK'
  | 'PARTSSUPPLY'
  | 'PARTSSUPPLY_ACK'
  | 'PRODSTARTED'
  | 'PRODSTARTED_ACK'
  | 'PRODCOMPLETED'
  | 'PRODCOMPLETED_ACK'
  | 'PRODCOMPLETEII'
  | 'PRODSTOPPED'
  | 'PRODSTOPPED_ACK'
  | 'MCSTATECHANGE'
  | 'MCSTATECHANGEII'
  | 'MCSTATECHANGEII_ACK'
  | 'MCALARMON'
  | 'MCALARMON_ACK'
  | 'MCALARMOFF'
  | 'MCALARMOFF_ACK'
  | 'PARTSUSAGE'
  | 'PARTSUSAGE_ACK'
  | 'PARTSREMOVE'
  | 'PARTSREMOVE_ACK'
  | 'STOPEQUIP'
  | 'RESTARTEQUIP'
  | 'MESSAGETEXT'
  | 'PDERROR'
  | 'PDERROR_ACK'
  | 'RECOVERYUP'
  | 'RECOVERYUP_ACK'
  | 'NOZZLEUSAGE'
  | 'NOZZLEUSAGE_ACK'
  | 'NOZZLECOUNT'
  | 'NOZZLECOUNT_ACK'
  | 'FEEDERUSAGE'
  | 'FEEDERUSAGE_ACK'
  | 'HEADUSAGE'
  | 'HEADUSAGE_ACK';

/**
 * Mapping Fuji machine status code to our canonical EquipmentState.
 * Fuji Code reference:
 * 2: Change Over
 * 3: Idle
 * 4: Loading
 * 5: Run / Product
 * 6: Stop (Error)
 * 7: Wait Next (Downstream Blocked)
 * 8: Wait Parts (Material Starved)
 * 9: Wait Previous (Upstream Starved)
 * 10: Wait Switch
 * 11: Maintenance
 */
export function mapFujiStatusToCanonical(fujiStatus: number | string): {
  state: EquipmentState;
  reasonCategory?: string;
  reasonCode?: string;
} {
  const code = Number(fujiStatus);
  switch (code) {
    case 5: // Run
      return { state: 'RUNNING' };
    case 2: // Change Over
      return { state: 'CHANGEOVER', reasonCategory: 'PROCESS_QUALITY', reasonCode: 'CHANGEOVER_SETUP' };
    case 3: // Idle
    case 10: // Wait Switch
      return { state: 'IDLE' };
    case 4: // Loading
      return { state: 'RUNNING' };
    case 6: // Stop
      return { state: 'STOPPED_UNPLANNED', reasonCategory: 'MECHANICAL', reasonCode: 'MACHINE_ERROR_STOP' };
    case 7: // Wait Next
      return { state: 'STOPPED_PLANNED', reasonCategory: 'PROCESS_QUALITY', reasonCode: 'WAITING_DOWNSTREAM' };
    case 8: // Wait Parts
      return { state: 'STOPPED_PLANNED', reasonCategory: 'MATERIAL', reasonCode: 'MAT_WAITING_RM' };
    case 9: // Wait Previous
      return { state: 'STOPPED_PLANNED', reasonCategory: 'PROCESS_QUALITY', reasonCode: 'WAITING_UPSTREAM' };
    case 11: // Maintenance
      return { state: 'MAINTENANCE', reasonCategory: 'MECHANICAL', reasonCode: 'PREVENTIVE_MAINTENANCE' };
    default:
      return { state: 'IDLE' };
  }
}

/**
 * Structured Multiline Payload Types (Fuji iMES 4.0 Wire Protocol)
 */
export interface FujiPgChangeSlotItem {
  stageNo: number;
  slotNo: number;
  partNumbers: string[];
}

export interface FujiPgChangePayload {
  seqId: number;
  timestamp: string;
  lineName: string;
  machineName: string;
  moduleNo: number;
  laneNo: number;
  programName: string;
  slots: FujiPgChangeSlotItem[];
}

export interface FujiBomItem {
  blockNo: number;
  partNumber: string;
  refDes: string;
}

export interface FujiBomPayload {
  seqId: number;
  timestamp: string;
  lineName: string;
  machineName: string;
  laneNo: number;
  programName: string;
  items: FujiBomItem[];
}

export interface FujiLoadCompItem {
  stageNo: number;
  slotNo: number;
  partNumber: string;
  feederId: string;
  reelId: string;
  vendor?: string;
  lotNo?: string;
  dateCode?: string;
  lightingClass?: string;
  quantity: number;
  supplyMethod?: number;
}

export interface FujiLoadCompPayload {
  seqId: number;
  timestamp: string;
  lineName: string;
  machineName: string;
  moduleNo: number;
  components: FujiLoadCompItem[];
}

export interface FujiLoadCompAckItem {
  stageNo: number;
  slotNo: number;
  result: number; // 0 = OK, 1 = NG
  partNumber: string;
  feederId: string;
  reelId: string;
  remainingTime: number; // MSL minutes
  quantity: number;
}

/**
 * Fuji Management Monitor & SMT Cockpit Analytics Standards
 */
export interface FujiManagementMonitorLineSummary {
  lineId: string;
  lineName: string;
  productName: string;
  jobName: string;
  progressCompleted: number;
  progressTarget: number;
  currentPbr: number; // Placement Balancing Rate e.g. 86.0
  optimizedPbr: number; // e.g. 92.7
  statusState: 'RUN' | 'WAIT_PREV' | 'WAIT_NEXT' | 'STOP' | 'IDLE';
  statusLabel: string; // "Product", "Wait Previous", "Wait Next", "Stop", "Idle"
  statusDurationSeconds: number; // e.g. 358 (00:05:58)
  oee: number; // e.g. 54.6
  availability: number; // e.g. 24.8
  performance: number; // e.g. 265.0
  quality: number; // e.g. 83.1
  spiYieldPct: number; // e.g. 94.6
  firstAoiYieldPct: number; // e.g. 90.2
  secondAoiYieldPct: number; // e.g. 86.0
  estimatedEndTime: string; // e.g. "01/14 23:12"
  deadline: string; // e.g. "01/15 00:22"
  deadlineAlert: boolean;
}

export interface FujiNozzleErrorRanking {
  nozzleAddress: string; // e.g. "NXT2-1-1-20-20"
  machineId: string;
  headId: string;
  errorRatePct: number;
  mispickCount: number;
}

export interface FujiSlotErrorRanking {
  slotAddress: string; // e.g. "NXT3-1-1-0-12"
  feederId: string;
  partNumber: string;
  errorRatePct: number;
  mispickCount: number;
}

export interface SmtMachineFlowItem {
  id: string;
  name: string;
  equipmentCode: string;
  type: 'LASER' | 'PRINTER' | 'SPI' | 'MOUNTER' | 'REFLOW' | 'AOI_PRE' | 'AOI_POST' | 'XRAY';
  towerLamp: 'RUN' | 'WAIT' | 'STOP' | 'NONE';
  cycleTimeSec: number;
  stopCount: number;
  stopTimeMin: number;
  nozzleBypass: boolean;
}

export interface MounterDropRatePpm {
  targetPpm: number; // e.g. 310
  actualPpm: number; // e.g. 288
  status: 'PASS' | 'FAIL';
  totalPickups: number;
  totalErrors: number;
  recogErrors: number;
  pickupErrors: number;
  recogDropRatePpm: number;
  pickupDropRatePpm: number;
}

export interface ShiftDropMatrixItem {
  shiftCode: string; // "Shift 1", "Shift 2", "Shift 3", "TOTAL"
  pickups: number;
  totalErrors: number;
  recogErrors: number;
  pickupErrors: number;
  dropRatePpm: number;
  recogDropRatePpm: number;
  pickupDropRatePpm: number;
}

/**
 * Universal interface that any industrial connector (Fuji, Modbus, OPC-UA, MQTT) must satisfy.
 */
export interface IFactoryIntegrationAdapter {
  readonly adapterName: string;
  readonly sourceType: 'INTEGRATION_SOCKET';
  
  parseRawFrame(buffer: Buffer): { command: FujiCommand; seqId: number; payloadRaw: string; tokens?: string[] } | null;
  toCanonicalEvent(command: FujiCommand, seqId: number, parsedData: Record<string, any>, workCenterId: string): MesEventEnvelope | null;
  buildAckFrame(command: FujiCommand, seqId: number, resultOk: boolean, extraFields?: string[]): Buffer;
}

