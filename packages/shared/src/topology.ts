export type EquipmentCategory = 
  | 'LASER' 
  | 'PRINTER' 
  | 'SPI' 
  | 'PICK_AND_PLACE' 
  | 'REFLOW' 
  | 'AOI' 
  | 'XRAY' 
  | 'BUFFER';

export type ProtocolType = 
  | 'IPC_CFX' 
  | 'FUJI_NEXIM' 
  | 'SECS_GEM' 
  | 'HERMES' 
  | 'KOH_YOUNG_XML' 
  | 'KIC_PROFILING' 
  | 'GENERIC_TCP' 
  | 'SIMULATOR';

export interface EquipmentCatalogItem {
  id: string;
  manufacturer: string;
  modelName: string;
  category: EquipmentCategory;
  defaultCycleTimeSec: number;
  ratedCph?: number;
  supportedProtocols: ProtocolType[];
  iconKey?: string;
  isBuiltIn: boolean;
  createdAt?: string;
}

export interface LineStationConfig {
  id: string;
  code: string;
  name: string;
  customerCode?: string;
  type: EquipmentCategory | string;
  sequenceOrder: number;
  cycleTimeNominalSec: number;
  manufacturer?: string;
  modelName?: string;
  protocolBinding?: {
    protocol: ProtocolType;
    host?: string;
    port?: number;
    moduleNo?: number;
    options?: Record<string, any>;
  };
  towerLamp?: 'RUN' | 'WAIT' | 'STOP' | 'NONE';
}

export interface LineTopologyConfig {
  id: string;
  code: string;
  name: string;
  status: string;
  taktTargetSec: number;
  stations: LineStationConfig[];
  layoutJson?: string;
}

export interface BatchTopologyUpdatePayload {
  lineName?: string;
  lineCode?: string;
  taktTargetSec?: number;
  status?: string;
  stations: LineStationConfig[];
}
