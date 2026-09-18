import { describe, it, expect } from 'vitest';
import {
  ENTERPRISE_THEMES,
  ThemeId,
  generateCssVariables,
  DEFAULT_CUSTOM_PALETTE
} from '../src/themes/theme-definitions';

describe('i-MES 2.0 Theme Engine & Design Token Architecture', () => {
  const themeKeys: ThemeId[] = ['obsidian', 'nordic', 'titanium', 'kyoto', 'monaco', 'tactical'];

  describe('1. Theme Catalog Integrity', () => {
    it('defines exactly the 6 enterprise cleanroom themes', () => {
      const definedKeys = Object.keys(ENTERPRISE_THEMES);
      expect(definedKeys).toHaveLength(6);
      themeKeys.forEach((key) => {
        expect(ENTERPRISE_THEMES[key]).toBeDefined();
        expect(ENTERPRISE_THEMES[key].id).toBe(key);
      });
    });

    it('validates every theme supplies all required surface, border, text, and telemetry tokens', () => {
      themeKeys.forEach((key) => {
        const theme = ENTERPRISE_THEMES[key];

        // Semantic identity
        expect(theme.name).toBeTruthy();
        expect(theme.tagline).toBeTruthy();
        expect(theme.description).toBeTruthy();
        expect(theme.recommendedEnvironment).toBeTruthy();
        expect(['DARK', 'LIGHT', 'CRT', 'TACTICAL']).toContain(theme.category);

        // Surfaces
        expect(theme.bgCanvas).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.bgSurface).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.bgWell).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.bgHeader).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.bgTabActive).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.bgTabInactive).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.bgModal).toMatch(/^#[0-9A-Fa-f]{6}$/);

        // Borders
        expect(theme.borderSubtle).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.borderStrong).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.borderHairline).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.borderAccentGlow).toBeDefined();

        // Typography
        expect(theme.textPrimary).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.textSecondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.textMuted).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.textDim).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.textInverse).toMatch(/^#[0-9A-Fa-f]{6}$/);

        // Accents
        expect(theme.accentPrimary).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.accentHover).toMatch(/^#[0-9A-Fa-f]{6}$/);

        // SEMI E10 Telemetry
        expect(theme.statusPass).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.statusWarn).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.statusHalt).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.statusIdle).toMatch(/^#[0-9A-Fa-f]{6}$/);

        // Contrast and Geometry
        expect(theme.radiusDefault).toMatch(/^[0-9]+px$/);
        expect(theme.contrastScore).toBeTruthy();
      });
    });

    it('verifies Nordic is certified as cleanroom light mode and Kyoto as CRT phosphor', () => {
      expect(ENTERPRISE_THEMES.nordic.category).toBe('LIGHT');
      expect(ENTERPRISE_THEMES.nordic.bgCanvas).toBe('#EEF2F6');

      expect(ENTERPRISE_THEMES.kyoto.category).toBe('CRT');
      expect(ENTERPRISE_THEMES.kyoto.accentPrimary).toBe('#22C55E');
    });
  });

  describe('2. CSS Variable Token Generator', () => {
    it('generates standard CSS variables for Obsidian without overrides', () => {
      const vars = generateCssVariables(ENTERPRISE_THEMES.obsidian, DEFAULT_CUSTOM_PALETTE);

      expect(vars['--mes-bg-canvas']).toBe(ENTERPRISE_THEMES.obsidian.bgCanvas);
      expect(vars['--mes-bg-surface']).toBe(ENTERPRISE_THEMES.obsidian.bgSurface);
      expect(vars['--mes-accent-primary']).toBe(ENTERPRISE_THEMES.obsidian.accentPrimary);
      expect(vars['--mes-radius']).toBe('2px'); // default cleanroom mode
      expect(vars['--mes-status-pass']).toBe(ENTERPRISE_THEMES.obsidian.statusPass);
    });

    it('correctly applies custom accent color override and auto-computes hover/ring', () => {
      const customColor = '#EC4899'; // Industrial Magenta
      const vars = generateCssVariables(ENTERPRISE_THEMES.obsidian, {
        ...DEFAULT_CUSTOM_PALETTE,
        customAccentHex: customColor
      });

      expect(vars['--mes-accent-primary']).toBe(customColor);
      expect(vars['--mes-accent-hover']).toBe(customColor);
      expect(vars['--mes-accent-muted']).toBe(`${customColor}20`);
      expect(vars['--mes-accent-ring']).toBe(`${customColor}40`);
    });

    it('correctly applies custom canvas hex override', () => {
      const customCanvas = '#020408';
      const vars = generateCssVariables(ENTERPRISE_THEMES.obsidian, {
        ...DEFAULT_CUSTOM_PALETTE,
        customCanvasHex: customCanvas
      });

      expect(vars['--mes-bg-canvas']).toBe(customCanvas);
    });

    it('correctly applies radius modes: SHARP_0PX, CLEANROOM_2PX, SUBTLE_4PX', () => {
      const sharpVars = generateCssVariables(ENTERPRISE_THEMES.titanium, {
        radiusMode: 'SHARP_0PX',
        densityMode: 'STANDARD',
        showScanlines: false
      });
      expect(sharpVars['--mes-radius']).toBe('0px');

      const cleanroomVars = generateCssVariables(ENTERPRISE_THEMES.titanium, {
        radiusMode: 'CLEANROOM_2PX',
        densityMode: 'STANDARD',
        showScanlines: false
      });
      expect(cleanroomVars['--mes-radius']).toBe('2px');

      const subtleVars = generateCssVariables(ENTERPRISE_THEMES.titanium, {
        radiusMode: 'SUBTLE_4PX',
        densityMode: 'STANDARD',
        showScanlines: false
      });
      expect(subtleVars['--mes-radius']).toBe('4px');
    });
  });
});
