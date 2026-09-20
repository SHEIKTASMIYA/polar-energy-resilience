# components/charts/

Thin, typed wrappers around a charting library (recharts or visx recommended — both work well
with the CSS-variable-driven design system in docs/05). Every chart takes props typed against
src/types/*, never inline `any` shapes.

Planned:
- TimeSeriesChart.tsx      — generic single/multi-series time series
- BandedForecastChart.tsx  — actual + forecast line + confidence band + annotations (docs/08)
- StackedAreaChart.tsx     — dispatch timeline, scenario timeline (docs/09, docs/07)
- GaugeChart.tsx           — fuel tank levels (docs/10)
- SankeyFlowChart.tsx      — station power flow diagram (docs/06)

Each should support a `ChartAccessibleTableToggle` fallback per the accessibility baseline in docs/05.

Not yet implemented.
