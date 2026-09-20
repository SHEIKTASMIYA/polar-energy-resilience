# utils/

Planned:
- units.ts     — kW/kWh/litre conversions and display formatting (always via these helpers,
                 never inline `.toFixed()` scattered through components)
- dateTime.ts  — station-local vs UTC conversion, polar day/night calculation for a given
                 station + date (needed by Solar & Resource page's "Polar Night" band)
- severity.ts  — pure functions mapping a raw value + station thresholds (config/stations.ts)
                 to a SeverityLevel ('NOMINAL' | 'WATCH' | 'CRITICAL') — the single source of
                 truth for severity logic, used by every StatusMetricCard / SeverityBadge

Not yet implemented.
