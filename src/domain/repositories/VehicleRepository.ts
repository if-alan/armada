import { Vehicle } from '../entities/Vehicle';

export interface PaginationParams {
  page_limit: number;
  page_offset: number;
  routes: string; // Optional route ID filter
}

export interface PaginatedVehicles {
  data: Vehicle[];
  hasMore: boolean;
}

export interface VehicleRepository {
  getVehicles(params: PaginationParams): Promise<PaginatedVehicles>;
}
