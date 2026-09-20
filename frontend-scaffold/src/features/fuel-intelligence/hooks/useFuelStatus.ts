import { useState, useEffect } from 'react';
import { fetchFuelStatus } from '../../../services/endpoints';
import type { FuelStatus } from '../../../types';

export function useFuelStatus(stationId: string) {
  const [data, setData] = useState<FuelStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchFuelStatus(stationId)
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
