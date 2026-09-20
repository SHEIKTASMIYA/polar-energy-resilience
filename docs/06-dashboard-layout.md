# 06 — Dashboard (Overview) Layout

## Shell layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  STATION CONTEXT BAR  (station · local time · UTC · season · data health)│
├───────────┬────────────────────────────────────────────────────────────┤
│           │  STATUS STRIP (6 metric cards, single row on desktop)       │
│  SIDEBAR  ├────────────────────────────────────────────────────────────┤
│  NAV      │  ┌───────────────────────────┐  ┌───────────────────────┐  │
│  (icons + │  │ STATION POWER FLOW DIAGRAM │  │  ALERT FEED           │  │
│  labels,  │  │ (solar/battery/genset/load)│  │  (scrollable list)    │  │
│  collapsi-│  └───────────────────────────┘  └───────────────────────┘  │
│  ble)     │  ┌────────────────────────────────────────────────────┐   │
│           │  │ 24H LOAD CURVE (full width time-series)             │   │
│           │  └────────────────────────────────────────────────────┘   │
│           │  ┌───────────────────────────┐  ┌───────────────────────┐ │
│           │  │ QUICK LINKS (Forecast/Fuel/│  │ RECENT SCENARIO RUNS  │ │
│           │  │ Scenario shortcuts)        │  │ (last 3, with outcome)│ │
│           │  └───────────────────────────┘  └───────────────────────┘ │
└───────────┴────────────────────────────────────────────────────────────┘
```

## Grid specification (desktop, 12-column)

- Sidebar: fixed 240px (collapsible to 64px icon rail)
- Status strip: 6 cards × 2 columns each = 12 columns, single row ≥1280px; wraps to 3×2 at 1024–1279px
- Power Flow Diagram: span 7 / Alert Feed: span 5
- Load Curve: full span 12
- Quick Links: span 5 / Recent Scenario Runs: span 7

## Status Strip — the six metrics and why these six

1. **Current Load (kW)** — the single most fundamental live number
2. **Battery SoC (%)** — with `SeverityBadge` (WATCH < 30%, CRITICAL < 15%, thresholds configurable)
3. **Fuel Days Remaining** — with `SeverityBadge` (WATCH < 45 days, CRITICAL < 21 days — placeholder
   thresholds, tunable per station in `config/stations.ts`)
4. **Gensets Online (n / total)**
5. **Outside Temp (°C)** — polar operations context, also a forecast/dispatch driver
6. **Wind Speed (kt)** — operationally critical (blizzard conditions affect both load and solar/logistics)

Each `StatusMetricCard` shows: label → monospace value → unit → delta-vs-previous-period arrow →
severity dot. Clicking a card deep-links to its owning page (Battery → Dispatch, Fuel → Fuel
Intelligence, etc.) — reserved interaction, wire up once routing/data exist.

## Station Power Flow Diagram

A simplified single-line-diagram-style visualization (not a literal electrical SLD, but inspired by
one): four nodes — **Solar Array**, **Battery Bank**, **Diesel Genset(s)**, **Station Load** — connected
by flow lines whose thickness/animation direction indicates current kW and direction (charging vs.
discharging battery, genset supplementing vs. idle). This is the signature visual of the Overview page
and should be built with the `SankeyFlowChart` wrapper (or a purpose-built SVG diagram — see
`docs/09` for a fuller treatment of this pattern, since Energy Dispatch reuses the same visual language).

## Alert Feed

Reverse-chronological list, each row: severity dot, category icon (power/fuel/weather/system),
message, relative timestamp. Filterable by severity. This is where "genset 2 fuel filter due,"
"battery SoC crossed WATCH threshold," "blizzard watch issued" all surface — the operational heartbeat
of the page.

## Responsive collapse order (see docs/12 for full strategy)

At narrow widths, sections stack in this priority order (most operationally urgent first):
Status Strip → Alert Feed → Power Flow Diagram → Load Curve → Quick Links → Recent Scenario Runs.
