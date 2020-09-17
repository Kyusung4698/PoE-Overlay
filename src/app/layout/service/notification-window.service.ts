import { Injectable } from '@angular/core';
import { WindowName } from '@app/config';
import { OWWindow } from '@app/odk';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NotificationWindowService {
    private readonly window: OWWindow;

    constructor() {
        this.window = new OWWindow(WindowName.Notification);
    }

    public open(gameWidth: number, gameHeight: number): Observable<void> {
        return this.window.restore().pipe(
            mergeMap(() => this.resize(gameWidth, gameHeight))
        );
    }

    public close(): Observable<void> {
        return this.window.close();
    }

    public resize(gameWidth: number, gameHeight: number): Observable<void> {
        const maxWidth = Math.round(gameWidth * 0.8);
        const left = Math.round((gameWidth - maxWidth) * 0.5);
        const top = Math.round(gameHeight * 0.77777);
        return this.window.changeSize(maxWidth, 100).pipe(
            mergeMap(() => this.window.changePosition(left, top))
        );
    }
}
