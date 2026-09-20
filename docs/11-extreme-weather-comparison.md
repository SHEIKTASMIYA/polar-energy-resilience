# 11 — Extreme-Weather Comparison UI

## Purpose

Let a user hold two scenario runs side-by-side — e.g. "48-hour blizzard" vs. "48-hour blizzard +
genset outage" — to understand marginal impact of compounding failures, or "this year's worst case"
vs. "last year's actual worst event" for historical grounding.

## Layout

```
┌───────────────────────────────┬────────────────────────────────────────┐
│  SCENARIO PICKER — SLOT A       │  SCENARIO PICKER — SLOT B              │
│  (dropdown: saved scenarios,    │  (dropdown: saved scenarios,           │
│   or "historical worst case")   │   or "historical worst case")          │
├───────────────────────────────┴────────────────────────────────────────┤
│  COMPARISON METRICS TABLE                                                │
│  (rows = key metrics, columns = A / B / Δ, severity-colored deltas)     │
├────────────────────────────────────────────────────────────────────────┤
│  COMPARISON OVERLAY CHART (both timelines on one chart,                 │
│  distinct hue per slot, shared axes, legend clearly labeled A/B)        │
└────────────────────────────────────────────────────────────────────────┘
```

## Scenario Pickers

Two independent `ScenarioPicker` dropdowns (Slot A / Slot B), each listing saved scenarios plus a
built-in `"historical_worst_case"` baseline option (per the `baselineSource` field in the data
contract) — comparing against real historical worst-case conditions, not just hypothetical ones, is
important for grounding the tool in reality rather than pure speculation.

Query-param driven (`?a=:scenarioId&b=:scenarioId`, per `docs/02`) so a specific comparison is
shareable/bookmarkable — genuinely useful for a report or handover between station engineers.

## Comparison Metrics Table

Rows: Outcome, Days to Fuel-Critical, Minimum Battery SoC, Peak Unmet Load, Total Genset Runtime,
Total Fuel Consumed. Columns: **A**, **B**, **Δ (B−A)**. The delta column is the whole point of this
table — always severity-colored (red delta if B is worse, green if better) so the marginal cost of
the compounding failure is immediately legible without mental subtraction.

## Comparison Overlay Chart

- Same chart primitive as `ScenarioTimelineChart` (docs/07), extended to accept two labeled series
  sets — Slot A in one hue family (e.g. ice-cyan), Slot B in another (e.g. violet/simulated-purple),
  with a shared legend clearly marked "A: {scenario name}" / "B: {scenario name}".
- Toggle between metrics shown (load / battery SoC / fuel) — since overlaying all three for two
  scenarios at once (6 lines) would be visually overwhelming; default to whichever metric first
  diverges between A and B (a computed "point of divergence" the backend/derived layer could surface,
  but which the UI can default to "fuel" today as the most consequential metric).
- Vertical annotation lines mark each scenario's own perturbation start points, differentiated by
  slot color, so it's clear *when* each scenario's stress event begins even if durations differ.

## Empty/mismatched states

- If either slot is unselected, render an `EmptyState` in that half of the layout ("Select a scenario
  to compare") — never show a broken/partial chart.
- If A and B have different durations, the chart x-axis extends to the longer of the two, and the
  shorter scenario's lines simply end — no fabricated extrapolation past its modeled duration.
