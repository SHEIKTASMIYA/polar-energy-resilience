import {
  ResponsiveContainer,
  ComposedChart,
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

export interface BandedPoint {
  timestamp: string;
  actualKw?: number;
  forecastKw?: {
    value: number;
    low: number;
    high: number;
  };
}

interface BandedForecastChartProps {
  points: BandedPoint[];
  height?: number;
  unit?: string;
  seriesName?: string;
}

export function BandedForecastChart({
  points,
  height = 300,
  unit = 'kW',
  seriesName = 'Demand Forecast',
}: BandedForecastChartProps) {
  // Transform data for Recharts: forecast band low, high, and range offset
  const formattedData = points.map((pt) => {
    const fc = pt.forecastKw;
    return {
      timestamp: pt.timestamp,
      Actual: pt.actualKw,
      Forecast: fc?.value,
      // For area band between low and high
      BandBase: fc?.low,
      BandSpread: fc ? fc.high - fc.low : undefined,
      LowBound: fc?.low,
      HighBound: fc?.high,
    };
  });

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={formattedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
            unit={` ${unit}`}
          />
          <Tooltip
            contentStyle={CHARTS_THEME.tooltip.contentStyle}
            formatter={(value: any, name: string) => {
              if (name === 'BandSpread' || name === 'BandBase') return [null, null];
              return [`${Number(value).toFixed(1)} ${unit}`, name];
            }}
            labelFormatter={(ts) => `Time: ${formatStationTime(String(ts), 5, true)}`}
          />
          <Legend
            wrapperStyle={{ fontSize: '11px', fontFamily: CHARTS_THEME.fontFamily, color: 'var(--text-secondary)' }}
          />

          {/* Translucent Confidence Band (Stacking Base + Spread) */}
          <Area
            type="monotone"
            dataKey="BandBase"
            stackId="confidence"
            stroke="none"
            fill="transparent"
            legendType="none"
          />
          <Area
            type="monotone"
            dataKey="BandSpread"
            stackId="confidence"
            name="Confidence Interval (95%)"
            stroke="none"
            fill="rgba(111, 208, 232, 0.18)"
          />

          {/* Actual Series Line */}
          <Line
            type="monotone"
            dataKey="Actual"
            name="Actual Load"
            stroke="var(--source-aadc)"
            strokeWidth={2.5}
            dot={false}
          />

          {/* Forecast Series Line */}
          <Line
            type="monotone"
            dataKey="Forecast"
            name={seriesName}
            stroke="var(--accent-ice)"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
