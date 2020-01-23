import { Injectable } from '@angular/core';
import { ClipboardService, KeyboardService, MouseService, WindowService } from '@app/service';
import { SnackBarService } from '@shared/module/material/service';
import { ItemClipboardResultCode, ItemClipboardService } from '@shared/module/poe/service';
import { ItemSection } from '@shared/module/poe/type';
import { Subject } from 'rxjs';
import { filter, flatMap, map, throttleTime } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StashService {
    private readonly navigateCommandQueue$ = new Subject<string>();
    private readonly highlightCommandQueue$ = new Subject<void>();

    constructor(
        private readonly keyboard: KeyboardService,
        private readonly mouse: MouseService,
        private readonly window: WindowService,
        private readonly clipboard: ClipboardService,
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
            throttleTime(150),
            flatMap(() => this.itemClipboard.copy({
                [ItemSection.Rartiy]: true
            })),
            map(result => {
                switch (result.code) {
                    case ItemClipboardResultCode.Success:
                        return result.item.type;
                    case ItemClipboardResultCode.ParserError:
                        this.snackbar.warning('Clipboard could not be parsed. Make sure you have cleared (ESC) the previous highlight.');
                        break;
                    default:
                        break;
                }
                return null;
            }), filter(value => (value || '').length > 0), map(value => {
                this.clipboard.writeText(`"${value}"`);
                this.keyboard.setKeyboardDelay(5);
                this.keyboard.keyTap('v', ['control']);
            })).subscribe();
    }

    private initNavigateQueue(): void {
        this.navigateCommandQueue$.pipe(
            throttleTime(10),
            filter(() => {
                const gameBounds = this.window.getBounds();
                const stashWidth = gameBounds.width / 2.88;
                const point = this.mouse.getCursorScreenPoint();
                const relativePointX = point.x - gameBounds.x;
                return relativePointX > stashWidth;
            })
        ).subscribe(command => {
            this.keyboard.setKeyboardDelay(5);
            switch (command) {
                case 'stash-left':
                    this.keyboard.keyTap('left');
                    break;
                case 'stash-right':
                    this.keyboard.keyTap('right');
                    break;
                default:
                    break;
            }
        });
    }
}
