import { Injectable } from '@angular/core';
import { SnackBarService } from '@shared/module/material/service';
import { ItemClipboardResultCode, ItemClipboardService, StashNavigationDirection, StashService } from '@shared/module/poe/service';
import { ItemSection } from '@shared/module/poe/type';
import { Subject } from 'rxjs';
import { filter, flatMap, map, throttleTime } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MiscStashService {
    private readonly navigateCommandQueue$ = new Subject<string>();
    private readonly highlightCommandQueue$ = new Subject<void>();

    constructor(
        private readonly stash: StashService,
        private readonly itemClipboard: ItemClipboardService,
        private readonly snackbar: SnackBarService) {
        this.init();
    }

    public navigate(command: 'stash-left' | 'stash-right'): void {
        this.navigateCommandQueue$.next(command);
    }

    public highlight(): void {
        this.highlightCommandQueue$.next();
    }

    private init(): void {
        this.initNavigateQueue();
        this.initHighlightQueue();
    }

    private initHighlightQueue(): void {
        this.highlightCommandQueue$.pipe(
            throttleTime(500),
            flatMap(() => this.itemClipboard.copy({
                [ItemSection.Rartiy]: true
            })),
            map(result => {
                switch (result.code) {
                    case ItemClipboardResultCode.Success:
                        return result.item.type;
                    case ItemClipboardResultCode.ParserError:
                        this.snackbar.warning('misc.parser-error');
                        break;
                    default:
                        break;
                }
                return null;
            }),
            filter(value => (value || '').length > 0),
            flatMap(value => this.stash.highlight(value))
        ).subscribe();
    }

    private initNavigateQueue(): void {
        this.navigateCommandQueue$.pipe(
            throttleTime(10),
            filter(() => !this.stash.hovering())
        ).subscribe(command => {
            switch (command) {
                case 'stash-left':
                    return this.stash.navigate(StashNavigationDirection.Left);
                case 'stash-right':
                    return this.stash.navigate(StashNavigationDirection.Right);
                default:
                    break;
            }
        });
    }
}
