-- ============================================================================
-- 008_fuji_imes_and_management_monitor.sql
-- Fuji iMES 4.0 Protocol & Management Monitor Infrastructure
-- Forward-only migration following 001-007.
-- ============================================================================

-- 1. Component PCB BOM Reference Designator Mapping (from BOMLIST)
CREATE TABLE IF NOT EXISTS pcb_bom_designators (
  id VARCHAR(64) PRIMARY KEY,
  program_name VARCHAR(128) NOT NULL,
  block_no INTEGER NOT NULL DEFAULT 1,
  part_number VARCHAR(128) NOT NULL,
  ref_des VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bom_des_prog_part ON pcb_bom_designators(program_name, part_number);
CREATE INDEX IF NOT EXISTS idx_bom_des_prog_ref ON pcb_bom_designators(program_name, ref_des);

-- 2. Fuji Active Recipes & Slot Allocation (from PGCHANGEII)
CREATE TABLE IF NOT EXISTS fuji_active_recipes (
  id VARCHAR(64) PRIMARY KEY,
  line_name VARCHAR(64) NOT NULL,
  machine_name VARCHAR(64) NOT NULL,
  module_no INTEGER NOT NULL DEFAULT 1,
  lane_no INTEGER NOT NULL DEFAULT 1,
  program_name VARCHAR(128) NOT NULL,
  stage_no INTEGER NOT NULL DEFAULT 1,
  slot_no INTEGER NOT NULL,
  part_number VARCHAR(128) NOT NULL,
  verified_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fuji_recipes_prog ON fuji_active_recipes(line_name, program_name);
CREATE INDEX IF NOT EXISTS idx_fuji_recipes_slot ON fuji_active_recipes(machine_name, slot_no);

-- 3. Suction Nozzle Predictive Telemetry & Error Rates (from PDERROR / NOZZLECOUNT)
CREATE TABLE IF NOT EXISTS machine_nozzle_telemetry (
  id VARCHAR(64) PRIMARY KEY,
  machine_id VARCHAR(64) NOT NULL,
  module_no INTEGER NOT NULL DEFAULT 1,
  head_id VARCHAR(64) NOT NULL,
  nozzle_id VARCHAR(64) NOT NULL,
  pick_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  error_rate_pct NUMERIC(6,3) NOT NULL DEFAULT 0.0,
  last_error_at TIMESTAMP,
  last_updated TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_nozzle_mach_id ON machine_nozzle_telemetry(machine_id, nozzle_id);
CREATE INDEX IF NOT EXISTS idx_nozzle_err_rate ON machine_nozzle_telemetry(error_rate_pct);

-- 4. SMT Placement Balancing Rate (PBR) & Line Balance Metrics
CREATE TABLE IF NOT EXISTS smt_line_balance_metrics (
  id VARCHAR(64) PRIMARY KEY,
  line_id VARCHAR(64) NOT NULL,
  work_center_id VARCHAR(64),
  program_name VARCHAR(128),
  current_pbr NUMERIC(5,2) NOT NULL DEFAULT 86.0,
  optimized_pbr NUMERIC(5,2) NOT NULL DEFAULT 95.0,
  bottleneck_module_no INTEGER DEFAULT 1,
  bottleneck_cycle_time NUMERIC(6,2) DEFAULT 0.0,
  recorded_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_smt_pbr_line ON smt_line_balance_metrics(line_id, recorded_at);

-- 5. Mounter Drop & Attrition Rate by Shift (Samsung G-MES PPM Standard)
CREATE TABLE IF NOT EXISTS smt_shift_drop_records (
  id VARCHAR(64) PRIMARY KEY,
  shift_code VARCHAR(32) NOT NULL,
  line_id VARCHAR(64) NOT NULL,
  machine_id VARCHAR(64) NOT NULL,
  pickups INTEGER NOT NULL DEFAULT 0,
  total_errors INTEGER NOT NULL DEFAULT 0,
  recog_errors INTEGER NOT NULL DEFAULT 0,
  pickup_errors INTEGER NOT NULL DEFAULT 0,
  drop_rate_ppm NUMERIC(8,2) NOT NULL DEFAULT 0.0,
  recog_drop_rate_ppm NUMERIC(8,2) NOT NULL DEFAULT 0.0,
  pickup_drop_rate_ppm NUMERIC(8,2) NOT NULL DEFAULT 0.0,
  recorded_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_smt_drop_shift ON smt_shift_drop_records(shift_code, line_id);
