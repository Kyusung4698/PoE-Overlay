export interface TradeItemGroup {
    name: string;
    items: TradeItem[];
}

export interface TradeItem {
    name: string;
    type: string;
    text: string;
}
