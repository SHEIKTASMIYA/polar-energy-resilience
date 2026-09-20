import { useNavigate } from 'react-router-dom';
import { useFuelStatus } from './hooks/useFuelStatus';
import { useStationContextStore } from '../../state/stationContextStore';
import { PageHeader } from '../../components/layout/PageHeader';
import { GaugeChart } from '../../components/charts/GaugeChart';
import { TimeSeriesChart } from '../../components/charts/TimeSeriesChart';
import { StatusMetricCard } from '../../components/status/StatusMetricCard';
import { SeverityBadge } from '../../components/status/SeverityBadge';
import { LoadingSkeleton } from '../../components/feedback/LoadingSkeleton';
import { Fuel, Calendar, Anchor, Sliders } from 'lucide-react';
import { CHARTS_THEME } from '../../styles/charts-theme';

export function FuelIntelligencePage() {
  const { selectedStationId } = useStationContextStore();
  const { data, isLoading, error } = useFuelStatus(selectedStationId);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Fuel Intelligence & Resupply" subtitle="Loading fuel telemetry..." />
        <LoadingSkeleton height={320} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <PageHeader title="Fuel Intelligence & Resupply" subtitle="Unable to load fuel status" />
        <div className="panel" style={{ color: 'var(--text-secondary)' }}>
          {error?.message || 'Fuel intelligence data is currently unavailable.'}
        </div>
      </div>
    );
  }

  // Format survival drawdown data for TimeSeriesChart
  const drawdownData = data.survivalCurve.map((pt) => ({
    date: pt.date,
    Litres: pt.projectedLitres.value,
    LowBound: pt.projectedLitres.low,
    HighBound: pt.projectedLitres.high,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Fuel Intelligence & Resupply"
        subtitle="Special Antarctic Blend (SAB) fuel stock, daily burn rate, and survival drawdown curve"
        source={data.meta.source}
      />

      {/* Fuel Status Strip (Large Tank Gauges + KPIs) */}
      <div className="grid-12">
        <div className="col-span-8">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
            {data.tanks.map((tank) => (
              <GaugeChart
                key={tank.id}
                label={tank.name}
                value={tank.currentLitres}
                max={tank.capacityLitres}
                severity={tank.currentLitres / tank.capacityLitres < 0.25 ? 'WATCH' : 'NOMINAL'}
              />
            ))}
          </div>
        </div>

        <div className="col-span-4 style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}">
          <StatusMetricCard
            label="Total SAB Fuel Reserve"
            value={data.totalLitres.toLocaleString()}
            unit="Litres"
            severity={data.riskFlag}
            icon={<Fuel size={16} />}
          />
          <StatusMetricCard
            label="Reserve Survival Horizon"
            value={data.daysRemaining.value.toFixed(1)}
            unit="days"
            deltaText={`± ${data.daysRemaining.low.toFixed(0)} - ${data.daysRemaining.high.toFixed(0)} days range`}
            severity={data.daysRemaining.value < 45 ? 'WATCH' : 'NOMINAL'}
            icon={<Calendar size={16} />}
          />
        </div>
      </div>

      {/* Fuel Drawdown Survival Projection Curve */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Fuel Drawdown Survival Projection to Next Resupply</span>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-ice)' }}>
            Burn Rate: {data.dailyBurnRateL.value.toLocaleString()} L/day (± 250 L/day)
          </span>
        </div>

        <TimeSeriesChart
          data={drawdownData}
          series={[{ key: 'Litres', name: 'Projected Fuel Reserve (Litres)', color: CHARTS_THEME.colors.genset }]}
          height={300}
          yAxisUnit="L"
        />
      </div>

      {/* Resupply Planning Panel & Scenario Jump */}
      <div className="grid-12">
        <div className="col-span-7 panel">
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Anchor size={16} color="var(--accent-ice)" />
              <span className="panel-title">Annual Shipping Resupply Status</span>
            </div>
            {data.nextResupply && <SeverityBadge severity={data.riskFlag} />}
          </div>

          {data.nextResupply ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div style={{ background: 'var(--surface-2)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Expected Resupply Vessel</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-ice)', marginTop: '2px' }}>
                    {data.nextResupply.confirmedVessel}
                  </div>
                </div>

                <div style={{ background: 'var(--surface-2)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Expected ETA Window</div>
                  <div className="mono" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {data.nextResupply.expectedDate}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>
                Required safety buffer at resupply arrival: <strong>{data.nextResupply.requiredReserveLitres.toLocaleString()} L</strong> (approx 14 days emergency reserve).
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-tertiary)' }}>No resupply vessel voyage confirmed yet for this operational season.</div>
          )}
        </div>

        <div className="col-span-5 panel" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <Sliders size={28} color="var(--accent-ice)" />
          <h4 style={{ margin: '8px 0 4px 0', fontSize: 'var(--fs-15)' }}>Test Resupply Delay Scenarios</h4>
          <p style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
            Simulate a 14-day or 30-day resupply vessel ice lockup in the Scenario Simulator.
          </p>
          <button onClick={() => navigate('/scenario')} style={{ borderColor: 'var(--accent-ice)', color: 'var(--accent-ice)' }}>
            Open Scenario Builder →
          </button>
        </div>
      </div>
    </div>
  );
}
