import { useState, useEffect } from 'react';
import { PRESET_SCENARIOS } from '../../../mocks/scenario.mock';
import { runScenario } from '../../../services/endpoints';
import type { ScenarioResult } from '../../../types';

export function useScenarioComparison(scenarioIdA: string, scenarioIdB: string) {
  const [scenarioA, setScenarioA] = useState<ScenarioResult | null>(null);
  const [scenarioB, setScenarioB] = useState<ScenarioResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const defA = PRESET_SCENARIOS.find((s) => s.definition.id === scenarioIdA)?.definition || PRESET_SCENARIOS[0].definition;
    const defB = PRESET_SCENARIOS.find((s) => s.definition.id === scenarioIdB)?.definition || PRESET_SCENARIOS[1].definition;

    Promise.all([runScenario(defA), runScenario(defB)])
      .then(([resA, resB]) => {
        if (isMounted) {
          setScenarioA(resA);
          setScenarioB(resB);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          // Fallback to static preset results if network error
          setScenarioA(PRESET_SCENARIOS.find((s) => s.definition.id === scenarioIdA)?.result || PRESET_SCENARIOS[0].result);
          setScenarioB(PRESET_SCENARIOS.find((s) => s.definition.id === scenarioIdB)?.result || PRESET_SCENARIOS[1].result);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [scenarioIdA, scenarioIdB]);

  return { scenarioA, scenarioB, isLoading };
}
