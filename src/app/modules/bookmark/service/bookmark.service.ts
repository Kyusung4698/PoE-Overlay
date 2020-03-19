import { Injectable } from '@angular/core';
import { BrowserService } from '@app/service';
import { Subject } from 'rxjs';
import { tap, throttleTime } from 'rxjs/operators';
import { BookmarkUserBookmark } from '../component/bookmark-settings/bookmark-settings.component';

@Injectable({
    providedIn: 'root'
})
export class BookmarkService {
    private readonly bookmark$ = new Subject<BookmarkUserBookmark>();

    constructor(
        private readonly browser: BrowserService) {
        this.init();
    }

    public open(bookmark: BookmarkUserBookmark): void {
        this.bookmark$.next(bookmark);
    }

    private init(): void {
        this.bookmark$.pipe(
            throttleTime(350),
            tap(bookmark => {
                this.browser.open(bookmark.url, !!bookmark.external);
            })
        ).subscribe();
    }
}