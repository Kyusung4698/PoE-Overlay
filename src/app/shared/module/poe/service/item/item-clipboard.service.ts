import { Injectable } from '@angular/core';
import { ClipboardService, KeyboardService, MouseService } from '@app/service';
import { Point } from '@app/type';
import { iif, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, flatMap, map, retryWhen, tap } from 'rxjs/operators';
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
                const point = this.mouse.position();
                this.keyboard.setKeyboardDelay(1);
                this.keyboard.keyToggle('c', false, ['alt']);
                this.keyboard.setKeyboardDelay(25);
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
                        concatMap((error, retry) => iif(() => retry >= 8,
                            throwError(error),
                            of(error).pipe(delay(25))))
                    )),
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
