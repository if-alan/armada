import Config from 'react-native-config';
import { Vehicle, VehicleResponse } from '../../domain/entities/Vehicle';
import { VehicleRepository } from '../../domain/repositories/VehicleRepository';
import { HttpService } from '../datasources/remote/services/HttpService';
import { VehicleMapper } from '../mappers/VehicleMapper';

export class VehicleRepositoryImpl implements VehicleRepository {
    private httpService: HttpService;
    private mapper: VehicleMapper;

    constructor() {
        this.httpService = new HttpService(Config.API_URL ?? 'https://api-v3.mbta.com/');
        this.mapper = new VehicleMapper();
    }

    async getVehicles(): Promise<Vehicle[]> {
        try {
            const response = await this.httpService.get<{ data: VehicleResponse[] }>('vehicles');
            return response.data.map(item => this.mapper.mapFromResponse(item));
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            throw error;
        }
    }
}