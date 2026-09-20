import { useState } from 'react';
import type { AlertEvent, SeverityLevel } from '../../../types';
import { SeverityBadge } from '../../../components/status/SeverityBadge';
import { formatRelativeTime } from '../../../utils/dateTime';
import { AlertCircle, ShieldAlert, Zap, Fuel, CloudSnow, Cog } from 'lucide-react';

interface AlertFeedPanelProps {
  alerts: AlertEvent[];
}

export function AlertFeedPanel({ alerts }: AlertFeedPanelProps) {
  const [filter, setFilter] = useState<SeverityLevel | 'ALL'>('ALL');

  const filteredAlerts = alerts.filter((a) => (filter === 'ALL' ? true : a.severity === filter));

  const getCategoryIcon = (cat: AlertEvent['category']) => {
    switch (cat) {
      case 'power':
        return <Zap size={14} color="var(--accent-ice)" />;
      case 'fuel':
        return <Fuel size={14} color="var(--source-genset)" />;
      case 'weather':
        return <CloudSnow size={14} color="var(--source-aadc)" />;
      case 'system':
      default:
        return <Cog size={14} color="var(--text-secondary)" />;
    }
  };

  return (
    <div className="panel" style={{ height: '100%', minHeight: '340px' }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={15} color="var(--accent-ice)" />
          <span className="panel-title">Station Alert Feed</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['ALL', 'CRITICAL', 'WATCH', 'NOMINAL'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className="mono"
              style={{
                fontSize: '10px',
                padding: '1px 6px',
                background: filter === lvl ? 'var(--surface-2)' : 'transparent',
                borderColor: filter === lvl ? 'var(--accent-ice)' : 'transparent',
                color: filter === lvl ? 'var(--accent-ice)' : 'var(--text-tertiary)',
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', overflowY: 'auto' }}>
        {filteredAlerts.length === 0 ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-12)', padding: 'var(--space-4)', textAlign: 'center' }}>
            No active alerts matching filter.
          </div>
        ) : (
          filteredAlerts.map((alt) => (
            <div
              key={alt.id}
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-3)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
              }}
            >
              <div style={{ marginTop: '2px' }}>{getCategoryIcon(alt.category)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <SeverityBadge severity={alt.severity} />
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                    {formatRelativeTime(alt.timestamp)}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {alt.message}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
