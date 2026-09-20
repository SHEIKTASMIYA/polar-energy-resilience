/**
 * Contract for:
 * GET /api/v1/stations/:id/forecast/demand?horizon=30d
 *
 * Powers the Demand Forecast page.
 * The backend uses the trained Random Forest model
 * together with environmental inputs from Open-Meteo.
 */

export interface DemandForecast {
  horizon: string;
  modelVersion: string;
  forecast: DemandForecastSummary;
  environment: ForecastEnvironment;
  drivers: FeatureImportance[];
  modelEvaluation: ForecastEvaluation;
  meta: ForecastMeta;
}

export interface DemandForecastSummary {
  date: string;
  energyKwh: number;
  averagePowerKw: number;
}

export interface ForecastEnvironment {
  temperatureC: number;
  solarKwhM2Day: number;
  source: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ForecastEvaluation {
  maeKwh: number;
  rmseKwh: number;
  evaluatedAgainst: string;
}

export interface ForecastMeta {
  source: string;
  inputDate: string;
  stationId: string;
  forecastType: string;
}