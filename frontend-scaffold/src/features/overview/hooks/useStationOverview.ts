import { useState, useEffect } from 'react';
import { fetchStationOverview } from '../../../services/endpoints';
import type { StationOverview } from '../../../types';

export function useStationOverview(stationId: string) {
  const [data, setData] = useState<StationOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchStationOverview(stationId)
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
