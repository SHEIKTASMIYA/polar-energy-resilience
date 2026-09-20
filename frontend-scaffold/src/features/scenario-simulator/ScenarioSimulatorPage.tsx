import { useEffect } from 'react';
import { useScenarioDraftStore } from '../../state/scenarioDraftStore';
import { useScenarioRunner } from './hooks/useScenarioRunner';
import { PageHeader } from '../../components/layout/PageHeader';
import { ScenarioBuilderPanel } from './components/ScenarioBuilderPanel';
import { SeverityBadge } from '../../components/status/SeverityBadge';
import { TimeSeriesChart } from '../../components/charts/TimeSeriesChart';
import { LoadingSkeleton } from '../../components/feedback/LoadingSkeleton';
import { CHARTS_THEME } from '../../styles/charts-theme';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { PRESET_SCENARIOS } from '../../mocks/scenario.mock';

export function ScenarioSimulatorPage() {
  const draft = useScenarioDraftStore();
  const { result, isRunning, execute } = useScenarioRunner();

  // Run scenario on initial mount
  useEffect(() => {
    execute({
      id: 'scen-draft',
      name: draft.name,
      createdAt: new Date().toISOString(),
      durationDays: draft.durationDays,
      perturbations: draft.perturbations,
      baselineSource: draft.baselineSource,
    });
  }, []);

  const handleRun = () => {
    execute({
      id: `scen-${Date.now()}`,
      name: draft.name,
      createdAt: new Date().toISOString(),
      durationDays: draft.durationDays,
      perturbations: draft.perturbations,
      baselineSource: draft.baselineSource,
    });
  };

  const getOutcomeBadge = (outcome?: string) => {
    switch (outcome) {
      case 'SURVIVES':
        return (
          <div
            style={{
              background: 'rgba(47, 191, 113, 0.15)',
              border: '1px solid var(--severity-nominal)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <CheckCircle size={24} color="var(--severity-nominal)" />
            <div>
              <div style={{ color: 'var(--severity-nominal)', fontWeight: 700, fontSize: 'var(--fs-15)' }}>
                STATION SURVIVES FULL SCENARIO
              </div>
              <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>
                Station maintains nominal fuel and battery storage margins for the full {draft.durationDays}-day duration.
              </div>
            </div>
          </div>
        );
      case 'FUEL_CRITICAL':
        return (
          <div
            style={{
              background: 'rgba(232, 72, 58, 0.15)',
              border: '1px solid var(--severity-critical)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <AlertTriangle size={24} color="var(--severity-critical)" />
            <div>
              <div style={{ color: 'var(--severity-critical)', fontWeight: 700, fontSize: 'var(--fs-15)' }}>
                FUEL CRITICAL — DEFICIT DETECTED (DAY {result?.fuelCriticalOnDay || 12})
              </div>
              <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>
                Fuel reserve reaches critical threshold on Day {result?.fuelCriticalOnDay}. Emergency load shedding or resupply required.
              </div>
            </div>
          </div>
        );
      case 'LOAD_SHED_REQUIRED':
      default:
        return (
          <div
            style={{
              background: 'rgba(232, 179, 57, 0.15)',
              border: '1px solid var(--severity-watch)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <AlertTriangle size={24} color="var(--severity-watch)" />
            <div>
              <div style={{ color: 'var(--severity-watch)', fontWeight: 700, fontSize: 'var(--fs-15)' }}>
                NON-ESSENTIAL LOAD SHEDDING REQUIRED
              </div>
              <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>
                Generation capacity deficit requires curtailing non-critical research loads to avoid blackout.
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Contingency Scenario Simulator"
        subtitle="Model compound extreme weather events, generator outages, and resupply delays"
      />

      <div className="grid-12">
        {/* Left 4 cols: Scenario Builder */}
        <div className="col-span-4">
          <ScenarioBuilderPanel onRun={handleRun} isRunning={isRunning} />
        </div>

        {/* Right 8 cols: Headline Result & Timeline */}
        <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Outcome Headline Banner */}
          {isRunning ? (
            <LoadingSkeleton height={70} />
          ) : (
            result && getOutcomeBadge(result.outcome)
          )}

          {/* Scenario Timeline Multi-Line Chart */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Simulation Trajectory Timeline (Days 1 – {draft.durationDays})</span>
            </div>
            {isRunning || !result ? (
              <LoadingSkeleton height={280} />
            ) : (
              <TimeSeriesChart
                data={result.timeline.map((point) => ({
                  ...point,
                  dayLabel: `Day ${point.day}`,
                }))}
                xKey="dayLabel"
                series={[
                  {
                    key: 'loadKw',
                    name: 'Electrical Load (kW)',
                    color: CHARTS_THEME.colors.load,
                  },
                  {
                    key: 'batterySoCPercent',
                    name: 'Battery SoC (%)',
                    color: CHARTS_THEME.colors.battery,
                  },
                ]}
                height={280}
              />
            )}
          </div>

          {/* Explicit Assumptions Panel */}
          <div className="panel">
            <div className="panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={15} color="var(--accent-ice)" />
                <span className="panel-title">Model Assumptions & Caveats</span>
              </div>
            </div>

            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>
              {result?.assumptions.map((asm, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>
                  {asm}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
