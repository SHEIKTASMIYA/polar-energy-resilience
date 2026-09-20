import type { DemandForecast } from '../types';

export function getDemandForecastMock(
  stationId: string = 'mawson',
  horizon: '24h' | '7d' | '30d' = '30d',
): DemandForecast {
  return {
    horizon,
    modelVersion: 'demand-random-forest-v1',
    forecast: {
      date: '2016-09-01',
      energyKwh: 161800,
      averagePowerKw: 224.72,
    },
    environment: {
      temperatureC: -22.4,
      solarKwhM2Day: 0.85,
      source: 'Open-Meteo',
    },
    drivers: [
      { feature: 'Electricity_Lag1', importance: 0.42 },
      { feature: 'Temperature_C', importance: 0.28 },
      { feature: 'Electricity_Lag12', importance: 0.15 },
      { feature: 'Month', importance: 0.09 },
      { feature: 'Solar_kWh_m2_day', importance: 0.06 },
    ],
    modelEvaluation: {
      maeKwh: 16218.45,
      rmseKwh: 20840.68,
      evaluatedAgainst: 'chronological 20% holdout',
    },
    meta: {
      source: 'DERIVED',
      inputDate: '2016-08-01',
      stationId,
      forecastType: 'next-month electricity demand estimate',
    },
  };
}
