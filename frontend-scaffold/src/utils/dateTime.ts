/**
 * Date & time utilities for station-local time (Mawson UTC+5), UTC,
 * polar day/night indicators, and relative timestamps.
 */

export function formatStationTime(
  isoString: string,
  timezoneOffsetHours: number = 5,
  includeSeconds: boolean = false,
): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;

  // Offset date to station timezone
  const localTimeMs = d.getTime() + timezoneOffsetHours * 60 * 60 * 1000;
  const localDate = new Date(localTimeMs);

  const hours = localDate.getUTCHours().toString().padStart(2, '0');
  const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
  const seconds = localDate.getUTCSeconds().toString().padStart(2, '0');

  if (includeSeconds) {
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}`;
}

export function formatUtcTime(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;

  const hours = d.getUTCHours().toString().padStart(2, '0');
  const minutes = d.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes} UTC`;
}

export function formatShortDate(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function getPolarSeason(date: Date = new Date()): {
  season: 'Winter Ops' | 'Summer Ops';
  sunStatus: '24h Polar Night' | '24h Polar Day' | 'Diurnal Sun';
  icon: 'snowflake' | 'sun' | 'moon';
} {
  const month = date.getUTCMonth(); // 0 = Jan, 11 = Dec

  // Antarctic winter ops: May to September (months 4..8)
  if (month >= 4 && month <= 8) {
    return {
      season: 'Winter Ops',
      sunStatus: '24h Polar Night',
      icon: 'snowflake',
    };
  } else if (month === 11 || month <= 1) {
    // Antarctic summer ops: Dec to Feb
    return {
      season: 'Summer Ops',
      sunStatus: '24h Polar Day',
      icon: 'sun',
    };
  } else {
    return {
      season: 'Summer Ops',
      sunStatus: 'Diurnal Sun',
      icon: 'moon',
    };
  }
}

export function formatRelativeTime(isoString: string): string {
  const now = new Date().getTime();
  const past = new Date(isoString).getTime();
  const diffMs = now - past;

  if (diffMs < 60 * 1000) return 'Just now';
  const diffMins = Math.floor(diffMs / (60 * 1000));
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
