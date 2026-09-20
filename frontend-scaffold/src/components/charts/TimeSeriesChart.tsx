import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CHARTS_THEME } from '../../styles/charts-theme';
import { formatStationTime } from '../../utils/dateTime';

export interface SeriesConfig {
  key: string;
  name: string;
  color: string;
  strokeDasharray?: string;
}

interface TimeSeriesChartProps {
  data: any[];
  series: SeriesConfig[];
  height?: number;
  yAxisUnit?: string;
  xKey?: string;
  xFormatter?: (val: any) => string;
}

export function TimeSeriesChart({
  data,
  series,
  height = 260,
  yAxisUnit = 'kW',
  xKey = 'timestamp',
  xFormatter,
}: TimeSeriesChartProps) {
  const defaultFormatter = (val: any) => {
    if (xKey === 'timestamp') {
      return formatStationTime(String(val), 5);
    }
    return String(val);
  };

  const formatter = xFormatter || defaultFormatter;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid {...CHARTS_THEME.grid} />
          <XAxis
            dataKey={xKey}
            tickFormatter={formatter}
            stroke="var(--text-tertiary)"
            fontSize={10}
            fontFamily={CHARTS_THEME.fontFamily}
          />
          <YAxis
            stroke="var(--text-tertiary)"
            fontSize={10}
            fontFamily={CHARTS_THEME.fontFamily}
            unit={` ${yAxisUnit}`}
          />
          <Tooltip
            contentStyle={CHARTS_THEME.tooltip.contentStyle}
            itemStyle={CHARTS_THEME.tooltip.itemStyle}
            labelFormatter={(label) => `Time/Period: ${formatter(label)}`}
          />
          <Legend
            wrapperStyle={{ fontSize: '11px', fontFamily: CHARTS_THEME.fontFamily, color: 'var(--text-secondary)' }}
          />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray={s.strokeDasharray}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
