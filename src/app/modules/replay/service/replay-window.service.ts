import { Injectable } from '@angular/core';
import { WindowName } from '@app/config';
import { EventEmitter } from '@app/event';
import { OWWindow } from '@app/odk';
import { ProcessStorageService } from '@app/storage';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const WINDOW_DATA_KEY = 'REPLAY_WINDOW_DATA';
const WINDOW_BORDER_SIZE = 20;
const WINDOW_SIZE = 25 / 100;
const WINDOW_HEADER_SIZE = 30;

export interface ReplayWindowData {
    url: string;
    gameWidth: number;
    gameHeight: number;
}

@Injectable({
    providedIn: 'root'
})
export class ReplayWindowService {
    private readonly window: OWWindow;

    constructor(private readonly storage: ProcessStorageService) {
        this.window = new OWWindow(WindowName.Replay);
    }

    public get data$(): EventEmitter<ReplayWindowData> {
        return this.storage.get(WINDOW_DATA_KEY, () => new EventEmitter<ReplayWindowData>());
    }

    public open(data: ReplayWindowData): Observable<void> {
        this.data$.next(data);
        return this.window.close().pipe(
            mergeMap(() => this.window.restore()),
            mergeMap(() => this.restorePosition())
        );
    }

    public close(): Observable<void> {
        return this.window.close();
    }

    private restorePosition(): Observable<void> {
        const { gameWidth, gameHeight } = this.data$.get();
        const width = Math.round(gameWidth * WINDOW_SIZE);
        const height = WINDOW_HEADER_SIZE + Math.round(gameHeight * WINDOW_SIZE);
        const left = gameWidth - width - WINDOW_BORDER_SIZE;
        const top = gameHeight - height - WINDOW_BORDER_SIZE;
        return this.window.changeSize(width, height).pipe(
            mergeMap(() => this.window.changePosition(left, top))
        );
    }
}
