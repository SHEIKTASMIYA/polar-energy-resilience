import { useState, useEffect } from 'react';
import { fetchDemandForecast } from '../../../services/endpoints';
import type { DemandForecast } from '../../../types';

export function useDemandForecast(stationId: string, horizon: '24h' | '7d' | '30d') {
  const [data, setData] = useState<DemandForecast | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchDemandForecast(stationId, horizon)
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
  }, [stationId, horizon]);

  return { data, isLoading, error };
}
