import type { SeverityLevel, SourceMeta } from './common';

/**
 * Contracts for the Scenario Simulator + Extreme-Weather Compare pages (docs/07, docs/11).
 */

export type PerturbationType =
  | 'blizzard'
  | 'temp_drop'
  | 'genset_outage'
  | 'solar_loss'
  | 'resupply_delay';

export interface Perturbation {
  type: PerturbationType;
  /** Meaning depends on type: wind severity, degrees C, N/A, % reduction, days delayed. */
  magnitude: number;
  startDay: number;
  durationDays: number;
}

/** The input a user builds in <ScenarioBuilderPanel />. */
export interface ScenarioDefinition {
  id: string;
  name: string;
  createdAt: string;
  durationDays: number;
  perturbations: Perturbation[];
  baselineSource: 'current_conditions' | 'historical_worst_case' | 'custom';
}

export type ScenarioOutcome = 'SURVIVES' | 'FUEL_CRITICAL' | 'LOAD_SHED_REQUIRED';

/** The output of POST /api/v1/scenarios/run */
export interface ScenarioResult {
  scenarioId: string;
  outcome: ScenarioOutcome;
  fuelCriticalOnDay?: number;
  timeline: ScenarioTimelinePoint[];
  /** Plain-language list, always rendered — never hidden behind a tooltip. */
  assumptions: string[];
  meta: SourceMeta;
}

export interface ScenarioTimelinePoint {
  day: number;
  loadKw: number;
  batterySoCPercent: number;
  fuelLitres: number;
  severity: SeverityLevel;
}
