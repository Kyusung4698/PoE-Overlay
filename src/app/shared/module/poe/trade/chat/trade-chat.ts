export interface TradeChatOffer {
    seller: string;
    item: string;
}

export interface TradeChatRequest {
    buyer: string;
    item: string;
}

export interface TradeChatParseResult {
    offer?: TradeChatOffer;
    request?: TradeChatRequest;
}
