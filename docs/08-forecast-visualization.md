# 08 — Forecast Visualization Requirements

Applies to `DemandForecastChart` (electricity demand) and `SolarIrradianceChart` /
`TemperatureProfileChart` (resource forecasts) — all forecast charts in the platform share these
requirements so they read as one visual language.

## Mandatory elements on every forecast chart

1. **Actual vs. forecast visually distinguished** — actual/historical as a solid line, forecast as a
   dashed or lighter-weight line, with a clear vertical "now" marker separating them.
2. **Confidence band, always rendered** — translucent fill between `low` and `high` from the
   `Interval<number>` contract. Never plot a bare forecast line without its band; this is a resilience
   tool where false certainty is actively harmful.
3. **Model/data provenance tag** — `<DataSourceTag>` in the panel header (`AADC` for actuals,
   model version string like `demand-lstm-v0.3` for forecast, `NASA POWER`/`MERRA-2` for resource data).
4. **Horizon control** — `RangeSelector` (24h / 7d / 30d) that re-queries via the page-level hook,
   not client-side slicing of a fixed dataset (keeps it honest once real variable-horizon models exist).
5. **Hover/tooltip** shows exact timestamp, actual (if available), forecast value, and the interval
   bounds — in monospace, station-local time.
6. **Axis units always labeled** (kW, °C, W/m²) — never bare numbers on an axis.

## Demand Forecast specifics

- X-axis: time (station-local); Y-axis: kW.
- `ForecastDriversPanel`: horizontal bar chart of feature importances (e.g. temperature, hour-of-day,
  day-of-week, season) — gives the user a sense of *why* the model predicts what it predicts, critical
  for trust in an eventual ML system.
- `ForecastAccuracyPanel`: appears only once `accuracy` is present in the payload (i.e., once there's
  enough backtest history) — MAE/RMSE displayed plainly, plus a small actual-vs-predicted scatter for
  the evaluated period. Component should gracefully render an `EmptyState` ("Insufficient history to
  evaluate model accuracy yet") before that data exists — this lets the page ship tonight without
  looking broken.

## Solar & Resource specifics

- Dual-context chart: GHI/DNI irradiance (W/m²) plotted alongside ambient temperature (°C) on a
  secondary axis, since both come from the same "resource conditions" mental model and are usually
  read together (cold + clear = good solar day; overcast + relatively warm = poor solar day).
- `SolarYieldEstimatePanel` explicitly labeled `DERIVED` (not `NASA_POWER` directly) since it's a
  computed estimate — reinforces the platform-wide provenance discipline.
- Polar-specific treatment: at latitudes like Mawson's, solar irradiance drops to ~zero for extended
  polar-night periods — the chart must handle and clearly annotate zero-irradiance stretches (a shaded
  "Polar Night" band) rather than letting them look like a data outage.

## Shared chart component requirements (`BandedForecastChart`)

- Accepts `points: { timestamp, actual?, forecast: Interval<number> }[]` generically, reused across
  demand and resource forecasts.
- Must support annotated vertical reference lines (for "now," for scenario perturbation start points,
  for polar-night bands) via a generic `annotations` prop — this is what lets the Scenario Simulator
  reuse the same chart primitive later if needed.
- Must degrade cleanly to a data table view (accessibility requirement from `docs/05`).
