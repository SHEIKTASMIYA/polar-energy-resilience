interface ToggleOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface ToggleGroupProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (val: T) => void;
}

export function ToggleGroup<T extends string>({ options, value, onChange }: ToggleGroupProps<T>) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-2)',
        flexWrap: 'wrap',
      }}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            title={opt.description}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--fs-12)',
              fontWeight: 500,
              background: isSelected ? 'rgba(111, 208, 232, 0.12)' : 'var(--surface-2)',
              color: isSelected ? 'var(--accent-ice)' : 'var(--text-secondary)',
              border: `1px solid ${isSelected ? 'var(--accent-ice)' : 'var(--border-subtle)'}`,
              transition: 'all var(--motion-fast)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
