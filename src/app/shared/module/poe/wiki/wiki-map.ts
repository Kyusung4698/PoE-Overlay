export interface WikiMap {
    url?: string;
    layoutRating?: string;
    bossRating?: string;
    bosses?: string[];
    bossCount?: number;
    items?: string[];
    encounter?: string;
    layout?: string;
}

export interface WikiMapsMap {
    [mapId: string]: WikiMap;
}
