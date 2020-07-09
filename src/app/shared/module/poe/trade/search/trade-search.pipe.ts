import { Pipe, PipeTransform } from '@angular/core';
import { RARITIES, TradeSearchRequest, TYPES as CATEGORIES } from './trade-search';

@Pipe({
    name: 'tradeSearchText'
})
export class TradeSearchTextPipe implements PipeTransform {
    public transform(request: TradeSearchRequest): string {
        const parts = [];
        const { query } = request;
        if (query) {
            if (query.name?.length || query.type?.length) {
                const text = [];
                if (query.name?.length) {
                    text.push(query.name);
                }
                if (query.type?.length) {
                    text.push(query.type);
                }
                parts.push(text.join(' '));
            } else {
                parts.push('Any');
            }

            const { filters } = query;
            if (filters) {
                parts.push(' (');

                const { type_filters } = filters;
                parts.push('Type: ');
                if (type_filters?.filters?.category || type_filters?.filters?.rarity) {
                    const type = [];
                    if (type_filters.filters.category?.option?.length) {
                        type.push(CATEGORIES[type_filters.filters.category.option]);
                    }
                    if (type_filters.filters.rarity?.option?.length) {
                        type.push(RARITIES[type_filters.filters.rarity.option]);
                    }
                    parts.push(type.join(' with '));
                } else {
                    parts.push('Any');
                }

                const { socket_filters } = filters;
                parts.push(', Sockets: ');
                if (socket_filters?.filters?.sockets) {
                    const { sockets } = socket_filters.filters;
                    const socket = [];
                    if (sockets.r) {
                        socket.push(`R${sockets.r}`);
                    }
                    if (sockets.g) {
                        socket.push(`G${sockets.g}`);
                    }
                    if (sockets.b) {
                        socket.push(`B${sockets.b}`);
                    }
                    if (sockets.w) {
                        socket.push(`W${sockets.w}`);
                    }
                    if (sockets.min) {
                        socket.push(`Min${sockets.min}`);
                    }
                    if (sockets.max) {
                        socket.push(`Max${sockets.max}`);
                    }
                    parts.push(socket.join(' '));
                } else {
                    parts.push('Any');
                }

                parts.push(', Links: ');
                if (socket_filters?.filters?.links) {
                    const { links } = socket_filters.filters;
                    const link = [];
                    if (links.r) {
                        link.push(`R${links.r}`);
                    }
                    if (links.g) {
                        link.push(`G${links.g}`);
                    }
                    if (links.b) {
                        link.push(`B${links.b}`);
                    }
                    if (links.w) {
                        link.push(`W${links.w}`);
                    }
                    if (links.min) {
                        link.push(`Min${links.min}`);
                    }
                    if (links.max) {
                        link.push(`Max${links.max}`);
                    }
                    parts.push(link.join('-'));
                } else {
                    parts.push('Any');
                }
                parts.push(')');
            }
        }
        return parts.join('');
    }
}
