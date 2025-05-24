import { useState, useEffect, useCallback } from 'react';
import { Vehicle } from '../../domain/entities/Vehicle';
import { vehicleUseCaseProvider } from '../../di/providers';
import { AppConfig } from '@/src/core/config/AppConfig';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageOffset, setPageOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const getVehiclesUseCase = vehicleUseCaseProvider.getVehiclesUseCase();

  const fetchVehicles = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setPageOffset(0);
        setHasMore(true);
      }

      const currentOffset = refresh ? 0 : pageOffset;

      if (loadingMore || (!hasMore && !refresh)) return;

      if(refresh){
        setRefreshing(true)
      } else {
        setLoadingMore(true)
      }

      const response = await getVehiclesUseCase.execute({
        page_limit: AppConfig.PAGINATION.DEFAULT_LIMIT,
        page_offset: currentOffset
      });

      setVehicles(refresh ? response.data : [...vehicles, ...response.data]);
      setHasMore(response.hasMore);
      setPageOffset(currentOffset + response.data.length);
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [pageOffset, vehicles, hasMore, loadingMore, getVehiclesUseCase]);

  const onRefresh = useCallback(() => {
    fetchVehicles(true);
  }, [fetchVehicles]);

  const loadMoreVehicles = useCallback(() => {
    if (!hasMore || loadingMore || refreshing) return;
    fetchVehicles();
  }, [hasMore, loadingMore, refreshing, fetchVehicles]);

  useEffect(() => {
    fetchVehicles(true);
  }, []);

  return {
    vehicles,
    loading,
    refreshing,
    error,
    loadingMore,
    hasMore,
    onRefresh,
    loadMoreVehicles
  };
};