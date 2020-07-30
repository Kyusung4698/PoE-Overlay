import { TradeHttpResponse } from './trade';

export interface TradeFetchHttpResultPriceExchange {
    amount: number;
    currency: string;
}

export interface TradeFetchHttpResultPriceItem {
    amount: number;
    currency: string;
    stock: number;
}

export interface TradeFetchHttpResultPrice {
    type?: string;
    amount?: number;
    currency?: string;
    exchange?: TradeFetchHttpResultPriceExchange;
    item?: TradeFetchHttpResultPriceItem;
}

export interface TradeFetchHttpResultAccountOnline {
    league: string;
    status?: string;
}

export interface TradeFetchHttpResultAccount {
    name: string;
    online?: TradeFetchHttpResultAccountOnline;
}

export interface TradeFetchHttpResultListing {
    indexed: string;
    price: TradeFetchHttpResultPrice;
    account: TradeFetchHttpResultAccount;
    whisper: string;
}

export interface TradeFetchHttpResultItemExtendedHash {
    [type: string]: [[string]];
}

export interface TradeFetchHttpResultItemExtended {
    text: string;
    hashes: TradeFetchHttpResultItemExtendedHash;
}

export interface TradeFetchHttpResultItem {
    icon: string;
    w: number;
    h: number;
    extended: TradeFetchHttpResultItemExtended;
}

export interface TradeFetchHttpResult {
    id: string;
    item: TradeFetchHttpResultItem;
    listing: TradeFetchHttpResultListing;
}

export type TradeFetchHttpResponse = TradeHttpResponse<TradeFetchHttpResult>;
