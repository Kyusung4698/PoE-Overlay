import { Injectable } from '@angular/core';
import { WindowName } from '@app/config';
import { EventEmitter } from '@app/event';
import { OWWindow } from '@app/odk';
import { ProcessStorageService } from '@app/storage';
import { Observable } from 'rxjs';

const WINDOW_DATA_KEY = 'SETTINGS_WINDOW_DATA';

export interface SettingsWindowData {
    activeFeature?: string;
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

    public toggle(activeFeature?: string): Observable<boolean> {
        this.data$.next({
            activeFeature
        });
        return this.window.toggle(true);
    }

    public close(): Observable<void> {
        this.data$.next({});
        return this.window.close();
    }
}
