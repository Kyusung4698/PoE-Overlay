export interface ItemPriceRate {
    name: string;
    type: string;
    mapTier: number;
    corrupted: boolean;
    gemLevel: number;
    gemQuality: number;
    links: number;
    relic: boolean;
    chaosAmount: number;
    change: number;
    history: number[];
    url: string;
}

export interface ItemPriceRates {
    rates: ItemPriceRate[];
}
