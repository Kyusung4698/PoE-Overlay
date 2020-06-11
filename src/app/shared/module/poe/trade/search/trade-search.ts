import { Language, TradeSearchHttpRequest } from '@data/poe/schema';

export interface TradeSearchResponse {
    id: string;
    url: string;
    language: Language;
    ids: string[];
    total: number;
}

export type TradeSearchRequest = TradeSearchHttpRequest;
