import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WindowService } from '@app/service';
import { DialogsService } from '@app/service/input/dialogs.service';
import { Point } from '@app/type';
import { Item, Language } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EvaluateDialogComponent, EvaluateDialogData } from '../component/evaluate-dialog/evaluate-dialog.component';
import { EvaluateUserSettings } from '../component/evaluate-settings/evaluate-settings.component';

@Injectable({
    providedIn: 'root'
})
export class EvaluateDialogService {
    constructor(
        private readonly dialog: MatDialog,
        private readonly window: WindowService,
        private readonly dialogs: DialogsService) {
    }

    public open(point: Point, item: Item, settings: EvaluateUserSettings, language?: Language): Observable<void> {
        const width = 400;
        const avgHeight = 500;

        const bounds = this.window.getBounds();
        const left = Math.min(Math.max(point.x - width * 0.5, bounds.x), bounds.x + bounds.width - width);
        const top = Math.min(Math.max(point.y - avgHeight * 0.5, bounds.y), bounds.y + bounds.height - avgHeight);

        const data: EvaluateDialogData = {
            item,
            settings,
            language,
        };

        this.window.enableInput();
        const dialogRef = this.dialog.open(EvaluateDialogComponent, {
            position: {
                left: `${left}px`,
                top: `${top}px`,
            },
            backdropClass: 'backdrop-clear',
            data
        });
        const close = dialogRef.close.bind(dialogRef);
        this.dialogs.add(close);
        return dialogRef.afterClosed().pipe(tap(() => {
            if (this.dialog.openDialogs.length === 0) {
                this.window.disableInput();
            }
            this.dialogs.remove(close);
        }));
    }
}
