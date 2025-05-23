import { Vehicle } from '../entities/Vehicle';

export interface VehicleRepository {
  getVehicles(): Promise<Vehicle[]>;
}
