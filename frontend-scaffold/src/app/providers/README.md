# app/providers/

Planned:
- QueryProvider.tsx — wraps the app with a @tanstack/react-query QueryClientProvider, for once
  real API calls exist (mock data tonight doesn't strictly need it, but hooks should be written
  against useQuery from the start so the swap-over later is trivial)
- ThemeProvider.tsx — reads/writes `data-theme` on <html> (dark default, light/print secondary),
  backed by state/stationContextStore.ts

Not yet implemented — App.tsx renders <RouterProvider> directly for now.
