import { Injectable } from '@angular/core';
import { NotificationService } from '@app/notification';
import { ItemClipboardResultCode, ItemClipboardService } from '@shared/module/poe/item/clipboard';
import { ItemSectionType } from '@shared/module/poe/item/clipboard/section-parser';
import { StashService } from '@shared/module/poe/stash';
import { Observable, of, throwError } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MiscStashService {
    constructor(
        private readonly stash: StashService,
        private readonly itemClipboard: ItemClipboardService,
        private readonly notification: NotificationService) { }

    public highlight(): Observable<void> {
        return this.itemClipboard.copy({
            [ItemSectionType.Rartiy]: true
        }).pipe(
            flatMap(({ code, item }) => {
                switch (code) {
                    case ItemClipboardResultCode.Success:
                        if (item.type?.length) {
                            this.stash.highlight(item.type);
                        }
                        break;
                    case ItemClipboardResultCode.Empty:
                        this.notification.show('clipboard.empty');
                        break;
                    case ItemClipboardResultCode.ParserError:
                        this.notification.show('clipboard.parser-error');
                        break;
                    default:
                        return throwError(`code: '${code}' out of range`);
                }
                return of(null);
            })
        );
    }
}
