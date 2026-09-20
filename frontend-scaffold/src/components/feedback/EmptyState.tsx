interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, actionText, onAction, icon }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
        textAlign: 'center',
        background: 'var(--surface-1)',
        border: '1px dashed var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        minHeight: '200px',
      }}
    >
      {icon && <div style={{ fontSize: '28px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>{icon}</div>}
      <h4 style={{ margin: '0 0 6px 0', fontSize: 'var(--fs-15)', color: 'var(--text-primary)' }}>{title}</h4>
      {description && (
        <p style={{ margin: '0 0 16px 0', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', maxWidth: '400px' }}>
          {description}
        </p>
      )}
      {actionText && onAction && (
        <button onClick={onAction} style={{ background: 'var(--surface-2)', borderColor: 'var(--accent-ice)' }}>
          {actionText}
        </button>
      )}
    </div>
  );
}
