import { Injectable } from '@angular/core';
import { OWUtils } from '@app/odk/ow-utils';
import { Subject } from 'rxjs';
import { delay, mergeMap, tap } from 'rxjs/operators';
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

    public copyPrice(tag: StashPriceTag): void {
        const content = `${tag.type} ${(tag.count ? `${tag.amount}/${tag.count}` : tag.amount)} ${tag.currency}`;
        OWUtils.placeOnClipboard(content);
    }

    public highlight(term: string): void {
        this.queue$.next({ term });
    }

    private init(): void {
        this.queue$.pipe(
            mergeMap(event => OWUtils.getFromClipboard().pipe(
                tap(() => OWUtils.placeOnClipboard(event.term)),
                delay(10),
                tap(() => OWUtils.sendKeyStroke('Ctrl+F')),
                delay(175),
                tap(() => OWUtils.sendKeyStroke('Ctrl+V')),
                delay(75),
                tap(text => OWUtils.placeOnClipboard(text)),
                delay(10),
            ), 1)
        ).subscribe();
    }
}
