/**
 * Station registry. Mawson is the only entry today, but every consumer of this file
 * (thresholds, timezone, coordinates) should look values up here rather than hardcode
 * "Mawson" assumptions — this is what lets Davis/Casey Stations be added later as data,
 * not a rewrite.
 *
 * TODO: fill in real threshold values with input from AAD operations once available.
 */

export interface StationConfig {
  id: string;
  name: string;
  country: string;
  utcOffsetHours: number;
  timezone: string; // IANA tz, e.g. "Antarctica/Mawson"
  coordinates: { lat: number; lon: number };
  thresholds: {
    batterySoCWatchPercent: number;
    batterySoCCriticalPercent: number;
    fuelDaysWatch: number;
    fuelDaysCritical: number;
  };
}

export const STATIONS: StationConfig[] = [
  {
    id: 'mawson',
    name: 'Mawson Station',
    country: 'Australia',
    utcOffsetHours: 5,
    timezone: 'Antarctica/Mawson',
    coordinates: { lat: -67.6014, lon: 62.8724 },
    thresholds: {
      batterySoCWatchPercent: 30,
      batterySoCCriticalPercent: 15,
      fuelDaysWatch: 45,
      fuelDaysCritical: 21,
    },
  },
];

export const DEFAULT_STATION_ID = 'mawson';

export function getStationConfig(stationId: string): StationConfig {
  const station = STATIONS.find((s) => s.id === stationId);
  if (!station) {
    throw new Error(`Unknown station id: ${stationId}`);
  }
  return station;
}
