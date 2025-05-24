import { Trip } from "../../entities/Trip";
import { TripRepository } from "../../repositories/TripRepository";

export class GetTripsUseCase {
  constructor(private tripRepository: TripRepository) { }

  execute(routes: string): Promise<Trip[]> {
    return this.tripRepository.getTrips(routes);
  }
}
