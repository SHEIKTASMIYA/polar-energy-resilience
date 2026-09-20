# 03 — Recommended Folder Structure

Feature-first structure. Chosen over a strict "components/pages/hooks at the root" layout because this
project will grow to 8+ genuinely distinct domains (forecast, dispatch, fuel, scenario, weather-compare)
and a flat structure gets unmanageable past ~15 components. Shared/dumb UI still lives centrally.

```
frontend-scaffold/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .env.example                     # VITE_API_BASE_URL etc. — no secrets committed
├── .gitignore
└── src/
    ├── main.tsx
    ├── app/
    │   ├── App.tsx                  # <AppShell> + <RouterProvider>
    │   ├── routes.tsx                # route table (see docs/02)
    │   └── providers/
    │       ├── QueryProvider.tsx     # react-query client (for when real APIs exist)
    │       └── ThemeProvider.tsx     # design tokens / dark-mode (default dark, see docs/05)
    │
    ├── components/                   # shared, feature-agnostic UI only
    │   ├── layout/
    │   │   ├── AppShell.tsx
    │   │   ├── PrimarySidebarNav.tsx
    │   │   ├── StationContextBar.tsx
    │   │   └── PageHeader.tsx
    │   ├── charts/
    │   │   ├── TimeSeriesChart.tsx
    │   │   ├── BandedForecastChart.tsx
    │   │   ├── StackedAreaChart.tsx
    │   │   ├── GaugeChart.tsx
    │   │   └── SankeyFlowChart.tsx
    │   ├── status/
    │   │   ├── StatusMetricCard.tsx
    │   │   ├── SeverityBadge.tsx
    │   │   ├── DataSourceTag.tsx
    │   │   └── FreshnessIndicator.tsx
    │   ├── controls/
    │   │   ├── RangeSelector.tsx
    │   │   ├── ToggleGroup.tsx
    │   │   └── StationSelector.tsx
    │   └── feedback/
    │       ├── LoadingSkeleton.tsx
    │       ├── EmptyState.tsx
    │       └── ErrorBoundaryPanel.tsx
    │
    ├── features/                     # one folder per IA domain — page + local components + hook
    │   ├── overview/
    │   │   ├── OverviewPage.tsx
    │   │   ├── components/
    │   │   │   ├── StationPowerFlowDiagram.tsx
    │   │   │   ├── LoadCurveChart.tsx
    │   │   │   └── AlertFeedPanel.tsx
    │   │   └── hooks/
    │   │       └── useStationOverview.ts
    │   ├── demand-forecast/
    │   │   ├── DemandForecastPage.tsx
    │   │   ├── components/
    │   │   └── hooks/useDemandForecast.ts
    │   ├── solar-resource/
    │   │   ├── SolarResourcePage.tsx
    │   │   ├── components/
    │   │   └── hooks/useSolarResource.ts
    │   ├── energy-dispatch/
    │   │   ├── EnergyDispatchPage.tsx
    │   │   ├── components/
    │   │   └── hooks/useDispatchPlan.ts
    │   ├── fuel-intelligence/
    │   │   ├── FuelIntelligencePage.tsx
    │   │   ├── components/
    │   │   └── hooks/useFuelStatus.ts
    │   ├── scenario-simulator/
    │   │   ├── ScenarioSimulatorPage.tsx
    │   │   ├── components/
    │   │   └── hooks/useScenarioRunner.ts
    │   ├── weather-compare/
    │   │   ├── WeatherComparePage.tsx
    │   │   ├── components/
    │   │   └── hooks/useScenarioComparison.ts
    │   └── station-assets/
    │       ├── StationAssetsPage.tsx
    │       └── components/
    │
    ├── types/                        # THE DATA CONTRACT — see docs/04
    │   ├── common.ts
    │   ├── telemetry.ts
    │   ├── forecast.ts
    │   ├── solar.ts
    │   ├── dispatch.ts
    │   ├── fuel.ts
    │   ├── scenario.ts
    │   └── index.ts
    │
    ├── services/                     # API boundary — swap mock -> real without touching UI
    │   ├── apiClient.ts               # fetch wrapper, base URL, error normalization
    │   ├── endpoints.ts               # typed endpoint functions, one per data contract
    │   └── mockAdapter.ts             # returns src/mocks/* through the same interface
    │
    ├── mocks/                         # realistic fixture data, shaped exactly like types/*
    │   ├── overview.mock.ts
    │   ├── demandForecast.mock.ts
    │   ├── solarResource.mock.ts
    │   ├── dispatch.mock.ts
    │   ├── fuel.mock.ts
    │   └── scenario.mock.ts
    │
    ├── state/                        # app-level UI state only (NOT remote data — react-query owns that)
    │   ├── stationContextStore.ts     # selected station, unit system, theme
    │   └── scenarioDraftStore.ts      # in-progress scenario builder form state
    │
    ├── styles/
    │   ├── tokens.css                 # design system CSS variables (docs/05)
    │   ├── global.css
    │   └── charts-theme.ts            # shared chart color/typography config
    │
    ├── utils/
    │   ├── units.ts                   # kW/kWh/L conversions, formatting
    │   ├── dateTime.ts                # station-local vs UTC helpers, polar day/night calc
    │   └── severity.ts                # threshold → NOMINAL/WATCH/CRITICAL logic
    │
    └── config/
        ├── stations.ts                # station registry (Mawson now, Davis/Casey later)
        └── featureFlags.ts            # e.g. USE_MOCK_DATA=true until backend exists
```

## Why this scales into the final-year project

- **`services/` is the single seam.** Tonight, `USE_MOCK_DATA=true` routes every hook through
  `mockAdapter.ts`. When the backend exists, you flip one flag and point `apiClient.ts` at the real
  base URL — no component or page changes.
- **`features/` isolates blast radius.** Adding ML-driven forecasting later only touches
  `features/demand-forecast/`, not the rest of the app.
- **`types/` is versioned documentation.** It becomes the literal spec you hand to your backend-building
  self — see `docs/04`.
- **`config/stations.ts`** means "just Mawson" today doesn't require a rewrite when Davis/Casey Stations
  are added — it's a registry lookup, not a hardcoded assumption, from day one.
