import { Injectable } from '@angular/core';
import { OWClipboard } from '@app/odk';
import { OWUtils } from '@app/odk/ow-utils';
import { Observable, of } from 'rxjs';
import { catchError, delay, flatMap, map } from 'rxjs/operators';
import { Item } from '../item';
import { ItemClipboardParserService } from './item-clipboard-parser.service';

export enum ItemClipboardResultCode {
    Success,
    Empty,
    ParserError
}

export interface ItemClipboardResult {
    code: ItemClipboardResultCode;
    item?: Item;
}

@Injectable({
    providedIn: 'root'
})
export class ItemClipboardService {

    constructor(private readonly itemParser: ItemClipboardParserService) { }

    public copy(parse?: {
        [section: number]: boolean
    }): Observable<ItemClipboardResult> {
        OWUtils.sendKeyStroke('Ctrl+C');
        return of(null).pipe(
            delay(150),
            flatMap(() => OWClipboard.getFromClipboard()),
            catchError(() => of('')),
            flatMap(content => OWClipboard.placeOnClipboard('').pipe(
                map(() => content)
            )),
            map(content => {
                if (!content?.length) {
                    return { code: ItemClipboardResultCode.Empty };
                }

                const item = this.itemParser.parse(content, parse);
                if (!item) {
                    return { code: ItemClipboardResultCode.ParserError };
                }

                return {
                    code: ItemClipboardResultCode.Success,
                    item
                };
            })
        );
    }
}
