import { Injectable } from '@angular/core';
import { WindowName } from '@app/config';
import { EventEmitter } from '@app/event';
import { OWWindow } from '@app/odk';
import { ProcessStorageService } from '@app/storage';
import { TradeChatOffer, TradeChatRequest } from '@shared/module/poe/trade/chat';
import { Observable } from 'rxjs';

const WINDOW_DATA_KEY = 'TRADE_WINDOW_DATA';

export interface TradeWindowData {
    offers: TradeChatOffer[];
    requests: TradeChatRequest[];
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
            offers: [],
            requests: []
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
