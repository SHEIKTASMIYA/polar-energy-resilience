# 05 — UI/UX Design System

## Design intent

The reference point is **industrial energy-management / SCADA and mission-control software** —
think power-utility DMS screens, spacecraft telemetry consoles, marine engine-room monitoring —
not consumer AI dashboards. Concretely that means:

- **Dark-first**, not light-first. Power/ops rooms run dark screens; it's also the honest choice for a
  polar-night station. Light theme is a secondary/print mode, not the default.
- **Data-dense, not whitespace-heavy.** Every panel earns its space — no giant hero numbers with
  acres of padding around a single KPI.
- **Muted, desaturated base palette** with **saturated color reserved entirely for status/severity**.
  If everything is colorful, nothing signals urgency. Color is a semaphore, not decoration.
- **Monospace for all numeric/telemetry values.** Numbers in a monitoring tool should align in
  fixed-width columns and read like instrumentation, not marketing copy.
- **No gradients, no glassmorphism, no rounded-pill everything.** Sharp-ish corners (4–6px), flat
  fills, thin 1px borders — the aesthetic of engineering software, not a landing page.

## Color system (tokens in `styles/tokens.css`)

**Base (dark theme, default):**
- `--surface-0` (`#0a0e12`) — app background, near-black cold blue
- `--surface-1` (`#12181f`) — panel background
- `--surface-2` (`#1a2229`) — nested panel / table row background
- `--border-subtle` (`#263038`)
- `--text-primary` (`#e8edf1`)
- `--text-secondary` (`#8fa0ab`)
- `--text-tertiary` (`#5c6b75`)

**Severity (the ONLY saturated colors, used consistently everywhere):**
- `--severity-nominal` (`#2fbf71`) — green
- `--severity-watch` (`#e8b339`) — amber
- `--severity-critical` (`#e8483a`) — red

**Data-source accent hues** (used sparingly — chart line colors, source tags):
- `--source-aadc` (`#4a90d9`) — steel blue (historical/grid data)
- `--source-solar` (`#e8b339`) — amber (irradiance/solar — intentionally shares hue family with WATCH,
  reinforcing "solar = variable/uncertain resource" — but distinguished by context, never literal alerting)
- `--source-battery` (`#5ec2c2`) — teal
- `--source-genset` (`#b98a4a`) — bronze/diesel-brown
- `--source-simulated` (`#8f6fd1`) — violet (always distinguishes simulated from live/historical)

**Ice/polar accent** (used for chrome, active nav state, focus rings): `--accent-ice` (`#6fd0e8`) —
a cold cyan, evokes glacial ice without being a cliché "arctic blue" gradient background.

## Typography

- **UI text / labels**: Inter or system-ui sans, 13–15px base — dense, legible at small sizes.
- **Numeric/telemetry values**: `"JetBrains Mono"` or `"IBM Plex Mono"` — tabular-nums, used for every
  KPI number, table figure, and axis label. This single choice does more than anything else to make
  the platform *feel* like instrumentation rather than a web app.
- **Scale**: 11 / 12 / 13 / 15 / 18 / 24 / 32px — deliberately compressed at the top end; this app
  almost never needs a 48px hero number.

## Spacing & grid

- 4px base unit, scale: 4/8/12/16/24/32/48
- 12-column responsive grid for page layouts, panels snap to column spans (see `docs/06`)
- Panel internal padding: 16px standard, 12px for dense tables

## Component visual language

- **Panels (`<Panel>`)**: `surface-1` background, 1px `border-subtle`, 6px radius, small-caps
  uppercase letter-spaced title bar (12px, `text-secondary`) with an optional `<DataSourceTag>` and
  `<FreshnessIndicator>` pinned to the top-right of the title bar.
- **StatusMetricCard**: label (small-caps, secondary) → large monospace value → small trend
  arrow/delta → thin `SeverityBadge` dot. No icons-as-decoration; only functional iconography
  (trend arrows, source glyphs).
- **SeverityBadge**: a small filled dot + uppercase label (`NOMINAL`/`WATCH`/`CRITICAL`), never color
  alone — always paired with text, for accessibility and because engineers scan for words under stress.
- **Charts**: dark canvas matching `surface-1`, gridlines at `border-subtle` at 40% opacity, no chart
  drop-shadows, confidence bands rendered as a translucent (15–20% opacity) fill in the series' own hue,
  never a generic gray band — keeps provenance visible even in the uncertainty range.
- **Tables**: zebra striping via `surface-1`/`surface-2`, monospace numeric columns right-aligned,
  text columns left-aligned, sticky header row.

## Iconography

Use a single consistent icon set (recommend **Lucide** — MIT-licensed, works cleanly with React) at
16/20px, `text-secondary` color by default, `text-primary` on hover/active. Avoid filled/glyph icons
that look like emoji; prefer thin-stroke technical icons (gauge, battery, thermometer, wind, snowflake,
fuel-drum equivalents).

## Motion

Minimal and functional only: 120–150ms ease-out for panel state changes, no bouncy/spring easing,
no decorative page-transition animation. A monitoring tool should feel instantly responsive, not "delightful."

## Accessibility baseline

- WCAG AA contrast minimum for all text against its surface
- Severity never conveyed by color alone (text label always present)
- All interactive controls keyboard-navigable; focus ring = `--accent-ice` 2px outset
- Charts include an accessible data-table fallback view (toggle) for screen-reader users — reserved as
  a `<ChartAccessibleTableToggle>` slot in every chart wrapper, implemented when charts are built out
