import React, { useState } from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import { ThemeId, ENTERPRISE_THEMES } from '../../themes/theme-definitions';
import { Palette, Check, Sparkles, Sliders, RotateCcw, X, Eye, ShieldCheck, Sun, Moon, Monitor } from 'lucide-react';

interface ThemePaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCENT_PRESETS = [
  { name: 'Cryo Cyan', hex: '#38BDF8', category: 'Standard' },
  { name: 'Phosphor Green', hex: '#22C55E', category: 'Fuji CRT' },
  { name: 'Electric Indigo', hex: '#818CF8', category: 'Linear' },
  { name: 'Cockpit Amber', hex: '#F97316', category: 'Tactical' },
  { name: 'Prussian Cobalt', hex: '#1E40AF', category: 'Clinical' },
  { name: 'Laser Ruby', hex: '#F43F5E', category: 'Alarm' },
  { name: 'High-Lux Gold', hex: '#FBBF24', category: 'Telemetry' },
  { name: 'Teal Surge', hex: '#06B6D4', category: 'Maritime' },
];

const SUBSTRATE_PRESETS = [
  { name: 'OLED Pitch Black', hex: '#000000', desc: 'Zero glow on OLED / andon monitors' },
  { name: 'Cold Obsidian', hex: '#06080C', desc: 'Factory default deep graphite' },
  { name: 'Slate Anthracite', hex: '#0E1118', desc: 'Warm aerospace metal tone' },
  { name: 'Clinical Light', hex: '#EEF2F6', desc: 'Matte daylight cleanroom paper' }
];

export const ThemePaletteModal: React.FC<ThemePaletteModalProps> = ({ isOpen, onClose }) => {
  const { themeId, setThemeId, customPalette, setCustomPalette, resetTheme, availableThemes } = useTheme();
  const [activeTab, setActiveTab] = useState<'GALLERY' | 'CUSTOMIZER'>('GALLERY');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 font-mono animate-in fade-in duration-150"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="w-full max-w-4xl bg-[var(--mes-bg-modal)] border border-[var(--mes-border-strong)] rounded-[var(--mes-radius)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ borderColor: 'var(--mes-border-strong)' }}
      >
        {/* Modal Header */}
        <div className="bg-[var(--mes-bg-header)] px-4 py-3 border-b border-[var(--mes-border-subtle)] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[var(--mes-radius)] bg-[var(--mes-accent-muted)] border border-[var(--mes-accent-ring)] flex items-center justify-center text-[var(--mes-accent-primary)]">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-[var(--mes-text-primary)] tracking-wider uppercase">
                  i-MES 2.0 INDUSTRIAL PALETTE & THEME STUDIO
                </h2>
                <span className="text-[10px] text-[var(--mes-accent-primary)] px-1.5 py-0.2 bg-[var(--mes-accent-muted)] border border-[var(--mes-accent-ring)] rounded-[var(--mes-radius)] font-bold">
                  SEMI E10 CALIBRATED
                </span>
              </div>
              <p className="text-[10.5px] text-[var(--mes-text-muted)] font-sans mt-0.5">
                Engineered visual ergonomics for cleanrooms, high-lux daylight metrology labs, and night-shift command walls.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)] p-1 hover:bg-[var(--mes-bg-surface)] rounded-[var(--mes-radius)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--mes-bg-well)] border-b border-[var(--mes-border-subtle)] text-xs shrink-0">
          <button
            onClick={() => setActiveTab('GALLERY')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-[var(--mes-radius)] transition-colors border ${
              activeTab === 'GALLERY'
                ? 'bg-[var(--mes-accent-primary)] text-[var(--mes-text-inverse)] border-[var(--mes-accent-primary)]'
                : 'text-[var(--mes-text-secondary)] hover:text-[var(--mes-text-primary)] bg-[var(--mes-bg-surface)] border-[var(--mes-border-subtle)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Themes ({availableThemes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CUSTOMIZER')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-[var(--mes-radius)] transition-colors border ${
              activeTab === 'CUSTOMIZER'
                ? 'bg-[var(--mes-accent-primary)] text-[var(--mes-text-inverse)] border-[var(--mes-accent-primary)]'
                : 'text-[var(--mes-text-secondary)] hover:text-[var(--mes-text-primary)] bg-[var(--mes-bg-surface)] border-[var(--mes-border-subtle)]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Custom Palette & Substrate Tuner</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'GALLERY' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableThemes.map((t) => {
                const isActive = themeId === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
                    className={`cursor-pointer group relative flex flex-col justify-between p-3.5 rounded-[var(--mes-radius)] border transition-all ${
                      isActive
                        ? 'border-[var(--mes-accent-primary)] ring-1 ring-[var(--mes-accent-primary)] bg-[var(--mes-bg-surface)] shadow-lg'
                        : 'border-[var(--mes-border-subtle)] hover:border-[var(--mes-border-strong)] bg-[var(--mes-bg-surface)] opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div>
                      {/* Theme Top Bar */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[var(--mes-text-primary)] tracking-wide">
                              {t.name}
                            </span>
                            {t.category === 'LIGHT' ? (
                              <Sun className="w-3 h-3 text-amber-400" />
                            ) : t.category === 'CRT' ? (
                              <Monitor className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Moon className="w-3 h-3 text-sky-400" />
                            )}
                          </div>
                          <span className="text-[10px] text-[var(--mes-text-muted)] block mt-0.5">
                            {t.tagline}
                          </span>
                        </div>

                        {isActive ? (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-[var(--mes-radius)] bg-[var(--mes-accent-primary)] text-[var(--mes-text-inverse)] text-[9px] font-bold">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                            <span>ACTIVE</span>
                          </div>
                        ) : (
                          <span className="text-[9px] text-[var(--mes-text-dim)] uppercase">
                            {t.category}
                          </span>
                        )}
                      </div>

                      {/* Realistic In-Card Mini Mockup */}
                      <div 
                        className="rounded-[2px] p-2 border my-2.5 space-y-1.5 overflow-hidden select-none"
                        style={{ backgroundColor: t.bgCanvas, borderColor: t.borderSubtle }}
                      >
                        {/* Mockup Header */}
                        <div 
                          className="px-2 py-1 flex items-center justify-between rounded-[1px] border"
                          style={{ backgroundColor: t.bgHeader, borderColor: t.borderHairline }}
                        >
                          <span className="text-[8.5px] font-bold" style={{ color: t.textPrimary }}>
                            i-MES 2.0
                          </span>
                          <span 
                            className="text-[7.5px] px-1 py-0.2 font-bold rounded-[1px]"
                            style={{ backgroundColor: t.accentMuted, color: t.accentPrimary, border: `1px solid ${t.accentRing}` }}
                          >
                            NXT III
                          </span>
                        </div>

                        {/* Mockup Surface & Metrics */}
                        <div 
                          className="p-1.5 rounded-[1px] border flex items-center justify-between"
                          style={{ backgroundColor: t.bgSurface, borderColor: t.borderSubtle }}
                        >
                          <div>
                            <span className="text-[7.5px] block uppercase" style={{ color: t.textMuted }}>
                              Throughput
                            </span>
                            <span className="text-[10px] font-bold tracking-tight" style={{ color: t.textPrimary }}>
                              44,820 CPH
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.statusPass }} />
                            <span className="text-[8px] font-bold" style={{ color: t.statusPass }}>
                              RUNNING
                            </span>
                          </div>
                        </div>

                        {/* Mockup Progress Bar */}
                        <div className="w-full h-1 rounded-none overflow-hidden" style={{ backgroundColor: t.bgWell }}>
                          <div className="h-full w-3/4" style={{ backgroundColor: t.accentPrimary }} />
                        </div>
                      </div>

                      <p className="text-[10.5px] text-[var(--mes-text-secondary)] font-sans line-clamp-2">
                        {t.description}
                      </p>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-3 pt-2.5 border-t border-[var(--mes-border-hairline)] flex items-center justify-between text-[9.5px]">
                      <span className="text-[var(--mes-text-muted)] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        {t.contrastScore}
                      </span>
                      <span className="text-[var(--mes-accent-primary)] font-bold group-hover:underline">
                        {isActive ? 'Current View' : 'Apply Theme →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'CUSTOMIZER' && (
            <div className="space-y-5 bg-[var(--mes-bg-surface)] p-4 rounded-[var(--mes-radius)] border border-[var(--mes-border-subtle)]">
              {/* Section 1: Primary Accent Color Tuning */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[var(--mes-text-primary)] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--mes-accent-primary)]" />
                    1. Primary Accent Luminescence
                  </label>
                  <span className="text-[11px] text-[var(--mes-accent-primary)] font-bold">
                    Active: {customPalette.customAccentHex || ENTERPRISE_THEMES[themeId].accentPrimary}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--mes-text-muted)] font-sans mb-3">
                  Sets the primary color for dials, active status badges, buttons, and high-priority machine chevrons.
                </p>

                {/* Preset Accent Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {ACCENT_PRESETS.map((preset) => {
                    const isSelected = (customPalette.customAccentHex || ENTERPRISE_THEMES[themeId].accentPrimary).toLowerCase() === preset.hex.toLowerCase();
                    return (
                      <button
                        key={preset.hex}
                        onClick={() => setCustomPalette({ customAccentHex: preset.hex })}
                        className={`flex items-center gap-2 p-2 rounded-[var(--mes-radius)] border transition-all text-left ${
                          isSelected
                            ? 'border-[var(--mes-accent-primary)] bg-[var(--mes-bg-well)] ring-1 ring-[var(--mes-accent-primary)]'
                            : 'border-[var(--mes-border-subtle)] bg-[var(--mes-bg-canvas)] hover:border-[var(--mes-border-strong)]'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-sm"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <div className="overflow-hidden">
                          <span className="text-[10px] font-bold text-[var(--mes-text-primary)] block truncate">
                            {preset.name}
                          </span>
                          <span className="text-[8.5px] text-[var(--mes-text-muted)]">
                            {preset.hex}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-[var(--mes-text-secondary)]">Custom Hex:</span>
                  <input
                    type="color"
                    value={customPalette.customAccentHex || ENTERPRISE_THEMES[themeId].accentPrimary}
                    onChange={(e) => setCustomPalette({ customAccentHex: e.target.value })}
                    className="w-8 h-8 rounded-[var(--mes-radius)] cursor-pointer bg-transparent border border-[var(--mes-border-strong)] p-0.5"
                  />
                  <input
                    type="text"
                    value={customPalette.customAccentHex || ENTERPRISE_THEMES[themeId].accentPrimary}
                    onChange={(e) => setCustomPalette({ customAccentHex: e.target.value })}
                    placeholder="#38BDF8"
                    className="w-28 px-2 py-1 bg-[var(--mes-bg-well)] border border-[var(--mes-border-strong)] rounded-[var(--mes-radius)] text-xs text-[var(--mes-text-primary)] uppercase"
                  />
                  {customPalette.customAccentHex && (
                    <button
                      onClick={() => setCustomPalette({ customAccentHex: undefined })}
                      className="text-[10px] text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)] underline ml-2"
                    >
                      Reset to Theme Accent
                    </button>
                  )}
                </div>
              </div>

              <div className="h-px bg-[var(--mes-border-subtle)]" />

              {/* Section 2: Substrate Base Darkness */}
              <div>
                <label className="text-xs font-bold text-[var(--mes-text-primary)] uppercase flex items-center gap-1.5 mb-2">
                  <Moon className="w-3.5 h-3.5 text-[var(--mes-accent-primary)]" />
                  2. Background Substrate Depth
                </label>
                <p className="text-[11px] text-[var(--mes-text-muted)] font-sans mb-3">
                  Select the base canvas shade to optimize readability for your facility's ambient lighting.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUBSTRATE_PRESETS.map((sub) => {
                    const isSelected = (customPalette.customCanvasHex || ENTERPRISE_THEMES[themeId].bgCanvas).toLowerCase() === sub.hex.toLowerCase();
                    return (
                      <button
                        key={sub.hex}
                        onClick={() => setCustomPalette({ customCanvasHex: sub.hex })}
                        className={`flex items-start gap-2.5 p-2.5 rounded-[var(--mes-radius)] border transition-all text-left ${
                          isSelected
                            ? 'border-[var(--mes-accent-primary)] bg-[var(--mes-bg-well)] ring-1 ring-[var(--mes-accent-primary)]'
                            : 'border-[var(--mes-border-subtle)] bg-[var(--mes-bg-canvas)] hover:border-[var(--mes-border-strong)]'
                        }`}
                      >
                        <span 
                          className="w-5 h-5 rounded-[1px] border border-white/20 shrink-0 mt-0.5"
                          style={{ backgroundColor: sub.hex }}
                        />
                        <div>
                          <span className="text-[10.5px] font-bold text-[var(--mes-text-primary)] block">
                            {sub.name}
                          </span>
                          <span className="text-[9px] text-[var(--mes-text-muted)] font-sans">
                            {sub.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-[var(--mes-border-subtle)]" />

              {/* Section 3: Corner Rigidity & CRT Simulation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Corner Geometry */}
                <div>
                  <label className="text-xs font-bold text-[var(--mes-text-primary)] uppercase block mb-1.5">
                    3. Corner Geometry
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'SHARP_0PX', label: '90° Sharp', radius: '0px' },
                      { id: 'CLEANROOM_2PX', label: '2px Precision', radius: '2px' },
                      { id: 'SUBTLE_4PX', label: '4px Subtle', radius: '4px' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setCustomPalette({ radiusMode: m.id as any })}
                        className={`py-1.5 px-2 text-center border text-[10px] font-bold transition-colors ${
                          customPalette.radiusMode === m.id
                            ? 'bg-[var(--mes-accent-primary)] text-[var(--mes-text-inverse)] border-[var(--mes-accent-primary)]'
                            : 'bg-[var(--mes-bg-well)] text-[var(--mes-text-secondary)] border-[var(--mes-border-subtle)] hover:text-[var(--mes-text-primary)]'
                        }`}
                        style={{ borderRadius: m.radius }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CRT Scanlines */}
                <div>
                  <label className="text-xs font-bold text-[var(--mes-text-primary)] uppercase block mb-1.5">
                    4. Analog CRT Simulation
                  </label>
                  <button
                    onClick={() => setCustomPalette({ showScanlines: !customPalette.showScanlines })}
                    className={`w-full py-1.5 px-3 border text-[10px] font-bold rounded-[var(--mes-radius)] flex items-center justify-between transition-colors ${
                      customPalette.showScanlines
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/50'
                        : 'bg-[var(--mes-bg-well)] text-[var(--mes-text-muted)] border-[var(--mes-border-subtle)] hover:text-[var(--mes-text-primary)]'
                    }`}
                  >
                    <span>Subtle Scanline Grain Overlay</span>
                    <span className="font-mono text-[9px]">[{customPalette.showScanlines ? 'ACTIVE' : 'DISABLED'}]</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[var(--mes-bg-header)] px-4 py-2.5 border-t border-[var(--mes-border-subtle)] flex items-center justify-between text-xs shrink-0">
          <button
            onClick={resetTheme}
            className="flex items-center gap-1.5 text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)] text-[10.5px] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Factory Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[var(--mes-accent-primary)] hover:bg-[var(--mes-accent-hover)] text-[var(--mes-text-inverse)] font-bold text-xs rounded-[var(--mes-radius)] transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
