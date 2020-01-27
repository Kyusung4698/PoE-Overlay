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
            flatMap(result => {
                switch (result.code) {
                    case ItemClipboardResultCode.Success:
                        const point = result.point;
                        return this.evaluateDialog.open(point, result.item, settings, language).pipe(
                            flatMap(evaluate => {
                                if (!evaluate) {
                                    return of(null);
                                }

                                if (!this.stash.hovering(point)) {
                                    this.stash.copyPrice(evaluate.amount, evaluate.currency);
                                    return this.snackbar.info(
                                        'Only items inside the stash can be fast tagged. Note has been copied instead.');
                                }

                                if ((result.item.note || '').length > 0) {
                                    this.stash.copyPrice(evaluate.amount, evaluate.currency);
                                    return this.snackbar.info(
                                        'Only items without an existing note can be fast tagged. Note has been copied instead.');
                                }
                                return this.stash.tagPrice(evaluate.amount, evaluate.currency, point);
                            })
                        );
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
