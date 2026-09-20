interface LoadingSkeletonProps {
  height?: number | string;
  width?: number | string;
  count?: number;
}

export function LoadingSkeleton({ height = 120, width = '100%', count = 1 }: LoadingSkeletonProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            height,
            width,
            backgroundColor: 'var(--surface-2)',
            borderRadius: 'var(--radius-md)',
            animation: 'pulse 1.5s ease-in-out infinite',
            border: '1px solid var(--border-subtle)',
          }}
        />
      ))}
    </div>
  );
}
