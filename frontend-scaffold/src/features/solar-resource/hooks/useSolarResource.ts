import { useState, useEffect } from 'react';
import { fetchSolarResource } from '../../../services/endpoints';
import type { SolarResourceSeries } from '../../../types';

export function useSolarResource(stationId: string) {
  const [data, setData] = useState<SolarResourceSeries | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchSolarResource(stationId)
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
  }, [stationId]);

  return { data, isLoading, error };
}
