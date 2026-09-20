import { STATIONS } from '../../config/stations';
import { useStationContextStore } from '../../state/stationContextStore';

export function StationSelector() {
  const { selectedStationId, setSelectedStationId } = useStationContextStore();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
        Station:
      </span>
      <select
        value={selectedStationId}
        onChange={(e) => setSelectedStationId(e.target.value)}
        className="mono"
        style={{
          background: 'var(--surface-2)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '3px 8px',
          fontSize: 'var(--fs-12)',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {STATIONS.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name} ({station.country})
          </option>
        ))}
      </select>
    </div>
  );
}
