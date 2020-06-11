import { FilterOption, TradeHttpResponse } from './trade';

export interface TradeExchangeHttpQuery {
    have?: string[];
    want?: string[];
    status?: FilterOption;
    minimum?: number;
}

export interface TradeExchangeHttpRequest {
    exchange: TradeExchangeHttpQuery;
}

export interface TradeExchangeHttpResponse extends TradeHttpResponse<string> {
    id: string;
    url: string;
    total: number;
}
