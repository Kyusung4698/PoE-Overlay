export interface ItemOverviewResponse {
    lines: ItemOverviewLine[];
    url: string;
}

export interface ItemOverviewLine {
    name: string;
    baseType: string;
    mapTier: number;
    corrupted: boolean;
    gemLevel: number;
    gemQuality: number;
    links: number;
    itemClass: number;
    chaosValue: number;
    sparkline: SparkLine;
}

export interface SparkLine {
    data: number[];
    totalChange: number;
}
