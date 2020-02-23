import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WindowService } from '@app/service';
import { DialogsService } from '@app/service/input/dialogs.service';
import { Point } from '@app/type';
import { Item } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MapDialogComponent, MapDialogData } from '../component/map-dialog/map-dialog.component';
import { MapUserSettings } from '../component/map-settings/map-settings.component';

// TODO: base class for common logic

@Injectable({
    providedIn: 'root'
})
export class MapDialogService {
    constructor(
        private readonly dialog: MatDialog,
        private readonly window: WindowService,
        private readonly dialogs: DialogsService) {
    }

    public open(point: Point, item: Item, settings: MapUserSettings): Observable<void> {
        const width = 250;
        const avgHeight = 300;

        const bounds = this.window.getBounds();
        const local = this.window.convertToLocal(point);
        const left = Math.min(Math.max(local.x - width * 0.5, bounds.x), bounds.x + bounds.width - width);
        const top = Math.min(Math.max(local.y - avgHeight * 0.5, bounds.y), bounds.y + bounds.height - avgHeight);

        const data: MapDialogData = {
            item,
            settings
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
        this.dialogs.add(close);
        return dialogRef.afterClosed().pipe(tap(() => {
            if (this.dialog.openDialogs.length === 0) {
                this.window.disableInput();
            }
            this.dialogs.remove(close);
        }));
    }
}
