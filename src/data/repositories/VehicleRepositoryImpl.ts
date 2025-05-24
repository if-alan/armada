import { VehicleResponse } from '../../domain/entities/Vehicle';
import { PaginatedVehicles, PaginationParams, VehicleRepository } from '../../domain/repositories/VehicleRepository';
import { HttpService } from '../datasources/remote/services/HttpService';
import { VehicleMapper } from '../mappers/VehicleMapper';

export class VehicleRepositoryImpl implements VehicleRepository {
    private mapper: VehicleMapper;

    constructor(private httpService: HttpService) {
        this.mapper = new VehicleMapper();
    }

    async getVehicles(params: PaginationParams): Promise<PaginatedVehicles> {
        try {
            const { page_limit, page_offset, routes, trips } = params;
            let url = `vehicles?page[limit]=${page_limit}&page[offset]=${page_offset}`;

            // Add route filter if provided
            if (routes !== '') {
                url += `&filter[route]=${routes}`;
            };
            if (trips !== '') {
                url += `&filter[trip]=${trips}`;
            };

            const response = await this.httpService.get<{
                data: VehicleResponse[],
                links?: { next?: string }
            }>(url);

            const vehicles = response.data.map(item => this.mapper.mapFromResponse(item));
            const hasMore = !!response.links?.next;

            return {
                data: vehicles,
                hasMore
            };
        } catch (error) {
            console.error('Error fetching paginated vehicles:', error);
            throw error;
        }
    }
}
