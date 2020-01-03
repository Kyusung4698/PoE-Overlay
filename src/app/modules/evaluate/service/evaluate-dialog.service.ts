import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WindowService } from '@app/service';
import { Point } from '@app/type';
import { Item, Language } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EvaluateDialogComponent, EvaluateDialogData } from '../component/evaluate-dialog/evaluate-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class EvaluateDialogService {
    constructor(
        private readonly dialog: MatDialog,
        private readonly window: WindowService) {
    }

    public open(point: Point, item: Item, language?: Language): Observable<void> {
        const width = 300;
        const avgHeight = 200;

        const bounds = this.window.getBounds();
        const left = Math.min(Math.max(point.x - width * 0.5, bounds.x), bounds.x + bounds.width - width);
        const top = Math.min(Math.max(point.y - avgHeight * 0.5, bounds.y), bounds.y + bounds.height - avgHeight);

        const data: EvaluateDialogData = {
            item,
            language
        };

        this.window.enableInput();
        return this.dialog.open(EvaluateDialogComponent, {
            position: {
                left: `${left}px`,
                top: `${top}px`,
            },
            backdropClass: 'backdrop-clear',
            data,
            width: `${width}px`,
        }).afterClosed().pipe(
            tap(() => {
                if (this.dialog.openDialogs.length === 0) {
                    this.window.disableInput();
                }
            })
        );
    }
}
