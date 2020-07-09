import { Injectable } from '@angular/core';
import { OWClipboard } from '@app/odk';
import { OWUtils } from '@app/odk/ow-utils';
import { Observable, Subject } from 'rxjs';
import { delay, flatMap, map, mergeMap, tap } from 'rxjs/operators';
import { StashPriceTag } from './stash-price-tag';

interface HighlightEvent {
    term: string;
}

@Injectable({
    providedIn: 'root'
})
export class StashService {
    private readonly queue$ = new Subject<HighlightEvent>();

    constructor() {
        this.init();
    }

    public copyPrice(tag: StashPriceTag): Observable<void> {
        const content = `${tag.type} ${(tag.count ? `${tag.amount}/${tag.count}` : tag.amount)} ${tag.currency}`;
        return OWClipboard.placeOnClipboard(content);
    }

    public highlight(term: string): void {
        this.queue$.next({ term });
    }

    private init(): void {
        this.queue$.pipe(
            mergeMap(event => OWClipboard.getFromClipboard().pipe(
                flatMap(text => OWClipboard.placeOnClipboard(event.term).pipe(
                    map(() => text)
                )),
                delay(10),
                tap(() => OWUtils.sendKeyStroke('Ctrl+F')),
                delay(175),
                tap(() => OWUtils.sendKeyStroke('Ctrl+V')),
                delay(75),
                flatMap(text => OWClipboard.placeOnClipboard(text)),
                delay(10),
            ), 1)
        ).subscribe();
    }
}
