# state/

App-level UI state ONLY — station selection, unit system, theme, in-progress form state.
Remote/server data is NEVER put here; that's react-query's job via the hooks in each feature.

Planned:
- stationContextStore.ts  (selected station id, unit system, theme — likely Zustand)
- scenarioDraftStore.ts   (in-progress ScenarioBuilderPanel form state, before a run is submitted)

Not yet implemented.
