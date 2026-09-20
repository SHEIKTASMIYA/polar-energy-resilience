import type { ScenarioDefinition, ScenarioResult } from '../types';

export function runScenarioMock(scenario: ScenarioDefinition): ScenarioResult {
  const duration = scenario.durationDays || 14;
  const initialFuel = 142500;
  const initialSoC = 68;

  let fuelCriticalDay: number | undefined = undefined;
  let outcome: 'SURVIVES' | 'FUEL_CRITICAL' | 'LOAD_SHED_REQUIRED' = 'SURVIVES';

  // Evaluate perturbations
  const blizzard = scenario.perturbations.find((p) => p.type === 'blizzard');
  const tempDrop = scenario.perturbations.find((p) => p.type === 'temp_drop');
  const gensetOutage = scenario.perturbations.find((p) => p.type === 'genset_outage');
  const solarLoss = scenario.perturbations.find((p) => p.type === 'solar_loss');
  const resupplyDelay = scenario.perturbations.find((p) => p.type === 'resupply_delay');

  const baseBurnRate = 2420; // Litres/day
  let extraBurnPerDay = 0;

  if (blizzard) extraBurnPerDay += blizzard.magnitude * 25; // Litres/day per wind magnitude
  if (tempDrop) extraBurnPerDay += Math.abs(tempDrop.magnitude) * 35; // Litres/day per degree drop
  if (gensetOutage) extraBurnPerDay += 200; // Efficiency loss on remaining units

  const totalDailyBurn = baseBurnRate + extraBurnPerDay;

  const timeline = Array.from({ length: duration }).map((_, i) => {
    const day = i + 1;

    let loadKw = 220;
    if (tempDrop && day >= tempDrop.startDay && day < tempDrop.startDay + tempDrop.durationDays) {
      loadKw += Math.abs(tempDrop.magnitude) * 3.5;
    }
    if (blizzard && day >= blizzard.startDay && day < blizzard.startDay + blizzard.durationDays) {
      loadKw += blizzard.magnitude * 1.8;
    }

    // SoC calculation
    let batterySoCPercent = Math.max(
      15,
      initialSoC - day * (solarLoss ? 3.5 : 1.2) - (blizzard ? 4.0 : 0),
    );

    // Fuel calculation
    const fuelLitres = Math.max(0, initialFuel - day * totalDailyBurn);

    let severity: 'NOMINAL' | 'WATCH' | 'CRITICAL' = 'NOMINAL';
    if (fuelLitres < 35000 || batterySoCPercent < 25) {
      severity = 'WATCH';
    }
    if (fuelLitres < 15000 || batterySoCPercent <= 15) {
      severity = 'CRITICAL';
      if (!fuelCriticalDay) fuelCriticalDay = day;
    }

    return {
      day,
      loadKw: Math.round(loadKw * 10) / 10,
      batterySoCPercent: Math.round(batterySoCPercent * 10) / 10,
      fuelLitres: Math.round(fuelLitres),
      severity,
    };
  });

  if (fuelCriticalDay) {
    outcome = 'FUEL_CRITICAL';
  } else if (
    gensetOutage ||
    (solarLoss && solarLoss.magnitude > 60) ||
    (resupplyDelay && resupplyDelay.magnitude > 14)
  ) {
    outcome = 'LOAD_SHED_REQUIRED';
  }

  const assumptions = [
    `Baseline station electrical load initialized at 220 kW with Mawson thermal profile.`,
    `Station crew size assumed constant at 18 wintering personnel.`,
    `Fuel burn calculated based on 3× Caterpillar 3512B generator efficiency curves.`,
    blizzard
      ? `Blizzard impact modeled: Katabatic wind drag +${(blizzard.magnitude * 25).toFixed(0)} L/day thermal load.`
      : `Nominal weather baseline assumed.`,
    tempDrop
      ? `Temperature drop of ${Math.abs(tempDrop.magnitude)}°C starting on Day ${tempDrop.startDay}.`
      : `Ambient temperature maintained at seasonal average (-22°C).`,
    gensetOutage
      ? `Genset unit failure active for ${gensetOutage.durationDays} days starting Day ${gensetOutage.startDay}.`
      : `All 4 diesel generator units assumed fully operational.`,
    resupplyDelay
      ? `Resupply vessel arrival delayed by ${resupplyDelay.magnitude} days.`
      : `Resupply vessel RSV Nuyina ETA on schedule.`,
  ];

  return {
    scenarioId: scenario.id,
    outcome,
    fuelCriticalOnDay: fuelCriticalDay,
    timeline,
    assumptions,
    meta: {
      source: 'SIMULATED',
      retrievedAt: new Date().toISOString(),
      stationId: 'mawson',
    },
  };
}

export const PRESET_SCENARIOS: { definition: ScenarioDefinition; result: ScenarioResult }[] = [
  {
    definition: {
      id: 'scen-blizzard-48h',
      name: '48-Hour Severe Blizzard',
      createdAt: new Date().toISOString(),
      durationDays: 14,
      perturbations: [
        { type: 'blizzard', magnitude: 45, startDay: 2, durationDays: 2 },
        { type: 'temp_drop', magnitude: -8, startDay: 2, durationDays: 3 },
      ],
      baselineSource: 'current_conditions',
    },
    result: runScenarioMock({
      id: 'scen-blizzard-48h',
      name: '48-Hour Severe Blizzard',
      createdAt: new Date().toISOString(),
      durationDays: 14,
      perturbations: [
        { type: 'blizzard', magnitude: 45, startDay: 2, durationDays: 2 },
        { type: 'temp_drop', magnitude: -8, startDay: 2, durationDays: 3 },
      ],
      baselineSource: 'current_conditions',
    }),
  },
  {
    definition: {
      id: 'scen-compound-outage',
      name: 'Blizzard + Genset #1 Outage',
      createdAt: new Date().toISOString(),
      durationDays: 14,
      perturbations: [
        { type: 'blizzard', magnitude: 50, startDay: 3, durationDays: 3 },
        { type: 'genset_outage', magnitude: 1, startDay: 3, durationDays: 7 },
        { type: 'solar_loss', magnitude: 80, startDay: 3, durationDays: 3 },
      ],
      baselineSource: 'historical_worst_case',
    },
    result: runScenarioMock({
      id: 'scen-compound-outage',
      name: 'Blizzard + Genset #1 Outage',
      createdAt: new Date().toISOString(),
      durationDays: 14,
      perturbations: [
        { type: 'blizzard', magnitude: 50, startDay: 3, durationDays: 3 },
        { type: 'genset_outage', magnitude: 1, startDay: 3, durationDays: 7 },
        { type: 'solar_loss', magnitude: 80, startDay: 3, durationDays: 3 },
      ],
      baselineSource: 'historical_worst_case',
    }),
  },
  {
    definition: {
      id: 'scen-resupply-delay-30d',
      name: '30-Day Resupply Vessel Ice Lockup',
      createdAt: new Date().toISOString(),
      durationDays: 30,
      perturbations: [
        { type: 'resupply_delay', magnitude: 30, startDay: 1, durationDays: 30 },
        { type: 'temp_drop', magnitude: -5, startDay: 10, durationDays: 14 },
      ],
      baselineSource: 'current_conditions',
    },
    result: runScenarioMock({
      id: 'scen-resupply-delay-30d',
      name: '30-Day Resupply Vessel Ice Lockup',
      createdAt: new Date().toISOString(),
      durationDays: 30,
      perturbations: [
        { type: 'resupply_delay', magnitude: 30, startDay: 1, durationDays: 30 },
        { type: 'temp_drop', magnitude: -5, startDay: 10, durationDays: 14 },
      ],
      baselineSource: 'current_conditions',
    }),
  },
];
