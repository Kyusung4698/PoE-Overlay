import { Injectable } from '@angular/core';
import { WindowName } from '@app/config';
import { EventEmitter } from '@app/event';
import { OWWindow } from '@app/odk';
import { ProcessStorageService } from '@app/storage';
import { Language } from '@data/poe/schema';
import { Item } from '@shared/module/poe/item';
import { Observable } from 'rxjs';
import { EvaluateFeatureSettings } from '../evaluate-feature-settings';

const WINDOW_DATA_KEY = 'EVALUATE_WINDOW_DATA';

export interface EvaluateWindowData {
    item: Item;
    language: Language;
    settings: EvaluateFeatureSettings;
}

@Injectable({
    providedIn: 'root'
})
export class EvaluateWindowService {
    private readonly window: OWWindow;

    constructor(private readonly storage: ProcessStorageService) {
        this.window = new OWWindow(WindowName.Evaluate);
    }

    public get data$(): EventEmitter<EvaluateWindowData> {
        return this.storage.get(WINDOW_DATA_KEY, () => new EventEmitter<EvaluateWindowData>());
    }

    public open(data: EvaluateWindowData): Observable<void> {
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
