import { Outlet } from 'react-router-dom';
import { StationContextBar } from './StationContextBar';
import { PrimarySidebarNav } from './PrimarySidebarNav';

export function AppShell() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <StationContextBar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <PrimarySidebarNav />

        <main
          style={{
            flex: 1,
            padding: 'var(--space-5)',
            backgroundColor: 'var(--surface-0)',
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
