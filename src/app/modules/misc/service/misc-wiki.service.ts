import { Injectable } from '@angular/core';
import { BrowserService } from '@app/service';
import { environment } from '@env/environment';
import { SnackBarService } from '@shared/module/material/service';
import { ItemClipboardResultCode, ItemClipboardService } from '@shared/module/poe/service';
import { ItemService } from '@shared/module/poe/service/item/item.service';
import { ItemSection, Language } from '@shared/module/poe/type';
import { Observable, throwError, of } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MiscWikiService {

    constructor(
        private readonly itemClipboard: ItemClipboardService,
        private readonly itemService: ItemService,
        private readonly browser: BrowserService,
        private readonly snackbar: SnackBarService) {
    }

    public open(external: boolean): Observable<void> {
        return this.itemClipboard.copy({
            [ItemSection.Rartiy]: true
        }).pipe(
            flatMap(result => {
                switch (result.code) {
                    case ItemClipboardResultCode.Success:
                        let search = this.itemService.getName(result.item.nameId, Language.English) || '';
                        if (search.length === 0) {
                            search = this.itemService.getType(result.item.typeId, Language.English);
                        }
                        this.browser.open(`${environment.wiki.baseUrl}/index.php?search=${encodeURIComponent(search)}`, external);
                        return of(null);
                    case ItemClipboardResultCode.Empty:
                        return this.snackbar.warning('Clipboard text was empty. Make sure the game is focused.');
                    case ItemClipboardResultCode.ParserError:
                        return this.snackbar.warning('Copied item could not be parsed. Make sure you have the correct language selected.');
                    default:
                        return throwError(`code: '${result.code}' out of range`);
                }
            }),
            catchError(() => {
                return this.snackbar.error('An unexpected error occured while parsing the item.');
            })
        );
    }
}
