import { useScenarioDraftStore } from '../../../state/scenarioDraftStore';
import { ScenarioParamSlider } from '../../../components/controls/ScenarioParamSlider';
import { Plus, Trash2, Sliders } from 'lucide-react';
import type { Perturbation } from '../../../types';

interface ScenarioBuilderPanelProps {
  onRun: () => void;
  isRunning: boolean;
}

export function ScenarioBuilderPanel({ onRun, isRunning }: ScenarioBuilderPanelProps) {
  const {
    name,
    durationDays,
    baselineSource,
    perturbations,
    setName,
    setDurationDays,
    setBaselineSource,
    addPerturbation,
    updatePerturbation,
    removePerturbation,
  } = useScenarioDraftStore();

  const handleAddDefaultPerturbation = (type: Perturbation['type']) => {
    switch (type) {
      case 'blizzard':
        addPerturbation({ type: 'blizzard', magnitude: 45, startDay: 2, durationDays: 3 });
        break;
      case 'temp_drop':
        addPerturbation({ type: 'temp_drop', magnitude: -8, startDay: 2, durationDays: 4 });
        break;
      case 'genset_outage':
        addPerturbation({ type: 'genset_outage', magnitude: 1, startDay: 3, durationDays: 5 });
        break;
      case 'solar_loss':
        addPerturbation({ type: 'solar_loss', magnitude: 75, startDay: 2, durationDays: 3 });
        break;
      case 'resupply_delay':
        addPerturbation({ type: 'resupply_delay', magnitude: 14, startDay: 1, durationDays: 14 });
        break;
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={16} color="var(--accent-ice)" />
          <span className="panel-title">Contingency Scenario Builder</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {/* Scenario Title */}
        <div>
          <label style={{ fontSize: 'var(--fs-11)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Scenario Title
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--surface-2)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px',
              marginTop: '4px',
            }}
          />
        </div>

        {/* Duration & Baseline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
          <div>
            <label style={{ fontSize: 'var(--fs-11)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Duration (Days)
            </label>
            <input
              type="number"
              min={7}
              max={60}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="mono"
              style={{
                width: '100%',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                marginTop: '4px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--fs-11)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Baseline Conditions
            </label>
            <select
              value={baselineSource}
              onChange={(e) => setBaselineSource(e.target.value as any)}
              style={{
                width: '100%',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                marginTop: '4px',
              }}
            >
              <option value="current_conditions">Live Station Baseline</option>
              <option value="historical_worst_case">Historical Worst Case</option>
            </select>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-subtle)', margin: '4px 0' }} />

        {/* Perturbations List */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Active Failure Perturbations ({perturbations.length})
          </span>
        </div>

        {perturbations.map((p, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 'var(--fs-12)', fontWeight: 600, color: 'var(--accent-ice)' }}>
                [+] {p.type.toUpperCase().replace('_', ' ')}
              </span>
              <button
                onClick={() => removePerturbation(idx)}
                style={{ background: 'transparent', border: 'none', color: 'var(--severity-critical)', padding: '2px' }}
              >
                <Trash2 size={14} />
              </button>
            </div>

            <ScenarioParamSlider
              label="Magnitude / Severity"
              value={p.magnitude}
              min={1}
              max={100}
              onChange={(val) => updatePerturbation(idx, { magnitude: val })}
              unit={p.type === 'temp_drop' ? '°C drop' : p.type === 'blizzard' ? 'kt wind' : '%'}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <ScenarioParamSlider
                label="Start Day"
                value={p.startDay}
                min={1}
                max={durationDays - 1}
                onChange={(val) => updatePerturbation(idx, { startDay: val })}
              />
              <ScenarioParamSlider
                label="Duration (Days)"
                value={p.durationDays}
                min={1}
                max={durationDays}
                onChange={(val) => updatePerturbation(idx, { durationDays: val })}
              />
            </div>
          </div>
        ))}

        {/* Add Perturbation Dropdown buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
          {(['blizzard', 'temp_drop', 'genset_outage', 'solar_loss', 'resupply_delay'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleAddDefaultPerturbation(type)}
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                background: 'var(--surface-2)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Plus size={12} /> {type.replace('_', ' ')}
            </button>
          ))}
        </div>

        <button
          onClick={onRun}
          disabled={isRunning}
          style={{
            marginTop: '8px',
            padding: 'var(--space-3)',
            backgroundColor: 'var(--accent-ice)',
            color: 'var(--surface-0)',
            fontWeight: 700,
            fontSize: 'var(--fs-13)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          {isRunning ? 'Solving Scenario Physics...' : 'Run Scenario Simulation →'}
        </button>
      </div>
    </div>
  );
}
