import { Injectable } from '@angular/core';
import { WindowName } from '@app/config';
import { EventEmitter } from '@app/event';
import { OWWindow } from '@app/odk';
import { ProcessStorageService } from '@app/storage';
import { Item } from '@shared/module/poe/item';
import { Observable } from 'rxjs';
import { InspectFeatureSettings } from '../inspect-feature-settings';

const WINDOW_DATA_KEY = 'INSPECT_WINDOW_DATA';

export interface InspectWindowData {
    item: Item;
    settings: InspectFeatureSettings;
}

@Injectable({
    providedIn: 'root'
})
export class InspectWindowService {
    private readonly window: OWWindow;

    constructor(private readonly storage: ProcessStorageService) {
        this.window = new OWWindow(WindowName.Inspect);
    }

    public get data$(): EventEmitter<InspectWindowData> {
        return this.storage.get(WINDOW_DATA_KEY, () => new EventEmitter<InspectWindowData>());
    }

    public open(data: InspectWindowData): Observable<void> {
        this.data$.next(data);
        return this.window.restore();
    }

    public close(): Observable<void> {
        return this.window.close();
    }

    public minimize(): Observable<void> {
        return this.window.minimize();
    }
}
