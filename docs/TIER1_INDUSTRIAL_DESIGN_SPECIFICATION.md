# Tier-1 Industrial UI/UX Design System Specification
## Aerospace Slate, High-Chroma Phosphor Telemetry & Optical Sharpness Guidelines

> **Standard:** Tier-1 Industrial / Mission-Control Grade  
> **Benchmark Heritage:** Tesla Gigafactory Mission Control, Linear, Palantir Foundry, Apple Pro Metrics, Bloomberg Terminal  
> **Target Environments:** Cleanroom Touchscreens, SMT Line Workbenches, 10–15m Overhead Andon Displays, Multi-Screen Video Walls, Executive Lobbies  
> **Author:** i-MES 2.0 Core Architecture Team  
> **Date:** September 2026  

---

## 1. Executive Summary & Design Heritage

Modern enterprise industrial applications frequently suffer from **"gray-on-gray mush"**: low-contrast gray text on medium-gray backgrounds, blurry subpixel text rendering, non-tabular jittering numbers, and decorative pastels that cannot be read from across a factory floor.

The **i-MES 2.0 Design System** establishes an uncompromising standard of optical sharpness, information density, and glanceability inspired by the highest-performing operational interfaces in the world:

1. **Tesla Gigafactory Mission Control**: High-velocity visual beaconing, 10-meter glanceability, high-contrast machine state indications, and instant emergency halt interrupts.
2. **Palantir Foundry & Bloomberg Terminal**: Milled data density, maximum information per square inch, strict tabular numeric lining, and zero decorative bloat.
3. **Linear**: Surgical typographic hierarchy, intentional uppercase letter-tracking, discrete status pills, and high-frequency keyboard navigation.
4. **Apple Pro Metrics & Xcode Dark**: Deep aerospace slate substrates (avoiding ocular halation), pure grayscale antialiasing, and crisp 1px precision seams.

---

## 2. The Obsidian Substrate Architecture (Contrast Without Halation)

### 2.1 The Pitch-Black Fallacy vs. Deep Aerospace Slate
A naive approach to dark themes uses pure `#000000` (harsh black) with pure `#FFFFFF` (glaring white). This creates an extreme **21:1 contrast ratio that causes optical halation** (visual smearing and eye fatigue) over an 8-hour operator shift.

Instead, the Tier-1 standard utilizes a **calibrated multi-layer obsidian slate architecture**:

| Substrate Layer | Hex Token | Color Role & Industrial Physics |
| :--- | :--- | :--- |
| **Viewport Base Canvas** | `#06090E` | **Deep Pitch Aerospace Slate**: Absorbs room reflections on glossy cleanroom displays while providing an anchor deeper than standard dark gray. |
| **Milled Card Surface** | `#020617` / `#0C1017` | **Ultra-Dense Well (`slate-950`)**: Forms the recessed cavity or docked equipment bay. |
| **Machined Wells & Inputs** | `#0F172A` | **Interactive Inset (`slate-900`)**: Text boxes, barcode scan targets, and table alternating rows. |
| **Primary Figures & Text** | `#F1F5F9` | **Luminescent Slate-100 (95% White Point)**: Crisp, high-luminance reading with zero harsh eye glare. |
| **Secondary Metadata** | `#94A3B8` | **Neutral Slate-400**: High legibility (6.5:1 contrast) for units, timestamps, and equipment serials. |
| **Muted Structure** | `#64748B` | **Recessed Slate-500**: Used for inactive borders, non-critical dividers, and grid lines. |

---

## 3. High-Precision 1px Seam & Border System

In Tier-1 industrial design, boxes do not float on nebulous box-shadows. They are structured like **precision-milled aluminum chassis plates**:

```
+-----------------------------------------------------------------------+
|  CHASSIS HEADER (bg-slate-950/95 border-b border-slate-800)            |
+-----------------------------------------------------------------------+
|  SLOT 1: SMT FLOW BAY         |  SLOT 2: PRECISION OEE CLUSTER        |
|  (border-r border-slate-800)  |  (border-slate-800 bg-slate-950)       |
+-------------------------------+---------------------------------------+
|  SLOT 3: NOZZLE PPM MATRIX    |  SLOT 4: SHIFT GANTT TIMELINE         |
|  (border-r border-slate-800)  |  (border-slate-800 bg-slate-950)       |
+-----------------------------------------------------------------------+
```

### Seam Hierarchy:
* **Frame Seams (`border-slate-800` / `#1E293B`)**: Crisp 1px division separating functional quadrants.
* **Active Seams (`border-cyan-500/50` or `border-slate-700` / `#334155`)**: Highlights focused or active equipment bays.
* **Corner Radius (`rounded-[2px]`)**: Sharp 2px corners reflecting physical industrial hardware, avoiding toy-like pill bubbles (`rounded-2xl`).

---

## 4. Dual-Typeface Optical Architecture

The human visual cortex processes shapes and measurements through different cognitive pathways. The interface enforces a strict separation:

### 4.1 Structural Titles & Badges: `Inter`
* **Role**: Section titles, equipment names, station modes, dialog headers.
* **Hierarchy**:
  * Heading: `font-sans font-bold uppercase tracking-wider text-slate-100`
  * Sub-badge: `font-sans font-bold uppercase tracking-widest text-[9.5px]`
* **Why Tracking Matters**: Expanding tracking (`tracking-wider` = `letter-spacing: 0.05em`, `tracking-widest` = `0.1em`) prevents letter collision at long viewing distances and on low-angle panels.

### 4.2 Telemetry, Measurements & Lots: `JetBrains Mono`
* **Role**: Cycle times, Cpk values, PPM rates, temperatures, barcode serials, timestamps.
* **Required OpenType Feature**:
  ```css
  code, pre, .font-mono {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
    font-feature-settings: "tnum" 1; /* OpenType Tabular Figures */
  }
  ```
* **The Zero-Jitter Invariant**: Every number digit occupies identical horizontal pitch. A counter incrementing from `11.1` to `88.8` never wobbles, vibrates, or causes neighboring layout reflow.
* **Disambiguation**: JetBrains Mono features slashed zeros (`0` vs `O`), distinguished lowercase `l` vs uppercase `I` vs digit `1`, and wide apertures that remain legible even under dusty cleanroom visor conditions.

---

## 5. High-Chroma Phosphor Palette (Laser Acuity)

Rather than muddy or diluted pastels, status telemetry utilizes **high-chroma phosphor wavelengths** matched to human retinal sensitivity:

```
[PASS / NORMAL]     Phosphor Emerald  : #34D399 (text-emerald-400) / #10B981 (bg-emerald-500)
[TELEMETRY / RADAR] Phosphor Cyan     : #22D3EE (text-cyan-400)    / #06B6D4 (bg-cyan-500)
[WARNING / PACING]  Signal Amber      : #FBBF24 (text-amber-400)   / #F59E0B (bg-amber-500)
[HALT / INTERLOCK]  Safety Rose       : #F43F5E (text-rose-400)    / #E11D48 (bg-rose-600)
```

### Optical Principles:
1. **Photopic Peak Sensitivity**: Human photopic vision peaks at ~555 nm (green-yellow). Phosphor Emerald (`#34D399`) stimulates both L and M retinal cones with minimal brightness power.
2. **Ambient Status Glow**: Critical live status beacons utilize a calibrated 8px optical glow:
   ```css
   box-shadow: 0 0 8px #10B981; /* Emerald Beacon */
   box-shadow: 0 0 8px #22D3EE; /* Cyan Radar */
   ```
3. **Purity of Meaning**: Red/Rose is **never** used for decoration or branding. It is strictly reserved for safety halts, JEDEC MSL floor-life expiration, and machine interlocks.

---

## 6. Grayscale Anti-Aliasing (Subpixel Fringe Elimination)

### The Problem with Default Subpixel Antialiasing:
On dark backgrounds, default Windows ClearType (subpixel LCD rendering) activates individual red and blue subpixels to smooth diagonal letter curves. On high-contrast black interfaces, this causes **annoying colored chromatic halos** (red and blue edges around white text).

### The Tier-1 Solution:
Globally enforce pure grayscale antialiasing:
```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```
This restricts font rasterization to pure luminance gray shades, producing **laser-etched, razor-sharp glyph outlines** across all LCD and OLED displays.

---

## 7. Glanceability Continuum: Kiosk vs. Workstation

| Parameter | 10–15 Meter Kiosk Display | 60 cm Engineering Workstation |
| :--- | :--- | :--- |
| **Primary Function** | Passive situational awareness | Active data entry, inspection, signing |
| **Figure Scale** | `text-4xl` (36px) to `text-7xl` (72px) | `text-xs` (12px) to `text-base` (16px) |
| **Label Scale** | `text-xs` (12px) to `text-sm` (14px) | `text-[10px]` to `text-[11.5px]` |
| **Information Density** | Low density / Macro glanceability | Ultra-high density / Micro precision |
| **Interaction Target** | 0px (No touch/mouse; URL driven) | 32px minimum click targets |
| **Focus State** | None (Passive display) | High-visibility 1px cyan focus ring |

---

## 8. Theme Token Reference Map

```css
:root {
  /* Obsidian Substrate */
  --mes-bg-canvas: #06090E;
  --mes-bg-surface: #020617;
  --mes-bg-well: #0F172A;
  --mes-bg-header: #020617;
  --mes-bg-tab-active: #0F172A;
  --mes-bg-tab-inactive: #020617;
  --mes-bg-modal: #0B0F17;

  /* Machined Seams */
  --mes-border-subtle: #1E293B;
  --mes-border-strong: #334155;
  --mes-border-hairline: #1E293B;
  --mes-border-accent-glow: rgba(34, 211, 238, 0.30);

  /* High-Acuity Typography */
  --mes-text-primary: #F1F5F9;
  --mes-text-secondary: #94A3B8;
  --mes-text-muted: #64748B;
  --mes-text-dim: #475569;

  /* Phosphor Accents */
  --mes-accent-primary: #22D3EE;
  --mes-accent-hover: #38BDF8;
  --mes-status-pass: #34D399;
  --mes-status-warn: #FBBF24;
  --mes-status-halt: #F43F5E;
  --mes-status-idle: #64748B;

  /* Hardware Geometry */
  --mes-radius: 2px;
}
```

---

## 9. Developer & Designer Checklist

Before releasing any new screen, dialog, or machine adapter UI, verify:
* [ ] Does every number, time, and coordinate use `font-mono tabular-nums`?
* [ ] Are structural titles uppercase with `font-bold tracking-wider`?
* [ ] Are card seams exactly 1px using `border-slate-800` (no heavy box shadows)?
* [ ] Is background canvas `#06090E` and card substrate `slate-950`?
* [ ] Are status badges using the 4 canonical phosphor colors?
* [ ] Is all text sharp without colored subpixel halos (`-webkit-font-smoothing: antialiased`)?
* [ ] Can primary metrics be read in under 1.5 seconds from the intended viewing distance?
