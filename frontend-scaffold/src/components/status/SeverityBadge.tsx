import type { SeverityLevel } from '../../types';
import { getSeverityColor, getSeverityBgColor } from '../../utils/severity';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  showText?: boolean;
}

export function SeverityBadge({ severity, showText = true }: SeverityBadgeProps) {
  const color = getSeverityColor(severity);
  const bgColor = getSeverityBgColor(severity);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: showText ? '2px 8px' : '4px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: bgColor,
        border: `1px solid ${color}40`,
        fontSize: 'var(--fs-11)',
        fontWeight: 600,
        color,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
      {showText && severity}
    </span>
  );
}
