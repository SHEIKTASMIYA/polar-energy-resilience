/**
 * Shared Recharts theme configuration matching the SCADA / operations design system.
 */

export const CHARTS_THEME = {
  fontFamily: "'JetBrains Mono', 'IBM Plex Mono', monospace",
  fontSize: 11,
  tooltip: {
    contentStyle: {
      backgroundColor: 'var(--surface-1)',
      borderColor: 'var(--border-subtle)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-primary)',
      fontSize: '12px',
      fontFamily: "'JetBrains Mono', monospace",
      padding: '8px 12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    },
    itemStyle: {
      color: 'var(--text-primary)',
      padding: '2px 0',
    },
  },
  grid: {
    stroke: 'var(--border-subtle)',
    strokeDasharray: '3 3',
    opacity: 0.5,
  },
  colors: {
    load: '#6fd0e8', // Ice cyan
    solar: '#e8b339', // Amber solar
    battery: '#5ec2c2', // Teal battery
    genset: '#b98a4a', // Bronze diesel
    simulated: '#8f6fd1', // Violet simulation
    actual: '#4a90d9', // Steel blue
    nominal: '#2fbf71',
    watch: '#e8b339',
    critical: '#e8483a',
    temp: '#e8483a',
    wind: '#4a90d9',
  },
};
