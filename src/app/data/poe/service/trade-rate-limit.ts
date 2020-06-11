export interface TradeRateLimitRule {
    count: number;
    period: number;
    limited: number;
}

export interface TradeRateLimitRequest {
    finished?: number;
}

export interface TradeRateLimit {
    requests: TradeRateLimitRequest[];
    rules: TradeRateLimitRule[];
    update: number;
}
