import type { FuelStatus } from '../types';

export function getFuelStatusMock(stationId: string = 'mawson'): FuelStatus {
  const now = new Date();
  const totalLitres = 142500; // ~58 days reserve at 2,420 L/day
  const dailyBurnRate = 2420;

  // Next resupply expected in 45 days (Antarctic shipping window)
  const resupplyDate = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);

  // Survival drawdown curve for 60 days
  const survivalCurve = Array.from({ length: 60 }).map((_, i) => {
    const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];

    // Burn accumulated with widening confidence uncertainty
    const projectedLitresValue = Math.max(0, totalLitres - i * dailyBurnRate);
    const uncertainty = i * 280;

    return {
      date: dateStr,
      projectedLitres: {
        value: projectedLitresValue,
        low: Math.max(0, projectedLitresValue - uncertainty),
        high: projectedLitresValue + uncertainty,
      },
    };
  });

  return {
    tanks: [
      { id: 'tank-1', name: 'Bulk Tank 1 (SAB)', currentLitres: 48000, capacityLitres: 60000 },
      { id: 'tank-2', name: 'Bulk Tank 2 (SAB)', currentLitres: 44000, capacityLitres: 60000 },
      { id: 'tank-3', name: 'Powerhouse Day Tank A', currentLitres: 28000, capacityLitres: 40000 },
      { id: 'tank-4', name: 'Emergency Reserve Tank', currentLitres: 22500, capacityLitres: 25000 },
    ],
    totalLitres,
    dailyBurnRateL: {
      value: dailyBurnRate,
      low: 2200,
      high: 2750,
    },
    daysRemaining: {
      value: 58.8,
      low: 51.8,
      high: 64.7,
    },
    survivalCurve,
    nextResupply: {
      expectedDate: resupplyDate.toISOString().split('T')[0],
      confirmedVessel: 'RSV Nuyina (AAD Flagship)',
      requiredReserveLitres: 35000,
    },
    riskFlag: 'NOMINAL',
    meta: {
      source: 'LIVE_TELEMETRY',
      retrievedAt: new Date().toISOString(),
      stationId,
    },
  };
}
