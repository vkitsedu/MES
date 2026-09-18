import { describe, it, expect } from 'vitest';
import { ENTERPRISE_THEMES, ThemeId, generateCssVariables } from '../src/themes/theme-definitions';

/**
 * Calculates relative luminance for an sRGB color per WCAG 2.1 specs
 */
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Computes contrast ratio (X:1) between foreground and background
 */
function getContrastRatio(fgHex: string, bgHex: string): number {
  const lum1 = getLuminance(fgHex);
  const lum2 = getLuminance(bgHex);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

describe('i-MES 2.0 Design System Specification & Accessibility Verification', () => {
  const themeIds: ThemeId[] = ['obsidian', 'nordic', 'titanium', 'kyoto', 'monaco', 'tactical'];

  describe('1. WCAG 2.1 Contrast Standards (Section 4.1 of Brief)', () => {
    it('verifies all 6 themes satisfy WCAG-AA (>= 4.5:1) for primary text over canvas', () => {
      themeIds.forEach(id => {
        const theme = ENTERPRISE_THEMES[id];
        const ratio = getContrastRatio(theme.textPrimary, theme.bgCanvas);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('verifies all 6 themes satisfy WCAG-AA (>= 4.5:1) for primary text over surface cards', () => {
      themeIds.forEach(id => {
        const theme = ENTERPRISE_THEMES[id];
        const ratio = getContrastRatio(theme.textPrimary, theme.bgSurface);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('verifies Nordic Clinical Light theme achieves high readability without pure white canvas glare', () => {
      const nordic = ENTERPRISE_THEMES.nordic;
      expect(nordic.bgCanvas).not.toBe('#FFFFFF');
      const ratio = getContrastRatio(nordic.textPrimary, nordic.bgCanvas);
      expect(ratio).toBeGreaterThan(10.0); // Clinical high contrast
    });
  });

  describe('2. Design System Elevation & Shadow Tokens (Section 4.3 of Brief)', () => {
    it('verifies every theme defines subtle, elevated, and modal shadow tokens', () => {
      themeIds.forEach(id => {
        const theme = ENTERPRISE_THEMES[id];
        expect(theme.shadowSubtle).toBeDefined();
        expect(theme.shadowElevated).toBeDefined();
        expect(theme.shadowModal).toBeDefined();
        expect(theme.shadowElevated).toContain('rgba');
      });
    });

    it('generates correct CSS variables for shadows and geometry', () => {
      const vars = generateCssVariables(ENTERPRISE_THEMES.obsidian);
      expect(vars['--mes-shadow-subtle']).toBe(ENTERPRISE_THEMES.obsidian.shadowSubtle);
      expect(vars['--mes-shadow-elevated']).toBe(ENTERPRISE_THEMES.obsidian.shadowElevated);
      expect(vars['--mes-shadow-modal']).toBe(ENTERPRISE_THEMES.obsidian.shadowModal);
      expect(vars['--mes-radius']).toBe('2px');
    });
  });

  describe('3. Semantic Industrial Telemetry Consistency (SEMI E10 & Section 4.1)', () => {
    it('verifies pass, warn, halt, and idle status tokens exist in every theme and remain visually distinct', () => {
      themeIds.forEach(id => {
        const theme = ENTERPRISE_THEMES[id];
        expect(theme.statusPass).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.statusWarn).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.statusHalt).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(theme.statusIdle).toMatch(/^#[0-9A-Fa-f]{6}$/);

        // Ensure status colors are never identical to one another
        expect(theme.statusPass).not.toBe(theme.statusHalt);
        expect(theme.statusWarn).not.toBe(theme.statusHalt);
      });
    });
  });
});
