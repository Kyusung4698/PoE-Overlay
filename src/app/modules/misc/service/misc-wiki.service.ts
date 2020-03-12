import { Injectable } from '@angular/core';
import { BrowserService } from '@app/service';
import { SnackBarService } from '@shared/module/material/service';
import { ItemClipboardResultCode, ItemClipboardService, ItemExternalService } from '@shared/module/poe/service';
import { ItemSection } from '@shared/module/poe/type';
import { Observable, of, throwError } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MiscWikiService {

    constructor(
        private readonly itemClipboard: ItemClipboardService,
        private readonly itemExternalService: ItemExternalService,
        private readonly browser: BrowserService,
        private readonly snackbar: SnackBarService) {
    }

    public open(external: boolean): Observable<void> {
        return this.itemClipboard.copy({
            [ItemSection.Rartiy]: true
        }).pipe(
            flatMap(({ code, item }) => {
                switch (code) {
                    case ItemClipboardResultCode.Success:
                        const url = this.itemExternalService.getWikiUrl(item);
                        this.browser.open(url, external);
                        return of(null);
                    case ItemClipboardResultCode.Empty:
                        return this.snackbar.warning('clipboard.empty');
                    case ItemClipboardResultCode.ParserError:
                        return this.snackbar.warning('clipboard.parser-error');
                    default:
                        return throwError(`code: '${code}' out of range`);
                }
            }),
            catchError(() => {
                return this.snackbar.error('clipboard.parser-error');
            })
        );
    }
}
