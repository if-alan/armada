export interface RouteResponse {
    id: string;
    attributes: {
        long_name: string;
        short_name?: string;
        description?: string;
        color: string;
        text_color: string;
        type: number;
    };
}

export interface Route {
    id: string;
    long_name: string;
    short_name?: string;
    description?: string;
    color: string;
    text_color: string;
    type: number;
}
