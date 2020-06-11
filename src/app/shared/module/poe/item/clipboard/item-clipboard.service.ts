import { Injectable } from '@angular/core';
import { OWUtils } from '@app/odk/ow-utils';
import { iif, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, flatMap, map, retryWhen, tap } from 'rxjs/operators';
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
            flatMap(() => OWUtils.getFromClipboard()),
            catchError(() => of('')),
            tap(() => OWUtils.placeOnClipboard('')),
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
