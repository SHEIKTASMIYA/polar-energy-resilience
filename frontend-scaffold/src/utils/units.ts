/**
/**
 * Formatting and conversion utility helpers for power (kW), energy (kWh),
 * volume (Litres), temperature (°C), and wind speed (knots).
 */

export function formatKw(val: number, showUnit: boolean = true): string {
  const formatted = val.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return showUnit ? `${formatted} kW` : formatted;
}

export function formatKwh(val: number, showUnit: boolean = true): string {
  const formatted = Math.round(val).toLocaleString('en-US');
  return showUnit ? `${formatted} kWh` : formatted;
}

export function formatLitres(val: number, showUnit: boolean = true): string {
  const formatted = Math.round(val).toLocaleString('en-US');
  return showUnit ? `${formatted} L` : formatted;
}

export function formatTemp(val: number, showUnit: boolean = true): string {
  const formatted = val.toFixed(1);
  return showUnit ? `${formatted} °C` : formatted;
}

export function formatKnots(val: number, showUnit: boolean = true): string {
  const formatted = Math.round(val).toString();
  return showUnit ? `${formatted} kt` : formatted;
}

export function formatDays(val: number): string {
  return `${val.toFixed(1)} days`;
}

export function formatPercent(val: number): string {
  return `${Math.round(val)}%`;
}
