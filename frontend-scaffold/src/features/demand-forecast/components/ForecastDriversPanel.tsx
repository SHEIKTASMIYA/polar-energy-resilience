import type { DemandForecast } from '../../../types';

interface ForecastDriversPanelProps {
  drivers: DemandForecast['drivers'];
}

export function ForecastDriversPanel({ drivers }: ForecastDriversPanelProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Model Feature Driver Importance</span>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
          SHAP / Feature Attribution
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {drivers.map((drv) => {
          const percent = Math.round(drv.importance * 100);
          return (
            <div key={drv.feature} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-12)' }}>
                <span style={{ color: 'var(--text-primary)' }}>{drv.feature}</span>
                <span className="mono" style={{ color: 'var(--accent-ice)', fontWeight: 600 }}>
                  {percent}%
                </span>
              </div>
              <div
                style={{
                  height: '6px',
                  width: '100%',
                  backgroundColor: 'var(--surface-2)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${percent}%`,
                    backgroundColor: 'var(--accent-ice)',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
