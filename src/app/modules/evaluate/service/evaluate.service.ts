import { Injectable } from '@angular/core';
import { NotificationService } from '@app/notification';
import { Language } from '@data/poe/schema';
import { ItemClipboardResultCode, ItemClipboardService } from '@shared/module/poe/item/clipboard';
import { ItemProcessorService } from '@shared/module/poe/item/processor';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { EvaluateFeatureSettings } from '../evaluate-feature-settings';
import { EvaluateWindowService } from './evaluate-window.service';

@Injectable({
    providedIn: 'root'
})
export class EvaluateService {

    constructor(
        private readonly clipboard: ItemClipboardService,
        private readonly window: EvaluateWindowService,
        private readonly itemProcessor: ItemProcessorService,
        private readonly notification: NotificationService) { }

    public evaluate(settings: EvaluateFeatureSettings, language?: Language): Observable<void> {
        return this.clipboard.copy().pipe(
            mergeMap(({ code, item }) => {
                switch (code) {
                    case ItemClipboardResultCode.Success:
                        this.itemProcessor.process(item, {
                            normalizeQuality: settings.evaluateItemSearchPropertyNormalizeQuality
                        });
                        return this.window.open({ item, settings, language });
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
