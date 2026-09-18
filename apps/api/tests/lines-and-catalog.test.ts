import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../src/server';
import { initDatabase } from '../src/db/database';
import { seedDatabase } from '../src/db/seed';
import { TokenManager } from '../src/security/jwt';
import http from 'http';

describe('Lines Topology & Multi-Vendor Equipment Catalog Suite', () => {
  let server: http.Server;
  let baseUrl: string;
  let authToken: string;

  const authFetch = (path: string, options: any = {}) => {
    return fetch(baseUrl + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        Authorization: 'Bearer ' + authToken
      }
    });
  };

  beforeAll(async () => {
    await initDatabase();
    await seedDatabase();

    authToken = TokenManager.generateAccessToken({
      sub: 'sup-smt-01',
      code: 'SUP-SMT-01',
      name: 'Line Lead Alpha',
      role: 'LINE_LEAD',
      org: 'org-apex',
      site: 'site-noida-p4',
      authzVersion: 1
    });

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const addr = server.address();
        if (typeof addr === 'object' && addr !== null) {
          baseUrl = 'http://127.0.0.1:' + addr.port;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('1. GET /api/v1/lines returns configured production lines with ordered stations', async () => {
    const res = await authFetch('/api/v1/lines');
    expect(res.status).toBe(200);
    const body: any = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(2);

    const line1 = body.find((l: any) => l.id === 'line-smt-01');
    expect(line1).toBeDefined();
    expect(line1.name).toContain('SMT Line 01');
    expect(line1.taktTargetSec).toBe(18.0);
    expect(Array.isArray(line1.stations)).toBe(true);
    expect(line1.stations.length).toBeGreaterThanOrEqual(4);

    // Verify stations are sorted by sequenceOrder
    for (let i = 0; i < line1.stations.length - 1; i++) {
      expect(line1.stations[i].sequenceOrder).toBeLessThanOrEqual(line1.stations[i + 1].sequenceOrder);
    }
  });

  it('2. GET /api/v1/equipment/catalog returns multi-vendor equipment items', async () => {
    const res = await authFetch('/api/v1/equipment/catalog');
    expect(res.status).toBe(200);
    const body: any = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(15);

    const manufacturers = new Set(body.map((i: any) => i.manufacturer));
    expect(manufacturers.has('Fuji')).toBe(true);
    expect(manufacturers.has('Yamaha')).toBe(true);
    expect(manufacturers.has('Panasonic')).toBe(true);
    expect(manufacturers.has('Koh Young')).toBe(true);
    expect(manufacturers.has('Heller')).toBe(true);
  });

  it('3. POST /api/v1/equipment/catalog registers a new custom machine model', async () => {
    const customMachine = {
      manufacturer: 'Hanwha',
      modelName: 'Decan S2 High-Speed Placer',
      category: 'PICK_AND_PLACE',
      defaultCycleTimeSec: 21.0,
      ratedCph: 92000,
      supportedProtocols: ['IPC_CFX', 'SECS_GEM']
    };

    const res = await authFetch('/api/v1/equipment/catalog', {
      method: 'POST',
      body: JSON.stringify(customMachine)
    });

    expect(res.status).toBe(201);
    const body: any = await res.json();
    expect(body.id).toBeDefined();
    expect(body.manufacturer).toBe('Hanwha');
    expect(body.modelName).toBe('Decan S2 High-Speed Placer');
    expect(body.isBuiltIn).toBe(false);

    // Verify it now appears in catalog
    const catRes = await authFetch('/api/v1/equipment/catalog');
    const catBody: any = await catRes.json();
    const found = catBody.find((item: any) => item.id === body.id);
    expect(found).toBeDefined();
    expect(found.manufacturer).toBe('Hanwha');
  });

  it('4. PATCH /api/v1/lines/:id renames line and updates takt time', async () => {
    const res = await authFetch('/api/v1/lines/line-smt-01', {
      method: 'PATCH',
      body: JSON.stringify({
        name: 'Line Alpha (Apex High-Speed SMT)',
        taktTargetSec: 16.5
      })
    });

    expect(res.status).toBe(200);
    const body: any = await res.json();
    expect(body.success).toBe(true);

    const lineRes = await authFetch('/api/v1/lines/line-smt-01');
    expect(lineRes.status).toBe(200);
    const lineBody: any = await lineRes.json();
    expect(lineBody.name).toBe('Line Alpha (Apex High-Speed SMT)');
    expect(lineBody.taktTargetSec).toBe(16.5);
  });

  it('5. POST /api/v1/lines/:id/topology atomically reorders and adds stations', async () => {
    const topologyPayload = {
      lineName: 'Line Alpha (Apex Cleanroom)',
      taktTargetSec: 16.0,
      stations: [
        {
          id: 'wc-spg-01',
          code: 'WC-SPG-01',
          name: 'DEK NeoHorizon Screen Printer',
          customerCode: 'PRN-ALPHA',
          type: 'PRINTER',
          sequenceOrder: 1,
          cycleTimeNominalSec: 13.5,
          manufacturer: 'DEK',
          modelName: 'NeoHorizon'
        },
        {
          id: 'wc-new-yamaha',
          code: 'WC-YAM-01',
          name: 'Yamaha YSM20R Placer',
          customerCode: 'MNT-ALPHA-01',
          type: 'PICK_AND_PLACE',
          sequenceOrder: 2,
          cycleTimeNominalSec: 20.5,
          manufacturer: 'Yamaha',
          modelName: 'YSM20R'
        },
        {
          id: 'wc-rfl-01',
          code: 'WC-RFL-01',
          name: 'Heller 1913 MK5 Oven',
          customerCode: 'OVEN-ALPHA',
          type: 'REFLOW',
          sequenceOrder: 3,
          cycleTimeNominalSec: 16.0,
          manufacturer: 'Heller',
          modelName: '1913 MK5'
        }
      ]
    };

    const res = await authFetch('/api/v1/lines/line-smt-01/topology', {
      method: 'POST',
      body: JSON.stringify(topologyPayload)
    });

    expect(res.status).toBe(200);
    const body: any = await res.json();
    expect(body.success).toBe(true);
    expect(body.line.stations.length).toBe(3);
    expect(body.line.stations[0].customerCode).toBe('PRN-ALPHA');
    expect(body.line.stations[1].customerCode).toBe('MNT-ALPHA-01');
    expect(body.line.stations[1].manufacturer).toBe('Yamaha');
    expect(body.line.stations[2].customerCode).toBe('OVEN-ALPHA');
  });
});
