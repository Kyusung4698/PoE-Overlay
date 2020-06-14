import { Language, TradeExchangeHttpRequest } from '@data/poe/schema';

export interface TradeExchangeResponse {
    id: string;
    url: string;
    language: Language;
    ids: string[];
    total: number;
}

export type TradeExchangeRequest = TradeExchangeHttpRequest;
