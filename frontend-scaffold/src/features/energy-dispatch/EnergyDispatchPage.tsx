import { useState } from 'react';
import { useDispatchPlan } from './hooks/useDispatchPlan';
import { useStationContextStore } from '../../state/stationContextStore';
import { PageHeader } from '../../components/layout/PageHeader';
import { ToggleGroup } from '../../components/controls/ToggleGroup';
import { StackedAreaChart } from '../../components/charts/StackedAreaChart';
import { GensetMeritOrderTable } from './components/GensetMeritOrderTable';
import { LoadingSkeleton } from '../../components/feedback/LoadingSkeleton';
import type { DispatchStrategy } from '../../types';
import { Battery, Cpu } from 'lucide-react';

export function EnergyDispatchPage() {
  const { selectedStationId } = useStationContextStore();
  const [strategy, setStrategy] = useState<DispatchStrategy>('cost_min');
  const { data, isLoading, error } = useDispatchPlan(selectedStationId, strategy);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Energy Dispatch & Merit Order" subtitle="Loading dispatch optimization model..." />
        <LoadingSkeleton height={320} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <PageHeader title="Energy Dispatch & Merit Order" subtitle="Unable to load dispatch plan" />
        <div className="panel" style={{ color: 'var(--text-secondary)' }}>
          {error?.message || 'Energy dispatch plan data is currently unavailable.'}
        </div>
      </div>
    );
  }

  const { battery } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Energy Dispatch & Merit Order"
        subtitle="Battery + Diesel Genset dispatch optimization timeline and merit order sequence"
        source={data.meta?.source}
        actions={
          <ToggleGroup
            options={[
              {
                value: 'cost_min',
                label: 'Cost-Min Strategy',
                description: 'Balanced economic dispatch minimizing maintenance and fuel cost',
              },
              {
                value: 'fuel_min',
                label: 'Fuel-Min Strategy',
                description: 'Maximize diesel conservation and battery storage utilization',
              },
              {
                value: 'reliability_max',
                label: 'Reliability-Max',
                description: 'Maintain generous spin reserve and keep generators in sweet-spot band',
              },
            ]}
            value={strategy}
            onChange={(val) => setStrategy(val)}
          />
        }
      />

      {/* Stacked Dispatch Timeline */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">
            Generation Stack Timeline ({strategy.toUpperCase().replace('_', ' ')})
          </span>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-ice)' }}>
            Solar + Battery + Gensets vs. Station Load
          </span>
        </div>
        <StackedAreaChart data={data.timeline} height={320} />
      </div>

      {/* Battery SoC & Genset Merit Table */}
      <div className="grid-12">
        <div className="col-span-5 panel">
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Battery size={16} color="var(--source-battery)" />
              <span className="panel-title">Battery Storage Bank Diagnostics</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>Current State of Charge</span>
              <span className="mono" style={{ fontSize: 'var(--fs-24)', fontWeight: 700, color: 'var(--source-battery)' }}>
                {battery.soCPercent}%
              </span>
            </div>

            <div
              style={{
                height: '10px',
                width: '100%',
                backgroundColor: 'var(--surface-2)',
                borderRadius: '5px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${battery.soCPercent}%`,
                  backgroundColor: 'var(--source-battery)',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginTop: '4px' }}>
              <div style={{ background: 'var(--surface-2)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Total Capacity</div>
                <div className="mono" style={{ fontSize: '13px', fontWeight: 600 }}>{battery.capacityKwh} kWh</div>
              </div>
              <div style={{ background: 'var(--surface-2)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Usable Energy</div>
                <div className="mono" style={{ fontSize: '13px', fontWeight: 600 }}>{battery.usableKwh} kWh</div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              LiFePO4 battery cycle count: {battery.cycleCount.toLocaleString()} cycles
            </div>
          </div>
        </div>

        <div className="col-span-7">
          <GensetMeritOrderTable gensets={data.gensets} />
        </div>
      </div>
    </div>
  );
}
