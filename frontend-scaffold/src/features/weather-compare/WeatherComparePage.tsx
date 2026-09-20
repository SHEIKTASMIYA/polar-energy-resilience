import { useState } from 'react';
import { useScenarioComparison } from './hooks/useScenarioComparison';
import { PageHeader } from '../../components/layout/PageHeader';
import { PRESET_SCENARIOS } from '../../mocks/scenario.mock';
import { TimeSeriesChart } from '../../components/charts/TimeSeriesChart';
import { SeverityBadge } from '../../components/status/SeverityBadge';
import { GitCompare } from 'lucide-react';
import { CHARTS_THEME } from '../../styles/charts-theme';

export function WeatherComparePage() {
  const [slotA, setSlotA] = useState<string>('scen-blizzard-48h');
  const [slotB, setSlotB] = useState<string>('scen-compound-outage');

  const { scenarioA, scenarioB } = useScenarioComparison(slotA, slotB);

  // Combine timelines into a single dataset for comparison overlay chart
  const combinedTimeline = (scenarioA?.timeline || []).map((ptA, idx) => {
    const ptB = scenarioB?.timeline[idx];
    return {
      day: `Day ${ptA.day}`,
      loadA: ptA.loadKw,
      loadB: ptB?.loadKw,
      fuelA: ptA.fuelLitres,
      fuelB: ptB?.fuelLitres,
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Extreme-Weather Scenario Comparison"
        subtitle="Hold two scenario runs side-by-side to understand marginal impact of compounding failure modes"
      />

      {/* Scenario Pickers Slot A vs Slot B */}
      <div className="grid-12">
        <div className="col-span-6 panel">
          <div className="panel-header">
            <span className="panel-title" style={{ color: 'var(--accent-ice)' }}>Scenario Slot A</span>
          </div>
          <select
            value={slotA}
            onChange={(e) => setSlotA(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--surface-2)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
            }}
          >
            {PRESET_SCENARIOS.map((s) => (
              <option key={s.definition.id} value={s.definition.id}>
                {s.definition.name} ({s.definition.durationDays} Days)
              </option>
            ))}
          </select>
          {scenarioA && (
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Outcome:</span>
              <SeverityBadge
                severity={scenarioA.outcome === 'SURVIVES' ? 'NOMINAL' : scenarioA.outcome === 'FUEL_CRITICAL' ? 'CRITICAL' : 'WATCH'}
              />
            </div>
          )}
        </div>

        <div className="col-span-6 panel">
          <div className="panel-header">
            <span className="panel-title" style={{ color: 'var(--source-simulated)' }}>Scenario Slot B</span>
          </div>
          <select
            value={slotB}
            onChange={(e) => setSlotB(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--surface-2)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
            }}
          >
            {PRESET_SCENARIOS.map((s) => (
              <option key={s.definition.id} value={s.definition.id}>
                {s.definition.name} ({s.definition.durationDays} Days)
              </option>
            ))}
          </select>
          {scenarioB && (
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Outcome:</span>
              <SeverityBadge
                severity={scenarioB.outcome === 'SURVIVES' ? 'NOMINAL' : scenarioB.outcome === 'FUEL_CRITICAL' ? 'CRITICAL' : 'WATCH'}
              />
            </div>
          )}
        </div>
      </div>

      {/* Comparison Metrics Delta Table */}
      <div className="panel">
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GitCompare size={16} color="var(--accent-ice)" />
            <span className="panel-title">Marginal Impact & Delta Comparison</span>
          </div>
        </div>

        <table className="tech-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Slot A</th>
              <th>Slot B</th>
              <th>Marginal Delta (B − A)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600 }}>Scenario Outcome</td>
              <td>{scenarioA?.outcome}</td>
              <td>{scenarioB?.outcome}</td>
              <td className="mono" style={{ color: scenarioB?.outcome === 'FUEL_CRITICAL' ? 'var(--severity-critical)' : 'var(--text-secondary)' }}>
                {scenarioA?.outcome === scenarioB?.outcome ? 'No Change' : 'Marginal Degradation'}
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Fuel Critical Day</td>
              <td className="mono">{scenarioA?.fuelCriticalOnDay ? `Day ${scenarioA.fuelCriticalOnDay}` : 'None'}</td>
              <td className="mono">{scenarioB?.fuelCriticalOnDay ? `Day ${scenarioB.fuelCriticalOnDay}` : 'None'}</td>
              <td className="mono">
                {scenarioA?.fuelCriticalOnDay && scenarioB?.fuelCriticalOnDay
                  ? `${scenarioB.fuelCriticalOnDay - scenarioA.fuelCriticalOnDay} days`
                  : 'N/A'}
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Final Fuel Level</td>
              <td className="mono">{scenarioA?.timeline[scenarioA.timeline.length - 1]?.fuelLitres.toLocaleString()} L</td>
              <td className="mono">{scenarioB?.timeline[scenarioB.timeline.length - 1]?.fuelLitres.toLocaleString()} L</td>
              <td className="mono" style={{ color: 'var(--severity-critical)' }}>
                {((scenarioB?.timeline[scenarioB.timeline.length - 1]?.fuelLitres || 0) -
                  (scenarioA?.timeline[scenarioA.timeline.length - 1]?.fuelLitres || 0)).toLocaleString()} L
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Comparison Overlay Time Series Chart */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Electrical Demand Over Time (Slot A vs Slot B)</span>
        </div>
        <TimeSeriesChart
          data={combinedTimeline}
          xKey="day"
          series={[
            { key: 'loadA', name: 'Slot A Load (kW)', color: 'var(--accent-ice)' },
            { key: 'loadB', name: 'Slot B Load (kW)', color: 'var(--source-simulated)' },
          ]}
          height={280}
        />
      </div>
    </div>
  );
}
