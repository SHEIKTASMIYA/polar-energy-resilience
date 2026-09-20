import { useState, useEffect } from 'react';
import { getStationConfig } from '../../config/stations';
import { useStationContextStore } from '../../state/stationContextStore';
import { formatStationTime, formatUtcTime, getPolarSeason } from '../../utils/dateTime';
import { StationSelector } from '../controls/StationSelector';
import { FreshnessIndicator } from '../status/FreshnessIndicator';
import { Sun, Snowflake, Moon, Clock } from 'lucide-react';

export function StationContextBar() {
  const { selectedStationId } = useStationContextStore();
  const station = getStationConfig(selectedStationId);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isoNow = now.toISOString();
  const localTime = formatStationTime(isoNow, station.utcOffsetHours, true);
  const utcTime = formatUtcTime(isoNow);
  const polar = getPolarSeason(now);

  return (
    <header
      style={{
        height: '42px',
        backgroundColor: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-4)',
        fontSize: 'var(--fs-12)',
        color: 'var(--text-secondary)',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <StationSelector />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--surface-2)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <Clock size={13} color="var(--accent-ice)" />
          <span className="mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {localTime}
          </span>
          <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>({utcTime})</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: 'var(--fs-11)',
          }}
        >
          {polar.icon === 'snowflake' ? (
            <Snowflake size={13} color="var(--accent-ice)" />
          ) : polar.icon === 'sun' ? (
            <Sun size={13} color="var(--source-solar)" />
          ) : (
            <Moon size={13} color="var(--text-secondary)" />
          )}
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{polar.season}</span>
          <span style={{ color: 'var(--text-tertiary)' }}>• {polar.sunStatus}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <FreshnessIndicator retrievedAt={isoNow} sourceName="AADC Telemetry" />
        <span style={{ color: 'var(--border-subtle)' }}>|</span>
        <FreshnessIndicator retrievedAt={isoNow} sourceName="Open-Meteo" />
      </div>
    </header>
  );
}
