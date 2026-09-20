/**
 * Returns fixture data through the SAME function signatures that services/endpoints.ts will
 * eventually implement against the real backend. Every feature hook calls into endpoints.ts,
 * which — while featureFlags.USE_MOCK_DATA is true — delegates here.
 *
 * TODO: populate each function body once src/mocks/*.mock.ts fixtures are written out.
 * (Fixture files are reserved/empty tonight — filling them with realistic Mawson-shaped
 * numbers is the natural next step once component-building begins.)
 */

import type {
  StationOverview,
  DemandForecast,
  SolarResourceSeries,
  DispatchPlan,
  DispatchStrategy,
  FuelStatus,
  ScenarioDefinition,
  ScenarioResult,
} from '../types';

import { getOverviewMock } from '../mocks/overview.mock';
import { getDemandForecastMock as fetchDemandMock } from '../mocks/demandForecast.mock';
import { getSolarResourceMock as fetchSolarMock } from '../mocks/solarResource.mock';
import { getDispatchPlanMock as fetchDispatchMock } from '../mocks/dispatch.mock';
import { getFuelStatusMock as fetchFuelMock } from '../mocks/fuel.mock';
import { runScenarioMock as executeScenarioMock } from '../mocks/scenario.mock';

export async function getStationOverviewMock(stationId: string): Promise<StationOverview> {
  return getOverviewMock(stationId);
}

export async function getDemandForecastMock(
  stationId: string,
  horizon: '24h' | '7d' | '30d',
): Promise<DemandForecast> {
  return fetchDemandMock(stationId, horizon);
}

export async function getSolarResourceMock(stationId: string): Promise<SolarResourceSeries> {
  return fetchSolarMock(stationId);
}

export async function getDispatchPlanMock(
  stationId: string,
  strategy: DispatchStrategy,
): Promise<DispatchPlan> {
  return fetchDispatchMock(stationId, strategy);
}

export async function getFuelStatusMock(stationId: string): Promise<FuelStatus> {
  return fetchFuelMock(stationId);
}

export async function runScenarioMock(scenario: ScenarioDefinition): Promise<ScenarioResult> {
  return executeScenarioMock(scenario);
}

import { getStationAssetsMock as fetchAssetsMock, type StationAsset } from '../mocks/assets.mock';

export async function getStationAssetsMock(stationId: string): Promise<StationAsset[]> {
  return fetchAssetsMock();
}

