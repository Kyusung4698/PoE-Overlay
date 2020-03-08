import { Injectable } from '@angular/core';
import { BrowserService } from '@app/service';
import { Subject } from 'rxjs';
import { tap, throttleTime } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BookmarkService {
    private readonly url$ = new Subject<string>();

    constructor(
        private readonly browser: BrowserService) {
        this.init();
    }

    public open(url: string): void {
        this.url$.next(url);
    }

    private init(): void {
        this.url$.pipe(
            throttleTime(350),
            tap(url => {
                this.browser.open(url);
            })
        ).subscribe();
    }
}