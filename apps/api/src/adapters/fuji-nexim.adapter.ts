import net from 'net';
import {
  FUJI_FRAMING,
  FujiCommand,
  IFactoryIntegrationAdapter,
  mapFujiStatusToCanonical,
  MesEventEnvelope,
  FujiLoadCompAckItem,
  FUJI_IMES_SUBSCRIBED_EVENTS
} from '@mes/shared';
import { EventIngestionService } from '../services/event-ingestion.service';
import { SplicingAuthorizationService } from '../services/splicing-authorization.service';
import { getDatabase } from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import { IpFirewall } from '../security/ip-firewall';
import { SecretsConfigManager } from '../config/secrets';
import { ProductionHoldService } from '../services/production-hold.service';

import {
  IControllableEquipmentAdapter,
  EquipmentAdapterStatus,
  MachineCapability,
  MachineParameterCommand,
  MachineActionCommand
} from './equipment-adapter.interface';

export interface FujiMachineMapping {
  machineId: string;
  workCenterId: string;
  lineId: string;
  ipAddress?: string;
}

export interface FujiWireLogCallbackPayload {
  direction: 'INBOUND' | 'OUTBOUND';
  remoteAddress: string;
  command: string;
  seqId: number;
  summary: string;
  rawPreview: string;
}

export type FujiWireLogCallback = (payload: FujiWireLogCallbackPayload) => void;

/**
 * Production Fuji Nexim TCP Socket Gateway.
 * Implements the Fuji Host Interface Specification V2.8.0.
 * Decodes Big-Endian length + STX (0x02) / ETX (0x03) packets.
 * Includes stream frame accumulator for fragmented/coalesced TCP packets.
 * Includes closed-loop Splicing Verification Interlock (ADR-003 decoupled).
 *
 * =========================================================================================
 * MANDATORY OT NETWORK COMPENSATING CONTROLS (IEC 62443 / Defense-in-Depth):
 * Standard OEM Fuji Nexim SMT equipment controllers (NXT III, AIMEX) run proprietary wire
 * protocols and firmware that do NOT support custom TLS or application-level authentication.
 * Modifying the OEM wire format with custom handshakes would break line controller interop.
 * Therefore, deployment requires strict network-level compensating controls:
 * 1. Dedicated OT VLAN / Interface: The gateway socket (port 30040) binds strictly to an
 *    isolated physical OT machine network (e.g. 192.168.40.0/24) with no route to enterprise LAN
 *    or public Internet.
 * 2. Hardware Industrial Firewall: Strict Layer-3/4 stateful inspection between IT and OT segments,
 *    blocking all traffic except authorized machine controller IPs.
 * 3. Monitored IP Allowlist (IpFirewall): Layer-4 ingress enforcement validating remote IP
 *    against configured machine controller CIDR blocks before socket acceptance.
 * 4. Protocol-Safe Defensive Framing: Strict 64KB accumulator limit, declared length bounds
 *    (2 <= totalLength <= 65536), sync header (STX) validation, and 30-second idle socket timeout.
 * =========================================================================================
 */
export class FujiNeximAdapter implements IFactoryIntegrationAdapter, IControllableEquipmentAdapter {
  readonly id = 'fuji-nxt-01';
  readonly name = 'Fuji NXT III Placement Gateway';
  readonly protocolName = 'Fuji Nexim Host Interface V2.8.0';
  readonly workCenterId = 'wc-nxt-01';
  readonly adapterId = 'FujiNeximAdapter';
  readonly adapterName = 'FujiNeximAdapter';
  readonly sourceType = 'INTEGRATION_SOCKET';
  private server: net.Server | null = null;
  private isRunning = false;
  private activePort: number = 30040;
  private activeConnections: number = 0;
  private framesProcessedTotal: number = 0;
  private lastFrameReceivedAt?: string;
  public static readonly MAX_SOCKET_BUFFER: number = 64 * 1024; // 64KB max buffer guard against memory exhaustion DoS
  public static readonly IDLE_TIMEOUT_MS: number = 30000; // 30-second socket timeout to prevent hung connections
  private customIdleTimeoutMs: number = FujiNeximAdapter.IDLE_TIMEOUT_MS;
  private customAllowedSubnets: string[] | null = null;
  private activeSockets: Set<net.Socket> = new Set();
  private wireLogCallback: FujiWireLogCallback | null = null;
  private machineRegistry: Map<string, FujiMachineMapping> = new Map();

  public setWireLogCallback(cb: FujiWireLogCallback | null): void {
    this.wireLogCallback = cb;
  }

  private logWire(payload: FujiWireLogCallbackPayload): void {
    if (this.wireLogCallback) {
      try {
        this.wireLogCallback(payload);
      } catch (err) {
        // Suppress logging error
      }
    }
  }

  private writeAndLog(socket: net.Socket, frame: Buffer, command: string, seqId: number, summary: string): void {
    this.logWire({
      direction: 'OUTBOUND',
      remoteAddress: `${socket.remoteAddress || '127.0.0.1'}:${socket.remotePort || 0}`,
      command,
      seqId,
      summary,
      rawPreview: frame.toString('utf-8').substring(0, 300)
    });
    socket.write(frame);
  }

  private get siteId(): string {
    return process.env.MES_SITE_ID || 'SITE-NOIDA-P4';
  }

  constructor() {
    // Check if dynamic configuration is provided via JSON in environment
    if (process.env.FUJI_MACHINE_MAPPINGS) {
      try {
        const parsed = JSON.parse(process.env.FUJI_MACHINE_MAPPINGS);
        if (Array.isArray(parsed)) {
          for (const m of parsed) {
            this.registerMachineMapping(m);
          }
          return;
        }
      } catch (err) {
        console.warn('[Fuji Gateway] Failed to parse FUJI_MACHINE_MAPPINGS env var, falling back to defaults.');
      }
    }

    // Default pre-registered SMT lines
    this.registerMachineMapping({
      machineId: process.env.FUJI_NXT01_MACHINE_ID || 'NXT01',
      workCenterId: 'wc-nxt-01',
      lineId: 'line-smt-01',
      ipAddress: process.env.FUJI_NXT01_IP || '192.168.10.42'
    });
    this.registerMachineMapping({
      machineId: process.env.FUJI_NXT02_MACHINE_ID || 'NXT02',
      workCenterId: 'wc-nxt-02',
      lineId: 'line-smt-02',
      ipAddress: process.env.FUJI_NXT02_IP || '192.168.10.43'
    });
  }

  public registerMachineMapping(mapping: FujiMachineMapping): void {
    const key = mapping.machineId.toUpperCase();
    this.machineRegistry.set(key, mapping);
    if (mapping.workCenterId) {
      this.machineRegistry.set(mapping.workCenterId.toLowerCase(), mapping);
    }
    if (mapping.ipAddress) {
      const cleanIp = mapping.ipAddress.replace(/^::ffff:/, '');
      this.machineRegistry.set(cleanIp, mapping);
    }
  }

  public getRegisteredMachines(): FujiMachineMapping[] {
    const unique = new Map<string, FujiMachineMapping>();
    for (const mapping of this.machineRegistry.values()) {
      unique.set(mapping.machineId, mapping);
    }
    return Array.from(unique.values());
  }

  public resolveMachineContext(clientIp: string, machineName?: string): FujiMachineMapping {
    const cleanIp = clientIp.replace(/^::ffff:/, '');

    if (machineName) {
      const key = machineName.toUpperCase();
      if (this.machineRegistry.has(key)) {
        return this.machineRegistry.get(key)!;
      }
      const lowerKey = machineName.toLowerCase();
      if (this.machineRegistry.has(lowerKey)) {
        return this.machineRegistry.get(lowerKey)!;
      }
    }

    if (this.machineRegistry.has(cleanIp)) {
      return this.machineRegistry.get(cleanIp)!;
    }

    // Dynamic resolution based on machine identifier pattern
    if (machineName && (machineName.includes('02') || machineName.includes('2'))) {
      return {
        machineId: machineName,
        workCenterId: 'wc-nxt-02',
        lineId: 'line-smt-02',
        ipAddress: cleanIp
      };
    }

    return {
      machineId: machineName || 'NXT01',
      workCenterId: this.workCenterId,
      lineId: 'line-smt-01',
      ipAddress: cleanIp
    };
  }

  public setAllowedSubnets(subnets: string[] | null): void {
    this.customAllowedSubnets = subnets;
  }

  public setIdleTimeout(ms: number): void {
    this.customIdleTimeoutMs = ms;
  }

  public getIdleTimeout(): number {
    return this.customIdleTimeoutMs;
  }

  /**
   * Streaming TCP Frame Extractor.
   * Handles arbitrary packet segmentation, chunk fragmentation, and packet coalescing.
   * Extracts all complete STX/ETX frames from the buffer and returns them alongside the unconsumed remainder.
   */
  public static extractFrames(buffer: Buffer): { frames: Buffer[]; remainder: Buffer } {
    const frames: Buffer[] = [];
    let offset = 0;

    while (buffer.length - offset >= FUJI_FRAMING.HEADER_SIZE) {
      const totalLength = buffer.readUInt32BE(offset);

      // Declared Length Guard: totalLength must be between 2 (STX+ETX) and MAX_SOCKET_BUFFER (64KB)
      if (totalLength < 2 || totalLength > FujiNeximAdapter.MAX_SOCKET_BUFFER) {
        break;
      }

      // Sync Header Guard: when at least 5 bytes are present from offset, verify byte 4 is STX (0x02)
      if (buffer.length - offset >= FUJI_FRAMING.HEADER_SIZE + 1) {
        const stx = buffer[offset + FUJI_FRAMING.HEADER_SIZE];
        if (stx !== FUJI_FRAMING.STX) {
          break;
        }
      }

      const fullFrameSize = FUJI_FRAMING.HEADER_SIZE + totalLength;
      if (buffer.length - offset < fullFrameSize) {
        // Incomplete frame; wait for additional TCP chunks
        break;
      }

      const stx = buffer[offset + FUJI_FRAMING.HEADER_SIZE];
      const etx = buffer[offset + fullFrameSize - 1];

      if (stx === FUJI_FRAMING.STX && etx === FUJI_FRAMING.ETX) {
        // Complete, valid frame
        frames.push(buffer.subarray(offset, offset + fullFrameSize));
        offset += fullFrameSize;
      } else {
        // Corrupted frame boundary: break to prevent desynchronized processing
        break;
      }
    }

    return {
      frames,
      remainder: buffer.subarray(offset)
    };
  }

  public parseRawFrame(buffer: Buffer): { command: FujiCommand; seqId: number; payloadRaw: string; tokens: string[]; lines?: string[] } | null {
    if (buffer.length < FUJI_FRAMING.HEADER_SIZE + 2) return null;

    const totalLength = buffer.readUInt32BE(0);
    if (buffer.length < FUJI_FRAMING.HEADER_SIZE + totalLength) return null;

    const stx = buffer[FUJI_FRAMING.HEADER_SIZE];
    const etx = buffer[FUJI_FRAMING.HEADER_SIZE + totalLength - 1];
    if (stx !== FUJI_FRAMING.STX || etx !== FUJI_FRAMING.ETX) return null;

    const bodyStr = buffer.toString('utf-8', FUJI_FRAMING.HEADER_SIZE + 1, FUJI_FRAMING.HEADER_SIZE + totalLength - 1);
    const lines = bodyStr.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) return null;

    const headerLine = lines[0];
    const isComma = headerLine.includes(',');
    const tokens = isComma
      ? headerLine.split(',').map(s => s.trim())
      : headerLine.split('\t');

    if (tokens.length < 2) return null;

    const command = tokens[0] as FujiCommand;
    const seqId = parseInt(tokens[1], 10) || 0;
    const payloadRaw = lines.length > 1 ? lines.slice(1).join('\n') : tokens.slice(2).join(isComma ? ',' : '\t');

    return { command, seqId, payloadRaw, tokens, lines };
  }

  public toCanonicalEvent(
    command: FujiCommand,
    seqId: number,
    parsedData: Record<string, any>,
    workCenterId: string
  ): MesEventEnvelope | null {
    const now = new Date().toISOString();

    switch (command) {
      case 'MCSTATECHANGE': {
        const canonical = mapFujiStatusToCanonical(parsedData.currentStatus);
        return {
          eventId: uuidv4(),
          eventType: 'STATE_CHANGED',
          eventTime: parsedData.time || now,
          receivedTime: now,
          sourceType: 'INTEGRATION_SOCKET',
          sourceId: `fuji-${parsedData.machineName || 'nxt'}`,
          sequenceId: seqId,
          siteId: this.siteId,
          workCenterId,
          payload: {
            previousState: mapFujiStatusToCanonical(parsedData.previousStatus).state,
            currentState: canonical.state,
            reasonCategory: canonical.reasonCategory,
            reasonCode: canonical.reasonCode,
            comment: `Fuji Machine State Transition: ${parsedData.previousStatus} -> ${parsedData.currentStatus}`
          }
        };
      }

      case 'PRODSTARTED': {
        return {
          eventId: uuidv4(),
          eventType: 'PANEL_CHECKIN',
          eventTime: parsedData.time || now,
          receivedTime: now,
          sourceType: 'INTEGRATION_SOCKET',
          sourceId: `fuji-${parsedData.machineName || 'nxt'}`,
          sequenceId: seqId,
          siteId: this.siteId,
          workCenterId,
          payload: {
            panelBarcode: parsedData.panelNo ? `PNL-${parsedData.panelNo}` : 'PNL-AUTO',
            programName: parsedData.programName || 'UNKNOWN',
            cycleTimeSeconds: 0,
            blockCount: 1,
            blockSkipCount: 0
          }
        };
      }

      case 'PRODCOMPLETEII': {
        return {
          eventId: uuidv4(),
          eventType: 'PANEL_CHECKOUT',
          eventTime: parsedData.time || now,
          receivedTime: now,
          sourceType: 'INTEGRATION_SOCKET',
          sourceId: `fuji-${parsedData.machineName || 'nxt'}`,
          sequenceId: seqId,
          siteId: this.siteId,
          workCenterId,
          payload: {
            panelBarcode: parsedData.panelNo ? `PNL-${parsedData.panelNo}` : `PNL-SEQ-${seqId}`,
            programName: parsedData.programName,
            moduleNo: parseInt(parsedData.moduleNo || '1', 10),
            laneNo: parseInt(parsedData.laneNo || '1', 10),
            cycleTimeSeconds: parseFloat(parsedData.cycleTime || '18.2'),
            blockCount: parseInt(parsedData.blockCount || '4', 10),
            blockSkipCount: parseInt(parsedData.blockSkipCount || '0', 10),
            skipBitmask: parsedData.bsInfoBit || '0x00'
          }
        };
      }

      case 'CHANGECOMP':
      case 'CHANGECOMPII':
      case 'LOADCOMP':
      case 'LOADCOMPIV': {
        return {
          eventId: uuidv4(),
          eventType: 'REEL_SPLICED',
          eventTime: parsedData.time || now,
          receivedTime: now,
          sourceType: 'INTEGRATION_SOCKET',
          sourceId: `fuji-${parsedData.machineName || 'nxt'}`,
          sequenceId: seqId,
          siteId: this.siteId,
          workCenterId,
          payload: {
            slotNo: parseInt(parsedData.slotNo || '1', 10),
            moduleNo: parseInt(parsedData.moduleNo || '1', 10),
            stageNo: parseInt(parsedData.stageNo || '1', 10),
            feederId: parsedData.feederId || 'FID-W08F-01',
            partNumber: parsedData.partNo || '',
            oldReelId: parsedData.oldReelId || 'REEL-OLD',
            newReelId: parsedData.newReelId || 'REEL-NEW',
            newReelLotNumber: parsedData.lotNo || 'LOT-AUTO',
            newReelVendor: 'Supplier',
            newReelQuantity: parseInt(parsedData.quantity || '10000', 10),
            mslRemainingMinutes: 999999
          }
        };
      }

      case 'PDERROR': {
        return {
          eventId: uuidv4(),
          eventType: 'PICK_ERROR_RECORDED',
          eventTime: parsedData.time || now,
          receivedTime: now,
          sourceType: 'INTEGRATION_SOCKET',
          sourceId: `fuji-${parsedData.machineName || 'nxt'}`,
          sequenceId: seqId,
          siteId: this.siteId,
          workCenterId,
          payload: {
            moduleNo: parseInt(parsedData.moduleNo || '1', 10),
            stageNo: parseInt(parsedData.stageNo || '1', 10),
            slotNo: parseInt(parsedData.slotNo || '1', 10),
            partNumber: parsedData.partNo || 'UNKNOWN-PART',
            feederId: parsedData.feederId || 'FEEDER-01',
            nozzleId: parsedData.nozzleId || 'NOZZLE-01',
            headId: parsedData.headId || 'HEAD-01',
            errorType: 'VISION_ERROR',
            errorCode: parsedData.errorCode,
            subErrorCode: parsedData.subErrorCode
          }
        };
      }

      default:
        return null;
    }
  }

  public buildAckFrame(command: FujiCommand, seqId: number, resultOk: boolean, extraFields: string[] = [], useComma = false): Buffer {
    const ackCommand = `${command}_ACK`;
    const resultCode = resultOk ? '0' : '1';
    const delimiter = useComma ? ',' : '\t';
    const bodyParts = [ackCommand, seqId.toString(), resultCode, ...extraFields];
    const bodyStr = bodyParts.join(delimiter);

    const bodyBuffer = Buffer.from(bodyStr, 'utf-8');
    const totalLength = 1 + bodyBuffer.length + 1; // STX + body + ETX

    const frame = Buffer.alloc(FUJI_FRAMING.HEADER_SIZE + totalLength);
    frame.writeUInt32BE(totalLength, 0);
    frame[4] = FUJI_FRAMING.STX;
    bodyBuffer.copy(frame, 5);
    frame[frame.length - 1] = FUJI_FRAMING.ETX;

    return frame;
  }

  /**
   * Builds the official Fuji iMES 4.0 multiline LOADCOMPIV_ACK frame echoing verified slot states.
   */
  public buildLoadCompAckFrame(
    seqId: number,
    machineName: string,
    moduleNo: string | number,
    items: FujiLoadCompAckItem[],
    useComma = false
  ): Buffer {
    const delim = useComma ? ',' : '\t';
    const header = ['LOADCOMPIV_ACK', seqId.toString(), machineName, moduleNo.toString(), items.length.toString()].join(delim);
    const itemLines = items.map(item =>
      [
        item.stageNo,
        item.slotNo,
        item.result,
        item.partNumber,
        item.feederId,
        item.reelId,
        item.remainingTime,
        item.quantity
      ].join(delim)
    );
    const bodyStr = [header, ...itemLines].join('\r\n');
    const bodyBuffer = Buffer.from(bodyStr, 'utf-8');
    const totalLength = 1 + bodyBuffer.length + 1; // STX + body + ETX

    const frame = Buffer.alloc(FUJI_FRAMING.HEADER_SIZE + totalLength);
    frame.writeUInt32BE(totalLength, 0);
    frame[4] = FUJI_FRAMING.STX;
    bodyBuffer.copy(frame, 5);
    frame[frame.length - 1] = FUJI_FRAMING.ETX;

    return frame;
  }

  /**
   * Splicing verification interlock (Unified SplicingAuthorizationService Gate).
   */
  public async verifySplicingInterlock(slotNo: number, partNumber: string, workCenterId: string, reelId?: string): Promise<boolean> {
    const decision = await SplicingAuthorizationService.authorizeSplicing({
      workCenterId,
      slotNo,
      scannedPartNumber: partNumber,
      scannedReelId: reelId
    });
    return decision.allowed;
  }

  public parseCommandTokens(command: FujiCommand, tokens: string[]): Record<string, any> {
    const data: Record<string, any> = {};

    switch (command) {
      case 'MCSTATECHANGE':
      case 'MCSTATECHANGEII':
        data.time = tokens[2];
        data.lineName = tokens[3];
        data.machineName = tokens[4];
        data.moduleNo = tokens[5];
        data.previousStatus = parseInt(tokens[6], 10);
        data.currentStatus = parseInt(tokens[7], 10);
        break;

      case 'PGCHANGEII':
        data.time = tokens[2];
        data.lineName = tokens[3];
        data.machineName = tokens[4];
        data.moduleNo = tokens[5];
        data.laneNo = tokens[6];
        data.programName = tokens[7];
        data.numSlots = tokens[8];
        break;

      case 'BOMLIST':
        data.time = tokens[2];
        data.lineName = tokens[3];
        data.machineName = tokens[4];
        data.laneNo = tokens[5];
        data.programName = tokens[6];
        data.numBOM = tokens[7];
        break;

      case 'PRODSTARTED':
        data.time = tokens[2];
        data.lineName = tokens[3];
        data.machineName = tokens[4];
        data.moduleNo = tokens[5];
        data.laneNo = tokens[6];
        data.productMode = tokens[7];
        data.programName = tokens[8];
        data.panelNo = tokens[9];
        break;

      case 'PRODCOMPLETEII':
        data.time = tokens[2];
        data.lineName = tokens[3];
        data.machineName = tokens[4];
        data.moduleNo = tokens[5];
        data.laneNo = tokens[6];
        data.productMode = tokens[7];
        data.programName = tokens[8];
        data.panelNo = tokens[9];
        data.blockCount = tokens[10];
        data.blockSkipCount = tokens[11];
        data.bsInfoBit = tokens[12];
        data.cycleTime = tokens[13];
        break;

      case 'LOADCOMP':
      case 'LOADCOMPIV':
        data.time = tokens[2];
        data.lineName = tokens[3];
        data.machineName = tokens[4];
        data.moduleNo = tokens[5];
        data.stageNo = tokens[6];
        data.slotNo = tokens[7];
        data.subSlotNo = tokens[8];
        data.feederId = tokens[9];
        data.partNo = tokens[10];
        data.newReelId = tokens[11];
        data.lotNo = tokens[12];
        data.quantity = tokens[13];
        break;

      case 'CHANGECOMP':
      case 'CHANGECOMPII':
        data.time = tokens[2];
        data.lineName = tokens[3];
        data.machineName = tokens[4];
        if (tokens.length >= 13) {
          // tokens[6]=numList, tokens[7]=subSeq, tokens[8]=slotNo, tokens[9]=partNo, tokens[10]=feederId
          data.slotNo = tokens[8];
          data.partNo = tokens[9];
          data.feederId = tokens[10];
          data.oldReelId = tokens[11];
          data.newReelId = tokens[12];
          data.quantity = tokens[13];
        } else {
          data.slotNo = tokens[6] || '1';
          data.partNo = tokens[7] || '';
          data.feederId = tokens[8] || 'FID-W08F-01';
          data.oldReelId = tokens[9] || 'REEL-OLD';
          data.newReelId = tokens[10] || 'REEL-NEW';
          data.quantity = tokens[11] || '10000';
        }
        break;

      case 'PDERROR':
        data.time = tokens[2];
        data.lineName = tokens[3];
        data.machineName = tokens[4];
        data.moduleNo = tokens[5];
        data.stageNo = tokens[6];
        data.slotNo = tokens[7];
        data.feederId = tokens[8];
        data.partNo = tokens[9];
        data.nozzleId = tokens[10];
        data.headId = tokens[11];
        data.errorCode = tokens[12];
        data.subErrorCode = tokens[13];
        break;
    }

    return data;
  }

  /**
   * Processes a single extracted frame with BLOB preservation and decoupled interlock checking.
   */
  public async processSingleFrame(socket: net.Socket, frame: Buffer, workCenterId: string): Promise<void> {
    const db = getDatabase();
    const ingressId = uuidv4();
    const decodedPayload = frame.toString('utf-8');

    // Tier 1 Ingress: Preserve verbatim raw bytes as BLOB + decoded text
    await db.execute(`
      INSERT INTO ingress_events (
        id, source_adapter, source_address, protocol, raw_payload, decoded_payload, processed_status
      ) VALUES (?, ?, ?, 'TCP_ASCII_STX_ETX', ?, ?, 'PROCESSED')
    `, [
      ingressId,
      'FUJI_NEXIM',
      `${socket.remoteAddress || '127.0.0.1'}:${socket.remotePort || 0}`,
      frame,
      decodedPayload
    ]);

    const parsed = this.parseRawFrame(frame);
    if (!parsed) return;

    this.logWire({
      direction: 'INBOUND',
      remoteAddress: `${socket.remoteAddress || '127.0.0.1'}:${socket.remotePort || 0}`,
      command: parsed.command,
      seqId: parsed.seqId,
      summary: `Received ${parsed.command} (${frame.length} bytes)`,
      rawPreview: decodedPayload.substring(0, 300)
    });

    // Handle Heartbeat Liveness (120s / 30s)
    if (parsed.command === 'KEEPALIVE') {
      this.writeAndLog(socket, this.buildAckFrame('KEEPALIVE', parsed.seqId, true), 'KEEPALIVE_ACK', parsed.seqId, 'Acknowledged KEEPALIVE');
      return;
    }

    const fields = this.parseCommandTokens(parsed.command, parsed.tokens);
    const resolved = this.resolveMachineContext(
      socket.remoteAddress || '127.0.0.1',
      fields.machineName || parsed.tokens[2] || (parsed.tokens.length > 4 ? parsed.tokens[4] : undefined)
    );
    const effectiveWorkCenterId = resolved.workCenterId;

    const isComma = parsed.tokens[0].includes(',');

    // Handle Protocol Start Handshake (Dynamically reply with resolved machine ID)
    if (parsed.command === 'SETEV') {
      const ackMachine = parsed.tokens[2] || resolved.machineId;
      socket.write(this.buildAckFrame('SETEV', parsed.seqId, true, [ackMachine], isComma));
      return;
    }
    if (parsed.command === 'STARTEV') {
      const ackMachine = parsed.tokens[2] || resolved.machineId;
      socket.write(this.buildAckFrame('STARTEV', parsed.seqId, true, [ackMachine], isComma));
      return;
    }

    // Interlock: Check if production line or work center is currently under active hold
    const isHold = this.isProductionHold || await ProductionHoldService.isHoldActive(resolved.lineId);
    if (isHold && (parsed.command === 'PRODSTARTED' || parsed.command === 'LOADCOMP' || parsed.command === 'LOADCOMPIV' || parsed.command === 'CHANGECOMP' || parsed.command === 'CHANGECOMPII')) {
      console.warn(`[Fuji Gateway] PRODUCTION HOLD ACTIVE on ${resolved.lineId} (${effectiveWorkCenterId}). Rejecting ${parsed.command}!`);
      socket.write(this.buildAckFrame(parsed.command, parsed.seqId, false, ['HOLD_ACTIVE'], isComma));
      return;
    }

    // Recipe Verification Interlock (PGCHANGEII)
    if (parsed.command === 'PGCHANGEII') {
      const lineName = fields.lineName || parsed.tokens[3] || 'LINE01';
      const machineName = fields.machineName || parsed.tokens[4] || resolved.machineId;
      const moduleNo = parseInt(fields.moduleNo || parsed.tokens[5] || '1', 10);
      const laneNo = parseInt(fields.laneNo || parsed.tokens[6] || '1', 10);
      const programName = fields.programName || parsed.tokens[7] || 'UNKNOWN_RECIPE';

      // Store recipe slot mappings if multiline payload is present
      if (parsed.lines && parsed.lines.length > 1) {
        const nowIso = new Date().toISOString();
        for (let i = 1; i < parsed.lines.length; i += 2) {
          const slotLine = parsed.lines[i];
          const partLine = parsed.lines[i + 1];
          if (!slotLine || !partLine) break;
          const sTokens = slotLine.includes(',') ? slotLine.split(',') : slotLine.split('\t');
          const stageNo = parseInt(sTokens[0] || '1', 10);
          const slotNo = parseInt(sTokens[1] || '1', 10);
          const partNo = partLine.trim();

          await db.execute(`
            INSERT INTO fuji_active_recipes (
              id, line_name, machine_name, module_no, lane_no, program_name, stage_no, slot_no, part_number, verified_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [uuidv4(), lineName, machineName, moduleNo, laneNo, programName, stageNo, slotNo, partNo, nowIso]);
        }
      }

      if (isHold) {
        socket.write(this.buildAckFrame('PGCHANGEII', parsed.seqId, false, [machineName, moduleNo.toString(), laneNo.toString(), programName], isComma));
        return;
      }

      // Unlock line device display by sending PGCHANGEII_ACK with Result = 0 (OK)
      socket.write(this.buildAckFrame('PGCHANGEII', parsed.seqId, true, [machineName, moduleNo.toString(), laneNo.toString(), programName], isComma));
      return;
    }

    // BOM Notification (BOMLIST)
    if (parsed.command === 'BOMLIST') {
      const machineName = fields.machineName || parsed.tokens[4] || resolved.machineId;
      const laneNo = fields.laneNo || parsed.tokens[5] || '1';
      const programName = fields.programName || parsed.tokens[6] || 'UNKNOWN_BOM';

      if (parsed.lines && parsed.lines.length > 1) {
        const nowIso = new Date().toISOString();
        for (let i = 1; i < parsed.lines.length; i++) {
          const bLine = parsed.lines[i];
          const bTokens = bLine.includes(',') ? bLine.split(',').map(s => s.trim()) : bLine.split('\t');
          if (bTokens.length >= 3) {
            const blockNo = parseInt(bTokens[0], 10) || 1;
            const partNumber = bTokens[1];
            const refDes = bTokens[2];
            await db.execute(`
              INSERT INTO pcb_bom_designators (
                id, program_name, block_no, part_number, ref_des, created_at
              ) VALUES (?, ?, ?, ?, ?, ?)
            `, [uuidv4(), programName, blockNo, partNumber, refDes, nowIso]);
          }
        }
      }

      this.writeAndLog(socket, this.buildAckFrame('BOMLIST', parsed.seqId, true, [machineName, laneNo, programName], isComma), 'BOMLIST_ACK', parsed.seqId, `Acknowledged BOMLIST for ${programName}`);
      return;
    }

    // Multiline Splicing / Part Supply Interlock (LOADCOMPIV)
    if (parsed.command === 'LOADCOMPIV' && parsed.lines && parsed.lines.length > 1) {
      const machineName = fields.machineName || parsed.tokens[4] || resolved.machineId;
      const moduleNo = fields.moduleNo || parsed.tokens[5] || '1';
      const ackItems: FujiLoadCompAckItem[] = [];

      for (let i = 1; i < parsed.lines.length; i++) {
        const cLine = parsed.lines[i];
        const cTokens = cLine.includes(',') ? cLine.split(',').map(s => s.trim()) : cLine.split('\t');
        if (cTokens.length < 5) continue;
        const stageNo = parseInt(cTokens[0], 10) || 1;
        const slotNo = parseInt(cTokens[1], 10) || 1;
        const partNo = cTokens[2] || '';
        const feederId = cTokens[3] || '';
        const reelId = cTokens[4] || '';
        const quantity = parseInt(cTokens[9], 10) || 10000;

        const decision = await SplicingAuthorizationService.authorizeSplicing({
          workCenterId: effectiveWorkCenterId,
          slotNo,
          scannedPartNumber: partNo,
          scannedReelId: reelId
        });

        ackItems.push({
          stageNo,
          slotNo,
          result: (decision.allowed && !isHold) ? 0 : 1,
          partNumber: partNo,
          feederId,
          reelId,
          remainingTime: 999999,
          quantity
        });
      }

      this.writeAndLog(socket, this.buildLoadCompAckFrame(parsed.seqId, machineName, moduleNo, ackItems, isComma), 'LOADCOMPIV_ACK', parsed.seqId, `Acknowledged LOADCOMPIV (${ackItems.length} slots)`);
      return;
    }

    // Single-slot Splicing & Part Load Interlock
    if (parsed.command === 'LOADCOMP' || parsed.command === 'LOADCOMPIV' || parsed.command === 'CHANGECOMP' || parsed.command === 'CHANGECOMPII') {
      const slotNo = parseInt(fields.slotNo || parsed.tokens[8] || parsed.tokens[3] || '1', 10);
      const partNo = fields.partNo || parsed.tokens[9] || parsed.tokens[4] || '';
      const newReelId = fields.newReelId || parsed.tokens[12] || parsed.tokens[10] || undefined;

      const decision = await SplicingAuthorizationService.authorizeSplicing({
        workCenterId: effectiveWorkCenterId,
        slotNo,
        scannedPartNumber: partNo,
        scannedReelId: newReelId
      });

      if (!decision.allowed) {
        console.warn(`[Fuji Gateway] SPLICING INTERLOCK BLOCKED (${decision.decisionCode}): Slot ${slotNo} - ${decision.reason}. Halting feeder!`);
        this.writeAndLog(socket, this.buildAckFrame(parsed.command, parsed.seqId, false, [], isComma), `${parsed.command}_ACK`, parsed.seqId, `Splicing Interlock Blocked (NG)`);
        return;
      }
    }

    // Pick & Nozzle Error Predictive Telemetry (PDERROR)
    if (parsed.command === 'PDERROR') {
      const machineId = fields.machineName || parsed.tokens[4] || resolved.machineId;
      const moduleNo = parseInt(fields.moduleNo || parsed.tokens[5] || '1', 10);
      const headId = fields.headId || parsed.tokens[11] || 'HEAD-01';
      const nozzleId = fields.nozzleId || parsed.tokens[10] || 'NOZZLE-01';
      const nowIso = new Date().toISOString();

      try {
        const existing = await db.query<any>(
          'SELECT id, pick_count, error_count FROM machine_nozzle_telemetry WHERE machine_id = ? AND nozzle_id = ?',
          [machineId, nozzleId]
        );
        if (existing.length > 0) {
          const errs = Number(existing[0].error_count) + 1;
          const picks = Math.max(Number(existing[0].pick_count), errs);
          const rate = Number(((errs / picks) * 100).toFixed(3));
          await db.execute(
            'UPDATE machine_nozzle_telemetry SET error_count = ?, error_rate_pct = ?, last_error_at = ?, last_updated = ? WHERE id = ?',
            [errs, rate, nowIso, nowIso, existing[0].id]
          );
        } else {
          await db.execute(
            'INSERT INTO machine_nozzle_telemetry (id, machine_id, module_no, head_id, nozzle_id, pick_count, error_count, error_rate_pct, last_error_at, last_updated) VALUES (?, ?, ?, ?, ?, 100, 1, 1.0, ?, ?)',
            [uuidv4(), machineId, moduleNo, headId, nozzleId, nowIso, nowIso]
          );
        }
      } catch (err: any) {
        console.warn('[Fuji Gateway] Failed to record nozzle telemetry:', err.message);
      }
    }

    // Project Canonical Event
    const canonical = this.toCanonicalEvent(parsed.command, parsed.seqId, fields, effectiveWorkCenterId);
    if (canonical) {
      canonical.ingressEventId = ingressId;
      await EventIngestionService.ingest(canonical);
    }

    // Respond OK ACK
    this.writeAndLog(socket, this.buildAckFrame(parsed.command, parsed.seqId, true), `${parsed.command}_ACK`, parsed.seqId, `Acknowledged ${parsed.command}`);
  }

  public startListener(port = 30040, workCenterId = 'wc-nxt-01', idleTimeoutMs?: number): void {
    if (this.isRunning) {
      this.stopListener();
    }
    this.activePort = port;
    const socketTimeout = idleTimeoutMs !== undefined ? idleTimeoutMs : this.customIdleTimeoutMs;

    this.server = net.createServer((socket) => {
      this.activeSockets.add(socket);
      const clientIp = socket.remoteAddress || '';
      const allowed = this.customAllowedSubnets || SecretsConfigManager.loadConfig().allowedSubnets;

      // Compensating Control #3: OT Subnet & IP Firewall Interlock
      if (!IpFirewall.isAllowed(clientIp, allowed)) {
        console.warn(`[SECURITY ALERT] Blocked unauthorized SMT TCP connection from IP: ${clientIp}`);
        this.activeSockets.delete(socket);
        socket.destroy();
        return;
      }

      // Idle Timeout Guard: Configure socket timeout if > 0 (0 = disabled / keep alive forever)
      if (socketTimeout > 0) {
        socket.setTimeout(socketTimeout);
        socket.on('timeout', () => {
          console.warn(
            `[SECURITY ALERT] OT Socket idle timeout (${socketTimeout}ms) reached for client: ${clientIp}. Terminating connection.`
          );
          this.activeSockets.delete(socket);
          socket.destroy();
        });
      }

      this.activeConnections++;
      console.log(`[Fuji Gateway] SMT Machine authorized & connected from ${socket.remoteAddress}:${socket.remotePort}`);

      let socketBuffer = Buffer.alloc(0);

      socket.on('data', async (chunk: Buffer) => {
        // Accumulator Overflow Guard: If socketBuffer.length + chunk.length > 65536, immediately disconnect
        if (socketBuffer.length + chunk.length > FujiNeximAdapter.MAX_SOCKET_BUFFER) {
          console.warn(
            `[SECURITY ALERT] Socket buffer overflow attempt from ${clientIp} (${socketBuffer.length + chunk.length} bytes > ${FujiNeximAdapter.MAX_SOCKET_BUFFER}). Terminating connection.`
          );
          this.activeSockets.delete(socket);
          socketBuffer = Buffer.alloc(0);
          socket.destroy();
          return;
        }

        socketBuffer = Buffer.concat([socketBuffer, chunk]);

        const framesToProcess: Buffer[] = [];

        while (true) {
          // Declared Length Guard: If at least 4 bytes are present, inspect declared totalLength
          if (socketBuffer.length >= FUJI_FRAMING.HEADER_SIZE) {
            const totalLength = socketBuffer.readUInt32BE(0);

            // Disconnect socket immediately (socket.destroy()), drop buffer, and log security warning.
            // Do not allow memory accumulation if declared length > 65536 or < 2 (minimum STX + ETX).
            if (totalLength > FujiNeximAdapter.MAX_SOCKET_BUFFER || totalLength < 2) {
              console.warn(
                `[SECURITY ALERT] Malformed declared length (${totalLength} bytes) from ${clientIp}. Terminating connection immediately.`
              );
              this.activeSockets.delete(socket);
              socketBuffer = Buffer.alloc(0);
              socket.destroy();
              return;
            }
          }

          // Sync Header Guard: When at least 5 bytes are present in accumulator, verify byte 4 is FUJI_FRAMING.STX (0x02).
          // If invalid/corrupt, immediately drop the connection (socket.destroy()).
          if (socketBuffer.length >= FUJI_FRAMING.HEADER_SIZE + 1) {
            const stx = socketBuffer[FUJI_FRAMING.HEADER_SIZE];
            if (stx !== FUJI_FRAMING.STX) {
              console.warn(
                `[SECURITY ALERT] Corrupt sync header (byte 4 = 0x${stx.toString(16)} != 0x02) from ${clientIp}. Terminating connection immediately.`
              );
              this.activeSockets.delete(socket);
              socketBuffer = Buffer.alloc(0);
              socket.destroy();
              return;
            }
          }

          // Need at least 4 bytes to determine full frame size
          if (socketBuffer.length < FUJI_FRAMING.HEADER_SIZE) {
            break;
          }

          const totalLength = socketBuffer.readUInt32BE(0);
          const fullFrameSize = FUJI_FRAMING.HEADER_SIZE + totalLength;

          // Incomplete frame; wait for subsequent TCP chunks
          if (socketBuffer.length < fullFrameSize) {
            break;
          }

          // Frame Boundary Guard: Verify ETX (0x03) at byte 4 + totalLength - 1
          const etx = socketBuffer[fullFrameSize - 1];
          if (etx !== FUJI_FRAMING.ETX) {
            console.warn(
              `[SECURITY ALERT] Corrupt frame boundary (ETX = 0x${etx.toString(16)} != 0x03) from ${clientIp}. Terminating connection immediately.`
            );
            this.activeSockets.delete(socket);
            socketBuffer = Buffer.alloc(0);
            socket.destroy();
            return;
          }

          // Extract frame and advance accumulator
          framesToProcess.push(socketBuffer.subarray(0, fullFrameSize));
          socketBuffer = Buffer.from(socketBuffer.subarray(fullFrameSize));
        }

        // Process valid extracted frames sequentially
        for (const frame of framesToProcess) {
          if (socket.destroyed) break;
          this.framesProcessedTotal++;
          this.lastFrameReceivedAt = new Date().toISOString();
          await this.processSingleFrame(socket, frame, workCenterId);
        }
      });

      socket.on('close', () => {
        this.activeSockets.delete(socket);
        this.activeConnections = Math.max(0, this.activeConnections - 1);
        socketBuffer = Buffer.alloc(0);
        console.log('[Fuji Gateway] SMT Machine disconnected.');
      });

      socket.on('error', (err) => {
        this.activeSockets.delete(socket);
        console.error('[Fuji Gateway] Socket error:', err.message);
      });
    });

    this.server.listen(port, () => {
      console.log(`[Fuji Gateway] TCP Listener active on port ${port} (Ready for Fuji NXT/AIMEX Central Server)`);
      this.isRunning = true;
    });
  }

  public stop(): void {
    this.stopListener();
  }

  public stopListener(): void {
    for (const socket of this.activeSockets) {
      try {
        socket.destroy();
      } catch {}
    }
    this.activeSockets.clear();

    if (this.server) {
      try {
        this.server.close();
      } catch {}
      this.server = null;
    }
    if (this.clientSocket) {
      try {
        this.clientSocket.destroy();
      } catch {}
      this.clientSocket = null;
      this.clientConnected = false;
    }
    this.isRunning = false;
    this.activeConnections = 0;
  }

  private isProductionHold: boolean = false;
  private productionHoldReason: string | null = null;

  public async tripProductionHold(reason: string, targetLineId?: string, targetWorkCenterId?: string): Promise<void> {
    this.isProductionHold = true;
    this.productionHoldReason = reason;
    const workCenter = targetWorkCenterId || this.workCenterId;
    console.warn(`[Fuji Gateway] PRODUCTION HOLD TRIPPED for ${workCenter}: ${reason}`);
    try {
      await ProductionHoldService.tripProductionHold({
        lineId: targetLineId,
        workCenterId: workCenter,
        reason
      });
    } catch (err: any) {
      console.error(`[Fuji Gateway] Failed to trip production hold in service:`, err.message);
      // Fallback local update
      try {
        const db = getDatabase();
        await db.execute(
          `UPDATE work_centers SET current_state = 'QUALITY_HOLD', last_state_change_time = ? WHERE id = ?`,
          [new Date().toISOString(), workCenter]
        );
      } catch (dbErr: any) {
        console.error(`[Fuji Gateway] DB fallback failed:`, dbErr.message);
      }
    }
  }

  public async clearProductionHold(acknowledgedBy = 'LINE_LEAD_01', reason = 'Supervisor acknowledged hold clear'): Promise<void> {
    this.isProductionHold = false;
    this.productionHoldReason = null;
    console.log(`[Fuji Gateway] Production hold CLEARED for ${this.workCenterId}`);
    try {
      await ProductionHoldService.acknowledgeProductionHold({
        workCenterId: this.workCenterId,
        acknowledgedBy,
        role: 'LINE_LEAD',
        acknowledgementReason: reason
      });
    } catch (err: any) {
      // Fallback local update
      try {
        const db = getDatabase();
        await db.execute(
          `UPDATE work_centers SET current_state = 'RUNNING', last_state_change_time = ? WHERE id = ?`,
          [new Date().toISOString(), this.workCenterId]
        );
      } catch (dbErr: any) {
        console.error(`[Fuji Gateway] DB fallback failed:`, dbErr.message);
      }
    }
  }

  public getCapabilities(): MachineCapability[] {
    return ['HOLD'];
  }

  public async tripHold(reason: string, _details?: Record<string, any>): Promise<void> {
    await this.tripProductionHold(reason);
  }

  public async clearHold(reason: string): Promise<void> {
    console.log(`[Fuji Gateway] Clearing hold with reason: ${reason}`);
    await this.clearProductionHold();
  }

  public async applyParameters(_commands: MachineParameterCommand[]): Promise<boolean> {
    return false; // Placement gateway does not support screen printer parameters
  }

  public async executeAction(_command: MachineActionCommand): Promise<boolean> {
    return false; // Placement gateway does not support cleaning/divert actions
  }

  public isHoldActive(): { active: boolean; reason: string | null } {
    return {
      active: this.isProductionHold,
      reason: this.productionHoldReason
    };
  }

  public getStatus(): EquipmentAdapterStatus {
    return {
      id: this.id,
      name: this.name,
      protocolName: this.protocolName,
      workCenterId: this.workCenterId,
      isRunning: this.isRunning,
      port: this.activePort,
      activeConnections: this.activeConnections,
      lastFrameReceivedAt: this.lastFrameReceivedAt,
      framesProcessedTotal: this.framesProcessedTotal
    };
  }

  public isListening(): boolean {
    return !!(this.server && this.server.listening);
  }

  private clientSocket: net.Socket | null = null;
  private clientConnected = false;

  /**
   * Connects outbound as a Host Computer (MES Client) to a physical Fuji NEXIM Central Server.
   * Executes the standard iMES 4.0 4-step initialization handshake (SETEV 22 events -> STARTEV).
   */
  public connectToCentralServer(host: string, port = 30040, machineName = 'NXTR1'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.clientSocket) {
        this.clientSocket.destroy();
      }

      const socket = net.connect({ host, port }, () => {
        this.clientConnected = true;
        this.clientSocket = socket;
        console.log(`[Fuji Gateway] Connected as Host Client to Fuji NEXIM Central Server at ${host}:${port}`);

        // Step 1: Send SETEV with all 22 subscribed events
        const eventLines = FUJI_IMES_SUBSCRIBED_EVENTS.map(ev => `${ev},1`).join('\r\n');
        const setEvBody = `SETEV,1,${machineName},${FUJI_IMES_SUBSCRIBED_EVENTS.length}\r\n${eventLines}`;
        const setEvBuffer = Buffer.from(setEvBody, 'utf-8');
        const totalLength = 1 + setEvBuffer.length + 1;
        const frame = Buffer.alloc(FUJI_FRAMING.HEADER_SIZE + totalLength);
        frame.writeUInt32BE(totalLength, 0);
        frame[4] = FUJI_FRAMING.STX;
        setEvBuffer.copy(frame, 5);
        frame[frame.length - 1] = FUJI_FRAMING.ETX;
        this.writeAndLog(socket, frame, 'SETEV', 1, `Sent SETEV (${FUJI_IMES_SUBSCRIBED_EVENTS.length} events subscribed)`);

        // Step 2: Send STARTEV to activate active notification
        const startEvBody = `STARTEV,2,${machineName}`;
        const startEvBuffer = Buffer.from(startEvBody, 'utf-8');
        const sTotalLen = 1 + startEvBuffer.length + 1;
        const sFrame = Buffer.alloc(FUJI_FRAMING.HEADER_SIZE + sTotalLen);
        sFrame.writeUInt32BE(sTotalLen, 0);
        sFrame[4] = FUJI_FRAMING.STX;
        startEvBuffer.copy(sFrame, 5);
        sFrame[sFrame.length - 1] = FUJI_FRAMING.ETX;
        this.writeAndLog(socket, sFrame, 'STARTEV', 2, `Sent STARTEV for ${machineName}`);

        resolve();
      });

      let socketBuffer: any = Buffer.alloc(0);
      socket.on('data', async (chunk) => {
        socketBuffer = Buffer.concat([socketBuffer, chunk]);
        const extracted = FujiNeximAdapter.extractFrames(socketBuffer);
        socketBuffer = extracted.remainder;
        for (const frame of extracted.frames) {
          await this.processSingleFrame(socket, frame, this.workCenterId);
        }
      });

      socket.on('error', (err) => {
        console.error(`[Fuji Gateway] Central Server connection error: ${err.message}`);
        this.clientConnected = false;
        reject(err);
      });

      socket.on('close', () => {
        console.warn('[Fuji Gateway] Central Server connection closed.');
        this.clientConnected = false;
      });
    });
  }

  public isClientConnected(): boolean {
    return this.clientConnected;
  }
}

