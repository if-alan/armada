import { Route } from '../../entities/Route';
import { RouteRepository } from '../../repositories/RouteRepository';

export class GetRouteByIdUseCase {
    constructor(private routeRepository: RouteRepository) { }

    execute(id: string): Promise<Route | null> {
        return this.routeRepository.getRouteById(id);
    }
}
