import type { SourceMeta } from './common';

export interface SolarResourceSeries {
  stationId: string;
  points: SolarResourcePoint[];
  resourceSummary: SolarResourceSummary;
  meta: SolarResourceMeta;
}

export interface SolarResourcePoint {
  timestamp: string;
  shortwaveRadiationWm2: number;
  ambientTempC: number;
  windSpeedKmh: number;
}

export interface SolarResourceSummary {
  forecastHours: number;
  averageShortwaveRadiationWm2: number;
  peakShortwaveRadiationWm2: number;
}

export interface SolarResourceMeta {
  source: string;
  retrievedAt: string;
  stationId: string;
  dataType: string;
  solarVariable: string;
  solarVariableUnit: string;
  forecastHours: number;
  note: string;
}