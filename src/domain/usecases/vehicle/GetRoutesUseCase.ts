import { Route } from '../../entities/Route';
import { RouteRepository } from '../../repositories/RouteRepository';

export class GetRoutesUseCase {
  constructor(private reouteRepository: RouteRepository) { }

  execute(): Promise<Route[]> {
    return this.reouteRepository.getRoutes();
  }
}
