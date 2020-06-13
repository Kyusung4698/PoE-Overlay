import { Injectable } from '@angular/core';
import { WindowName } from '@app/config';
import { EventEmitter } from '@app/event';
import { OWWindow } from '@app/odk';
import { ProcessStorageService } from '@app/storage';
import { TradeBulkMessage, TradeExchangeMessage, TradeItemMessage, TradeMapList, TradeMapMessage, TradeParserType, TradeWhisperDirection } from '@shared/module/poe/trade/chat';
import { Observable } from 'rxjs';

const WINDOW_DATA_KEY = 'TRADE_WINDOW_DATA';

export interface TradeWindowData {
    // only modified by the background window
    messages: TradeExchangeMessage[];
    // only modified by the trade window
    removed: TradeExchangeMessage[];
}

@Injectable({
    providedIn: 'root'
})
export class TradeWindowService {
    private readonly window: OWWindow;

    constructor(private readonly storage: ProcessStorageService) {
        this.window = new OWWindow(WindowName.Trade);
    }

    public get data$(): EventEmitter<TradeWindowData> {
        return this.storage.get(WINDOW_DATA_KEY, () => new EventEmitter<TradeWindowData>({
            messages: [
                {
                    type: TradeParserType.TradeItem,
                    direction: TradeWhisperDirection.Incoming,
                    timeReceived: new Date(),
                    name: 'Hyve747',
                    message: 'Hi, I would like to buy your Rusted Sulphite Scarab listed for 2.5 chaos in Delirium (stash tab "C"; position: left 47, top 1) Offer 2c',
                    league: 'Delirium',
                    whispers: [{
                        message: 'Offer 2c',
                        timeReceived: new Date()
                    }],
                    itemName: 'Rusted Sulphite Scarab',
                    left: 22,
                    top: 1,
                    stash: 'C',
                    currencyType: 'chaos',
                    price: 2.5
                } as TradeItemMessage,
                {
                    type: TradeParserType.TradeItem,
                    direction: TradeWhisperDirection.Outgoing,
                    timeReceived: new Date(),
                    name: 'Hyve747',
                    message: 'Hi, I would like to buy your Rusted Sulphite Scarab listed for 2.5 chaos in Delirium (stash tab "C"; position: left 47, top 1) Offer 2c',
                    league: 'Delirium',
                    whispers: [{
                        message: 'Offer 2c',
                        timeReceived: new Date()
                    }],
                    itemName: 'Rusted Sulphite Scarab',
                    left: 22,
                    top: 1,
                    stash: 'C',
                    currencyType: 'chaos',
                    price: 2.5,
                } as TradeItemMessage,
                {
                    type: TradeParserType.TradeBulk,
                    direction: TradeWhisperDirection.Incoming,
                    timeReceived: new Date(),
                    name: 'Hyve747',
                    message: 'Hi, I\'d like to buy your 1 Rusted Sulphite Scarab for my 2.5 Chaos Orb in Delirium. TEST',
                    league: 'Delirium',
                    whispers: [{
                        message: 'Offer 2c',
                        timeReceived: new Date()
                    }],
                    count1: 1,
                    type1: 'Rusted Sulphite Scarab',
                    count2: 2.5,
                    type2: 'Chaos Orb',
                } as TradeBulkMessage,
                {
                    type: TradeParserType.TradeBulk,
                    direction: TradeWhisperDirection.Outgoing,
                    timeReceived: new Date(),
                    name: 'Hyve747',
                    message: 'Hi, I\'d like to buy your 1 Rusted Sulphite Scarab for my 2.5 Chaos Orb in Delirium. TEST',
                    league: 'Delirium',
                    whispers: [{
                        message: 'Offer 2c',
                        timeReceived: new Date()
                    }],
                    count1: 1,
                    type1: 'Rusted Sulphite Scarab',
                    count2: 2.5,
                    type2: 'Chaos Orb',
                } as TradeBulkMessage,
                {
                    type: TradeParserType.TradeMap,
                    direction: TradeWhisperDirection.Incoming,
                    timeReceived: new Date(),
                    name: 'Hyve747',
                    message: 'I\'d like to exchange my XIV: (Sulphur Vents Map) for your XIV: (Iceberg Map, Glacier Map, Volcano Map, Wharf Map, Laboratory Map, Museum Map, Wasteland Map) in Delirium.',
                    league: 'Delirium',
                    whispers: [{
                        message: 'Offer 2c',
                        timeReceived: new Date()
                    }],
                    maps1: {
                        tier: 'XIV',
                        maps: ['Sulphur Vents Map']
                    } as TradeMapList,
                    maps2: {
                        tier: 'XIV',
                        maps: [
                            'Iceberg Map',
                            'Glacier Map',
                            'Volcano Map',
                            'Wharf Map',
                            'Laboratory Map',
                            'Museum Map',
                            'Wasteland Map'
                        ]
                    } as TradeMapList,
                } as TradeMapMessage,
                {
                    type: TradeParserType.TradeMap,
                    direction: TradeWhisperDirection.Outgoing,
                    timeReceived: new Date(),
                    name: 'Hyve747',
                    message: 'I\'d like to exchange my XIV: (Sulphur Vents Map) for your XIV: (Iceberg Map, Glacier Map, Volcano Map, Wharf Map, Laboratory Map, Museum Map, Wasteland Map) in Delirium.',
                    league: 'Delirium',
                    whispers: [{
                        message: 'Offer 2c',
                        timeReceived: new Date()
                    }],
                    maps1: {
                        tier: 'XIV',
                        maps: ['Sulphur Vents Map']
                    } as TradeMapList,
                    maps2: {
                        tier: 'XIV',
                        maps: [
                            'Iceberg Map',
                            'Glacier Map',
                            'Volcano Map',
                            'Wharf Map',
                            'Laboratory Map',
                            'Museum Map',
                            'Wasteland Map'
                        ]
                    } as TradeMapList,
                } as TradeMapMessage
            ],
            removed: []
        }));
    }

    public restore(): Observable<void> {
        return this.window.restore();
    }

    public close(): Observable<void> {
        return this.window.close();
    }

    public minimize(): Observable<void> {
        return this.window.minimize();
    }
}
