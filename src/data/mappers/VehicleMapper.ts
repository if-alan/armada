import { Vehicle, VehicleResponse } from '../../domain/entities/Vehicle';

export class VehicleMapper {
    mapFromResponse(response: VehicleResponse): Vehicle {
        return {
            id: response.id,
            label: response.attributes.label,
            current_status: response.attributes.current_status,
            latitude: response.attributes.latitude,
            longitude: response.attributes.longitude,
            updated_at: response.attributes.updated_at,
            route_id: response.relationships.route.data.id,
            trip_id: response.relationships.trip.data.id,
        };
    }
}