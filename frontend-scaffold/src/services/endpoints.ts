/**
 * The single seam between UI hooks and data. Every feature hook (useStationOverview,
 * useDemandForecast, ...) imports from here — NEVER from apiClient.ts or mockAdapter.ts directly.
 *
 * Today: featureFlags.USE_MOCK_DATA routes everything to mockAdapter.ts.
 * Later: flip the flag, implement the apiGet/apiPost calls below, delete nothing in the UI layer.
 */

import { featureFlags } from '../config/featureFlags';
import * as mock from './mockAdapter';
import { apiGet, apiPost } from './apiClient';
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

export async function fetchStationOverview(
  stationId: string
): Promise<StationOverview> {
  if (featureFlags.USE_MOCK_DATA) {
    return mock.getStationOverviewMock(stationId);
  }

  return apiGet<StationOverview>(
    `/api/v1/stations/${stationId}/overview`
  );
}

export async function fetchDemandForecast(
  stationId: string,
  horizon: '24h' | '7d' | '30d',
): Promise<DemandForecast> {
  if (featureFlags.USE_MOCK_DATA) {
    return mock.getDemandForecastMock(stationId, horizon);
  }

  return apiGet<DemandForecast>(
    `/api/v1/stations/${stationId}/forecast/demand`,
    { horizon },
  );
}

export async function fetchSolarResource(
  stationId: string
): Promise<SolarResourceSeries> {
  if (featureFlags.USE_MOCK_DATA) {
    return mock.getSolarResourceMock(stationId);
  }

  return apiGet<SolarResourceSeries>(
    `/api/v1/stations/${stationId}/resource/solar`
  );
}

export async function fetchDispatchPlan(
  stationId: string,
  strategy: DispatchStrategy,
): Promise<DispatchPlan> {
  if (featureFlags.USE_MOCK_DATA) return mock.getDispatchPlanMock(stationId, strategy);
  return apiGet<DispatchPlan>(`/api/v1/stations/${stationId}/dispatch`, { strategy });
}

export async function fetchFuelStatus(stationId: string): Promise<FuelStatus> {
  if (featureFlags.USE_MOCK_DATA) {
    return mock.getFuelStatusMock(stationId);
  }

  return apiGet<FuelStatus>(
    `/api/v1/stations/${stationId}/fuel`
  );
}

export async function runScenario(
  scenario: ScenarioDefinition
): Promise<ScenarioResult> {
  if (featureFlags.USE_MOCK_DATA) {
    return mock.runScenarioMock(scenario);
  }

  return apiPost<ScenarioResult, ScenarioDefinition>(
    '/api/v1/scenarios/run',
    scenario
  );
}

export async function fetchStationAssets(stationId: string) {
  if (featureFlags.USE_MOCK_DATA) {
    return mock.getStationAssetsMock(stationId);
  }

  const res = await apiGet<{ assets: any[] }>(`/api/v1/stations/${stationId}/assets`);
  return res.assets;
}

export async function fetchDecisionSupport(stationId: string) {
  if (featureFlags.USE_MOCK_DATA) {
    return {
      overallStatus: 'WATCH',
      stationId,
      keyDrivers: [
        { label: 'Fuel Reserve Survival Horizon', value: '58.0 days', status: 'NOMINAL' },
        { label: 'Forecast Electrical Load', value: '224.5 kW avg', status: 'NOMINAL' },
        { label: 'Katabatic Wind Velocity', value: '28.0 kt', status: 'WATCH' },
      ],
      recommendations: [
        { priority: 'HIGH', category: 'Solar / Generation', action: 'Solar PV output is constrained. Maintain Genset #1 & #2 in base-load merit order.' },
        { priority: 'MEDIUM', category: 'Battery Storage', action: 'Preserve battery bank state of charge (current: 68%). Avoid non-essential peak discharge.' },
      ],
      meta: { source: 'DERIVED', retrievedAt: new Date().toISOString(), stationId },
    };
  }

  return apiGet<{
    overallStatus: 'NOMINAL' | 'WATCH' | 'CRITICAL';
    stationId: string;
    keyDrivers: { label: string; value: string; status: 'NOMINAL' | 'WATCH' | 'CRITICAL' }[];
    recommendations: { priority: string; category: string; action: string }[];
    meta: { source: string; retrievedAt: string; stationId: string };
  }>(`/api/v1/stations/${stationId}/resilience/decision-support`);
}
