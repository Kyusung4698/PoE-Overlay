export enum ParserResultType {
    Ignored = 'ignored',
    TradeItem = 'item',
    TradeBulk = 'bulk',
    TradeMap = 'map',
    Whisper = 'whisper',
    PlayerJoinedArea = 'player',
}

export enum TradeDirection {
    Incoming = 'incoming',
    Outgoing = 'outgoing',
}

export interface TradeParserBase {
    parseType: ParserResultType;
}

export interface Whisper extends TradeParserBase {
    timeReceived: Date;
    tradeDirection: TradeDirection;
    name: string;
    message: string;
}

export interface TradeMessageBase extends Whisper {
    extendedMessage: string[];
    league: string;
}

export interface TradeItemMessage extends TradeMessageBase {
    itemName: string;
    price?: number;
    currencyType?: string;
    stash: string;
    left: number;
    top: number;
}

export interface TradeBulkMessage extends TradeMessageBase {
    count1: number;
    type1: string;
    count2: number;
    type2: string;
}

export interface TradeMapList {
    tier: string;
    maps: string[];
}

export interface TradeMapMessage extends TradeMessageBase {
    maps1: TradeMapList;
    maps2: TradeMapList;
}
