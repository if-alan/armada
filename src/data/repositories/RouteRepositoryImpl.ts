import { Route, RouteResponse } from '@/src/domain/entities/Route';
import { RouteRepository } from '@/src/domain/repositories/RouteRepository';
import { HttpService } from '../datasources/remote/services/HttpService';
import { RouteMapper } from '../mappers/RouteMapper';

export class RouteRepositoryImpl implements RouteRepository {
    private mapper: RouteMapper;

    constructor(private httpService: HttpService) {
        this.mapper = new RouteMapper();
    }

    async getRoutes(): Promise<Route[]> {
        try {
            const url = `routes`;

            const response = await this.httpService.get<{ data: RouteResponse[] }>(url);

            return response.data.map(item => this.mapper.mapFromResponse(item));
        } catch (error) {
            console.error('Error fetching routes:', error);
            throw error;
        }
    }

    async getRouteById(id: string): Promise<Route | null> {
        try {
            const url = `routes/${id}`;

            const response = await this.httpService.get<{ data: RouteResponse }>(url);

            if (!response.data) {
                return null;
            }

            return this.mapper.mapFromResponse(response.data);
        } catch (error) {
            console.error(`Error fetching route with id ${id}:`, error);
            return null;
        }
    }
}
