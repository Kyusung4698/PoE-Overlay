export type Currency = {
    id: string;
    nameType: string;
    image: string;
}

export type CurrenciesMap = {
    label: string;
    currencies: Currency[];
}

export type CurrencyChaosEquivalents = {
    [nameType: string]: number;
}