# components/feedback/

**PlaceholderPage.tsx** is implemented — it's the temporary stand-in every route renders tonight
(see app/routes.tsx). Swap it out per-route as each real feature page gets built.

Still planned:
- LoadingSkeleton.tsx     — per docs/02 component rule: every data-driven component has an
                            explicit loading state, never a blank render
- EmptyState.tsx          — used consistently for "no resupply confirmed", "insufficient
                            history to evaluate model accuracy", unselected comparison slots, etc.
- ErrorBoundaryPanel.tsx  — panel-level error boundary so one failed data source doesn't blank
                            the whole page

Not yet implemented.
