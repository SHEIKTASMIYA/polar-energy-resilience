import type { DataSource } from '../../types';

interface DataSourceTagProps {
  source: DataSource;
  label?: string;
}

export function DataSourceTag({ source, label }: DataSourceTagProps) {
  const getSourceColor = (src: DataSource) => {
    switch (src) {
      case 'AADC':
        return 'var(--source-aadc)';
      case 'OPEN_METEO':
      case 'NASA_POWER':
      case 'MERRA2':
        return 'var(--source-solar)';
      case 'LIVE_TELEMETRY':
        return 'var(--severity-nominal)';
      case 'SIMULATED':
        return 'var(--source-simulated)';
      case 'DERIVED':
      default:
        return 'var(--source-battery)';
    }
  };

  const color = getSourceColor(source);

  return (
    <span
      className="mono"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '1px 6px',
        borderRadius: '2px',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.05em',
        color,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        border: `1px solid ${color}40`,
      }}
    >
      {label || source}
    </span>
  );
}
