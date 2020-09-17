import { Injectable } from '@angular/core';
import { WindowName } from '@app/config';
import { OWWindow } from '@app/odk';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AnnotationWindowService {
    private readonly window: OWWindow;

    constructor() {
        this.window = new OWWindow(WindowName.Annotation);
    }

    public open(gameWidth: number, gameHeight: number): Observable<void> {
        return this.window.restore().pipe(
            mergeMap(() => this.move(gameWidth, gameHeight))
        );
    }

    public close(): Observable<void> {
        return this.window.close();
    }

    public move(gameWidth: number, gameHeight: number): Observable<void> {
        const left = gameWidth - Math.max(280, Math.round(gameWidth * 0.2));
        const top = Math.round(gameHeight * 0.3);
        return this.window.changePosition(left, top);
    }
}
