/**
 * Contract for GET /api/v1/stations/:id/dispatch?strategy=cost_min|fuel_min|reliability_max
 * Powers the Energy Dispatch page (docs/09).
 */
import type { SourceMeta } from './common';

export type DispatchStrategy = 'cost_min' | 'fuel_min' | 'reliability_max';

export interface DispatchPlan {
  strategy: DispatchStrategy;
  timeline: DispatchTimelinePoint[];
  gensets: GensetStatus[];
  battery: BatteryStatus;
  meta?: SourceMeta;
}

export interface DispatchTimelinePoint {
  timestamp: string;
  solarKw: number;
  /** Positive = discharging into the bus, negative = charging from excess solar. */
  batteryKw: number;
  gensetKw: number;
  loadKw: number;
}

export interface GensetStatus {
  id: string;
  name: string; // e.g. "Genset 1 (Cat 3406)"
  isOnline: boolean;
  ratedKw: number;
  currentOutputKw: number;
  runtimeHoursTotal: number;
  fuelEfficiencyLPerKwh: number;
}

export interface BatteryStatus {
  soCPercent: number;
  capacityKwh: number;
  usableKwh: number;
  cycleCount: number;
}
