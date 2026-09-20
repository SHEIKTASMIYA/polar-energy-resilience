/**
 * Common contract primitives shared across every domain type in this app.
 * See docs/04-data-contracts.md for the full rationale.
 */

/** A forecasted/estimated value must always ship with a confidence interval — never a bare number. */
export interface Interval<T> {
  value: T;
  low: T;
  high: T;
}

/** Where a given payload's data actually came from — drives <DataSourceTag /> everywhere. */
export type DataSource =
  | 'AADC'            // Australian Antarctic Division Data Centre (historical consumption/fuel)
  | 'OPEN_METEO'       // Open-Meteo shortwave radiation, ambient temperature, and wind forecast
  | 'NASA_POWER'      // NASA POWER solar radiation
  | 'MERRA2'          // NASA MERRA-2 temperature reanalysis
  | 'LIVE_TELEMETRY'  // real-time station SCADA/telemetry feed
  | 'SIMULATED'       // output of the scenario simulator
  | 'DERIVED';        // computed/estimated by this platform from other sources

/** Three-state severity used consistently for batteries, fuel, weather, and alerts. */
export type SeverityLevel = 'NOMINAL' | 'WATCH' | 'CRITICAL';

/** Attached to every API payload so the UI can always show provenance + freshness. */
export interface SourceMeta {
  source: DataSource;
  retrievedAt: string; // ISO-8601 UTC
  stationId: string;
}

/** Generic paginated/list envelope, reserved for tables that will eventually need paging. */
export interface ListEnvelope<T> {
  items: T[];
  total: number;
  meta: SourceMeta;
}
