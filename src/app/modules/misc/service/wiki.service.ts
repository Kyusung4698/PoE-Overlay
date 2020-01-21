import { Injectable } from '@angular/core';
import { WindowService } from '@app/service';
import { environment } from '@env/environment';
import { SnackBarService } from '@shared/module/material/service';
import { ItemClipboardResultCode, ItemClipboardService } from '@shared/module/poe/service';
import { ItemService } from '@shared/module/poe/service/item/item.service';
import { ItemSection, Language } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class WikiService {

    constructor(
        private readonly itemClipboard: ItemClipboardService,
        private readonly itemService: ItemService,
        private readonly window: WindowService,
        private readonly snackbar: SnackBarService) {
    }

    public open(external: boolean): void {
        const result = this.itemClipboard.copy({
            [ItemSection.Rartiy]: true
        });
        switch (result.code) {
            case ItemClipboardResultCode.Success:
                let search = this.itemService.getName(result.item.nameId, Language.English) || '';
                if (search.length === 0) {
                    search = this.itemService.getType(result.item.typeId, Language.English);
                }
                this.window.open(`${environment.wiki.baseUrl}/index.php?search=${encodeURIComponent(search)}`, external);
                break;
            case ItemClipboardResultCode.Empty:
                this.snackbar.warning('Clipboard text was empty. Make sure the game is focused.');
                break;
            case ItemClipboardResultCode.ParserError:
                this.snackbar.warning('Copied item could not be parsed. Make sure you have the correct language selected.');
                break;
            case ItemClipboardResultCode.Error:
                this.snackbar.error('An unexpected error occured while parsing the item.');
                break;
        }
    }
}
