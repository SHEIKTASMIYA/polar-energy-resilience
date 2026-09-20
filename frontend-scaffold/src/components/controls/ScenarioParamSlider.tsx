interface ScenarioParamSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  description?: string;
}

export function ScenarioParamSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  description,
}: ScenarioParamSliderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '4px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>{label}</label>
        <div className="mono" style={{ fontSize: 'var(--fs-12)', color: 'var(--accent-ice)', fontWeight: 600 }}>
          {value} {unit}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            flex: 1,
            accentColor: 'var(--accent-ice)',
            cursor: 'pointer',
          }}
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mono"
          style={{
            width: '60px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 4px',
            fontSize: 'var(--fs-11)',
            textAlign: 'right',
          }}
        />
      </div>

      {description && (
        <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{description}</span>
      )}
    </div>
  );
}
