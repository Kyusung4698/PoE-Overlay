import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WindowService } from '@app/service';
import { Point } from '@app/type';
import { SnackBarService } from '@shared/module/material/service';
import { ItemTranslatorService } from '@shared/module/poe/service';
import { Item, Language } from '@shared/module/poe/type';
import { Observable, of } from 'rxjs';
import { catchError, flatMap, tap } from 'rxjs/operators';
import { EvaluateDialogComponent } from '../component/evaluate-dialog/evaluate-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class EvaluateDialogService {
    constructor(
        private readonly dialog: MatDialog,
        private readonly translator: ItemTranslatorService,
        private readonly window: WindowService,
        private readonly snackbar: SnackBarService) {
    }

    public open(item: Item, point: Point, language?: Language): Observable<void> {
        return (language
            ? this.translator.translate(item, language)
            : of(item)).pipe(
                flatMap(data => {
                    const width = 300;
                    const avgHeight = 200;

                    const bounds = this.window.getBounds();
                    const left = Math.min(Math.max(point.x - width * 0.5, bounds.x), bounds.x + bounds.width - width);
                    const top = Math.min(Math.max(point.y - avgHeight * 0.5, bounds.y), bounds.y + bounds.height - avgHeight);

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
                }),
                catchError(() => {
                    return this.snackbar.warning('Could not translate the copied item.');
                })
            );
    }
}
