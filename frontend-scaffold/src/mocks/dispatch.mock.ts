import type { DispatchPlan, DispatchStrategy } from '../types';

export function getDispatchPlanMock(
  stationId: string = 'mawson',
  strategy: DispatchStrategy = 'cost_min',
): DispatchPlan {
  const now = new Date();

  // 24h timeline points
  const timeline = Array.from({ length: 24 }).map((_, i) => {
    const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000).toISOString();
    const hour = new Date(timestamp).getHours();

    const loadKw = 210 + Math.sin((hour / 24) * Math.PI * 2) * 35;
    let solarKw = 0;
    if (hour >= 5 && hour <= 19) {
      solarKw = Math.sin(((hour - 5) / 14) * Math.PI) * (strategy === 'fuel_min' ? 65 : 45);
    }

    let batteryKw = 0;
    let gensetKw = 0;

    if (strategy === 'fuel_min') {
      // Maximize battery discharge to shave peak genset
      batteryKw = hour >= 17 && hour <= 22 ? 40 : hour >= 8 && hour <= 15 ? -25 : 0;
      gensetKw = Math.max(0, loadKw - solarKw - Math.max(0, batteryKw));
    } else if (strategy === 'reliability_max') {
      // Keep gensets running at optimal 75% load for reliability
      batteryKw = hour >= 10 && hour <= 16 ? -30 : 0;
      gensetKw = Math.max(140, loadKw - solarKw);
    } else {
      // Cost min (default balanced)
      batteryKw = hour >= 18 && hour <= 23 ? 30 : hour >= 9 && hour <= 14 ? -20 : 0;
      gensetKw = Math.max(0, loadKw - solarKw - Math.max(0, batteryKw));
    }

    return {
      timestamp,
      solarKw: Math.round(solarKw * 10) / 10,
      batteryKw: Math.round(batteryKw * 10) / 10,
      gensetKw: Math.round(gensetKw * 10) / 10,
      loadKw: Math.round(loadKw * 10) / 10,
    };
  });

  return {
    strategy,
    timeline,
    gensets: [
      {
        id: 'gen-1',
        name: 'Genset #1 (Caterpillar 3512B)',
        isOnline: true,
        ratedKw: 150,
        currentOutputKw: 95.0,
        runtimeHoursTotal: 14280,
        fuelEfficiencyLPerKwh: 0.28,
      },
      {
        id: 'gen-2',
        name: 'Genset #2 (Caterpillar 3512B)',
        isOnline: true,
        ratedKw: 150,
        currentOutputKw: 85.0,
        runtimeHoursTotal: 12850,
        fuelEfficiencyLPerKwh: 0.29,
      },
      {
        id: 'gen-3',
        name: 'Genset #3 (Caterpillar 3512B)',
        isOnline: false,
        ratedKw: 150,
        currentOutputKw: 0,
        runtimeHoursTotal: 18910,
        fuelEfficiencyLPerKwh: 0.31,
      },
      {
        id: 'gen-4',
        name: 'Genset #4 (Emergency Cummins)',
        isOnline: false,
        ratedKw: 100,
        currentOutputKw: 0,
        runtimeHoursTotal: 4120,
        fuelEfficiencyLPerKwh: 0.34,
      },
    ],
    battery: {
      soCPercent: 68,
      capacityKwh: 1200,
      usableKwh: 960,
      cycleCount: 1420,
    },
    meta: {
      source: 'DERIVED',
      retrievedAt: new Date().toISOString(),
      stationId,
    },
  };
}
