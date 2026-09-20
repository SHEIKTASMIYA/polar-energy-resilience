import type { SolarResourceSeries } from '../types';

export function getSolarResourceMock(stationId: string = 'mawson'): SolarResourceSeries {
  const now = new Date();
  const points = Array.from({ length: 48 }).map((_, i) => {
    const timestamp = new Date(now.getTime() - (24 - i) * 60 * 60 * 1000).toISOString();
    const hour = new Date(timestamp).getHours();

    // Polar diurnal irradiance (Mawson latitude ~67°S)
    let solar = 0;
    if (hour >= 4 && hour <= 20) {
      const sunPhase = Math.sin(((hour - 4) / 16) * Math.PI);
      solar = Math.max(0, Math.round(sunPhase * 420 + (Math.random() - 0.5) * 20));
    }

    const temp = Math.round((-20 - Math.sin((hour / 24) * Math.PI * 2) * 4) * 10) / 10;
    const wind = Math.round(25 + Math.sin(hour) * 8);

    return {
      timestamp,
      shortwaveRadiationWm2: solar,
      ambientTempC: temp,
      windSpeedKmh: wind,
    };
  });

  const validSolar = points.map((p) => p.shortwaveRadiationWm2);
  const avgSolar = validSolar.reduce((a, b) => a + b, 0) / validSolar.length;
  const peakSolar = Math.max(...validSolar);

  return {
    stationId,
    points,
    resourceSummary: {
      forecastHours: points.length,
      averageShortwaveRadiationWm2: Math.round(avgSolar * 100) / 100,
      peakShortwaveRadiationWm2: Math.round(peakSolar * 100) / 100,
    },
    meta: {
      source: 'Open-Meteo',
      retrievedAt: new Date().toISOString(),
      stationId,
      dataType: 'hourly environmental forecast',
      solarVariable: 'shortwave radiation',
      solarVariableUnit: 'W/m²',
      forecastHours: points.length,
      note: 'Solar radiation is reported directly from Open-Meteo shortwave radiation.',
    },
  };
}
