import { Trip } from '@/src/domain/entities/Trip';
import { useCallback, useEffect, useState } from 'react';
import { tripUseCaseProvider } from '../../di/providers';

export const useTrip = (tripId: string) => {
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getTripByIdUseCase = tripUseCaseProvider.getTripByIdUseCase();

    const fetchTrip = useCallback(async () => {
        if (!tripId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getTripByIdUseCase.execute(tripId);
            setTrip(response);
        } catch (err) {
            console.error('Error fetching trip:', err);
            setError('Failed to load trip data.');
        } finally {
            setLoading(false);
        }
    }, [tripId, getTripByIdUseCase]);

    useEffect(() => {
        fetchTrip();
    }, []);

    return {
        trip,
        loading,
        error,
        refetch: fetchTrip
    };
};
