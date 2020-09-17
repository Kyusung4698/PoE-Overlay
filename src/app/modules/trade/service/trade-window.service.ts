import { Injectable } from '@angular/core';
import { WindowName } from '@app/config';
import { EventEmitter } from '@app/event';
import { OWGames, OWWindow } from '@app/odk';
import { ProcessStorageService } from '@app/storage';
import { TradeExchangeMessage } from '@shared/module/poe/trade/chat';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TradeFeatureSettings } from '../trade-feature-settings';

const WINDOW_DATA_KEY = 'TRADE_WINDOW_DATA';

export interface TradeWindowData {
    // only modified by the background window
    messages: TradeExchangeMessage[];
    // only modified by the trade window
    removed: TradeExchangeMessage[];
    settings: TradeFeatureSettings;
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
            messages: [],
            removed: [],
            settings: undefined
        }));
    }

    public restore(settings: TradeFeatureSettings): Observable<void> {
        const data = this.data$.get();
        data.settings = settings;
        this.data$.next(data);
        return this.window.restore().pipe(
            mergeMap(() => OWGames.getRunningGameInfo().pipe(
                mergeMap(({ height }) => {
                    const newHeight = Math.round(height * settings.tradeHeight / 100);
                    return this.window.changeSize(310, newHeight);
                })
            ))
        );
    }

    public close(): Observable<void> {
        return this.window.close();
    }

    public minimize(): Observable<void> {
        return this.window.minimize();
    }
}
