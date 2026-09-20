import type { Interval, SeverityLevel, SourceMeta } from './common';

/**
 * Contract for GET /api/v1/stations/:id/fuel
 * Powers the Fuel Intelligence page (docs/10) — the single most operationally critical page
 * in the platform. Every projected number is an Interval, never a bare point estimate.
 */
export interface FuelStatus {
  tanks: FuelTank[];
  totalLitres: number;
  dailyBurnRateL: Interval<number>;
  daysRemaining: Interval<number>;
  survivalCurve: FuelSurvivalPoint[];
  nextResupply: ResupplyPlan | null;
  riskFlag: SeverityLevel;
  meta: SourceMeta;
}

export interface FuelTank {
  id: string;
  name: string; // e.g. "Fuel Farm Tank 2"
  currentLitres: number;
  capacityLitres: number;
}

export interface FuelSurvivalPoint {
  date: string; // ISO-8601 date
  projectedLitres: Interval<number>;
}

export interface ResupplyPlan {
  expectedDate: string;
  confirmedVessel?: string; // e.g. "RSV Nuyina"
  requiredReserveLitres: number;
}
