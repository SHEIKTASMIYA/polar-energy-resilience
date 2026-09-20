interface PlaceholderPageProps {
  title: string;
  description: string;
  docRef?: string;
}

/**
 * Stand-in for every feature page tonight. Replace each route's element (see app/routes.tsx)
 * with the real feature page component (e.g. <OverviewPage />) as it's built out — the routing,
 * shell, and data contracts around it won't need to change.
 */
export function PlaceholderPage({ title, description, docRef }: PlaceholderPageProps) {
  return (
    <div
      style={{
        border: '1px dashed var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-8)',
        color: 'var(--text-secondary)',
      }}
    >
      <h1 style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-24)', marginTop: 0 }}>{title}</h1>
      <p style={{ fontSize: 'var(--fs-15)' }}>{description}</p>
      <p style={{ fontSize: 'var(--fs-12)' }}>Not yet implemented.</p>
      {docRef && (
        <p className="mono" style={{ fontSize: 'var(--fs-12)', color: 'var(--accent-ice)' }}>
          See {docRef}
        </p>
      )}
    </div>
  );
}
