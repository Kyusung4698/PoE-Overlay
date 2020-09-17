import { Injectable } from '@angular/core';
import { OWClipboard } from '@app/odk';
import { OWUtils } from '@app/odk/ow-utils';
import { Observable, Subject } from 'rxjs';
import { delay, map, mergeMap, tap, throttleTime } from 'rxjs/operators';
import { StashPriceTag } from './stash-price-tag';

interface HighlightEvent {
    term: string;
}

interface NavigateEvent {
    dir: 'left' | 'right';
}

@Injectable({
    providedIn: 'root'
})
export class StashService {
    private readonly hightlight$ = new Subject<HighlightEvent>();
    private readonly navigate$ = new Subject<NavigateEvent>();

    constructor() {
        this.init();
    }

    public copyPrice(tag: StashPriceTag): Observable<void> {
        const content = `${tag.type} ${(tag.count ? `${tag.amount}/${tag.count}` : tag.amount)} ${tag.currency}`;
        return OWClipboard.placeOnClipboard(content);
    }

    public highlight(term: string): void {
        this.hightlight$.next({ term });
    }

    public navigate(dir: 'right' | 'left'): void {
        this.navigate$.next({ dir });
    }

    private init(): void {
        this.hightlight$.pipe(
            mergeMap(event => OWClipboard.getFromClipboard().pipe(
                mergeMap(text => OWClipboard.placeOnClipboard(event.term).pipe(
                    map(() => text)
                )),
                delay(10),
                tap(() => OWUtils.sendKeyStroke('Ctrl+F')),
                delay(175),
                tap(() => OWUtils.sendKeyStroke('Ctrl+V')),
                delay(75),
                mergeMap(text => OWClipboard.placeOnClipboard(text)),
                delay(10),
            ), 1)
        ).subscribe();
        this.navigate$.pipe(
            throttleTime(5),
            map(({ dir }) => OWUtils.sendKeyStroke(dir))
        ).subscribe();
    }
}
