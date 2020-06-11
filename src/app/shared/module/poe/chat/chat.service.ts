import { Injectable } from '@angular/core';
import { OWUtils } from '@app/odk/ow-utils';
import { Subject } from 'rxjs';
import { delay, flatMap, map, tap, throttleTime } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private readonly queue$ = new Subject<string>();

    constructor() {
        this.init();
    }

    public send(content: string): void {
        this.queue$.next(content);
    }

    private init(): void {
        this.queue$.pipe(
            throttleTime(350),
            flatMap(content => OWUtils.getFromClipboard().pipe(
                map(text => ({ content, text }))
            )),
            tap(({ content }) => {
                OWUtils.placeOnClipboard(content);
            }),
            delay(10),
            tap(() => OWUtils.sendKeyStroke('Enter')),
            delay(10),
            tap(() => OWUtils.sendKeyStroke('Ctrl+V')),
            delay(10),
            tap(() => OWUtils.sendKeyStroke('Enter')),
            delay(200),
            tap(({text}) => {
                OWUtils.placeOnClipboard(text);
            })
        ).subscribe();
    }
}
