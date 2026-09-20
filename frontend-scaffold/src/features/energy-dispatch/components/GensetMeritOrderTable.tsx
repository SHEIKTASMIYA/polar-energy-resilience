import type { GensetStatus } from '../../../types';
import { SeverityBadge } from '../../../components/status/SeverityBadge';

interface GensetMeritOrderTableProps {
  gensets: GensetStatus[];
}

export function GensetMeritOrderTable({ gensets }: GensetMeritOrderTableProps) {
  // Sort merit order by fuel efficiency (L/kWh) ascending
  const sortedGensets = [...gensets].sort((a, b) => a.fuelEfficiencyLPerKwh - b.fuelEfficiencyLPerKwh);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Genset Merit Order & Operational Status</span>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
          Sorted by Fuel Efficiency (Merit Rank)
        </span>
      </div>

      <table className="tech-table">
        <thead>
          <tr>
            <th>Merit Rank</th>
            <th>Genset Unit</th>
            <th>State</th>
            <th>Current Load</th>
            <th>Rated Cap</th>
            <th>Runtime</th>
            <th>Efficiency</th>
          </tr>
        </thead>
        <tbody>
          {sortedGensets.map((gen, idx) => (
            <tr key={gen.id}>
              <td className="mono" style={{ fontWeight: 600, color: 'var(--accent-ice)' }}>
                #{idx + 1}
              </td>
              <td style={{ fontWeight: 500 }}>{gen.name}</td>
              <td>
                <SeverityBadge severity={gen.isOnline ? 'NOMINAL' : 'WATCH'} showText={true} />
              </td>
              <td className="mono">{gen.currentOutputKw.toFixed(1)} kW</td>
              <td className="mono">{gen.ratedKw} kW</td>
              <td className="mono">{gen.runtimeHoursTotal.toLocaleString()} hrs</td>
              <td className="mono" style={{ color: 'var(--source-genset)', fontWeight: 600 }}>
                {gen.fuelEfficiencyLPerKwh} L/kWh
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
