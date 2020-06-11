export interface TradeStaticGroup {
    id: string;
    name: string;
    items: TradeStatic[];
}

export interface TradeStatic {
    id: string;
    name: string;
    image?: string;
}
