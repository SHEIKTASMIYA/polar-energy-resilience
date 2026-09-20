import { DataSourceTag } from '../status/DataSourceTag';
import type { DataSource } from '../../types';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  source?: DataSource;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, source, actions }: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-5)',
        paddingBottom: 'var(--space-3)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <h1
            style={{
              margin: 0,
              fontSize: 'var(--fs-18)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </h1>
          {source && <DataSourceTag source={source} />}
        </div>
        {subtitle && (
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: 'var(--fs-12)',
              color: 'var(--text-secondary)',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>{actions}</div>}
    </div>
  );
}
