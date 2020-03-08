import { Injectable } from '@angular/core';
import { SnackBarService } from '@shared/module/material/service';
import { ItemClipboardResultCode, ItemClipboardService, StashService } from '@shared/module/poe/service';
import { Language } from '@shared/module/poe/type';
import { Observable, of, throwError } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { EvaluateUserSettings } from '../component/evaluate-settings/evaluate-settings.component';
import { EvaluateDialogService } from './evaluate-dialog.service';

@Injectable({
    providedIn: 'root'
})
export class EvaluateService {
    constructor(
        private readonly item: ItemClipboardService,
        private readonly stash: StashService,
        private readonly snackbar: SnackBarService,
        private readonly evaluateDialog: EvaluateDialogService) {
    }

    public evaluate(settings: EvaluateUserSettings, language?: Language): Observable<void> {
        return this.item.copy().pipe(
            flatMap(({ code, point, item }) => {
                switch (code) {
                    case ItemClipboardResultCode.Success:
                        return this.evaluateDialog.open(point, item, settings, language).pipe(
                            flatMap(result => {
                                if (!result) {
                                    return of(null);
                                }

                                if (!this.stash.hovering(point)) {
                                    this.stash.copyPrice(result);
                                    return this.snackbar.info('evaluate.tag.outside-stash');
                                }

                                if ((item.note || '').length > 0) {
                                    this.stash.copyPrice(result);
                                    return this.snackbar.info('evaluate.tag.note');
                                }
                                return this.stash.tagPrice(result, point);
                            })
                        );
                    case ItemClipboardResultCode.Empty:
                        return this.snackbar.warning('clipboard.empty');
                    case ItemClipboardResultCode.ParserError:
                        return this.snackbar.warning('clipboard.parser-error');
                    default:
                        return throwError(`code: '${code}' out of range`);
                }
            }),
            catchError(() => {
                return this.snackbar.error('clipboard.error');
            })
        );
    }
}
