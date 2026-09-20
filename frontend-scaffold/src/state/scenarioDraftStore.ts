import { create } from 'zustand';
import type { Perturbation, ScenarioDefinition } from '../types';

interface ScenarioDraftState {
  name: string;
  durationDays: number;
  baselineSource: 'current_conditions' | 'historical_worst_case' | 'custom';
  perturbations: Perturbation[];
  setName: (name: string) => void;
  setDurationDays: (days: number) => void;
  setBaselineSource: (source: 'current_conditions' | 'historical_worst_case' | 'custom') => void;
  addPerturbation: (perturbation: Perturbation) => void;
  updatePerturbation: (index: number, perturbation: Partial<Perturbation>) => void;
  removePerturbation: (index: number) => void;
  resetDraft: () => void;
  loadDefinition: (definition: ScenarioDefinition) => void;
}

const DEFAULT_DRAFT = {
  name: 'Custom Contingency Scenario',
  durationDays: 14,
  baselineSource: 'current_conditions' as const,
  perturbations: [
    { type: 'blizzard' as const, magnitude: 40, startDay: 2, durationDays: 3 },
    { type: 'temp_drop' as const, magnitude: -6, startDay: 2, durationDays: 4 },
  ],
};

export const useScenarioDraftStore = create<ScenarioDraftState>((set) => ({
  ...DEFAULT_DRAFT,
  setName: (name) => set({ name }),
  setDurationDays: (durationDays) => set({ durationDays }),
  setBaselineSource: (baselineSource) => set({ baselineSource }),
  addPerturbation: (perturbation) =>
    set((state) => ({ perturbations: [...state.perturbations, perturbation] })),
  updatePerturbation: (index, updated) =>
    set((state) => ({
      perturbations: state.perturbations.map((p, i) => (i === index ? { ...p, ...updated } : p)),
    })),
  removePerturbation: (index) =>
    set((state) => ({
      perturbations: state.perturbations.filter((_, i) => i !== index),
    })),
  resetDraft: () => set(DEFAULT_DRAFT),
  loadDefinition: (def) =>
    set({
      name: def.name,
      durationDays: def.durationDays,
      baselineSource: def.baselineSource,
      perturbations: [...def.perturbations],
    }),
}));
