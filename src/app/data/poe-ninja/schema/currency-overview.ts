export interface CurrencyOverviewResponse {
    lines: CurrencyOverviewLine[];
}

export interface CurrencyOverviewLine {
    currencyTypeName: string;
    receiveSparkLine: ReceiveSparkLine;
    chaosEquivalent: number;
}

export interface ReceiveSparkLine {
    data: number[];
    totalChange: number;
}
