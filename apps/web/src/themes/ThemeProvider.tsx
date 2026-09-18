import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  ThemeId,
  ThemeTokens,
  CustomPaletteOptions,
  DEFAULT_CUSTOM_PALETTE,
  ENTERPRISE_THEMES,
  generateCssVariables
} from './theme-definitions';

interface ThemeContextValue {
  themeId: ThemeId;
  theme: ThemeTokens;
  setThemeId: (id: ThemeId) => void;
  customPalette: CustomPaletteOptions;
  setCustomPalette: (updates: Partial<CustomPaletteOptions>) => void;
  resetTheme: () => void;
  availableThemes: ThemeTokens[];
}

const STORAGE_KEY = 'imes_theme_preferences_v2';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.themeId && ENTERPRISE_THEMES[parsed.themeId as ThemeId]) {
          return parsed.themeId as ThemeId;
        }
      }
    } catch {}
    return 'obsidian';
  });

  const [customPalette, setCustomPaletteState] = useState<CustomPaletteOptions>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.customPalette) {
          return { ...DEFAULT_CUSTOM_PALETTE, ...parsed.customPalette };
        }
      }
    } catch {}
    return DEFAULT_CUSTOM_PALETTE;
  });

  const activeTheme = useMemo(() => {
    return ENTERPRISE_THEMES[themeId] || ENTERPRISE_THEMES.obsidian;
  }, [themeId]);

  // Apply CSS variables and dataset attribute to root document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeId);

    const vars = generateCssVariables(activeTheme, customPalette);
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }

    if (customPalette.showScanlines) {
      root.classList.add('mes-scanlines-active');
    } else {
      root.classList.remove('mes-scanlines-active');
    }

    // Save to localStorage
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          themeId,
          customPalette
        })
      );
    } catch {}
  }, [themeId, activeTheme, customPalette]);

  const setThemeId = useCallback((id: ThemeId) => {
    if (ENTERPRISE_THEMES[id]) {
      setThemeIdState(id);
    }
  }, []);

  const setCustomPalette = useCallback((updates: Partial<CustomPaletteOptions>) => {
    setCustomPaletteState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetTheme = useCallback(() => {
    setThemeIdState('obsidian');
    setCustomPaletteState(DEFAULT_CUSTOM_PALETTE);
  }, []);

  const availableThemes = useMemo(() => {
    return Object.values(ENTERPRISE_THEMES);
  }, []);

  const value = useMemo(
    () => ({
      themeId,
      theme: activeTheme,
      setThemeId,
      customPalette,
      setCustomPalette,
      resetTheme,
      availableThemes
    }),
    [themeId, activeTheme, setThemeId, customPalette, setCustomPalette, resetTheme, availableThemes]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
