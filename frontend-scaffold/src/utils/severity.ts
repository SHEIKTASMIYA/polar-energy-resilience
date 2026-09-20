import type { SeverityLevel } from '../types';

export function getBatterySeverity(socPercent: number): SeverityLevel {
  if (socPercent < 15) return 'CRITICAL';
  if (socPercent < 30) return 'WATCH';
  return 'NOMINAL';
}

export function getFuelSeverity(daysRemaining: number): SeverityLevel {
  if (daysRemaining < 21) return 'CRITICAL';
  if (daysRemaining < 45) return 'WATCH';
  return 'NOMINAL';
}

export function getSeverityColor(severity: SeverityLevel): string {
  switch (severity) {
    case 'CRITICAL':
      return 'var(--severity-critical)';
    case 'WATCH':
      return 'var(--severity-watch)';
    case 'NOMINAL':
    default:
      return 'var(--severity-nominal)';
  }
}

export function getSeverityBgColor(severity: SeverityLevel): string {
  switch (severity) {
    case 'CRITICAL':
      return 'rgba(232, 72, 58, 0.12)';
    case 'WATCH':
      return 'rgba(232, 179, 57, 0.12)';
    case 'NOMINAL':
    default:
      return 'rgba(47, 191, 113, 0.12)';
  }
}
