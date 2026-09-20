import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CHARTS_THEME } from '../../styles/charts-theme';
import { formatStationTime } from '../../utils/dateTime';

export interface DispatchPoint {
  timestamp: string;
  solarKw: number;
  batteryKw: number;
  gensetKw: number;
  loadKw: number;
}

interface StackedAreaChartProps {
  data: DispatchPoint[];
  height?: number;
}

export function StackedAreaChart({ data, height = 300 }: StackedAreaChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid {...CHARTS_THEME.grid} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(ts) => formatStationTime(ts, 5)}
            stroke="var(--text-tertiary)"
            fontSize={10}
            fontFamily={CHARTS_THEME.fontFamily}
          />
          <YAxis
            stroke="var(--text-tertiary)"
            fontSize={10}
            fontFamily={CHARTS_THEME.fontFamily}
            unit=" kW"
          />
          <Tooltip
            contentStyle={CHARTS_THEME.tooltip.contentStyle}
            itemStyle={CHARTS_THEME.tooltip.itemStyle}
            formatter={(val: any, name: string) => [`${Number(val).toFixed(1)} kW`, name]}
            labelFormatter={(ts) => `Time: ${formatStationTime(String(ts), 5, true)}`}
          />
          <Legend
            wrapperStyle={{ fontSize: '11px', fontFamily: CHARTS_THEME.fontFamily, color: 'var(--text-secondary)' }}
          />

          {/* Stack order bottom to top: Solar -> Battery -> Genset */}
          <Area
            type="monotone"
            dataKey="solarKw"
            name="Solar PV"
            stackId="1"
            stroke="var(--source-solar)"
            fill="var(--source-solar)"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="batteryKw"
            name="Battery Storage"
            stackId="1"
            stroke="var(--source-battery)"
            fill="var(--source-battery)"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="gensetKw"
            name="Diesel Generators"
            stackId="1"
            stroke="var(--source-genset)"
            fill="var(--source-genset)"
            fillOpacity={0.6}
          />

          {/* Station total demand line outline */}
          <Line
            type="monotone"
            dataKey="loadKw"
            name="Station Demand"
            stroke="var(--text-primary)"
            strokeWidth={2.5}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
