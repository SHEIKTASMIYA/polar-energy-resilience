/**
 * Feature flags. USE_MOCK_DATA is the single seam that lets the whole app run tonight
 * against fixture data, then flip to real APIs later with zero component changes.
 */
export const featureFlags = {
  USE_MOCK_DATA: false,
} as const;