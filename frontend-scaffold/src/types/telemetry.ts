import type { SeverityLevel, SourceMeta } from './common';

/**
 * Contract for GET /api/v1/stations/:id/overview
 * Powers the Overview page (docs/06). This is an aggregation endpoint — the backend is expected
 * to fan out to live SCADA telemetry + derived battery/genset state and merge into one payload.
 */
export interface StationOverview {
  currentLoadKw: number;
  batterySoCPercent: number;
  fuelDaysRemaining: number;
  gensetsOnline: number;
  gensetsTotal: number;
  outsideTempC: number;
  windSpeedKt: number;
  powerFlow: PowerFlowSnapshot;
  loadCurve24h: LoadCurvePoint[];
  alerts: AlertEvent[];
  meta: SourceMeta;
}

export interface PowerFlowSnapshot {
  solarKw: number;
  batteryKw: number;
  gensetKw: number;
  loadKw: number;
  batteryDirection: 'charging' | 'discharging' | 'idle';
}

export interface LoadCurvePoint {
  timestamp: string; // ISO-8601 UTC
  loadKw: number;
}

export interface AlertEvent {
  id: string;
  severity: SeverityLevel;
  message: string;
  category: 'power' | 'fuel' | 'weather' | 'system';
  timestamp: string;
}
