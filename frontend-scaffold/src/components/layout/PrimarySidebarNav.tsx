import { NavLink } from 'react-router-dom';
import { useStationContextStore } from '../../state/stationContextStore';
import {
  Activity,
  Zap,
  Sun,
  Cpu,
  Fuel,
  Sliders,
  GitCompare,
  Server,
  Radio,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/overview', label: 'Live Overview', icon: Activity },
  { to: '/forecast/demand', label: 'Demand Forecast', icon: Zap },
  { to: '/forecast/solar', label: 'Solar & Resource', icon: Sun },
  { to: '/dispatch', label: 'Energy Dispatch', icon: Cpu },
  { to: '/fuel', label: 'Fuel Intelligence', icon: Fuel },
  { to: '/scenario', label: 'Scenario Simulator', icon: Sliders },
  { to: '/compare', label: 'Extreme-Weather Compare', icon: GitCompare },
  { to: '/assets', label: 'Station & Assets', icon: Server },
  { to: '/settings/data-sources', label: 'Data Sources & Config', icon: Radio },
];

export function PrimarySidebarNav() {
  const { sidebarCollapsed, toggleSidebar } = useStationContextStore();

  return (
    <aside
      style={{
        width: sidebarCollapsed ? '64px' : '230px',
        flexShrink: 0,
        backgroundColor: 'var(--surface-1)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width var(--motion-base)',
        zIndex: 5,
      }}
    >
      <div>
        {/* Brand Header */}
        <div
          style={{
            padding: 'var(--space-4)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} color="var(--accent-ice)" />
            {!sidebarCollapsed && (
              <div
                className="mono"
                style={{
                  fontSize: 'var(--fs-12)',
                  fontWeight: 700,
                  color: 'var(--accent-ice)',
                  letterSpacing: '0.06em',
                  lineHeight: 1.2,
                }}
              >
                POLAR ENERGY
                <br />
                RESILIENCE
              </div>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '4px',
              color: 'var(--text-tertiary)',
              display: sidebarCollapsed ? 'none' : 'block',
            }}
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            padding: 'var(--space-3) var(--space-2)',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={sidebarCollapsed ? item.label : undefined}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--fs-13)',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--surface-2)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-ice)' : '3px solid transparent',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                })}
              >
                <Icon size={16} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Collapse Toggle when collapsed */}
      {sidebarCollapsed && (
        <div style={{ padding: 'var(--space-3)', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={toggleSidebar}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </aside>
  );
}
