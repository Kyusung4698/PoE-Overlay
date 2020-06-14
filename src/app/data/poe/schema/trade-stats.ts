import { TradeHttpResponse } from './trade';

export enum TradeStatsHttpResultLabel {
    Pseudo = 'Pseudo',
    Explicit = 'Explicit',
    Implicit = 'Implicit',
    Fractured = 'Fractured',
    Enchant = 'Enchant',
    Crafted = 'Crafted',
    Veiled = 'Veiled',
    Monster = 'Monster',
    Delve = 'Delve',
}

export interface TradeStatsHttpResultResultEntry {
    id?: string;
    text?: string;
    type?: string;
    option?: {
        options?: {
            id: string,
            text: string
        }[]
    };
}

export interface TradeStatsHttpResult {
    label: TradeStatsHttpResultLabel;
    entries: TradeStatsHttpResultResultEntry[];
}

export type TradeStatsHttpResponse = TradeHttpResponse<TradeStatsHttpResult>;
