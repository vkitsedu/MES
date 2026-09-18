import fs from 'fs';
import path from 'path';
import os from 'os';
import net from 'net';
import { v4 as uuidv4 } from 'uuid';
import { FujiNeximAdapter, FujiWireLogCallbackPayload } from '../adapters/fuji-nexim.adapter';

export interface FujiRuntimeConfig {
  mode: 'LISTENER' | 'CLIENT';
  port: number;
  allowedSubnets: string[];
  idleTimeoutSeconds: number; // 0 = disabled / keep alive forever
  clientTargetHost: string;
  clientTargetPort: number;
  machineName: string;
  lastUpdated?: string;
}

export interface LocalInterfaceInfo {
  name: string;
  address: string;
  netmask: string;
  mac: string;
  family: string;
  isInternal: boolean;
}

export interface FujiWireLogEntry extends FujiWireLogCallbackPayload {
  id: string;
  timestamp: string;
}

export class FujiConfigService {
  private static configFilePath: string = path.resolve(process.cwd(), 'fuji_config.json');
  private static activeConfig: FujiRuntimeConfig | null = null;
  private static registeredAdapter: FujiNeximAdapter | null = null;
  private static wireLogs: FujiWireLogEntry[] = [];
  private static readonly MAX_WIRE_LOGS = 100;

  public static getDefaultConfig(): FujiRuntimeConfig {
    return {
      mode: 'LISTENER',
      port: parseInt(process.env.FUJI_PORT || '30040', 10),
      allowedSubnets: ['*'], // Default to open wildcard so field engineers never hit blocked connection
      idleTimeoutSeconds: 120, // Default 120s (0 = disabled)
      clientTargetHost: '192.168.1.100',
      clientTargetPort: 30040,
      machineName: 'NXTR1'
    };
  }

  public static loadConfig(): FujiRuntimeConfig {
    if (this.activeConfig) return this.activeConfig;

    try {
      if (fs.existsSync(this.configFilePath)) {
        const raw = fs.readFileSync(this.configFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        const loaded: FujiRuntimeConfig = {
          ...this.getDefaultConfig(),
          ...parsed
        };
        this.activeConfig = loaded;
        return loaded;
      }
    } catch (err: any) {
      console.warn('[FujiConfigService] Failed to parse fuji_config.json, using defaults:', err.message);
    }

    const fallback = this.getDefaultConfig();
    this.activeConfig = fallback;
    this.saveConfig(fallback);
    return fallback;
  }

  public static saveConfig(cfg: FujiRuntimeConfig): void {
    try {
      this.activeConfig = {
        ...cfg,
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(this.configFilePath, JSON.stringify(this.activeConfig, null, 2), 'utf-8');
    } catch (err: any) {
      console.error('[FujiConfigService] Failed to write fuji_config.json:', err.message);
    }
  }

  public static async initialize(adapter: FujiNeximAdapter): Promise<void> {
    this.registeredAdapter = adapter;
    const config = this.loadConfig();

    // Hook wire logging
    adapter.setWireLogCallback((payload) => {
      this.recordWireLog(payload);
    });

    await this.applyConfig(config);
  }

  public static async applyConfig(newConfig: Partial<FujiRuntimeConfig>): Promise<FujiRuntimeConfig> {
    const current = this.loadConfig();
    const updated: FujiRuntimeConfig = {
      ...current,
      ...newConfig
    };

    this.saveConfig(updated);

    if (this.registeredAdapter) {
      // 1. Configure Subnet allowlist
      this.registeredAdapter.setAllowedSubnets(updated.allowedSubnets);

      // 2. Configure Idle Timeout
      const timeoutMs = updated.idleTimeoutSeconds > 0 ? updated.idleTimeoutSeconds * 1000 : 0;
      this.registeredAdapter.setIdleTimeout(timeoutMs);

      // 3. Apply Mode
      if (updated.mode === 'CLIENT') {
        this.registeredAdapter.stopListener();
        try {
          console.log(`[FujiConfigService] Connecting outbound as client to Central Nexim Server at ${updated.clientTargetHost}:${updated.clientTargetPort}...`);
          await this.registeredAdapter.connectToCentralServer(
            updated.clientTargetHost,
            updated.clientTargetPort,
            updated.machineName
          );
        } catch (err: any) {
          console.error(`[FujiConfigService] Failed to connect to Central Nexim Server: ${err.message}`);
        }
      } else {
        // LISTENER mode
        console.log(`[FujiConfigService] Starting Inbound TCP Listener on port ${updated.port} (timeout: ${updated.idleTimeoutSeconds}s, allowed: ${updated.allowedSubnets.join(', ')})...`);
        this.registeredAdapter.startListener(updated.port, 'wc-nxt-01', timeoutMs);
      }
    }

    return updated;
  }

  public static getLocalInterfaces(): LocalInterfaceInfo[] {
    const interfaces = os.networkInterfaces();
    const result: LocalInterfaceInfo[] = [];

    for (const [name, nets] of Object.entries(interfaces)) {
      if (!nets) continue;
      for (const net of nets) {
        if (net.family === 'IPv4' || (net.family as any) === 4) {
          result.push({
            name,
            address: net.address,
            netmask: net.netmask,
            mac: net.mac,
            family: 'IPv4',
            isInternal: net.internal
          });
        }
      }
    }

    // Sort so physical / non-internal IPv4 interfaces come first
    result.sort((a, b) => {
      if (a.isInternal && !b.isInternal) return 1;
      if (!a.isInternal && b.isInternal) return -1;
      return a.name.localeCompare(b.name);
    });

    return result;
  }

  public static recordWireLog(payload: FujiWireLogCallbackPayload): void {
    const entry: FujiWireLogEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...payload
    };

    this.wireLogs.unshift(entry);
    if (this.wireLogs.length > this.MAX_WIRE_LOGS) {
      this.wireLogs.pop();
    }
  }

  public static getWireLogs(limit = 50): FujiWireLogEntry[] {
    return this.wireLogs.slice(0, Math.min(limit, this.wireLogs.length));
  }

  public static clearWireLogs(): void {
    this.wireLogs = [];
  }

  public static async testConnection(
    host: string,
    port: number,
    timeoutMs = 3000
  ): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    const start = Date.now();
    return new Promise((resolve) => {
      const socket = new net.Socket();
      let settled = false;

      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          socket.destroy();
          resolve({
            success: false,
            latencyMs: Date.now() - start,
            error: `Connection timed out after ${timeoutMs}ms`
          });
        }
      }, timeoutMs);

      socket.connect({ host, port }, () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          const latency = Date.now() - start;
          socket.end();
          resolve({ success: true, latencyMs: latency });
        }
      });

      socket.on('error', (err) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          socket.destroy();
          resolve({
            success: false,
            latencyMs: Date.now() - start,
            error: err.message
          });
        }
      });
    });
  }

  public static getStatus(): Record<string, any> {
    const config = this.loadConfig();
    const adapterStatus = this.registeredAdapter ? this.registeredAdapter.getStatus() : null;
    return {
      mode: config.mode,
      port: config.port,
      isListening: this.registeredAdapter ? this.registeredAdapter.isListening() : false,
      isClientConnected: this.registeredAdapter ? this.registeredAdapter.isClientConnected() : false,
      activeConnections: adapterStatus?.activeConnections || 0,
      framesProcessedTotal: adapterStatus?.framesProcessedTotal || 0,
      lastFrameReceivedAt: adapterStatus?.lastFrameReceivedAt || null,
      idleTimeoutSeconds: config.idleTimeoutSeconds,
      allowedSubnets: config.allowedSubnets,
      clientTargetHost: config.clientTargetHost,
      clientTargetPort: config.clientTargetPort,
      machineName: config.machineName
    };
  }
}
