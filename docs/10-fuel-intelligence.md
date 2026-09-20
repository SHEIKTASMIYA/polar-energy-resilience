# 10 — Fuel Intelligence Section

## Why this page gets special treatment

At a polar station, fuel is the ultimate survival constraint — resupply is often a single annual
shipping window (icebreaker/resupply vessel), and running out of diesel is a life-safety event, not
an inconvenience. This page should feel the most "serious" of the entire platform.

## Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│  FUEL STATUS STRIP: per-tank gauges + total litres + days-remaining     │
│  (severity-colored, largest visual weight on the page)                 │
├───────────────────────────────┬────────────────────────────────────────┤
│  FUEL BURN RATE (bar/line,     │  RESUPPLY PLANNING PANEL               │
│  daily L, actual + projected)  │  (next resupply ETA, required reserve, │
│                                 │   risk flag, countdown)                │
├────────────────────────────────────────────────────────────────────────┤
│  FUEL SURVIVAL PROJECTION (drawdown-to-zero curve, full width,          │
│  resupply-date marker overlaid, confidence band around the projection) │
└────────────────────────────────────────────────────────────────────────┘
```

## Fuel Status Strip

- One `GaugeChart` per fuel tank (station fuel farms typically have multiple bulk tanks) showing
  current litres / capacity as a fill gauge, severity-colored by percentage remaining.
- Aggregate `StatusMetricCard`s: Total Litres, Days Remaining (with interval, e.g. "58 ± 6 days"),
  Daily Burn Rate.
- This strip should be the single largest, most visually weighted element on the page — bigger gauge
  components than anywhere else in the app — reflecting the stakes.

## Fuel Burn Rate chart

- Combo chart: historical daily burn as solid bars, near-term projected burn as lighter/hatched bars,
  with a 7-day and 30-day moving average line overlaid — burn rate is noisy day-to-day (weather-driven
  heating load, generator cycling) so the trend line matters more than any single day's bar.
- Toggle to overlay ambient temperature on a secondary axis — burn rate correlates strongly with
  heating demand, and making that correlation visible is genuinely useful for a duty engineer.

## Fuel Survival Projection (the signature chart of this page)

- X-axis: date, extending forward from "today" to (at minimum) the next expected resupply date.
- Y-axis: litres remaining, starting at current total, projected downward via `dailyBurnRateL`.
- Rendered as a `BandedForecastChart`-style projection: a central drawdown line with a widening
  confidence band further into the future (uncertainty compounds over time — the chart should visually
  show the band getting wider, not stay a constant width).
- **Zero-litres threshold line** always drawn in `--severity-critical` red.
- **Resupply date marker**: a vertical annotation line labeled with the vessel/ETA if known.
- If the projected drawdown band's lower bound crosses zero *before* the resupply marker, that
  intersection region is shaded in critical red — this is the single most important visual moment in
  the entire application, and should read as unmistakably alarming without being cluttered.

## Resupply Planning Panel

- Countdown to next resupply (days), required reserve buffer at time of resupply (a safety margin,
  not "runs out exactly on resupply day"), and a `SeverityBadge`-driven risk flag summarizing whether
  current burn trajectory meets that buffer.
- If no resupply is confirmed (`nextResupply: null` in the contract), render a clear `EmptyState`
  prompting the user that this is an open planning gap — never silently omit the panel.

## Cross-links

This page is the natural jump-off point into the Scenario Simulator ("what if resupply is delayed
14 days?") — the `ResupplyPlanningPanel` should include a "Model a delay" action that pre-fills a
`resupply_delay` perturbation in the Scenario Builder (reserved interaction, wire up once both pages
have real state).
