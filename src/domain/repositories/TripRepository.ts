import { Trip } from "../entities/Trip";

export interface TripRepository {
  getTrips(trips: string): Promise<Trip[]>;
}
