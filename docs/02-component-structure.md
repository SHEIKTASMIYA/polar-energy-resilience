# 02 — Page & Component Structure

## Routing map (React Router v6, data-router style)

```
/                                → redirect to /overview
/overview                        → OverviewPage
/forecast/demand                 → DemandForecastPage
/forecast/solar                  → SolarResourcePage
/dispatch                        → EnergyDispatchPage
/fuel                            → FuelIntelligencePage
/scenario                        → ScenarioSimulatorPage
/scenario/:scenarioId            → ScenarioSimulatorPage (loaded scenario)
/compare                         → WeatherComparePage
/compare?a=:scenarioIdA&b=:scenarioIdB
/assets                          → StationAssetsPage
/settings/data-sources           → DataSourcesPage
*                                → NotFoundPage
```

Reserving `:scenarioId` and `?a=&b=` params now means the eventual "send this forecast to the
simulator" / "compare these two runs" interactions need zero routing rework later.

## Page-level component tree (representative — Overview shown in full depth, others summarized)

```
<AppShell>
 ├── <StationContextBar />                 (station select, clock, season, data-freshness pills)
 ├── <PrimarySidebarNav />
 └── <PageOutlet>
      └── <OverviewPage>
           ├── <StatusStrip>
           │    ├── <StatusMetricCard metric="currentLoadKw" />
           │    ├── <StatusMetricCard metric="batterySoC" />
           │    ├── <StatusMetricCard metric="fuelDaysRemaining" />
           │    ├── <StatusMetricCard metric="gensetsOnline" />
           │    ├── <StatusMetricCard metric="outsideTempC" />
           │    └── <StatusMetricCard metric="windSpeedKt" />
           ├── <StationPowerFlowDiagram />         (solar → battery → bus → load, genset → bus)
           ├── <LoadCurveChart range="24h" />
           ├── <AlertFeedPanel />                  (NOMINAL/WATCH/CRITICAL events)
           └── <QuickLinksPanel />                 (jump to Forecast / Fuel / Scenario)
      </OverviewPage>
```

### DemandForecastPage
```
<DemandForecastPage>
 ├── <ForecastHeaderControls />        (horizon selector: 24h/7d/30d, model version tag)
 ├── <DemandForecastChart />           (actual vs. forecast, confidence band)
 ├── <ForecastAccuracyPanel />         (MAE/RMSE vs. historical AADC data, once backend exists)
 └── <ForecastDriversPanel />          (temp, season, day-of-week feature breakdown)
```

### SolarResourcePage
```
<SolarResourcePage>
 ├── <ResourceHeaderControls />        (date range, NASA POWER vs MERRA-2 toggle)
 ├── <SolarIrradianceChart />          (GHI/DNI over time)
 ├── <TemperatureProfileChart />       (MERRA-2 temp series)
 └── <SolarYieldEstimatePanel />       (estimated PV yield given panel spec — pre-ML placeholder)
```

### EnergyDispatchPage
```
<EnergyDispatchPage>
 ├── <DispatchTimeline />              (stacked area: solar / battery / diesel vs load, by hour)
 ├── <BatteryStateOfChargeChart />
 ├── <GensetMeritOrderTable />         (which genset runs when, runtime hours, efficiency)
 └── <DispatchStrategySelector />      (rule-based strategy toggle: cost-min / fuel-min / reliability-max)
```

### FuelIntelligencePage
```
<FuelIntelligencePage>
 ├── <FuelStatusStrip />               (tank levels per fuel farm tank, total litres, days remaining)
 ├── <FuelBurnRateChart />             (historical + projected daily burn)
 ├── <FuelSurvivalProjection />        (drawdown curve to zero, resupply window overlay)
 └── <ResupplyPlanningPanel />         (next resupply ETA, required reserve buffer, risk flag)
```

### ScenarioSimulatorPage
```
<ScenarioSimulatorPage>
 ├── <ScenarioBuilderPanel />          (form: blizzard duration, temp drop, genset outage, solar loss %)
 ├── <ScenarioRunControls />           (run / save / load scenario)
 ├── <ScenarioResultSummary />         (headline outcome: survives / fuel-critical-in-Xdays)
 ├── <ScenarioTimelineChart />         (projected load/battery/fuel trace across scenario duration)
 └── <ScenarioAssumptionsPanel />      (transparent list of every assumption used in the run)
```

### WeatherComparePage
```
<WeatherComparePage>
 ├── <ScenarioPicker slot="A" />
 ├── <ScenarioPicker slot="B" />
 ├── <ComparisonMetricsTable />        (side-by-side headline numbers)
 └── <ComparisonOverlayChart />        (both traces on one chart, distinct colors + legend)
```

## Shared/common component library (`src/components/`)

- **Layout primitives**: `PageHeader`, `PageSection`, `Panel`, `Grid`, `ResponsiveSplit`
- **Status/metric**: `StatusMetricCard`, `SeverityBadge` (NOMINAL/WATCH/CRITICAL), `DataSourceTag`,
  `FreshnessIndicator`, `TrendArrow`
- **Charts** (thin wrappers around a charting lib, see `docs/05`): `TimeSeriesChart`, `StackedAreaChart`,
  `BandedForecastChart`, `GaugeChart`, `SankeyFlowChart` (for power flow)
- **Controls**: `RangeSelector`, `ToggleGroup`, `ScenarioParamSlider`, `StationSelector`
- **Feedback**: `AlertFeedPanel`, `EmptyState`, `LoadingSkeleton`, `ErrorBoundaryPanel`

## Component design rules

1. Every chart component takes **typed props matching `src/types/*.ts`** — never inline `any` shapes.
   This is what lets the UI be built tonight against mock data and re-pointed at a real API later
   with zero component changes.
2. Every data-driven component has three explicit render states: `loading`, `error`, `data` — no
   component silently renders blank.
3. No component reaches into a global store directly for **remote data** — it receives data via props
   from a page-level hook (`useDemandForecast()`, `useFuelStatus()`, etc.). This keeps components
   reusable and trivially testable with mock data.
