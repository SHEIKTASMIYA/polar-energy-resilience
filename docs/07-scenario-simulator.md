# 07 — Scenario Simulator Layout

## Purpose

Answer: *"If a specific bad thing happens, for how long, starting now — do we survive it, and what
breaks first?"* This is the platform's signature resilience feature, so it gets the most deliberate
layout of any page: a **builder / run / result** three-stage flow, all visible on one screen on
desktop (not a wizard — power users iterate on parameters rapidly).

## Layout

```
┌───────────────────────────────┬────────────────────────────────────────┐
│  SCENARIO BUILDER (left, 4/12) │  RESULT SUMMARY (top, 8/12)            │
│                                 ├──────────────────────────────────────┤
│  Name / duration                │  SCENARIO TIMELINE CHART (8/12)       │
│  ─────────────────────────      │  (load / battery SoC / fuel litres    │
│  Perturbations (repeatable rows)│   traced across scenario duration,    │
│   [+] Blizzard                  │   severity-shaded background bands)   │
│       duration, wind severity   ├──────────────────────────────────────┤
│   [+] Temperature drop          │  ASSUMPTIONS PANEL (8/12)             │
│       Δ°C, start day            │  (plain-language, always visible —    │
│   [+] Genset outage             │   never buried behind a tooltip)      │
│       which unit, duration      │                                        │
│   [+] Solar loss                │                                        │
│       % reduction, duration     │                                        │
│   [+] Resupply delay            │                                        │
│       days delayed              │                                        │
│  ─────────────────────────      │                                        │
│  Baseline: current / worst-case │                                        │
│  / custom                       │                                        │
│  ─────────────────────────      │                                        │
│  [ Run Scenario ]  [ Save ]     │                                        │
│  Saved scenarios list ▾         │                                        │
└───────────────────────────────┴────────────────────────────────────────┘
```

## ScenarioBuilderPanel — interaction model

- Perturbations are **additive, stackable cards** the user adds via a "+ Add perturbation" control —
  not a fixed form — because real contingency planning stacks compound failures (blizzard *and*
  genset outage *and* delayed resupply is exactly the scenario that matters most).
- Each perturbation type has its own minimal parameter set (see `ScenarioDefinition.perturbations` in
  `docs/04`) rendered via a small typed form component per type — `BlizzardParamsForm`,
  `GensetOutageParamsForm`, etc. — swappable/extensible as new perturbation types are added later.
- A `ScenarioParamSlider` (shared control) is used for all magnitude/duration inputs for visual
  consistency — always shows the numeric value in the monospace style, never a bare unlabeled slider.

## ResultSummary — headline treatment

Large, severity-colored headline outcome badge as the very first thing the eye hits after running a
scenario:
- **SURVIVES** (green) — "Station remains within nominal fuel/power margins for the full scenario duration."
- **FUEL_CRITICAL** (red) — "Fuel reserve reaches critical threshold on Day {n}."
- **LOAD_SHED_REQUIRED** (amber/red) — "Non-essential load shedding required from Day {n} to avoid blackout."

Below the headline: the 3 key derived numbers (days-to-critical, minimum battery SoC reached, peak
unmet load if any) as a small `StatusMetricCard` row reused from the Overview page — visual consistency
across the app reinforces "this is one coherent system."

## ScenarioTimelineChart

Multi-line time series across the scenario's day range: load (kW), battery SoC (%), fuel remaining
(litres) — three distinct y-axes or a normalized/indexed view (toggle between "raw units" and
"% of safe operating threshold" — the latter is often more useful for spotting which resource fails
first). Background shading transitions from nominal→watch→critical using the same severity colors as
everywhere else, so a scenario run visually "reads" the same way an Overview alert does.

## AssumptionsPanel

A non-negotiable, always-visible plain-text list (not a modal, not a tooltip) of every assumption the
simulation made — e.g. "Crew size held constant at 18," "No emergency resupply assumed," "Battery
degradation not modeled." This is a resilience-planning tool used to make real operational decisions;
hiding assumptions behind an info icon would undermine the entire premise of the platform.

## Saved scenarios

A lightweight list (name, date, outcome badge) below the builder, letting a user reload a past scenario
definition into the builder for tweaking, or send it directly to `/compare` as slot A or B.
