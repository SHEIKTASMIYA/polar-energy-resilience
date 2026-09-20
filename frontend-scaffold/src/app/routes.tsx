import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { OverviewPage } from '../features/overview/OverviewPage';
import { DemandForecastPage } from '../features/demand-forecast/DemandForecastPage';
import { SolarResourcePage } from '../features/solar-resource/SolarResourcePage';
import { EnergyDispatchPage } from '../features/energy-dispatch/EnergyDispatchPage';
import { FuelIntelligencePage } from '../features/fuel-intelligence/FuelIntelligencePage';
import { ScenarioSimulatorPage } from '../features/scenario-simulator/ScenarioSimulatorPage';
import { WeatherComparePage } from '../features/weather-compare/WeatherComparePage';
import { StationAssetsPage } from '../features/station-assets/StationAssetsPage';
import { DataSourcesPage } from '../features/settings/DataSourcesPage';
import { EmptyState } from '../components/feedback/EmptyState';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/overview" replace /> },
      { path: 'overview', element: <OverviewPage /> },
      { path: 'forecast/demand', element: <DemandForecastPage /> },
      { path: 'forecast/solar', element: <SolarResourcePage /> },
      { path: 'dispatch', element: <EnergyDispatchPage /> },
      { path: 'fuel', element: <FuelIntelligencePage /> },
      { path: 'scenario', element: <ScenarioSimulatorPage /> },
      { path: 'scenario/:scenarioId', element: <ScenarioSimulatorPage /> },
      { path: 'compare', element: <WeatherComparePage /> },
      { path: 'assets', element: <StationAssetsPage /> },
      { path: 'settings/data-sources', element: <DataSourcesPage /> },
      {
        path: '*',
        element: <EmptyState title="Page Not Found" description="The requested operations route does not exist." />,
      },
    ],
  },
]);
