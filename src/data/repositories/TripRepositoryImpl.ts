import { Trip, TripResponse } from '@/src/domain/entities/Trip';
import { TripRepository } from '@/src/domain/repositories/TripRepository';
import { HttpService } from '../datasources/remote/services/HttpService';
import { TripMapper } from '../mappers/TripMapper';

export class TripRepositoryImpl implements TripRepository {
    private mapper: TripMapper;

    constructor(private httpService: HttpService) {
        this.mapper = new TripMapper();
    }

    async getTrips(routes: string): Promise<Trip[]> {
        try {
            let url = `trips`;

            // Add route filter if provided
            if (routes !== '') {
                url += `?filter[route]=${routes}`;
            };

            const response = await this.httpService.get<{ data: TripResponse[] }>(url);

            return response.data.map(item => this.mapper.mapFromResponse(item));
        } catch (error) {
            console.error('Error fetching trips:', error);
            throw error;
        }
    }

    async getTripById(id: string): Promise<Trip | null> {
        try {
            const url = `trips/${id}`;

            const response = await this.httpService.get<{ data: TripResponse }>(url);

            if (!response.data) {
                return null;
            }

            return this.mapper.mapFromResponse(response.data);
        } catch (error) {
            console.error(`Error fetching trip with id ${id}:`, error);
            return null;
        }
    }
}
