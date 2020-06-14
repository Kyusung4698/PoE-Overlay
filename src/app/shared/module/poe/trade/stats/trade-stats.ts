export interface TradeStatGroup {
    name: string;
    items: TradeStat[];
}

export interface TradeStat {
    id: string;
    type: string;
    text: string;
    option?: {
        options?: {
            id: string,
            text: string
        }[]
    };
}
