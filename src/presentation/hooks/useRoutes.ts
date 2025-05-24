import { Route } from '@/src/domain/entities/Route';
import { useCallback, useEffect, useState } from 'react';
import { routeUseCaseProvider } from '../../di/providers';

export const useRoutes = (setError: (n: string | null) => void) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);

  const getRouteUseCase = routeUseCaseProvider.getRoutesUseCase();

  const fetchRoutes = useCallback(async () => {
    try {
      const response = await getRouteUseCase.execute();

      setRoutes(response);
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError('Failed to load data. Please try again.');
    }
  }, [getRouteUseCase, setError]);

  const handleRouteSelect = (routeId: string) => {
    setSelectedRoutes(prev => {

      if (prev.includes(routeId)) {
        return prev.filter(id => id !== routeId);
      }

      else {
        return [...prev, routeId];
      }
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleClearRouteFilters = () => {
    setSelectedRoutes([]);
  };

  return {
    routes,
    selectedRoutes,
    setSelectedRoutes,
    handleRouteSelect,
    handleClearRouteFilters,
  };
};