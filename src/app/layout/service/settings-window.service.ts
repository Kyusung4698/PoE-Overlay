import { Injectable } from '@angular/core';
import { WindowName } from '@app/config';
import { EventEmitter } from '@app/event';
import { OWWindow } from '@app/odk';
import { ProcessStorageService } from '@app/storage';
import { Observable } from 'rxjs';

const WINDOW_DATA_KEY = 'SETTINGS_WINDOW_DATA';

export enum SettingsFeature {
    Evaluate = 'evaluate.name',
    Inspect = 'inspect.name',
    Market = 'market.name',
    Replay = 'replay.name',
    Trade = 'trade.name',
    Support = 'support.name'
}

export interface SettingsWindowData {
    activeFeature?: SettingsFeature;
}

@Injectable({
    providedIn: 'root'
})
export class SettingsWindowService {
    private readonly window: OWWindow;

    constructor(private readonly storage: ProcessStorageService) {
        this.window = new OWWindow(WindowName.Settings);
    }

    public get data$(): EventEmitter<SettingsWindowData> {
        return this.storage.get(WINDOW_DATA_KEY, () => new EventEmitter<SettingsWindowData>());
    }

    public open(activeFeature?: SettingsFeature): Observable<void> {
        this.data$.next({ activeFeature });
        return this.window.restore();
    }

    public toggle(activeFeature?: SettingsFeature): Observable<boolean> {
        this.data$.next({ activeFeature });
        return this.window.toggle(true);
    }

    public close(): Observable<void> {
        this.data$.next({});
        return this.window.close();
    }
}
