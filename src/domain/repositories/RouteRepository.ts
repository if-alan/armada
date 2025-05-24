import { Route } from '../entities/Route';

export interface RouteRepository {
  getRoutes(): Promise<Route[]>;
}
