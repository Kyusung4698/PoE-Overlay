import { Injectable } from '@angular/core';
import { NotificationService } from '@app/notification';
import { OWMouseWheel } from '@app/odk';
import { ItemClipboardResultCode, ItemClipboardService } from '@shared/module/poe/item/clipboard';
import { ItemSectionType } from '@shared/module/poe/item/clipboard/section-parser';
import { StashService } from '@shared/module/poe/stash';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MiscStashService {
    private inverse = false;
    private subscription: Subscription;

    constructor(
        private readonly stash: StashService,
        private readonly itemClipboard: ItemClipboardService,
        private readonly notification: NotificationService
    ) {
    }

    public start(): Observable<void> {
        return OWMouseWheel.setOptions({
            windowInfo: {
                winClassname: 'POEWindowClass',
                winTitle: 'Path of Exile'
            },
            inputInfo: {
                controlPressed: true,
                shiftPressed: false,
                wheelDown: true,
                wheelUp: true
            }
        }).pipe(
            mergeMap(() => OWMouseWheel.start()),
            tap(() => {
                if (this.subscription) {
                    this.subscription.unsubscribe();
                }
                this.subscription = OWMouseWheel.onMouseWheelBlocked().subscribe(event => {
                    if (event.controlPressed) {
                        if (event.wheelUp) {
                            this.stash.navigate(
                                !this.inverse ? 'left' : 'right'
                            );
                        }
                        if (event.wheelDown) {
                            this.stash.navigate(
                                !this.inverse ? 'right' : 'left'
                            );
                        }
                    }
                });
            })
        );
    }

    public stop(): Observable<void> {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        return OWMouseWheel.stop();
    }

    public setDirection(inverse: boolean): void {
        this.inverse = inverse;
    }

    public highlight(): Observable<void> {
        return this.itemClipboard.copy({
            [ItemSectionType.Rartiy]: true
        }).pipe(
            mergeMap(({ code, item }) => {
                switch (code) {
                    case ItemClipboardResultCode.Success:
                        if (item.type?.length) {
                            this.stash.highlight(item.type);
                        }
                        break;
                    case ItemClipboardResultCode.Empty:
                        this.notification.show('clipboard.empty');
                        break;
                    case ItemClipboardResultCode.ParserError:
                        this.notification.show('clipboard.parser-error');
                        break;
                    default:
                        return throwError(`code: '${code}' out of range`);
                }
                return of(null);
            })
        );
    }
}
