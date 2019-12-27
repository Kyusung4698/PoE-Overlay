import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClipboardService, WindowService, KeyboardService, MouseService } from '@app/service';
import { Point } from '@app/type';
import { ItemParserService } from '@shared/module/poe';
import { Item } from '@shared/module/poe/type';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
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
        private readonly input: WindowService) {
    }

    public evaluate(): Observable<void> {
        // TODO: service
        
        let item: Item;
        let point: Point;
        try {
            point = this.mouse.getCursorScreenPoint();
            this.keyboard.keyTap('c', ['control']);

            const text = this.clipboard.readText();
            item = this.itemParser.parse(text);
        } catch (e) {
            return of(null);
        }

        if (!item) {
            return of(null);
        }

        this.input.enableInput();
        return this.dialog.open(EvaluateDialogComponent, {
            position: {
                left: `${point.x}px`,
                top: `${point.y}px`,                
            },
            backdropClass: 'backdrop-clear',
            data: item,
        }).afterClosed().pipe(
            tap(() => {
                if (this.dialog.openDialogs.length === 0) {
                    this.input.disableInput();
                }
            })
        );
    }
}
