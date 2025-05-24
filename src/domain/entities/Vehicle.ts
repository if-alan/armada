export interface VehicleResponse {
  id: string;
  attributes: {
    label: string;
    current_status: string;
    latitude: number;
    longitude: number;
    updated_at: string;
  };
  relationships: {
    route: {
      data: {
        id: string;
      }
    };
    trip: {
      data: {
        id: string;
      }
    };
  }
}

export interface Vehicle {
  id: string;
  label: string;
  current_status: string;
  latitude: number;
  longitude: number;
  updated_at: string;
  route_id: string;
  trip_id: string;
}
