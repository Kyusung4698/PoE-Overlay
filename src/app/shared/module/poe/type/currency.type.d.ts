import { Language } from "./language.type"

export type Currency = {
    id: string;
    nameType: string;
    image: string;
}

export type CurrencyTrade = {
    tradeId: string;
    nameType: string;
}

export type CurrencyChaosEquivalents = {
    [nameType: string]: number;
}