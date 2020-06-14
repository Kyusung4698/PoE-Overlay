export interface ItemPricePredictionResult {
    id: ItemPricePredictionResultId;
    url: string;
    currency: string;
    min: number;
    max: number;
    score: number;
}

export interface ItemPricePredictionResultId {
    leagueId: string;
    content: string;
    currency: string;
    min: number;
    max: number;
}

export enum ItemPricePredictionFeedback {
    Low = 'low',
    Fair = 'fair',
    High = 'high',
}
