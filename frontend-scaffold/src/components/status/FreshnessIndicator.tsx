import { formatRelativeTime } from '../../utils/dateTime';

interface FreshnessIndicatorProps {
  retrievedAt: string;
  sourceName?: string;
}

export function FreshnessIndicator({ retrievedAt, sourceName }: FreshnessIndicatorProps) {
  const relativeText = formatRelativeTime(retrievedAt);

  return (
    <span
      className="mono"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '10px',
        color: 'var(--text-tertiary)',
      }}
      title={`Data retrieved at ${new Date(retrievedAt).toLocaleString()}`}
    >
      <span
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: 'var(--severity-nominal)',
        }}
      />
      {sourceName ? `${sourceName}: ${relativeText}` : relativeText}
    </span>
  );
}
