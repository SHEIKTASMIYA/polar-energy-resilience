import { getSeverityColor } from '../../utils/severity';
import type { SeverityLevel } from '../../types';

interface GaugeChartProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  severity?: SeverityLevel;
  height?: number;
}

export function GaugeChart({
  value,
  max,
  label,
  unit = 'L',
  severity = 'NOMINAL',
  height = 140,
}: GaugeChartProps) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const color = getSeverityColor(severity);

  return (
    <div
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height,
      }}
    >
      <div style={{ fontSize: 'var(--fs-11)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
        {label}
      </div>

      {/* Tank fill bar visual */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="mono" style={{ fontSize: 'var(--fs-18)', fontWeight: 700, color: 'var(--text-primary)' }}>
            {value.toLocaleString()} <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{unit}</span>
          </span>
          <span className="mono" style={{ fontSize: 'var(--fs-13)', fontWeight: 600, color }}>
            {percent}%
          </span>
        </div>

        <div
          style={{
            height: '10px',
            width: '100%',
            backgroundColor: 'var(--surface-0)',
            borderRadius: '4px',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percent}%`,
              backgroundColor: color,
              borderRadius: '3px',
              transition: 'width var(--motion-base)',
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', width: '100%', textAlign: 'right' }}>
        Cap: {max.toLocaleString()} {unit}
      </div>
    </div>
  );
}
