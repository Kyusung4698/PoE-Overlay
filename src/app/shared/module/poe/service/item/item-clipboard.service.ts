import { Injectable } from '@angular/core';
import { ClipboardService, KeyboardService, MouseService } from '@app/service';
import { Point } from '@app/type';
import { Item } from '../../type';
import { ItemParserService } from './parser/item-parser.service';

export enum ItemClipboardResultCode {
    Success,
    Empty,
    ParserError,
    Error
}

export class ItemClipboardResult {
    code: ItemClipboardResultCode;
    item?: Item;
    point?: Point;
}

@Injectable({
    providedIn: 'root'
})
export class ItemClipboardService {
    constructor(
        private readonly mouse: MouseService,
        private readonly keyboard: KeyboardService,
        private readonly clipboard: ClipboardService,
        private readonly itemParser: ItemParserService) { }

    public copy(sections?: {
        [section: number]: boolean
    }): ItemClipboardResult {
        let point: Point;
        let item: Item;
        try {
            point = this.mouse.getCursorScreenPoint();
            this.keyboard.setKeyboardDelay(50);
            this.keyboard.keyTap('c', ['control']);

            const text = this.clipboard.readText() || '';
            this.clipboard.writeText('');
            if (text.length <= 0) {
                return { code: ItemClipboardResultCode.Empty };
            }

            item = this.itemParser.parse(text, sections);
        } catch (e) {
            return { code: ItemClipboardResultCode.Error };
        }

        if (!item) {
            return { code: ItemClipboardResultCode.ParserError };
        }

        return {
            code: ItemClipboardResultCode.Success,
            item,
            point
        };
    }
}
