import { Route, RouteResponse } from '../../domain/entities/Route';

export class RouteMapper {
    mapFromResponse(response: RouteResponse): Route {
        return {
            id: response.id,
            long_name: response.attributes.long_name,
            short_name: response.attributes.short_name,
            description: response.attributes.description,
            color: response.attributes.color,
            text_color: response.attributes.text_color,
            type: response.attributes.type
        };
    }
}