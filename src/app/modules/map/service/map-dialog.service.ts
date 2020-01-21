import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WindowService } from '@app/service';
import { DialogShortcutService } from '@app/service/input/dialog-shortcut.service';
import { Point } from '@app/type';
import { Item } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MapDialogComponent, MapDialogData } from '../component/map-dialog/map-dialog.component';

// TODO: base class for common logic

@Injectable({
    providedIn: 'root'
})
export class MapDialogService {
    constructor(
        private readonly dialog: MatDialog,
        private readonly window: WindowService,
        private readonly dialogShortcut: DialogShortcutService) {
    }

    public open(point: Point, item: Item): Observable<void> {
        const width = 250;
        const avgHeight = 300;

        const bounds = this.window.getBounds();
        const left = Math.min(Math.max(point.x - width * 0.5, bounds.x), bounds.x + bounds.width - width);
        const top = Math.min(Math.max(point.y - avgHeight * 0.5, bounds.y), bounds.y + bounds.height - avgHeight);

        const data: MapDialogData = {
            item
        };

        this.window.enableInput();
        const dialogRef = this.dialog.open(MapDialogComponent, {
            position: {
                left: `${left}px`,
                top: `${top}px`,
            },
            backdropClass: 'backdrop-clear',
            data
        });
        const close = dialogRef.close.bind(dialogRef);
        this.dialogShortcut.register(close);
        return dialogRef.afterClosed().pipe(tap(() => {
            if (this.dialog.openDialogs.length === 0) {
                this.window.disableInput();
            }
            this.dialogShortcut.unregister(close);
        }));
    }
}
