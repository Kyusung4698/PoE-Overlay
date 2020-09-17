import { Injectable } from '@angular/core';
import { NotificationService } from '@app/notification';
import { ItemClipboardResultCode, ItemClipboardService } from '@shared/module/poe/item/clipboard';
import { ItemSectionType } from '@shared/module/poe/item/clipboard/section-parser';
import { ItemProcessorService } from '@shared/module/poe/item/processor';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { InspectFeatureSettings } from '../inspect-feature-settings';
import { InspectWindowService } from './inspect-window.service';

@Injectable({
    providedIn: 'root'
})
export class InspectService {
    constructor(
        private readonly clipboard: ItemClipboardService,
        private readonly window: InspectWindowService,
        private readonly processor: ItemProcessorService,
        private readonly notification: NotificationService) { }

    public inspect(settings: InspectFeatureSettings): Observable<void> {
        return this.clipboard.copy({
            [ItemSectionType.Rartiy]: true,
            [ItemSectionType.ItemLevel]: true,
            [ItemSectionType.Properties]: true,
            [ItemSectionType.Corrupted]: true,
            [ItemSectionType.Stats]: true,
        }).pipe(
            mergeMap(({ code, item }) => {
                switch (code) {
                    case ItemClipboardResultCode.Success:
                        this.processor.process(item, {
                            normalizeQuality: false
                        });
                        return this.window.open({ item, settings });
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
