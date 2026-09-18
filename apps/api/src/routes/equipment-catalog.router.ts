import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';
import { EquipmentCatalogItem } from '@mes/shared';
import { v4 as uuidv4 } from 'uuid';

export const equipmentCatalogRouter = Router();

// GET / - List all equipment in catalog
equipmentCatalogRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const rows = await db.query<any>(`
      SELECT 
        id, manufacturer, model_name, category, 
        default_cycle_time_sec, rated_cph, supported_protocols, 
        icon_key, is_built_in, created_at
      FROM equipment_catalog
      ORDER BY category ASC, manufacturer ASC, model_name ASC
    `);

    const items: EquipmentCatalogItem[] = rows.map(r => {
      let protocols = [];
      try {
        protocols = typeof r.supported_protocols === 'string' ? JSON.parse(r.supported_protocols) : (r.supported_protocols || []);
      } catch {
        protocols = ['IPC_CFX'];
      }

      return {
        id: r.id,
        manufacturer: r.manufacturer,
        modelName: r.model_name,
        category: r.category,
        defaultCycleTimeSec: Number(r.default_cycle_time_sec || 15.0),
        ratedCph: r.rated_cph ? Number(r.rated_cph) : undefined,
        supportedProtocols: protocols,
        iconKey: r.icon_key || 'cpu',
        isBuiltIn: Boolean(r.is_built_in),
        createdAt: r.created_at
      };
    });

    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Register a new machine model (Dynamic multi-vendor expansion)
equipmentCatalogRouter.post('/', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { 
      manufacturer, 
      modelName, 
      category, 
      defaultCycleTimeSec, 
      ratedCph, 
      supportedProtocols,
      iconKey 
    } = req.body;

    if (!manufacturer || !modelName || !category) {
      return res.status(400).json({ 
        error: 'Manufacturer, modelName, and category are required' 
      });
    }

    const id = `cat-${manufacturer.toLowerCase().slice(0, 3)}-${uuidv4().slice(0, 8)}`;
    const cycleTime = Number(defaultCycleTimeSec) || 15.0;
    const cph = ratedCph ? Number(ratedCph) : 0;
    const protocolsStr = JSON.stringify(supportedProtocols || ['IPC_CFX', 'GENERIC_TCP']);
    const icon = iconKey || 'cpu';

    await db.execute(`
      INSERT INTO equipment_catalog (
        id, manufacturer, model_name, category, default_cycle_time_sec,
        rated_cph, supported_protocols, icon_key, is_built_in
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `, [id, manufacturer, modelName, category, cycleTime, cph, protocolsStr, icon]);

    const created: EquipmentCatalogItem = {
      id,
      manufacturer,
      modelName,
      category,
      defaultCycleTimeSec: cycleTime,
      ratedCph: cph > 0 ? cph : undefined,
      supportedProtocols: supportedProtocols || ['IPC_CFX', 'GENERIC_TCP'],
      iconKey: icon,
      isBuiltIn: false
    };

    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
