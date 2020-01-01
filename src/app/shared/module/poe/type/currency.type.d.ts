import { Language } from "./language.type"

export type Currency = {
    language: Language;
    id: string;
    nameType: string;
    image: string;
}

export type CurrenciesMap = {
    label: string;
    currencies: Currency[];
}

export type CurrencyChaosEquivalents = {
    // TODO: Use ids instead of nameType to be language unspecific
    [nameType: string]: number;
}