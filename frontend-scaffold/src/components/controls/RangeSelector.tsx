interface RangeSelectorOption<T extends string> {
  value: T;
  label: string;
}

interface RangeSelectorProps<T extends string> {
  options: RangeSelectorOption<T>[];
  selected: T;
  onChange: (value: T) => void;
}

export function RangeSelector<T extends string>({
  options,
  selected,
  onChange,
}: RangeSelectorProps<T>) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--surface-2)',
        padding: '2px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {options.map((opt) => {
        const isSelected = opt.value === selected;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="mono"
            style={{
              padding: '3px 10px',
              border: 'none',
              fontSize: 'var(--fs-11)',
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isSelected ? 'var(--surface-1)' : 'transparent',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all var(--motion-fast)',
              boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
