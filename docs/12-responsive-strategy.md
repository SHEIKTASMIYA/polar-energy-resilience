# 12 — Responsive Design Strategy

## Philosophy

This is primarily a **desktop/large-monitor operations tool** (station power houses run wall-mounted
or desk monitors), but it must remain usable on a tablet for a duty engineer doing rounds, and
gracefully readable on a phone for a quick status check. The strategy is "desktop-optimized, tablet-
functional, mobile-readable" — not a mobile-first redesign, since that would compromise the data
density that makes this tool useful at its primary use case.

## Breakpoints (`styles/tokens.css` + a `useBreakpoint()` hook in `utils/`)

- `--bp-desktop-wide`: ≥1440px — full 12-column layouts, all panels at designed span
- `--bp-desktop`: 1024–1439px — status strips wrap from 6→3 columns × 2 rows; side-by-side panels
  keep their 2-column relationship but narrower
- `--bp-tablet`: 768–1023px — sidebar collapses to icon-rail by default (expandable via toggle);
  two-column panel pairs stack to single column in priority order (see per-page docs 06–11)
- `--bp-mobile`: <768px — sidebar becomes a bottom nav bar or slide-over drawer; all panels stack
  single-column; Status Strip becomes a horizontally-scrollable row of cards rather than wrapping
  (preserves glanceable at-a-glance metrics without pushing content far down the page)

## Layout technique

- CSS Grid with named template areas per page, redefined per breakpoint via media queries — not a
  utility-class flex-wrap approach — because panel *order* changes (not just wrapping) between
  desktop and mobile (see stacking priority in docs/06–11), and named grid areas make re-ordering
  explicit and maintainable rather than relying on DOM order + flex-wrap tricks.
- Charts use a `ResponsiveContainer`-style wrapper (most React chart libs provide one) so canvas-based
  charts genuinely resize rather than overflow or letterbox.

## Content strategy at narrow widths (not just resizing — actual content decisions)

- **Tables** (Genset Merit Order, Comparison Metrics): switch from full table to a stacked
  card-per-row layout below `--bp-tablet` — each "row" becomes a small card with label:value pairs —
  rather than a horizontally scrolling table, which is hard to use on touch.
- **Multi-series charts**: below `--bp-tablet`, default to showing only the primary series
  (e.g. Load) with secondary series (Solar/Battery/Genset breakdown) behind a toggle, rather than
  cramming a full legend and 4 lines into a 340px-wide canvas.
- **Scenario Builder** (docs/07): the two-column builder/result layout stacks with the builder form
  first, full-width, on tablet/mobile — since building the scenario is the primary action a user takes
  before caring about the result on a small screen.
- **Station Context Bar**: freshness indicators and season/day-night info collapse into a single
  expandable "Station Info" pill on mobile rather than a full horizontal bar, preserving header space
  for the page title.

## Touch targets & interaction

- Minimum 44×44px touch targets for all controls once below `--bp-tablet` (toggle groups, range
  selectors, table sort headers all need larger hit areas than their desktop hover-driven equivalents).
- Sliders in `ScenarioParamSlider` get a paired numeric input field on touch breakpoints — dragging a
  precise slider value on a touchscreen is unreliable, direct numeric entry is a necessary fallback.

## Testing matrix (for whoever implements this)

Validate every page at: 1440px (design target), 1024px (small laptop / tablet landscape), 768px
(tablet portrait), 390px (phone). The folder structure's shared `components/layout/` primitives
(`Grid`, `ResponsiveSplit`, `PageSection`) should be the *only* place breakpoint logic lives — feature
pages compose these primitives rather than writing their own media queries, keeping the responsive
behavior consistent and centrally maintainable as the platform grows.
