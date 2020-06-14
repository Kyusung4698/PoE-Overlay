import { BehaviorSubject } from 'rxjs';

export enum TradeParserType {
    Ignored = 'ignored',
    TradeItem = 'item',
    TradeBulk = 'bulk',
    TradeMap = 'map',
    Whisper = 'whisper',
    PlayerJoinedArea = 'player',
}

export enum TradeWhisperDirection {
    Incoming = 'incoming',
    Outgoing = 'outgoing',
}

export interface TradeParserBase {
    type: TradeParserType;
}

export interface TradePlayerJoinedArea extends TradeParserBase {
    name: string;
}

export interface TradeWhisper {
    timeReceived: Date;
    direction: TradeWhisperDirection;
    message: string;
}

export interface TradeMessage extends TradeParserBase, TradeWhisper {
    name: string;
}

export interface TradeExchangeMessage extends TradeMessage {
    whispers$: BehaviorSubject<TradeWhisper[]>;
    league: string;
    joined$: BehaviorSubject<boolean>;
}

export interface TradeItemMessage extends TradeExchangeMessage {
    itemName: string;
    price?: number;
    currencyType?: string;
    stash: string;
    left: number;
    top: number;
}

export interface TradeBulkMessage extends TradeExchangeMessage {
    count1: number;
    type1: string;
    count2: number;
    type2: string;
}

export interface TradeMapList {
    tier: string;
    maps: string[];
}

export interface TradeMapMessage extends TradeExchangeMessage {
    maps1: TradeMapList;
    maps2: TradeMapList;
}
