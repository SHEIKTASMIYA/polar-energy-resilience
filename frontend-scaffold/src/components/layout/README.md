# components/layout/

Planned (docs/02, docs/06, docs/12):
- AppShell.tsx            — sidebar + station context bar + routed page outlet
- PrimarySidebarNav.tsx   — collapsible icon+label nav, routes per docs/02
- StationContextBar.tsx   — station selector, local/UTC clock, season, per-source freshness pills
- PageHeader.tsx          — page title + optional right-aligned controls slot
- Grid.tsx, ResponsiveSplit.tsx, PageSection.tsx — the ONLY place breakpoint/media-query logic
  should live (see docs/12) — feature pages compose these rather than writing their own queries

Not yet implemented.
