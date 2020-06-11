import { TradeFetchResultEntry } from './trade-fetch';

export interface TradeFetchAnalyzeEntry {
    fetch: TradeFetchResultEntry;
    target: string;
    targetAmount: number;
    targetAmountRounded: number;
}

export interface TradeFetchAnalyzeEntryGrouped {
    value: number;
    hidden: number;
    mean?: string;
    items: TradeFetchAnalyzeEntry[];
}

export interface TradeFetchAnalyzeValues {
    min?: number;
    max?: number;
    mode?: number;
    median?: number;
    mean?: number;
}

export interface TradeFetchAnalyzeResult {
    total: number;
    url: string;
    entries: TradeFetchAnalyzeEntry[];
    entryGroups?: TradeFetchAnalyzeEntryGrouped[];
    currency?: string;
    values?: TradeFetchAnalyzeValues;
}
