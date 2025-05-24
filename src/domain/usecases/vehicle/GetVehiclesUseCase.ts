import { PaginatedVehicles, VehicleRepository } from '../../repositories/VehicleRepository';

const ITEMS_PER_PAGE = 250;

export class GetVehiclesUseCase {
  constructor(private vehicleRepository: VehicleRepository) { }

  execute(pageOffset: number): Promise<PaginatedVehicles> {
    return this.vehicleRepository.getVehicles({
      page_limit: ITEMS_PER_PAGE,
      page_offset: pageOffset
    });
  }
}
