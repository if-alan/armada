import { Vehicle } from '../../entities/Vehicle';
import { VehicleRepository } from '../../repositories/VehicleRepository';

export class GetVehiclesUseCase {
  constructor(private vehicleRepository: VehicleRepository) { }

  execute(): Promise<Vehicle[]> {
    return this.vehicleRepository.getVehicles();
  }
}
