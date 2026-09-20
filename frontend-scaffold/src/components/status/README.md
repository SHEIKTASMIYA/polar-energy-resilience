# components/status/

Planned:
- StatusMetricCard.tsx    — label, monospace value, unit, trend arrow, severity dot
- SeverityBadge.tsx       — filled dot + uppercase text label (NOMINAL/WATCH/CRITICAL) — color
                            is never the only signal, per docs/05 accessibility baseline
- DataSourceTag.tsx       — small-caps provenance tag (AADC / NASA POWER / MERRA-2 / SIMULATED...)
- FreshnessIndicator.tsx  — "updated Xm ago" style indicator, driven by SourceMeta.retrievedAt
- TrendArrow.tsx          — up/down/flat delta indicator vs. previous period

Not yet implemented.
