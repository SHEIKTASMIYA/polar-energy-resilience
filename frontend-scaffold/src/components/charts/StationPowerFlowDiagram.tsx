import { Sun, BatteryCharging, Cpu, Zap } from 'lucide-react';
import type { StationOverview } from '../../types';

interface StationPowerFlowDiagramProps {
  powerFlow: StationOverview['powerFlow'];
}

export function StationPowerFlowDiagram({ powerFlow }: StationPowerFlowDiagramProps) {
  const { solarKw, batteryKw, gensetKw, loadKw, batteryDirection } = powerFlow;

  return (
    <div
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--fs-12)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Station Microgrid Power Flow
        </span>
        <span className="mono" style={{ fontSize: 'var(--fs-11)', color: 'var(--accent-ice)' }}>
          Total Demand: {loadKw.toFixed(1)} kW
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-3)',
          alignItems: 'center',
          padding: 'var(--space-2) 0',
        }}
      >
        {/* Node 1: Solar */}
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--source-solar)60',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Sun size={24} color="var(--source-solar)" />
          <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-secondary)', marginTop: '4px' }}>Solar PV</span>
          <span className="mono" style={{ fontSize: 'var(--fs-15)', fontWeight: 700, color: 'var(--source-solar)' }}>
            {solarKw.toFixed(1)} kW
          </span>
        </div>

        {/* Node 2: Battery */}
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--source-battery)60',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <BatteryCharging size={24} color="var(--source-battery)" />
          <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-secondary)', marginTop: '4px' }}>Battery Bank</span>
          <span className="mono" style={{ fontSize: 'var(--fs-15)', fontWeight: 700, color: 'var(--source-battery)' }}>
            {Math.abs(batteryKw).toFixed(1)} kW
          </span>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            {batteryDirection}
          </span>
        </div>

        {/* Node 3: Gensets */}
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--source-genset)60',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Cpu size={24} color="var(--source-genset)" />
          <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-secondary)', marginTop: '4px' }}>Diesel Gensets</span>
          <span className="mono" style={{ fontSize: 'var(--fs-15)', fontWeight: 700, color: 'var(--source-genset)' }}>
            {gensetKw.toFixed(1)} kW
          </span>
        </div>

        {/* Node 4: Station Load */}
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--accent-ice)60',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Zap size={24} color="var(--accent-ice)" />
          <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-secondary)', marginTop: '4px' }}>Station Load</span>
          <span className="mono" style={{ fontSize: 'var(--fs-15)', fontWeight: 700, color: 'var(--accent-ice)' }}>
            {loadKw.toFixed(1)} kW
          </span>
        </div>
      </div>
    </div>
  );
}
