import { Injectable } from '@angular/core';
import { SnackBarService } from '@shared/module/material/service';
import { ItemClipboardResultCode, ItemClipboardService } from '@shared/module/poe/service';
import { ItemCategory, ItemSection } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { MapUserSettings } from '../component/map-settings/map-settings.component';
import { MapDialogService } from './map-dialog.service';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    constructor(
        private readonly itemClipboard: ItemClipboardService,
        private readonly snackbar: SnackBarService,
        private readonly dialogService: MapDialogService) {
    }

    public info(settings: MapUserSettings): Observable<void> {
        const result = this.itemClipboard.copy({
            [ItemSection.Rartiy]: true,
            [ItemSection.ItemLevel]: true,
            [ItemSection.Properties]: true,
            [ItemSection.Stats]: true,
        });
        switch (result.code) {
            case ItemClipboardResultCode.Success:
                if (result.item.category !== ItemCategory.Map) {
                    return this.snackbar.warning('Item was not a map.');
                }
                return this.dialogService.open(result.point, result.item, settings);
            case ItemClipboardResultCode.Empty:
                return this.snackbar.warning('Clipboard text was empty. Make sure the game is focused.');
            case ItemClipboardResultCode.ParserError:
                return this.snackbar.warning('Copied item could not be parsed. Make sure you have the correct language selected.');
            case ItemClipboardResultCode.Error:
                return this.snackbar.error('An unexpected error occured while parsing the item.');
        }
    }
}
