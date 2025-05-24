import { VehicleRepositoryImpl } from '../data/repositories/VehicleRepositoryImpl';
import { GetVehiclesUseCase } from '../domain/usecases/vehicle/GetVehiclesUseCase';
import { HttpService } from '../data/datasources/remote/services/HttpService';

// Singleton for HttpService
const httpService = new HttpService();

// Repository provider
export const repositoryProvider = {
  vehicleRepository: () => new VehicleRepositoryImpl(httpService)
};

// Use case provider
export const vehicleUseCaseProvider = {
  getVehiclesUseCase: () => new GetVehiclesUseCase(repositoryProvider.vehicleRepository())
};