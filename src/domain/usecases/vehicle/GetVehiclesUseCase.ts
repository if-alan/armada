import { PaginatedVehicles, PaginationParams, VehicleRepository } from '../../repositories/VehicleRepository';

export class GetVehiclesUseCase {
  constructor(private vehicleRepository: VehicleRepository) { }

  execute(params: PaginationParams): Promise<PaginatedVehicles> {
    return this.vehicleRepository.getVehicles(params);
  }
}
