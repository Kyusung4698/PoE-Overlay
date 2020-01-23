import { Injectable } from '@angular/core';
import { ClipboardService, KeyboardService, MouseService } from '@app/service';
import { Point } from '@app/type';
import { Observable, of, throwError } from 'rxjs';
import { delay, flatMap, map, retryWhen, take, tap, catchError, concatMap } from 'rxjs/operators';
import { Item } from '../../type';
import { ItemParserService } from './parser/item-parser.service';

export enum ItemClipboardResultCode {
    Success,
    Empty,
    ParserError
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
    }): Observable<ItemClipboardResult> {
        return of(null).pipe(
            flatMap(() => {
                const point = this.mouse.getCursorScreenPoint();
                this.keyboard.setKeyboardDelay(5);
                this.keyboard.keyTap('c', ['control']);

                return of(null).pipe(
                    flatMap(() => {
                        const text = this.clipboard.readText() || '';
                        if (text.length <= 0) {
                            return throwError('empty');
                        }
                        return of(text);
                    }),
                    retryWhen(errors => errors.pipe(
                        delay(25),
                        take(6),
                        concatMap(() => throwError('empty')))),
                    catchError(() => of('')),
                    tap(() => this.clipboard.writeText('')),
                    map(text => {
                        if (text.length <= 0) {
                            return { code: ItemClipboardResultCode.Empty };
                        }

                        const item = this.itemParser.parse(text, sections);
                        if (!item) {
                            return { code: ItemClipboardResultCode.ParserError };
                        }

                        return {
                            code: ItemClipboardResultCode.Success,
                            item,
                            point
                        };
                    })
                );
            })
        );
    }
}
