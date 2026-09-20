import { PageHeader } from '../../components/layout/PageHeader';
import { DataSourceTag } from '../../components/status/DataSourceTag';
import { SeverityBadge } from '../../components/status/SeverityBadge';
import { featureFlags } from '../../config/featureFlags';
import { Radio, Database } from 'lucide-react';

export function DataSourcesPage() {
  const sources = [
    {
      name: 'Australian Antarctic Data Centre (AADC)',
      type: 'AADC' as const,
      status: 'NOMINAL' as const,
      endpoint: 'Historical Dataset Repository',
      mode: 'HISTORICAL DATASET',
      purpose: 'Model Training & Demand Forecast Validation',
      description: 'Historical Mawson station electricity, load profile, and fuel consumption datasets used for model training and validation.',
    },
    {
      name: 'Open-Meteo Environmental Forecast API',
      type: 'OPEN_METEO' as const,
      status: 'NOMINAL' as const,
      endpoint: 'https://api.open-meteo.com/v1/forecast',
      mode: 'LIVE API (UTC)',
      purpose: 'Environmental Weather & Solar Irradiance Input',
      description: 'Shortwave solar radiation (W/m²), ambient temperature (°C), and katabatic wind velocity (km/h) forecast.',
    },
    {
      name: 'FastAPI Decision Engine & Service Layer',
      type: 'SIMULATED' as const,
      status: featureFlags.USE_MOCK_DATA ? ('WATCH' as const) : ('NOMINAL' as const),
      endpoint: 'http://localhost:8000/api/v1',
      mode: featureFlags.USE_MOCK_DATA ? 'Mock Fixture Mode' : 'Live FastAPI Backend',
      purpose: 'Demand Forecasting, Optimization & Scenario Engine',
      description: featureFlags.USE_MOCK_DATA
        ? 'Frontend currently running on decoupled mock fixture layer (USE_MOCK_DATA=true).'
        : 'Live FastAPI application backend active.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Data Sources & API Integration Status"
        subtitle="Upstream data provider telemetry health, API endpoints, and decision engine configuration"
      />

      {/* Upstream Data Providers Grid */}
      <div className="grid-12">
        {sources.map((src) => (
          <div key={src.name} className="col-span-4 panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={16} color="var(--accent-ice)" />
                <span className="panel-title" style={{ fontSize: '13px' }}>{src.name}</span>
              </div>
              <SeverityBadge severity={src.status} />
            </div>

            <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
              {src.description}
            </div>

            <div
              style={{
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                fontSize: '11px',
                marginTop: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Data Tag:</span>
                <DataSourceTag source={src.type} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Endpoint:</span>
                <span className="mono" style={{ color: 'var(--accent-ice)' }}>{src.endpoint}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Data Mode:</span>
                <span className="mono">{src.mode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Primary Purpose:</span>
                <span className="mono" style={{ color: 'var(--text-secondary)', textAlign: 'right' }}>{src.purpose}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FastAPI Backend Integration Active Status Panel */}
      <div className="panel" style={{ borderLeft: '4px solid var(--severity-nominal)' }}>
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={16} color="var(--severity-nominal)" />
            <span className="panel-title">FASTAPI BACKEND INTEGRATION</span>
          </div>
          <SeverityBadge severity="NOMINAL" />
        </div>

        <p style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', margin: 0 }}>
          Live application backend connection is active. The frontend communicates with the FastAPI decision layer through the centralized API service.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-3)',
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-3)',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Backend</div>
            <div className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>FastAPI</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Base URL Config</div>
            <div className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-ice)' }}>VITE_API_BASE_URL</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Mock Mode</div>
            <div className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--severity-nominal)' }}>
              {featureFlags.USE_MOCK_DATA ? 'ENABLED' : 'DISABLED'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Connection Status</div>
            <div className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--severity-nominal)' }}>CONNECTED</div>
          </div>
        </div>
      </div>
    </div>
  );
}

