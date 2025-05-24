export interface TripResponse {
    id: string;
    attributes: {
        headsign?: string;
        name?: string;
        route_id?: string;
        direction_id?: number;
        block_id?: string;
        service_id?: string;
        shape_id?: string;
        wheelchair_accessible?: number;
        bikes_allowed?: number;
    };
}

export interface Trip {
    id: string;
    headsign?: string;
    name?: string;
    route_id?: string;
    direction_id?: number;
    block_id?: string;
    service_id?: string;
    shape_id?: string;
    wheelchair_accessible?: number;
    bikes_allowed?: number;
}
