export interface ItemPricePredictionResponse {
    url: string;
    min: number;
    max: number;
    currency: 'chaos' | 'exalt';
    warning_msg: string;
    error_msg: string;
    pred_confidence_score: number;
}
