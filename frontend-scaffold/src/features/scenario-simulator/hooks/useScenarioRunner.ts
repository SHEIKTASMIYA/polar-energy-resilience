import { useState, useCallback } from 'react';
import { runScenario } from '../../../services/endpoints';
import type { ScenarioDefinition, ScenarioResult } from '../../../types';

export function useScenarioRunner() {
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const execute = useCallback(async (definition: ScenarioDefinition) => {
    setIsRunning(true);
    try {
      const res = await runScenario(definition);
      setResult(res);
    } catch (err) {
      console.error('Scenario execution error:', err);
    } finally {
      setIsRunning(false);
    }
  }, []);

  return { result, isRunning, execute };
}
