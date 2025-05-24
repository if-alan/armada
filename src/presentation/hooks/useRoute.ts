import { Route } from '@/src/domain/entities/Route';
import { useCallback, useEffect, useState } from 'react';
import { routeUseCaseProvider } from '../../di/providers';

export const useRoute = (routeId: string) => {
    const [route, setRoute] = useState<Route | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getRouteByIdUseCase = routeUseCaseProvider.getRouteByIdUseCase();

    const fetchRoute = useCallback(async () => {
        if (!routeId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getRouteByIdUseCase.execute(routeId);
            setRoute(response);
        } catch (err) {
            console.error('Error fetching route:', err);
            setError('Failed to load route data.');
        } finally {
            setLoading(false);
        }
    }, [routeId, getRouteByIdUseCase]);

    useEffect(() => {
        fetchRoute();
    }, []);

    return {
        route,
        loading,
        error,
        refetch: fetchRoute
    };
};
