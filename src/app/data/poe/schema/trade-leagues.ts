import { TradeHttpResponse } from './trade';

export enum TradeLeaguesHttpLeague {
    Standard = 'Standard',
    HardCore = 'Hardcore',
}

export interface TradeLeaguesHttpResult {
    id: string;
    text: string;
}

export type TradeLeaguesHttpResponse = TradeHttpResponse<TradeLeaguesHttpResult>;
