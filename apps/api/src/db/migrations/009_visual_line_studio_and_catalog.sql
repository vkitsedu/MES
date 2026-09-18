-- ============================================================================
-- 009_visual_line_studio_and_catalog.sql
-- Visual Cleanroom Floor Layout & Pluggable Multi-Vendor Machine Studio
-- Forward-only migration following 001-008.
-- ============================================================================

-- 1. Pluggable Multi-Vendor Equipment Catalog
CREATE TABLE IF NOT EXISTS equipment_catalog (
  id VARCHAR(64) PRIMARY KEY,
  manufacturer VARCHAR(64) NOT NULL,
  model_name VARCHAR(128) NOT NULL,
  category VARCHAR(64) NOT NULL,
  default_cycle_time_sec NUMERIC(6,2) DEFAULT 15.0,
  rated_cph INTEGER DEFAULT 0,
  supported_protocols TEXT,
  icon_key VARCHAR(32) DEFAULT 'cpu',
  is_built_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_equip_catalog_mfg ON equipment_catalog(manufacturer);
CREATE INDEX IF NOT EXISTS idx_equip_catalog_cat ON equipment_catalog(category);

-- 2. Line Layout & Takt Metadata
ALTER TABLE production_lines ADD COLUMN IF NOT EXISTS takt_target_sec NUMERIC(6,2) DEFAULT 18.0;
ALTER TABLE production_lines ADD COLUMN IF NOT EXISTS layout_json TEXT;

-- 3. Work Center Presentation & Sequence Extensions
ALTER TABLE work_centers ADD COLUMN IF NOT EXISTS customer_code VARCHAR(64);
ALTER TABLE work_centers ADD COLUMN IF NOT EXISTS sequence_order INTEGER DEFAULT 1;
ALTER TABLE work_centers ADD COLUMN IF NOT EXISTS cycle_time_nominal_sec NUMERIC(6,2) DEFAULT 15.0;
ALTER TABLE work_centers ADD COLUMN IF NOT EXISTS protocol_binding TEXT;
ALTER TABLE work_centers ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(64) DEFAULT 'Fuji';
ALTER TABLE work_centers ADD COLUMN IF NOT EXISTS model_name VARCHAR(128) DEFAULT 'NXT III';

UPDATE work_centers SET sequence_order = 1, customer_code = 'PRN-01' WHERE code IN ('WC-SPG-01', 'WC-PRN-01');
UPDATE work_centers SET sequence_order = 2, customer_code = 'MNT-01' WHERE code IN ('WC-NXT-01', 'WC-MNT-01');
UPDATE work_centers SET sequence_order = 3, customer_code = 'RFW-01' WHERE code IN ('WC-RFL-01', 'WC-RFW-01');
UPDATE work_centers SET sequence_order = 4, customer_code = 'AOI-01' WHERE code IN ('WC-AOI-01');

UPDATE work_centers SET sequence_order = 1, customer_code = 'PRN-02' WHERE code IN ('WC-SPG-02', 'WC-PRN-02');
UPDATE work_centers SET sequence_order = 2, customer_code = 'MNT-02' WHERE code IN ('WC-NXT-02', 'WC-MNT-02');
UPDATE work_centers SET sequence_order = 3, customer_code = 'RFW-02' WHERE code IN ('WC-RFL-02', 'WC-RFW-02');
UPDATE work_centers SET sequence_order = 4, customer_code = 'AOI-02' WHERE code IN ('WC-AOI-02');
