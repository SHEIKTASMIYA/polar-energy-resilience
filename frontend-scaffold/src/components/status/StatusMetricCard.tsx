import type { SeverityLevel } from '../../types';
import { SeverityBadge } from './SeverityBadge';

interface StatusMetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  deltaText?: string;
  deltaDirection?: 'up' | 'down' | 'neutral';
  severity?: SeverityLevel;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export function StatusMetricCard({
  label,
  value,
  unit,
  deltaText,
  deltaDirection,
  severity,
  onClick,
  icon,
}: StatusMetricCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3) var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color var(--motion-fast)',
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.borderColor = 'var(--accent-ice)';
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: 'var(--fs-11)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-secondary)',
          }}
        >
          {label}
        </span>
        {severity && <SeverityBadge severity={severity} showText={false} />}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '6px 0 2px 0' }}>
        {icon && <span style={{ color: 'var(--text-secondary)', marginRight: '2px' }}>{icon}</span>}
        <span
          className="mono"
          style={{
            fontSize: 'var(--fs-24)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="mono"
            style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}
          >
            {unit}
          </span>
        )}
      </div>

      {deltaText && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--fs-11)' }}>
          <span
            style={{
              color:
                deltaDirection === 'up'
                  ? 'var(--severity-nominal)'
                  : deltaDirection === 'down'
                  ? 'var(--severity-critical)'
                  : 'var(--text-tertiary)',
            }}
          >
            {deltaDirection === 'up' ? '▲' : deltaDirection === 'down' ? '▼' : '•'}
          </span>
          <span style={{ color: 'var(--text-tertiary)' }}>{deltaText}</span>
        </div>
      )}
    </div>
  );
}
