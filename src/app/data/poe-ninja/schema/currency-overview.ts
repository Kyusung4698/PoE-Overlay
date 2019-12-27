export interface CurrencyOverviewResponse {
    lines: CurrencyOverviewLine[];
}

export interface CurrencyOverviewLine {
    currencyTypeName: string;
    chaosEquivalent: number;
}
