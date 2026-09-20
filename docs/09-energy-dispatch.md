# 09 — Energy Dispatch Visualization

## Purpose

Show **how** the station's load is being met moment-to-moment across its three sources — solar,
battery, diesel genset(s) — and support planning which dispatch *strategy* to run under.

## Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│ DispatchStrategySelector: [ Cost-min ] [ Fuel-min ] [ Reliability-max ] │
├────────────────────────────────────────────────────────────────────────┤
│  DISPATCH TIMELINE (stacked area, full width)                          │
│  solar (amber) + battery (teal) + genset (bronze) = load (outline)     │
├───────────────────────────────┬────────────────────────────────────────┤
│  BATTERY STATE OF CHARGE       │  GENSET MERIT ORDER TABLE              │
│  (line chart, %, with WATCH/   │  (id, online?, output kW, runtime hrs, │
│   CRITICAL threshold lines)    │   L/kWh efficiency — sortable)         │
└───────────────────────────────┴────────────────────────────────────────┘
```

## Dispatch Timeline (stacked area chart)

- Stack order bottom-to-top: **Solar → Battery discharge → Genset**, with the station's total load
  drawn as a bold outline on top — visually, "does the stack reach the load line" *is* the dispatch story.
- When battery is **charging** (absorbing excess solar) rather than discharging, render as a
  negative-direction area beneath the zero line in the battery's teal — this single visual convention
  communicates charge/discharge direction without a separate legend entry.
- Genset area uses the bronze/diesel-brown token consistently — this color means "diesel" everywhere
  in the app (dispatch, fuel intelligence, scenario timeline).
- X-axis horizon matches a `RangeSelector` (typically 24h/48h for operational dispatch, distinct from
  the long-horizon selectors on the Forecast pages).

## DispatchStrategySelector

A `ToggleGroup` of three named strategies (`cost_min` / `fuel_min` / `reliability_max`) — tonight this
is a **display-only** selector (changes which mock dataset is shown); once a real dispatch-optimization
backend exists, selecting a strategy re-requests `useDispatchPlan(strategy)` and the timeline updates
to reflect that plan. Each strategy option shows a one-line description on hover (e.g. "Fuel-min:
maximize diesel conservation, accept lower reliability margin").

## Battery State of Charge chart

- Simple time-series line, 0–100%, with **horizontal threshold reference lines** at the WATCH and
  CRITICAL SoC levels (pulled from `config/stations.ts`, not hardcoded) rendered as thin dashed lines
  in the corresponding severity color — reinforces the severity system visually here too.
- Shaded region below the CRITICAL line in a faint red wash, so "how close did we get to critical"
  is legible at a glance even without reading exact numbers.

## Genset Merit Order Table

Columns: Unit ID/name · Online (boolean badge) · Current Output (kW) · Rated Capacity (kW) ·
Runtime Hours (total) · Fuel Efficiency (L/kWh). Sortable by any column — "merit order" in power
systems refers to the sequence in which generation units are dispatched by cost/efficiency, so this
table should default-sort by fuel efficiency ascending (most efficient unit first), reflecting how a
real station engineer would actually decide which genset to bring online next.

## Why a Sankey-style diagram is reserved, not default, here

The Overview page's `StationPowerFlowDiagram` (docs/06) gives the instantaneous "shape" of power flow.
Energy Dispatch is about **time-based planning**, where a stacked-area timeline communicates far more
than a flow diagram repeated per-hour would. Both pages use the same four-node mental model
(solar/battery/genset/load) and the same color tokens, so a user moving between them doesn't have to
re-learn the visual language — just reads it in two different temporal modes (instant vs. timeline).
