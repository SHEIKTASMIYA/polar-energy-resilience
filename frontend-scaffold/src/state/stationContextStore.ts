import { create } from 'zustand';
import { DEFAULT_STATION_ID } from '../config/stations';

interface StationContextState {
  selectedStationId: string;
  unitSystem: 'metric' | 'imperial';
  timeFormat: 'station_local' | 'utc';
  sidebarCollapsed: boolean;
  setSelectedStationId: (id: string) => void;
  setUnitSystem: (units: 'metric' | 'imperial') => void;
  setTimeFormat: (format: 'station_local' | 'utc') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useStationContextStore = create<StationContextState>((set) => ({
  selectedStationId: DEFAULT_STATION_ID,
  unitSystem: 'metric',
  timeFormat: 'station_local',
  sidebarCollapsed: false,
  setSelectedStationId: (id) => set({ selectedStationId: id }),
  setUnitSystem: (units) => set({ unitSystem: units }),
  setTimeFormat: (format) => set({ timeFormat: format }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
