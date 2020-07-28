import { Language } from '@data/poe/schema';
import moment from 'moment';

export interface TradeFetchPriceItem {
    currency: string;
    amount: number;
    stock: number;
}

export interface TradeFetchPriceExchange {
    currency: string;
    amount: number;
}

export interface TradeFetchListingPrice {
    currency?: string;
    amount?: number;
    item?: TradeFetchPriceItem;
    exchange?: TradeFetchPriceExchange;
}

export enum TradeFetchListingStatus {
    Offline = 'offline',
    Online = 'online',
    Afk = 'afk'
}

export interface TradeFetchEntryListing {
    seller: string;
    status: TradeFetchListingStatus;
    indexed: moment.Moment;
    age: string;
    whisper: string;
    price: TradeFetchListingPrice;
}

export interface TradeFetchEntryItem {
    icon: string;
    width: number;
    height: number;
    text: string;
    hashes: string[];
}

export interface TradeFetchResultEntry {
    id: string;
    listing: TradeFetchEntryListing;
    item: TradeFetchEntryItem;
}

export interface TradeFetchResponse {
    url: string;
    entries: TradeFetchResultEntry[];
    total: number;
}

export interface TradeFetchRequest {
    id: string;
    language: Language;
    url: string;
    ids: string[];
    total: number;
}
