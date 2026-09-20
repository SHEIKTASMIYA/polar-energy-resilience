import { useNavigate } from 'react-router-dom';
import { useStationOverview } from './hooks/useStationOverview';
import { useStationContextStore } from '../../state/stationContextStore';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatusMetricCard } from '../../components/status/StatusMetricCard';
import { StationPowerFlowDiagram } from '../../components/charts/StationPowerFlowDiagram';
import { TimeSeriesChart } from '../../components/charts/TimeSeriesChart';
import { AlertFeedPanel } from './components/AlertFeedPanel';
import { ResilienceDecisionPanel } from './components/ResilienceDecisionPanel';
import { LoadingSkeleton } from '../../components/feedback/LoadingSkeleton';
import { getBatterySeverity, getFuelSeverity } from '../../utils/severity';
import { CHARTS_THEME } from '../../styles/charts-theme';
import { Activity, Battery, Fuel, Cpu, Thermometer, Wind, Sliders } from 'lucide-react';
import { PRESET_SCENARIOS } from '../../mocks/scenario.mock';
import { SeverityBadge } from '../../components/status/SeverityBadge';

export function OverviewPage() {
  const { selectedStationId } = useStationContextStore();
  const { data, isLoading, error } = useStationOverview(selectedStationId);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Station Live Overview" subtitle="Loading Mawson Station telemetry..." />
        <LoadingSkeleton height={180} count={3} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <PageHeader title="Station Live Overview" subtitle="Unable to load station telemetry" />
        <div className="panel" style={{ color: 'var(--text-secondary)' }}>
          {error?.message || 'Station overview data is currently unavailable.'}
        </div>
      </div>
    );
  }

  const batterySeverity = getBatterySeverity(data.batterySoCPercent);
  const fuelSeverity = getFuelSeverity(data.fuelDaysRemaining);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Station Live Overview"
        subtitle="Mawson Station (67°36'S 62°52'E) — Antarctic Operations & Resilience Dashboard"
        source={data.meta.source}
      />

      {/* Operator Decision Support & Resilience Panel */}
      <ResilienceDecisionPanel stationId={selectedStationId} />

      {/* Tier 1: Status Strip (6 Metric Cards) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        <StatusMetricCard
          label="Current Load"
          value={data.currentLoadKw.toFixed(1)}
          unit="kW"
          deltaText="+4.2 kW vs 1h ago"
          deltaDirection="up"
          severity="NOMINAL"
          icon={<Activity size={16} />}
          onClick={() => navigate('/forecast/demand')}
        />
        <StatusMetricCard
          label="Battery SoC"
          value={`${data.batterySoCPercent}%`}
          unit="State of Charge"
          deltaText="-1.5%/h discharge"
          deltaDirection="down"
          severity={batterySeverity}
          icon={<Battery size={16} />}
          onClick={() => navigate('/dispatch')}
        />
        <StatusMetricCard
          label="Fuel Reserve"
          value={data.fuelDaysRemaining}
          unit="days remaining"
          deltaText="2,420 L/day burn"
          deltaDirection="neutral"
          severity={fuelSeverity}
          icon={<Fuel size={16} />}
          onClick={() => navigate('/fuel')}
        />
        <StatusMetricCard
          label="Gensets Online"
          value={`${data.gensetsOnline} / ${data.gensetsTotal}`}
          unit="units active"
          deltaText="Gensets #1 & #2 online"
          deltaDirection="neutral"
          severity="NOMINAL"
          icon={<Cpu size={16} />}
          onClick={() => navigate('/dispatch')}
        />
        <StatusMetricCard
          label="Outside Temp"
          value={`${data.outsideTempC} °C`}
          unit="ambient"
          deltaText="-2.1 °C 24h drop"
          deltaDirection="down"
          severity="NOMINAL"
          icon={<Thermometer size={16} />}
          onClick={() => navigate('/forecast/solar')}
        />
        <StatusMetricCard
          label="Wind Speed"
          value={`${data.windSpeedKt} kt`}
          unit="katabatic"
          deltaText="+8 kt gusts"
          deltaDirection="up"
          severity={data.windSpeedKt > 35 ? 'WATCH' : 'NOMINAL'}
          icon={<Wind size={16} />}
          onClick={() => navigate('/forecast/solar')}
        />
      </div>

      {/* Tier 2: Power Flow & Alert Feed */}
      <div className="grid-12">
        <div className="col-span-7">
          <StationPowerFlowDiagram powerFlow={data.powerFlow} />
        </div>
        <div className="col-span-5">
          <AlertFeedPanel alerts={data.alerts} />
        </div>
      </div>

      {/* Tier 3: 24h Load Curve Time Series */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">24-Hour Station Electricity Load Curve (Historical AADC & Derived Forecast)</span>
        </div>
        <TimeSeriesChart
          data={data.loadCurve24h}
          series={[{ key: 'loadKw', name: 'Electrical Load (kW)', color: CHARTS_THEME.colors.load }]}
          height={260}
          yAxisUnit="kW"
        />
      </div>

      {/* Quick Links & Recent Scenario Runs */}
      <div className="grid-12">
        <div className="col-span-5 panel">
          <div className="panel-header">
            <span className="panel-title">Operations Quick Links</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <button
              onClick={() => navigate('/scenario')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3)',
                background: 'var(--surface-2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} color="var(--accent-ice)" />
                <span style={{ fontWeight: 600 }}>Run Extreme-Weather Scenario</span>
              </div>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>→</span>
            </button>
            <button
              onClick={() => navigate('/fuel')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3)',
                background: 'var(--surface-2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Fuel size={16} color="var(--source-genset)" />
                <span style={{ fontWeight: 600 }}>View Fuel Drawdown & Resupply</span>
              </div>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>→</span>
            </button>
            <button
              onClick={() => navigate('/compare')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3)',
                background: 'var(--surface-2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="var(--source-simulated)" />
                <span style={{ fontWeight: 600 }}>Compare Scenario Runs</span>
              </div>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>→</span>
            </button>
          </div>
        </div>

        <div className="col-span-7 panel">
          <div className="panel-header">
            <span className="panel-title">Recent Contingency Scenario Simulations</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {PRESET_SCENARIOS.map((scen) => (
              <div
                key={scen.definition.id}
                onClick={() => navigate(`/scenario/${scen.definition.id}`)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3)',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--fs-13)' }}>{scen.definition.name}</div>
                  <div className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    Duration: {scen.definition.durationDays} days • {scen.definition.perturbations.length} perturbations
                  </div>
                </div>
                <SeverityBadge
                  severity={
                    scen.result.outcome === 'SURVIVES'
                      ? 'NOMINAL'
                      : scen.result.outcome === 'FUEL_CRITICAL'
                      ? 'CRITICAL'
                      : 'WATCH'
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
