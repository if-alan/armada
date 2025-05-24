import { HttpService } from '../data/datasources/remote/services/HttpService';
import { RouteRepositoryImpl } from '../data/repositories/RouteRepositoryImpl';
import { VehicleRepositoryImpl } from '../data/repositories/VehicleRepositoryImpl';
import { GetRoutesUseCase } from '../domain/usecases/vehicle/GetRoutesUseCase';
import { GetVehiclesUseCase } from '../domain/usecases/vehicle/GetVehiclesUseCase';

// Singleton for HttpService
const httpService = new HttpService();

// Repository provider
export const repositoryProvider = {
  vehicleRepository: () => new VehicleRepositoryImpl(httpService),
  routeRepository: () => new RouteRepositoryImpl(httpService)
};

// Use case provider
export const vehicleUseCaseProvider = {
  getVehiclesUseCase: () => new GetVehiclesUseCase(repositoryProvider.vehicleRepository())
};

export const routeUseCaseProvider = {
  getRoutesUseCase: () => new GetRoutesUseCase(repositoryProvider.routeRepository())
};
