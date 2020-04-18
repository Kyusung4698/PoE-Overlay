import { Injectable } from '@angular/core';
import { DialogService } from '@app/service/dialog';
import { Point } from '@app/type';
import { Item } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { DialogSpawnPosition } from 'src/app/layout/type';
import { MapDialogComponent, MapDialogData } from '../component/map-dialog/map-dialog.component';
import { MapUserSettings } from '../component/map-settings/map-settings.component';

@Injectable({
    providedIn: 'root'
})
export class MapDialogService {
    constructor(
        private readonly dialog: DialogService) {
    }

    public open(point: Point, item: Item, settings: MapUserSettings): Observable<void> {
        const width = 250;
        const height = 300;

        const data: MapDialogData = {
            item,
            settings
        };

        const position = settings.dialogSpawnPosition === DialogSpawnPosition.Cursor ? point : undefined;
        return this.dialog.open(MapDialogComponent, data, {
            position, width, height
        }, settings.focusable);
    }
}
