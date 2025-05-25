import { Trip } from '@/src/domain/entities/Trip';
import { useCallback, useState } from 'react';
import { tripUseCaseProvider } from '../../di/providers';

export const useTrips = (
  errorFilter: (n: string | null) => void,
  selectedRoutes: string[],
) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]);

  const getTripsUseCase = tripUseCaseProvider.getTripsUseCase();

  const fetchTrips = useCallback(async () => {
    try {
      const response = await getTripsUseCase.execute(selectedRoutes.map(item => item).join(','));

      setTrips(response);
    } catch (err) {
      console.error('Error fetching trips:', err);
      errorFilter('Failed to load trip data. Please try again.');
    }
  }, [selectedRoutes, getTripsUseCase, errorFilter]);

  const handleTripSelect = (tripId: string) => {
    setSelectedTrips(prev => {

      if (prev.includes(tripId)) {
        return prev.filter(id => id !== tripId);
      }

      else {
        return [...prev, tripId];
      }
    });
  };

  const handleClearTripFilters = () => {
    setSelectedTrips([]);
  };

  return {
    trips,
    selectedTrips,
    setSelectedTrips,
    fetchTrips,
    handleTripSelect,
    handleClearTripFilters,
  };
};