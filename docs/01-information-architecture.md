# 01 — Dashboard Information Architecture

## Guiding principle

Polar Energy Resilience is an **operations & planning tool**, not a marketing dashboard. The IA is built
around the three real questions a station power engineer at Mawson actually asks:

1. **"What is happening right now?"** → Live Overview
2. **"What will happen in the next hours/days/weeks?"** → Forecasting & Dispatch Planning
3. **"What happens if things go wrong, and how long can we survive it?"** → Resilience & Scenario Simulation

Everything in the nav maps to one of these three questions, plus a Fuel Intelligence module that cuts
across all three (fuel is both a live gauge, a forecast input, and a survival constraint).

## Top-level navigation (primary sidebar)

```
POLAR ENERGY RESILIENCE
├── Overview                  (station-wide live snapshot)
├── Demand Forecast           (ML electricity demand — placeholder until backend/ML ready)
├── Solar & Resource          (NASA POWER solar irradiance, MERRA-2 temperature)
├── Energy Dispatch           (battery + diesel genset dispatch/merit order)
├── Fuel Intelligence         (fuel stock, burn rate, survival/resupply)
├── Scenario Simulator        (extreme-weather & contingency modeling)
├── Extreme-Weather Compare   (side-by-side scenario comparison)
├── Station & Assets          (asset registry: gensets, battery banks, panels)
└── Settings / Data Sources   (API connection status, units, station selector)
```

## Information hierarchy per page

Each page follows the same three-tier hierarchy so the platform feels like one coherent system rather
than a set of disconnected screens:

1. **Tier 1 — Status strip** (top, always visible): the 4–6 numbers a duty engineer glances at first
   (e.g. current load, battery SoC, fuel days remaining, genset(s) online, outside temp, wind).
2. **Tier 2 — Primary visualization**: the one chart/panel that answers this page's core question.
3. **Tier 3 — Supporting detail**: tables, secondary charts, logs, breakdowns — the "drill in" layer.

## Station context (always visible)

A persistent **Station Context Bar** sits above all pages:

- Station selector (Mawson Station default; architecture supports Davis/Casey later)
- Current local time + UTC + "Day/Night" indicator (relevant for solar generation context)
- Season indicator (Summer / Winter operations — crew size and load profile differ drastically)
- Data freshness indicator per source (AADC, NASA POWER, MERRA-2, live telemetry) — critical for a
  research-grade tool: users must always know *how stale* each number is.

## Cross-cutting concepts surfaced everywhere

- **Confidence/uncertainty**: every forecasted number (demand, solar, fuel-days) is displayed with a
  band/interval, never a bare point estimate — this is a resilience tool, false precision is dangerous.
- **Data provenance**: every chart has a small-caps source tag (`AADC`, `NASA POWER`, `MERRA-2`, `LIVE`,
  `SIMULATED`) so users never confuse forecasted/simulated data with telemetry.
- **Alert/threshold state**: three-state severity system (`NOMINAL` / `WATCH` / `CRITICAL`) used
  consistently across battery SoC, fuel reserve, and weather severity.

## Information flow between pages

```
Solar & Resource ──┐
                    ├──> Demand Forecast ──> Energy Dispatch ──> Fuel Intelligence ──> Scenario Simulator
Station telemetry ──┘                                                                        │
                                                                                              ▼
                                                                              Extreme-Weather Compare
```

Each page can deep-link forward (e.g. "Run this forecast through the Scenario Simulator") once
those interactions are implemented — the routing structure in `docs/02` reserves query-param slots
for this now, so it doesn't require a redesign later.
