import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClipboardService, KeyboardService, MouseService, WindowService } from '@app/service';
import { Point } from '@app/type';
import { SnackBarService } from '@shared/module/material/service';
import { ItemParserService, ItemTranslatorService } from '@shared/module/poe/service';
import { Item, Language } from '@shared/module/poe/type';
import { Observable, of } from 'rxjs';
import { catchError, flatMap, tap } from 'rxjs/operators';
import { EvaluateDialogComponent } from '../component/evaluate-dialog/evaluate-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class EvaluateService {
    constructor(
        private readonly dialog: MatDialog,
        private readonly mouse: MouseService,
        private readonly keyboard: KeyboardService,
        private readonly clipboard: ClipboardService,
        private readonly itemParser: ItemParserService,
        private readonly itemTranslator: ItemTranslatorService,
        private readonly window: WindowService,
        private readonly snackbar: SnackBarService) {
    }

    public evaluate(language?: Language): Observable<void> {
        let item: Item;
        let point: Point;
        try {
            point = this.mouse.getCursorScreenPoint();
            this.keyboard.keyTap('c', ['control']);

            const text = this.clipboard.readText();
            item = this.itemParser.parse(text);
        } catch (e) {
            return this.snackbar.error('An unexpected error occured while parsing the item.');
        }

        if (!item) {
            return this.snackbar.warning('Could not parse the copied text into a item.');
        }

        return (language
            ? this.itemTranslator.translate(item, language)
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
