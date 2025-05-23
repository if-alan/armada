export interface Vehicle {
    id: string;
    attributes: {
        label: string;
        current_status: string;
        latitude: number;
        longitude: number;
        updated_at: string;
    };
}

export interface VehicleResponse {
    data: Vehicle[];
} 
