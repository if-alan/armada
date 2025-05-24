import { Route } from '../../entities/Route';
import { RouteRepository } from '../../repositories/RouteRepository';

export class GetRoutesUseCase {
  constructor(private routeRepository: RouteRepository) { }

  execute(): Promise<Route[]> {
    return this.routeRepository.getRoutes();
  }
}
