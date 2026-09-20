# mocks/

Realistic fixture data, shaped EXACTLY like the contracts in `src/types/`. Not yet written.

Planned files (one per contract, per docs/04):
- overview.mock.ts
- demandForecast.mock.ts
- solarResource.mock.ts
- dispatch.mock.ts
- fuel.mock.ts
- scenario.mock.ts

When writing these, use plausible Mawson Station numbers (e.g. ~60-90kW typical winter load,
diesel genset capacity in the 100-300kW range, fuel farm in the hundreds-of-thousands-of-litres
range) so the UI looks and feels real even before live data exists.
