# 04 — Data Contracts (Backend API Specification)

These are the shapes the frontend is built against **tonight**, using mock data. They are the spec
your backend (FastAPI/Node/whatever) should implement later. The actual TypeScript is in
`frontend-scaffold/src/types/` — this document explains the *why* behind each field.

General conventions:
- All timestamps are ISO-8601 UTC strings; the frontend converts to station-local time for display.
- All energy values in **kW** (power) or **kWh** (energy), all volumes in **litres**, all temperatures
  in **°C**, wind in **knots** (polar operations convention) — conversion helpers live in `utils/units.ts`.
- Every forecasted/estimated value ships as `{ value, low, high }` (a confidence interval), never a bare
  number — see `Interval<T>` in `common.ts`.
- Every payload includes a `meta.source` and `meta.retrievedAt` so the UI's `DataSourceTag` /
  `FreshnessIndicator` components always have something real to display.

## 1. Common envelope (`types/common.ts`)

- `Interval<T>` — `{ value: T; low: T; high: T }`
- `DataSource` — `'AADC' | 'NASA_POWER' | 'MERRA2' | 'LIVE_TELEMETRY' | 'SIMULATED' | 'DERIVED'`
- `SeverityLevel` — `'NOMINAL' | 'WATCH' | 'CRITICAL'`
- `SourceMeta` — `{ source: DataSource; retrievedAt: string; stationId: string }`

## 2. Station telemetry (`types/telemetry.ts`) — powers Overview

`StationOverview`:
- `currentLoadKw: number`
- `batterySoCPercent: number`
- `fuelDaysRemaining: number`
- `gensetsOnline: number`
- `gensetsTotal: number`
- `outsideTempC: number`
- `windSpeedKt: number`
- `powerFlow: { solarKw, batteryKw, gensetKw, loadKw, batteryDirection: 'charging'|'discharging'|'idle' }`
- `loadCurve24h: { timestamp: string; loadKw: number }[]`
- `alerts: AlertEvent[]`
- `meta: SourceMeta`

`AlertEvent`: `{ id, severity: SeverityLevel, message, category: 'power'|'fuel'|'weather'|'system', timestamp }`

*Backend note:* this endpoint is the aggregation point — it's expected to fan out to AADC live feed +
derived battery/genset state. Frontend treats it as one call (`GET /api/v1/stations/:id/overview`).

## 3. Demand forecast (`types/forecast.ts`) — powers Demand Forecast page

`DemandForecast`:
- `horizon: '24h' | '7d' | '30d'`
- `modelVersion: string` (e.g. `"demand-lstm-v0.3"`) — always shown in UI so users know what produced a number
- `points: DemandForecastPoint[]`
- `drivers: { feature: string; importance: number }[]` — for the driver-breakdown panel
- `accuracy?: { mae: number; rmse: number; evaluatedAgainst: string }` — optional, appears once backend
  has enough historical AADC data to backtest
- `meta: SourceMeta`

`DemandForecastPoint`: `{ timestamp: string; actualKw?: number; forecastKw: Interval<number> }`

## 4. Solar & climate resource (`types/solar.ts`) — powers Solar & Resource page

`SolarResourceSeries`:
- `points: { timestamp: string; ghiWm2: number; dniWm2?: number; ambientTempC: number }[]`
  (GHI/DNI from NASA POWER; temp from MERRA-2 — kept in one series because they're always viewed together)
- `estimatedPvYieldKwh?: Interval<number>` — pre-ML naive estimate (panel-spec × irradiance), clearly
  labeled `DERIVED`, not ML, until the real model exists
- `meta: SourceMeta[]` (array — this endpoint blends two upstream sources, each needs its own freshness tag)

## 5. Energy dispatch (`types/dispatch.ts`) — powers Energy Dispatch page

`DispatchPlan`:
- `strategy: 'cost_min' | 'fuel_min' | 'reliability_max'`
- `timeline: DispatchTimelinePoint[]`
- `gensets: GensetStatus[]`
- `battery: { soCPercent: number; capacityKwh: number; usableKwh: number; cycleCount: number }`

`DispatchTimelinePoint`: `{ timestamp, solarKw, batteryKw, gensetKw, loadKw }` (stacked-area source data)

`GensetStatus`: `{ id, name, isOnline, ratedKw, currentOutputKw, runtimeHoursTotal, fuelEfficiencyLPerKwh }`

## 6. Fuel intelligence (`types/fuel.ts`) — powers Fuel Intelligence page

`FuelStatus`:
- `tanks: { id, name, currentLitres, capacityLitres }[]`
- `totalLitres: number`
- `dailyBurnRateL: Interval<number>`
- `daysRemaining: Interval<number>`
- `survivalCurve: { date: string; projectedLitres: Interval<number> }[]`
- `nextResupply: { expectedDate: string; confirmedVessel?: string; requiredReserveLitres: number } | null`
- `riskFlag: SeverityLevel`
- `meta: SourceMeta`

*Backend note:* `survivalCurve` is the drawdown-to-zero projection the UI plots against the resupply
date — this is the single most important number on the whole platform (this is a life-safety-adjacent
metric at a polar station), so it always ships with an interval, never a point estimate.

## 7. Scenario simulation (`types/scenario.ts`) — powers Scenario Simulator + Compare

`ScenarioDefinition` (the input the user builds in `<ScenarioBuilderPanel>`):
- `id, name, createdAt`
- `durationDays: number`
- `perturbations: { type: 'blizzard' | 'temp_drop' | 'genset_outage' | 'solar_loss' | 'resupply_delay';
  magnitude: number; startDay: number; durationDays: number }[]`
- `baselineSource: 'current_conditions' | 'historical_worst_case' | 'custom'`

`ScenarioResult` (the output):
- `scenarioId: string`
- `outcome: 'SURVIVES' | 'FUEL_CRITICAL' | 'LOAD_SHED_REQUIRED'`
- `fuelCriticalOnDay?: number`
- `timeline: { day: number; loadKw: number; batterySoCPercent: number; fuelLitres: number; severity: SeverityLevel }[]`
- `assumptions: string[]` — plain-language list, always rendered in `<ScenarioAssumptionsPanel>` so no
  number is ever presented without its caveats
- `meta: SourceMeta`

## Why this matters for tonight's build

Every hook in `features/*/hooks/` (e.g. `useFuelStatus()`) is typed to return exactly these shapes.
Tonight they're backed by `services/mockAdapter.ts` returning realistic fixture data from `src/mocks/`.
When the backend exists, `services/endpoints.ts` implements the same function signatures against real
HTTP calls — **the components never know the difference.**
