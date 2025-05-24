import { Trip } from "../../entities/Trip";
import { TripRepository } from "../../repositories/TripRepository";

export class GetTripByIdUseCase {
    constructor(private tripRepository: TripRepository) { }

    execute(id: string): Promise<Trip | null> {
        return this.tripRepository.getTripById(id);
    }
}
