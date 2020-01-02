import { Injectable } from '@angular/core';
import { ClipboardService, KeyboardService, MouseService } from '@app/service';
import { Point } from '@app/type';
import { SnackBarService } from '@shared/module/material/service';
import { ItemParserService } from '@shared/module/poe/service';
import { Item, Language } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { EvaluateDialogService } from './evaluate-dialog.service';

@Injectable({
    providedIn: 'root'
})
export class EvaluateService {
    constructor(
        private readonly mouse: MouseService,
        private readonly keyboard: KeyboardService,
        private readonly clipboard: ClipboardService,
        private readonly itemParser: ItemParserService,
        private readonly snackbar: SnackBarService,
        private readonly evaluateDialog: EvaluateDialogService) {
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

        return this.evaluateDialog.open(item, point, language);
    }
}
