import type { StationOverview } from '../types';

export function getOverviewMock(stationId: string = 'mawson'): StationOverview {
  const now = new Date();

  // Generate 24h historical load curve points (1-hour resolution)
  const loadCurve24h = Array.from({ length: 24 }).map((_, i) => {
    const timestamp = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000).toISOString();
    // Diurnal load cycle between 180kW and 255kW with slight noise
    const baseLoad = 210 + Math.sin((i / 24) * Math.PI * 2) * 35;
    const noise = (Math.random() - 0.5) * 10;
    return {
      timestamp,
      loadKw: Math.round((baseLoad + noise) * 10) / 10,
    };
  });

  return {
    currentLoadKw: 224.5,
    batterySoCPercent: 68,
    fuelDaysRemaining: 58,
    gensetsOnline: 2,
    gensetsTotal: 4,
    outsideTempC: -22.4,
    windSpeedKt: 28,
    powerFlow: {
      solarKw: 45.0,
      batteryKw: 25.0, // positive = discharging, negative = charging
      gensetKw: 154.5,
      loadKw: 224.5,
      batteryDirection: 'discharging',
    },
    loadCurve24h,
    alerts: [
      {
        id: 'alt-101',
        severity: 'WATCH',
        category: 'fuel',
        message: 'Tank 3 transfer pump maintenance scheduled in 48h',
        timestamp: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
      },
      {
        id: 'alt-102',
        severity: 'NOMINAL',
        category: 'power',
        message: 'Genset 2 routine oil & filter inspection cleared',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'alt-103',
        severity: 'WATCH',
        category: 'weather',
        message: 'Blizzard warning: Katabatic wind gust forecast up to 45 kt',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'alt-104',
        severity: 'CRITICAL',
        category: 'system',
        message: 'Solar Inverter B2 minor communications timeout',
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
    meta: {
      source: 'LIVE_TELEMETRY',
      retrievedAt: new Date().toISOString(),
      stationId,
    },
  };
}
