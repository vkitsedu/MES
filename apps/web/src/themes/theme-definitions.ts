/**
 * i-MES 2.0 Enterprise Design System - Theme Definitions & Token Map
 * Calibrated for industrial cleanrooms, overhead andon displays, and rugged mobile tablets.
 */

export type ThemeId = 'obsidian' | 'nordic' | 'titanium' | 'kyoto' | 'monaco' | 'tactical';

export interface ThemeTokens {
  id: ThemeId;
  name: string;
  category: 'DARK' | 'LIGHT' | 'CRT' | 'TACTICAL';
  tagline: string;
  description: string;
  recommendedEnvironment: string;

  // Surfaces
  bgCanvas: string;
  bgSurface: string;
  bgWell: string;
  bgHeader: string;
  bgTabActive: string;
  bgTabInactive: string;
  bgModal: string;

  // Dividers & Borders
  borderSubtle: string;
  borderStrong: string;
  borderHairline: string;
  borderAccentGlow: string;

  // Typography
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDim: string;
  textInverse: string;

  // Brand & Interactive Accents
  accentPrimary: string;
  accentHover: string;
  accentMuted: string;
  accentRing: string;

  // Industrial Telemetry Semantics (SEMI E10 & ISA-101)
  statusPass: string;
  statusPassMuted: string;
  statusWarn: string;
  statusWarnMuted: string;
  statusHalt: string;
  statusHaltMuted: string;
  statusIdle: string;

  // Corner Geometry & Aesthetics
  radiusDefault: string;
  contrastScore: string;

  // Elevation & Shadows
  shadowSubtle: string;
  shadowElevated: string;
  shadowModal: string;
}

export interface CustomPaletteOptions {
  customAccentHex?: string;
  customCanvasHex?: string;
  radiusMode: 'SHARP_0PX' | 'CLEANROOM_2PX' | 'SUBTLE_4PX';
  densityMode: 'COMPACT' | 'STANDARD';
  showScanlines: boolean;
}

export const DEFAULT_CUSTOM_PALETTE: CustomPaletteOptions = {
  radiusMode: 'CLEANROOM_2PX',
  densityMode: 'STANDARD',
  showScanlines: false
};

export const ENTERPRISE_THEMES: Record<ThemeId, ThemeTokens> = {
  // 1. Obsidian Foundry (DPX Cleanroom Navy Flagship)
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Cleanroom Navy',
    category: 'DARK',
    tagline: 'DPX Enterprise SMT & Deep Navy Cleanroom',
    description: 'Deep cleanroom navy (#0A192F) chassis with brilliant electric blue (#0088FF) active accents and SEMI E10 industrial telemetry.',
    recommendedEnvironment: 'Standard Cleanroom / 24-7 Production Floor',
    bgCanvas: '#070D18',
    bgSurface: '#0A192F',
    bgWell: '#0D1B2A',
    bgHeader: '#0A192F',
    bgTabActive: '#0088FF',
    bgTabInactive: '#0A192F',
    bgModal: '#0A192F',
    borderSubtle: '#1E293B',
    borderStrong: '#2A3B54',
    borderHairline: '#162234',
    borderAccentGlow: 'rgba(0, 136, 255, 0.30)',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textDim: '#475569',
    textInverse: '#070D18',
    accentPrimary: '#0088FF',
    accentHover: '#2563EB',
    accentMuted: 'rgba(0, 136, 255, 0.15)',
    accentRing: 'rgba(0, 136, 255, 0.35)',
    statusPass: '#059669',
    statusPassMuted: 'rgba(5, 150, 105, 0.15)',
    statusWarn: '#D97706',
    statusWarnMuted: 'rgba(217, 119, 6, 0.15)',
    statusHalt: '#DC2626',
    statusHaltMuted: 'rgba(220, 38, 38, 0.15)',
    statusIdle: '#0284C7',
    radiusDefault: '2px',
    contrastScore: '15.2:1 (WCAG AAA)',
    shadowSubtle: '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
    shadowElevated: '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 4px 10px -2px rgba(0, 0, 0, 0.4)',
    shadowModal: '0 25px 50px -12px rgba(0, 0, 0, 0.85)'
  },

  // 2. Nordic Precision (DPX Cleanroom Light / Siemens Opcenter)
  nordic: {
    id: 'nordic',
    name: 'Nordic Cleanroom Light',
    category: 'LIGHT',
    tagline: 'Siemens Opcenter & DPX Daylight Cleanroom Light',
    description: 'Glare-resistant matte cleanroom paper substrate with DPX navy header, electric blue active pills, and crisp white station panels.',
    recommendedEnvironment: 'High-Lux Cleanroom Bay / Metrology Lab',
    bgCanvas: '#EEF2F6',
    bgSurface: '#FFFFFF',
    bgWell: '#F1F5F9',
    bgHeader: '#0A192F',
    bgTabActive: '#0088FF',
    bgTabInactive: '#0D1B2A',
    bgModal: '#FFFFFF',
    borderSubtle: '#CBD5E1',
    borderStrong: '#94A3B8',
    borderHairline: '#E2E8F0',
    borderAccentGlow: 'rgba(0, 136, 255, 0.20)',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    textDim: '#94A3B8',
    textInverse: '#FFFFFF',
    accentPrimary: '#0088FF',
    accentHover: '#2563EB',
    accentMuted: 'rgba(0, 136, 255, 0.10)',
    accentRing: 'rgba(0, 136, 255, 0.25)',
    statusPass: '#059669',
    statusPassMuted: 'rgba(5, 150, 105, 0.12)',
    statusWarn: '#D97706',
    statusWarnMuted: 'rgba(217, 119, 6, 0.12)',
    statusHalt: '#DC2626',
    statusHaltMuted: 'rgba(220, 38, 38, 0.12)',
    statusIdle: '#0284C7',
    radiusDefault: '2px',
    contrastScore: '13.2:1 (WCAG AAA)',
    shadowSubtle: '0 1px 3px 0 rgba(15, 23, 42, 0.08)',
    shadowElevated: '0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.06)',
    shadowModal: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
  },

  // 3. Titanium Cyber (Linear / Apple Pro / Automotive Aerospace)
  titanium: {
    id: 'titanium',
    name: 'Titanium Cyber',
    category: 'DARK',
    tagline: 'Linear SaaS & Apple Pro Anodized Metal',
    description: 'Dark anthracite metal with DPX electric blue and sky undertones. Crafted for modern engineering reviews.',
    recommendedEnvironment: 'Engineering R&D / Executive Briefings',
    bgCanvas: '#080C14',
    bgSurface: '#0E1726',
    bgWell: '#0A121E',
    bgHeader: '#0A192F',
    bgTabActive: '#0088FF',
    bgTabInactive: '#0A121E',
    bgModal: '#0E1726',
    borderSubtle: '#1E2C42',
    borderStrong: '#2E4264',
    borderHairline: '#162335',
    borderAccentGlow: 'rgba(0, 136, 255, 0.25)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textDim: '#475569',
    textInverse: '#080C14',
    accentPrimary: '#0088FF',
    accentHover: '#2563EB',
    accentMuted: 'rgba(0, 136, 255, 0.15)',
    accentRing: 'rgba(0, 136, 255, 0.35)',
    statusPass: '#059669',
    statusPassMuted: 'rgba(5, 150, 105, 0.15)',
    statusWarn: '#D97706',
    statusWarnMuted: 'rgba(217, 119, 6, 0.15)',
    statusHalt: '#DC2626',
    statusHaltMuted: 'rgba(220, 38, 38, 0.15)',
    statusIdle: '#0284C7',
    radiusDefault: '3px',
    contrastScore: '15.1:1 (WCAG AAA)',
    shadowSubtle: '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
    shadowElevated: '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 4px 10px -2px rgba(0, 0, 0, 0.4)',
    shadowModal: '0 25px 50px -12px rgba(0, 0, 0, 0.85)'
  },

  // 4. Kyoto Phosphor (Fuji NXT / Classic Japanese SMT Console)
  kyoto: {
    id: 'kyoto',
    name: 'Kyoto Phosphor',
    category: 'CRT',
    tagline: 'Fuji NXT & Japanese SMT Line Machine Console',
    description: 'High-contrast CRT green phosphor over pitch-black console housing. Native aesthetic for seasoned Fuji & Panasonic operators.',
    recommendedEnvironment: 'Machine-Side Touchscreens / Line Stations',
    bgCanvas: '#060A06',
    bgSurface: '#0B120B',
    bgWell: '#070D07',
    bgHeader: '#090F09',
    bgTabActive: '#101B10',
    bgTabInactive: '#070D07',
    bgModal: '#0D160D',
    borderSubtle: '#162416',
    borderStrong: '#253D25',
    borderHairline: '#101A10',
    borderAccentGlow: 'rgba(34, 197, 94, 0.25)',
    textPrimary: '#DCFCE7',
    textSecondary: '#86EFAC',
    textMuted: '#4ADE80',
    textDim: '#166534',
    textInverse: '#060A06',
    accentPrimary: '#22C55E',
    accentHover: '#16A34A',
    accentMuted: 'rgba(34, 197, 94, 0.12)',
    accentRing: 'rgba(34, 197, 94, 0.35)',
    statusPass: '#22C55E',
    statusPassMuted: 'rgba(34, 197, 94, 0.15)',
    statusWarn: '#EAB308',
    statusWarnMuted: 'rgba(234, 179, 8, 0.15)',
    statusHalt: '#EF4444',
    statusHaltMuted: 'rgba(239, 68, 68, 0.15)',
    statusIdle: '#3F6212',
    radiusDefault: '0px',
    contrastScore: '16.5:1 (WCAG AAA)',
    shadowSubtle: '0 1px 3px 0 rgba(0, 0, 0, 0.5)',
    shadowElevated: '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 4px 10px -2px rgba(0, 0, 0, 0.5)',
    shadowModal: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
  },

  // 5. Monaco Sapphire (DPX Deep Ocean SCADA & Telemetry)
  monaco: {
    id: 'monaco',
    name: 'Monaco Sapphire',
    category: 'DARK',
    tagline: 'DPX Deep Ocean SCADA & Industrial Telemetry',
    description: 'Deep oceanic sapphire (#0A192F) with vibrant electric blue and cyan waves. Engineered for plant executives and multi-line fleet command walls.',
    recommendedEnvironment: 'Shop-Floor Andon Displays / Plant Cockpit',
    bgCanvas: '#060C1A',
    bgSurface: '#0A192F',
    bgWell: '#0D1B2A',
    bgHeader: '#0A192F',
    bgTabActive: '#0088FF',
    bgTabInactive: '#0A192F',
    bgModal: '#0A192F',
    borderSubtle: '#1E293B',
    borderStrong: '#2A3B54',
    borderHairline: '#162234',
    borderAccentGlow: 'rgba(0, 136, 255, 0.30)',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textDim: '#475569',
    textInverse: '#060C1A',
    accentPrimary: '#0088FF',
    accentHover: '#2563EB',
    accentMuted: 'rgba(0, 136, 255, 0.15)',
    accentRing: 'rgba(0, 136, 255, 0.35)',
    statusPass: '#059669',
    statusPassMuted: 'rgba(5, 150, 105, 0.15)',
    statusWarn: '#D97706',
    statusWarnMuted: 'rgba(217, 119, 6, 0.15)',
    statusHalt: '#DC2626',
    statusHaltMuted: 'rgba(220, 38, 38, 0.15)',
    statusIdle: '#0284C7',
    radiusDefault: '2px',
    contrastScore: '15.4:1 (WCAG AAA)',
    shadowSubtle: '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
    shadowElevated: '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 4px 10px -2px rgba(0, 0, 0, 0.4)',
    shadowModal: '0 25px 50px -12px rgba(0, 0, 0, 0.85)'
  },

  // 6. Tactical Amber (Aerospace HUD / High-Contrast Mil-Spec)
  tactical: {
    id: 'tactical',
    name: 'Tactical Amber',
    category: 'TACTICAL',
    tagline: 'Fighter Cockpit HUD & Laser Interlock Telemetry',
    description: 'Aviation amber luminescence over matte carbon. Ideal for direct sunlight environments or low eye-strain 12-hour night shifts.',
    recommendedEnvironment: 'Night Shift Cleanroom / Direct Sunlight Glare',
    bgCanvas: '#080809',
    bgSurface: '#111114',
    bgWell: '#0C0C0E',
    bgHeader: '#0E0E10',
    bgTabActive: '#D97706',
    bgTabInactive: '#0C0C0E',
    bgModal: '#151413',
    borderSubtle: '#262422',
    borderStrong: '#3D3833',
    borderHairline: '#1C1A18',
    borderAccentGlow: 'rgba(217, 119, 6, 0.25)',
    textPrimary: '#FFF7ED',
    textSecondary: '#FED7AA',
    textMuted: '#D97706',
    textDim: '#7C2D12',
    textInverse: '#080809',
    accentPrimary: '#D97706',
    accentHover: '#B45309',
    accentMuted: 'rgba(217, 119, 6, 0.15)',
    accentRing: 'rgba(217, 119, 6, 0.35)',
    statusPass: '#059669',
    statusPassMuted: 'rgba(5, 150, 105, 0.15)',
    statusWarn: '#D97706',
    statusWarnMuted: 'rgba(217, 119, 6, 0.15)',
    statusHalt: '#DC2626',
    statusHaltMuted: 'rgba(220, 38, 38, 0.15)',
    statusIdle: '#0284C7',
    radiusDefault: '0px',
    contrastScore: '16.0:1 (WCAG AAA)',
    shadowSubtle: '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
    shadowElevated: '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 4px 10px -2px rgba(0, 0, 0, 0.4)',
    shadowModal: '0 25px 50px -12px rgba(0, 0, 0, 0.85)'
  }
};

/**
 * Generates an object of CSS variables from ThemeTokens + CustomPaletteOptions
 */
export function generateCssVariables(
  theme: ThemeTokens,
  custom?: Partial<CustomPaletteOptions>
): Record<string, string> {
  const canvas = custom?.customCanvasHex || theme.bgCanvas;
  const accent = custom?.customAccentHex || theme.accentPrimary;

  let radius = theme.radiusDefault;
  if (custom?.radiusMode === 'SHARP_0PX') radius = '0px';
  if (custom?.radiusMode === 'CLEANROOM_2PX') radius = '2px';
  if (custom?.radiusMode === 'SUBTLE_4PX') radius = '4px';

  return {
    '--mes-bg-canvas': canvas,
    '--mes-bg-surface': theme.bgSurface,
    '--mes-bg-well': theme.bgWell,
    '--mes-bg-header': theme.bgHeader,
    '--mes-bg-tab-active': theme.bgTabActive,
    '--mes-bg-tab-inactive': theme.bgTabInactive,
    '--mes-bg-modal': theme.bgModal,

    '--mes-border-subtle': theme.borderSubtle,
    '--mes-border-strong': theme.borderStrong,
    '--mes-border-hairline': theme.borderHairline,
    '--mes-border-accent-glow': theme.borderAccentGlow,

    '--mes-text-primary': theme.textPrimary,
    '--mes-text-secondary': theme.textSecondary,
    '--mes-text-muted': theme.textMuted,
    '--mes-text-dim': theme.textDim,
    '--mes-text-inverse': theme.textInverse,

    '--mes-accent-primary': accent,
    '--mes-accent-hover': custom?.customAccentHex ? accent : theme.accentHover,
    '--mes-accent-muted': custom?.customAccentHex ? `${accent}20` : theme.accentMuted,
    '--mes-accent-ring': custom?.customAccentHex ? `${accent}40` : theme.accentRing,

    '--mes-status-pass': theme.statusPass,
    '--mes-status-pass-muted': theme.statusPassMuted,
    '--mes-status-warn': theme.statusWarn,
    '--mes-status-warn-muted': theme.statusWarnMuted,
    '--mes-status-halt': theme.statusHalt,
    '--mes-status-halt-muted': theme.statusHaltMuted,
    '--mes-status-idle': theme.statusIdle,

    '--mes-radius': radius,

    '--mes-shadow-subtle': theme.shadowSubtle,
    '--mes-shadow-elevated': theme.shadowElevated,
    '--mes-shadow-modal': theme.shadowModal
  };
}
