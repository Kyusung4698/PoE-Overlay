import { ItemClipboardResultCode, ItemClipboardService, StashService } from '@shared/module/poe/service';
import { SnackBarService } from '@shared/module/material/service';
import { ForumTradeUserSettings } from '@modules/forum-trade/component';
import { catchError, flatMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ForumTradeService {
  constructor(
    private readonly stash: StashService,
    private readonly item: ItemClipboardService,
    private readonly snackBar: SnackBarService
  ) {
  }

  public setPrice(settings: ForumTradeUserSettings): Observable<void> {
    return this.item.copy().pipe(
      flatMap(({code, point, item}) => {
        switch (code) {
          case ItemClipboardResultCode.Empty:
            return this.snackBar.warning('clipboard.empty');

          case ItemClipboardResultCode.ParserError:
            return this.snackBar.warning('clipboard.parser-error');

          case ItemClipboardResultCode.Success:
            if (!this.stash.hovering(point)) return this.snackBar.warning('evaluate.tag.outside-stash');

            // todo
            break;

          default:
            return throwError(`code '${code}' out of range`)
        }
      }),
      catchError(() => {
        return this.snackBar.error('clipboard.error')
      })
    )
  }
}
