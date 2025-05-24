import { HttpService } from '../data/datasources/remote/services/HttpService';
import { RouteRepositoryImpl } from '../data/repositories/RouteRepositoryImpl';
import { TripRepositoryImpl } from '../data/repositories/TripRepositoryImpl';
import { VehicleRepositoryImpl } from '../data/repositories/VehicleRepositoryImpl';
import { GetRouteByIdUseCase } from '../domain/usecases/vehicle/GetRouteByIdUseCase';
import { GetRoutesUseCase } from '../domain/usecases/vehicle/GetRoutesUseCase';
import { GetTripByIdUseCase } from '../domain/usecases/vehicle/GetTripByIdUseCase';
import { GetTripsUseCase } from '../domain/usecases/vehicle/GetTripsUseCase';
import { GetVehiclesUseCase } from '../domain/usecases/vehicle/GetVehiclesUseCase';

// Singleton for HttpService
const httpService = new HttpService();

// Repository provider
export const repositoryProvider = {
  vehicleRepository: () => new VehicleRepositoryImpl(httpService),
  routeRepository: () => new RouteRepositoryImpl(httpService),
  tripRepository: () => new TripRepositoryImpl(httpService)
};

// Use case provider
export const vehicleUseCaseProvider = {
  getVehiclesUseCase: () => new GetVehiclesUseCase(repositoryProvider.vehicleRepository())
};

export const routeUseCaseProvider = {
  getRoutesUseCase: () => new GetRoutesUseCase(repositoryProvider.routeRepository()),
  getRouteByIdUseCase: () => new GetRouteByIdUseCase(repositoryProvider.routeRepository())
};

export const tripUseCaseProvider = {
  getTripsUseCase: () => new GetTripsUseCase(repositoryProvider.tripRepository()),
  getTripByIdUseCase: () => new GetTripByIdUseCase(repositoryProvider.tripRepository())
};
