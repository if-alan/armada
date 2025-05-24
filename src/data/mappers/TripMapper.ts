import { Trip, TripResponse } from "@/src/domain/entities/Trip";

export class TripMapper {
    mapFromResponse(response: TripResponse): Trip {
        return {
            id: response.id,
            headsign: response.attributes.headsign,
            name: response.attributes.name,
            route_id: response.attributes.route_id,
            direction_id: response.attributes.direction_id,
            block_id: response.attributes.block_id,
            service_id: response.attributes.service_id,
            shape_id: response.attributes.shape_id,
            wheelchair_accessible: response.attributes.wheelchair_accessible,
            bikes_allowed: response.attributes.bikes_allowed,
        };
    }
}
