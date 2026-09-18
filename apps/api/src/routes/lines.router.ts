import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';
import { LineTopologyConfig, LineStationConfig, BatchTopologyUpdatePayload } from '@mes/shared';
import { v4 as uuidv4 } from 'uuid';

export const linesRouter = Router();

// 1. GET / - List all production lines with their ordered stations
linesRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const lines = await db.query<any>(`
      SELECT id, area_id, code, name, status, takt_target_sec, layout_json, created_at
      FROM production_lines
      ORDER BY id ASC
    `);

    const workCenters = await db.query<any>(`
      SELECT 
        id, line_id, code, name, customer_code, type, 
        sequence_order, cycle_time_nominal_sec, manufacturer, 
        model_name, protocol_binding, current_state
      FROM work_centers
      ORDER BY line_id ASC, sequence_order ASC, code ASC
    `);

    const result: LineTopologyConfig[] = lines.map(line => {
      const lineStations: LineStationConfig[] = workCenters
        .filter(wc => wc.line_id === line.id)
        .map(wc => {
          let protocolBinding;
          try {
            protocolBinding = wc.protocol_binding ? JSON.parse(wc.protocol_binding) : undefined;
          } catch {
            protocolBinding = undefined;
          }

          let towerLamp: 'RUN' | 'WAIT' | 'STOP' | 'NONE' = 'RUN';
          const state = wc.current_state || 'RUNNING';
          if (state === 'RUNNING') towerLamp = 'RUN';
          else if (state.includes('STOP') || state.includes('FAULT')) towerLamp = 'STOP';
          else if (state === 'WAIT' || state === 'PAUSED' || state === 'CHANGEOVER') towerLamp = 'WAIT';

          return {
            id: wc.id,
            code: wc.code,
            name: wc.name,
            customerCode: wc.customer_code || wc.code,
            type: wc.type,
            sequenceOrder: wc.sequence_order || 1,
            cycleTimeNominalSec: Number(wc.cycle_time_nominal_sec || 15.0),
            manufacturer: wc.manufacturer || 'Fuji',
            modelName: wc.model_name || 'NXT III',
            protocolBinding,
            towerLamp
          };
        });

      return {
        id: line.id,
        code: line.code,
        name: line.name,
        status: line.status || 'RUNNING',
        taktTargetSec: Number(line.takt_target_sec || 18.0),
        stations: lineStations,
        layoutJson: line.layout_json || undefined
      };
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /:id - Single line topology
linesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { id } = req.params;
    const lines = await db.query<any>(`
      SELECT id, area_id, code, name, status, takt_target_sec, layout_json
      FROM production_lines
      WHERE id = ? OR code = ?
    `, [id, id]);

    if (lines.length === 0) {
      return res.status(404).json({ error: 'Production line not found' });
    }

    const line = lines[0];
    const workCenters = await db.query<any>(`
      SELECT 
        id, line_id, code, name, customer_code, type, 
        sequence_order, cycle_time_nominal_sec, manufacturer, 
        model_name, protocol_binding, current_state
      FROM work_centers
      WHERE line_id = ?
      ORDER BY sequence_order ASC, code ASC
    `, [line.id]);

    const stations: LineStationConfig[] = workCenters.map(wc => ({
      id: wc.id,
      code: wc.code,
      name: wc.name,
      customerCode: wc.customer_code || wc.code,
      type: wc.type,
      sequenceOrder: wc.sequence_order || 1,
      cycleTimeNominalSec: Number(wc.cycle_time_nominal_sec || 15.0),
      manufacturer: wc.manufacturer || 'Fuji',
      modelName: wc.model_name || 'NXT III',
      towerLamp: wc.current_state === 'RUNNING' ? 'RUN' : (wc.current_state?.includes('STOP') ? 'STOP' : 'WAIT')
    }));

    res.json({
      id: line.id,
      code: line.code,
      name: line.name,
      status: line.status || 'RUNNING',
      taktTargetSec: Number(line.takt_target_sec || 18.0),
      stations,
      layoutJson: line.layout_json
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST / - Create a new production line
linesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { code, name, taktTargetSec, areaId } = req.body;
    if (!code || !name) {
      return res.status(400).json({ error: 'Line code and name are required' });
    }

    const id = `line-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36).slice(-4)}`;
    const effectiveAreaId = areaId || 'area-smt-01';
    const takt = Number(taktTargetSec) || 18.0;

    await db.execute(`
      INSERT INTO production_lines (id, area_id, code, name, status, takt_target_sec)
      VALUES (?, ?, ?, ?, 'RUNNING', ?)
    `, [id, effectiveAreaId, code, name, takt]);

    res.status(201).json({
      id,
      code,
      name,
      status: 'RUNNING',
      taktTargetSec: takt,
      stations: []
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. PATCH /:id - Update line metadata
linesRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { id } = req.params;
    const { name, code, taktTargetSec, status } = req.body;

    const existing = await db.query<any>('SELECT id FROM production_lines WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Production line not found' });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (code !== undefined) {
      updates.push('code = ?');
      params.push(code);
    }
    if (taktTargetSec !== undefined) {
      updates.push('takt_target_sec = ?');
      params.push(Number(taktTargetSec));
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }

    if (updates.length > 0) {
      params.push(id);
      await db.execute(`UPDATE production_lines SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    res.json({ success: true, message: 'Line updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. POST /:id/topology - Atomic batch update of line stations, order, and names
linesRouter.post('/:id/topology', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { id } = req.params;
    const payload: BatchTopologyUpdatePayload = req.body;

    const lines = await db.query<any>('SELECT * FROM production_lines WHERE id = ?', [id]);
    if (lines.length === 0) {
      return res.status(404).json({ error: 'Production line not found' });
    }
    const currentLine = lines[0];

    await db.withTransaction(async (tx) => {
      // 1. Update line level properties if provided
      if (payload.lineName || payload.lineCode || payload.taktTargetSec || payload.status) {
        await tx.execute(`
          UPDATE production_lines 
          SET 
            name = COALESCE(?, name),
            code = COALESCE(?, code),
            takt_target_sec = COALESCE(?, takt_target_sec),
            status = COALESCE(?, status)
          WHERE id = ?
        `, [
          payload.lineName || null,
          payload.lineCode || null,
          payload.taktTargetSec ? Number(payload.taktTargetSec) : null,
          payload.status || null,
          id
        ]);
      }

      // 2. Sync stations
      if (Array.isArray(payload.stations)) {
        const submittedStationIds = new Set<string>();

        for (let i = 0; i < payload.stations.length; i++) {
          const st = payload.stations[i];
          const seq = i + 1;
          const protocolStr = st.protocolBinding ? JSON.stringify(st.protocolBinding) : null;
          const nominalCycle = Number(st.cycleTimeNominalSec || 15.0);

          const existingWc = await tx.query<any>('SELECT id FROM work_centers WHERE id = ?', [st.id]);

          if (existingWc.length > 0) {
            submittedStationIds.add(st.id);
            await tx.execute(`
              UPDATE work_centers 
              SET 
                line_id = ?,
                name = ?,
                customer_code = ?,
                code = ?,
                sequence_order = ?,
                cycle_time_nominal_sec = ?,
                manufacturer = ?,
                model_name = ?,
                type = ?,
                protocol_binding = ?
              WHERE id = ?
            `, [
              id,
              st.name,
              st.customerCode || st.code,
              st.code,
              seq,
              nominalCycle,
              st.manufacturer || 'Fuji',
              st.modelName || 'NXT III',
              st.type || 'PICK_AND_PLACE',
              protocolStr,
              st.id
            ]);
          } else {
            const newId = st.id && !st.id.startsWith('new-') ? st.id : `wc-${st.type?.toLowerCase().slice(0, 3) || 'st'}-${uuidv4().slice(0, 6)}`;
            submittedStationIds.add(newId);
            const now = new Date().toISOString();

            await tx.execute(`
              INSERT INTO work_centers (
                id, line_id, code, name, customer_code, area, type, 
                asset_path, current_state, sequence_order, cycle_time_nominal_sec,
                manufacturer, model_name, protocol_binding, last_state_change_time
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'RUNNING', ?, ?, ?, ?, ?, ?)
            `, [
              newId,
              id,
              st.code || `WC-${newId.toUpperCase()}`,
              st.name,
              st.customerCode || st.code || `WC-${newId.toUpperCase()}`,
              currentLine.area_id || 'SMT Cleanroom Bay A',
              st.type || 'PICK_AND_PLACE',
              `ORG-APEX.SITE-NOIDA-P4.AREA-SMT-01.${currentLine.code}.${newId}`,
              seq,
              nominalCycle,
              st.manufacturer || 'Generic',
              st.modelName || 'Standard',
              protocolStr,
              now
            ]);
          }
        }

        // Dissociate any old work centers for this line that were removed
        const currentWcs = await tx.query<any>('SELECT id FROM work_centers WHERE line_id = ?', [id]);
        for (const wc of currentWcs) {
          if (!submittedStationIds.has(wc.id)) {
            await tx.execute('UPDATE work_centers SET line_id = NULL WHERE id = ?', [wc.id]);
          }
        }
      }
    });

    const updatedLine = (await db.query<any>('SELECT * FROM production_lines WHERE id = ?', [id]))[0];
    const updatedWcs = await db.query<any>(`
      SELECT * FROM work_centers 
      WHERE line_id = ? 
      ORDER BY sequence_order ASC, code ASC
    `, [id]);

    res.json({
      success: true,
      message: 'Line topology committed and deployed to MES',
      line: {
        id: updatedLine.id,
        code: updatedLine.code,
        name: updatedLine.name,
        status: updatedLine.status,
        taktTargetSec: Number(updatedLine.takt_target_sec),
        stations: updatedWcs.map((w: any) => ({
          id: w.id,
          code: w.code,
          name: w.name,
          customerCode: w.customer_code,
          type: w.type,
          sequenceOrder: w.sequence_order,
          cycleTimeNominalSec: Number(w.cycle_time_nominal_sec),
          manufacturer: w.manufacturer,
          modelName: w.model_name
        }))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
