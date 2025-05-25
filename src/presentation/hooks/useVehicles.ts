import { AppConfig } from '@/src/core/config/AppConfig';
import { useCallback, useEffect, useState } from 'react';
import { vehicleUseCaseProvider } from '../../di/providers';
import { Vehicle } from '../../domain/entities/Vehicle';

export const useVehicles = (
  fetchTrips: () => void,
  showRouteFilter: boolean,
  setShowRouteFilter: (n: boolean) => void,
  showTripFilter: boolean,
  setShowTripFilter: (n: boolean) => void,
  selectedTrips: string[],
  setSelectedTrips: (n: string[]) => void,
  selectedRoutes: string[],
  setSelectedRoutes: (n: string[]) => void,
  setError: (n: string | null) => void,
) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState<'route' | 'trip' | null>(null);

  const getVehiclesUseCase = vehicleUseCaseProvider.getVehiclesUseCase();

  const handleApplyFilter = () => {
    if (showRouteFilter) {
      setActiveFilterType('route');
      setSelectedTrips([]);
      setShowRouteFilter(false);

      fetchTrips();
    } else if (showTripFilter) {
      setActiveFilterType('trip');
      setShowTripFilter(false);
    }

    fetchVehicles(
      true,
      selectedRoutes.map(item => item).join(','),
      selectedTrips.map(item => item).join(',')
    );
  };

  const fetchVehicles = useCallback(async (
    refresh = false,
    routesFilter = '',
    tripsFilter = ''
  ) => {
    try {
      if (refresh) {
        setPageOffset(0);
        setHasMore(true);
      }

      const currentOffset = refresh ? 0 : pageOffset;

      if (loadingMore || (!hasMore && !refresh)) return;

      if (refresh) {
        setRefreshing(true)
      } else {
        setLoadingMore(true)
      }

      const response = await getVehiclesUseCase.execute({
        page_limit: AppConfig.PAGINATION.DEFAULT_LIMIT,
        page_offset: currentOffset,
        routes: routesFilter,
        trips: tripsFilter,
      });
      console.log('selectedRoutes', selectedRoutes);

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

  const loadMoreVehicles = useCallback(() => {
    if (!hasMore || loadingMore || refreshing) return;
    fetchVehicles(
      false,
      selectedRoutes.map(item => item).join(','),
      selectedTrips.map(item => item).join(','),
    );
  }, [hasMore, loadingMore, refreshing, fetchVehicles]);

  // Initial fetch
  useEffect(() => {
    fetchVehicles(true);
  }, []);

  const handleClearAllFilters = () => {
    setSelectedRoutes([]);
    setSelectedTrips([]);
    setActiveFilterType(null);
    fetchVehicles(true);
  };

  return {
    vehicles,
    fetchVehicles,
    loading,
    refreshing,
    loadingMore,
    loadMoreVehicles,
    handleApplyFilter,
    activeFilterType,
    handleClearAllFilters,
  };
};