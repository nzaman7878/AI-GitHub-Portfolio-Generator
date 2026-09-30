# Design System Specification: The Technical Monograph

> **Project**: AI GitHub Portfolio Generator  
> **Brief**: _"Developer portfolio for technical recruiters, editorial feel, not SaaS landing page."_  
> **Stitch Exploration Reference**: [`projects/16427716752381542403`](https://stitch.withgoogle.com) • [Screen Exploration Dossier](file:///c:/Users/nuruz/Desktop/AI%20GitHub%20Portfolio%20Generator/docs/DESIGN_EXPLORATION.md)  
> **Status**: Approved & Tokenized (Phase 32)

---

## 1. Executive Design Decision & Rationale

### Selected Direction

We have selected **Direction A: "The Technical Monograph" (Swiss Editorial / Archival Minimalist)** as the primary design language, paired seamlessly with **"Obsidian Telemetry"** for dark mode precision environments.

### The Problem with Modern Portfolios

Most software engineering portfolios make one of two critical mistakes:

1. **The Generic SaaS Landing Page**: Neon purple gradients, floating 3D glass orbs, oversized feature cards with marketing buzzwords, and minimal technical proof. Technical recruiters and engineering leaders see right through this.
2. **The Barebones Unstyled Dump**: An uncurated list of repositories with raw GitHub stars and zero explanation of architectural decision-making, trade-offs, or production impact.

### Why "The Technical Monograph" Wins

Technical recruiters, VPs of Engineering, and Staff+ hiring managers spend an average of **30 to 45 seconds** scanning a candidate's portfolio. They are seeking specific high-signal answers:

- _What complex distributed systems or architectural challenges has this person solved?_
- _Can they articulate the technical trade-offs between competing approaches?_
- _What were the verified production metrics (uptime, latency, throughput, scale)?_

**The Technical Monograph** treats software engineering as a disciplined, scholarly craft—evoking the gravitas of Stripe Press publications, MIT Press research volumes, and Bell System technical memoranda. It replaces marketing fluff with **density, typographic authority, verified telemetry, and clear case study dossiers**.

---

## 2. Core Design Principles

1. **Archival Materiality over Synthetic Illusions**:
   - We use physical printing metaphors: archival rag paper (`#FAF9F5`), high-density carbon ink (`#121316`), and terracotta validation stamps (`#8A2D1B`).
   - In dark mode, this transitions into clinical command-console obsidian slate (`#090A0D` / `#111318`) with laser phosphor emerald (`#10B981`) and ice cyan (`#06B6D4`).
2. **Recruiter-First High Density**:
   - The first viewport immediately surfaces verified production metrics (throughput, availability, latency bounds, commit activity) and a concise executive thesis.
3. **Planar Elevation over Murky Shadows**:
   - Depth is achieved through **tonal stepping** and **1px cartographic hairlines** (`#D4D2C9`), not heavy blurred drop shadows. Interactive states utilize crisp, zero-blur hard planar offsets (`box-shadow: 2px 2px 0px 0px #121316`).
4. **Tabular Numeric Rigor**:
   - All performance figures, latencies, memory footprints, and git hashes are set in monospace with tabular lining numerals (`font-variant-numeric: tabular-nums`).
5. **Razor-Sharp 0px Geometry**:
   - Containers, buttons, cards, and data tables use crisp right angles (`rounded-none` / `border-radius: 0px`). Corners mimic trimmed archival bookplates and blueprint sheets.

---

## 3. Design Tokens

### 3.1 Color Palette

#### Light Mode (The Technical Monograph)

| Token Name           | Hex       | Functional Usage                                | Tailwind Class                     |
| :------------------- | :-------- | :---------------------------------------------- | :--------------------------------- |
| `paper-canvas`       | `#FAF9F5` | Primary application background                  | `bg-paper-canvas`                  |
| `paper-sheet`        | `#F4F3ED` | Case study cards, dossier panels                | `bg-paper-sheet`                   |
| `paper-elevated`     | `#EDECE4` | Nested telemetry blocks, code containers        | `bg-paper-elevated`                |
| `paper-muted`        | `#E3E2DF` | Subtle secondary backgrounds                    | `bg-paper-muted`                   |
| `ink-primary`        | `#121316` | Main headings, thesis statements, primary text  | `text-ink-primary`                 |
| `ink-secondary`      | `#46464B` | Body rationale, methodology prose               | `text-ink-secondary`               |
| `ink-muted`          | `#76777B` | Metadata, timestamps, footnotes                 | `text-ink-muted`                   |
| `terracotta`         | `#8A2D1B` | Section markers (§), key callouts, focus states | `text-terracotta`, `bg-terracotta` |
| `terracotta-surface` | `#FDF0ED` | Light accent backgrounds                        | `bg-terracotta-surface`            |
| `hairline`           | `#D4D2C9` | Primary structural grid lines and card borders  | `border-hairline`                  |
| `hairline-subtle`    | `#E3E2DC` | Secondary row dividers, code separators         | `border-hairline-subtle`           |

#### Dark Mode (Obsidian Telemetry)

| Token Name          | Hex       | Functional Usage                           | Tailwind Class                |
| :------------------ | :-------- | :----------------------------------------- | :---------------------------- |
| `obsidian-void`     | `#090A0D` | Base dark canvas ground                    | `dark:bg-obsidian-void`       |
| `obsidian-panel`    | `#111318` | Primary panel container, sidebar           | `dark:bg-obsidian-panel`      |
| `obsidian-card`     | `#171A22` | Case study card, elevated inspector pane   | `dark:bg-obsidian-card`       |
| `obsidian-overlay`  | `#1E222D` | Highlighted code sequences, inputs         | `dark:bg-obsidian-overlay`    |
| `obsidian-border`   | `#262932` | Structural borders, panel splits           | `dark:border-obsidian-border` |
| `bone`              | `#EDEDEE` | Primary headers, high-contrast text        | `dark:text-bone`              |
| `bone-secondary`    | `#8B8F9A` | Secondary documentation text               | `dark:text-bone-secondary`    |
| `telemetry-cyan`    | `#06B6D4` | Primary links, technical tags, focus rings | `text-telemetry-cyan`         |
| `telemetry-emerald` | `#10B981` | 99.999% uptime, verified benchmark badges  | `text-telemetry-emerald`      |
| `telemetry-amber`   | `#F59E0B` | Rate-limit warnings, caution states        | `text-telemetry-amber`        |
| `telemetry-rose`    | `#EF4444` | Critical errors, failed generations        | `text-telemetry-rose`         |

---

### 3.2 Typography System

The system utilizes an authoritative tri-font hierarchy:

1. **The Humanist Editorial (`font-serif`)**: `Newsreader` / `Playfair Display`. Used for thesis titles, major article headings, and editorial openings.
2. **The Rationalist Utility (`font-sans`)**: `Inter` / `Geist`. Delivers crisp, unstylized prose for technical explanations and architecture trade-offs.
3. **The Mechanical Record (`font-mono`)**: `JetBrains Mono` / `Geist Mono`. Delivers computational precision for latencies, memory footprints, git hashes, and code blocks.

#### Type Scale

| Level           | Font Family | Size / Line Height              | Letter Spacing | Tailwind Class                                  |
| :-------------- | :---------- | :------------------------------ | :------------- | :---------------------------------------------- |
| **Display XL**  | Serif       | `4.0rem` (64px) / `4.25rem`     | `-0.025em`     | `text-display-xl font-serif`                    |
| **Headline XL** | Serif       | `3.5rem` (56px) / `4.0rem`      | `-0.02em`      | `text-headline-xl font-serif`                   |
| **Headline LG** | Serif       | `2.25rem` (36px) / `2.75rem`    | `-0.015em`     | `text-headline-lg font-serif`                   |
| **Headline MD** | Serif       | `1.5rem` (24px) / `2.0rem`      | `-0.01em`      | `text-headline-md font-serif`                   |
| **Headline SM** | Sans        | `1.125rem` (18px) / `1.5rem`    | `-0.005em`     | `text-headline-sm font-sans font-semibold`      |
| **Body LG**     | Sans        | `1.125rem` (18px) / `1.875rem`  | `-0.005em`     | `text-body-lg font-sans`                        |
| **Body MD**     | Sans        | `0.9375rem` (15px) / `1.625rem` | `0em`          | `text-body-md font-sans`                        |
| **Body SM**     | Sans        | `0.8125rem` (13px) / `1.375rem` | `+0.005em`     | `text-body-sm font-sans`                        |
| **Label LG**    | Mono        | `0.875rem` (14px) / `1.25rem`   | `+0.04em`      | `text-label-lg font-mono font-medium`           |
| **Label MD**    | Mono        | `0.75rem` (12px) / `1.0rem`     | `+0.06em`      | `text-label-md font-mono font-medium uppercase` |
| **Label SM**    | Mono        | `0.6875rem` (11px) / `0.875rem` | `+0.08em`      | `text-label-sm font-mono uppercase`             |

---

### 3.3 Geometry, Radius & Elevation

| Token              | Value                                   | Description                                              | Tailwind Class        |
| :----------------- | :-------------------------------------- | :------------------------------------------------------- | :-------------------- |
| `radius-none`      | `0px`                                   | Default for all cards, buttons, tables, and inputs       | `rounded-none`        |
| `radius-subtle`    | `2px`                                   | Micro-tags, code badges                                  | `rounded-subtle`      |
| `radius-full`      | `9999px`                                | Reserved strictly for circular LED telemetry status dots | `rounded-full`        |
| `shadow-planar`    | `2px 2px 0px 0px rgba(18, 19, 22, 0.9)` | Hard-edge planar offset shadow on active/hover           | `shadow-planar`       |
| `shadow-planar-lg` | `3px 3px 0px 0px rgba(18, 19, 22, 0.9)` | Featured dossier card elevation                          | `shadow-planar-lg`    |
| `hairline`         | `1px solid var(--border)`               | Cartographic boundary rules                              | `border hairline-all` |

---

### 3.4 Grid & Spacing System

- **Base Spacing Unit**: 4px / 8px baseline cadence (`4, 8, 12, 16, 24, 32, 48, 64, 96, 128px`).
- **Desktop Grid (≥ 1280px)**: 12-column asymmetric layout with a persistent marginalia column (Cols 1–3) for section indices (§), timeline timestamps, and footnotes. The primary dissertation and data run across cols 4–12.
- **Outer Margin**: `margin-desktop: 4rem` (64px).
- **Gutter**: `gutter-desktop: 2.5rem` (40px).

---

## 4. Component Design Standards

### 4.1 Masthead & Header

- Split by top and bottom hairline rules.
- Left: Engineer Name in uppercase monospaced type (`label-lg`) + Role Tag (`STAFF DISTRIBUTED SYSTEMS ENGINEER`).
- Right: Live telemetry status dot (`● ALL REGIONS HEALTHY`) + quiet editorial links (`Dossier`, `Systems`, `GitHub`, `CV (PDF)`).

### 4.2 Case Study Dossier Card

- Bounded by a crisp 1px `#D4D2C9` hairline.
- Top meta strip: Document reference number (`SPEC REF: RFC-9041`) on the left; timestamp and branch status on the right.
- Left Column: Technical Narrative (Problem Statement, Key Trade-offs with concrete rationale, production impact metrics).
- Right Column: System Architecture ASCII / SVG schematic, verified benchmark comparisons, and syntax-highlighted code with line numbers.

### 4.3 Interactive Buttons

- **Primary**: Solid carbon rectangle (`bg-ink-primary text-paper-canvas`), sharp corners, 1px border. Hover shifts background to `#8A2D1B` with zero layout shift.
- **Secondary**: Transparent background, 1px solid hairline, text in `#121316`. Hover fills with `#F4F3ED`.
- **Text Link**: Underlined text with a 1px baseline rule offset by 3px.

---

## 5. Technical Implementation in Next.js

1. **`tailwind.config.ts`**: Contains complete JavaScript token exports for programmatic consumption and IDE IntelliSense.
2. **`app/globals.css`**: Configures modern Tailwind v4 `@theme` directives and CSS custom properties (`--background`, `--foreground`, `--border`, `--accent`, etc.) supporting light and dark modes with zero runtime overhead.
