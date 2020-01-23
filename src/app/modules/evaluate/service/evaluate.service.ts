import { Injectable } from '@angular/core';
import { SnackBarService } from '@shared/module/material/service';
import { ItemClipboardResultCode, ItemClipboardService } from '@shared/module/poe/service';
import { Language } from '@shared/module/poe/type';
import { Observable, throwError } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { EvaluateUserSettings } from '../component/evaluate-settings/evaluate-settings.component';
import { EvaluateDialogService } from './evaluate-dialog.service';

@Injectable({
    providedIn: 'root'
})
export class EvaluateService {
    constructor(
        private readonly itemClipboard: ItemClipboardService,
        private readonly snackbar: SnackBarService,
        private readonly evaluateDialog: EvaluateDialogService) {
    }

    public evaluate(settings: EvaluateUserSettings, language?: Language): Observable<void> {
        return this.itemClipboard.copy().pipe(
            flatMap(result => {
                switch (result.code) {
                    case ItemClipboardResultCode.Success:
                        return this.evaluateDialog.open(result.point, result.item, settings, language);
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
