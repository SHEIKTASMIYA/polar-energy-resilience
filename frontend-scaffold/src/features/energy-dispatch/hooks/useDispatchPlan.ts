import { useState, useEffect } from 'react';
import { fetchDispatchPlan } from '../../../services/endpoints';
import type { DispatchPlan, DispatchStrategy } from '../../../types';

export function useDispatchPlan(stationId: string, strategy: DispatchStrategy) {
  const [data, setData] = useState<DispatchPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchDispatchPlan(stationId, strategy)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [stationId, strategy]);

  return { data, isLoading, error };
}
