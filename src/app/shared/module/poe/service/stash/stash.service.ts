import { Injectable } from '@angular/core';
import { GameService, WindowService } from '@app/service';
import { ClipboardService, KeyboardService, KeyCode, MouseService } from '@app/service/input';
import { Point } from '@app/type';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Currency } from '../../type';

export enum StashNavigationDirection {
    Left,
    Right
}

export enum StashPriceTagType {
    Exact = '~price',
    Negotiable = '~b/o'
}

const GAME_HEIGHT_TO_STASH_WIDTH_RATIO = 1.622;

export interface StashPriceTag {
    amount: number;
    currency: Currency;
    type?: StashPriceTagType;
    count?: number;
}

@Injectable({
    providedIn: 'root'
})
export class StashService {
    constructor(
        private readonly game: GameService,
        private readonly keyboard: KeyboardService,
        private readonly mouse: MouseService,
        private readonly window: WindowService,
        private readonly clipboard: ClipboardService) {
    }

    public hovering(point?: Point): boolean {
        point = point || this.mouse.position();
        const gameBounds = this.window.getBounds();

        const stashWidth = Math.round(gameBounds.height / GAME_HEIGHT_TO_STASH_WIDTH_RATIO);
        const relativePointX = point.x - gameBounds.x;

        return relativePointX >= 0 && relativePointX <= stashWidth;
    }

    public highlight(term: string): Observable<void> {
        const text = this.clipboard.readText();
        this.clipboard.writeText(`"${term}"`);

        this.keyboard.setKeyboardDelay(1);
        this.keyboard.keyToggle(KeyCode.VK_LMENU, false);
        this.keyboard.keyToggle(KeyCode.VK_RMENU, false);

        this.keyboard.setKeyboardDelay(15);
        return of(null).pipe(
            tap(() => this.keyboard.keyTap(KeyCode.VK_KEY_F, ['control'])),
            delay(175),
            tap(() => this.keyboard.keyTap(KeyCode.VK_KEY_V, ['control'])),
            delay(75),
            tap(() => this.clipboard.writeText(text))
        );
    }

    public navigate(dir: StashNavigationDirection): void {
        this.keyboard.setKeyboardDelay(5);
        this.keyboard.keyTap(dir === StashNavigationDirection.Left ? KeyCode.VK_LEFT : KeyCode.VK_RIGHT);
    }

    public copyPrice(tag: StashPriceTag): void {
        this.clipboard.writeText(`${tag.type} ${(tag.count ? `${tag.amount}/${tag.count}` : tag.amount)} ${tag.currency.id}`);
    }

    public tagPrice(tag: StashPriceTag, point: Point): Observable<void> {
        const text = this.clipboard.readText();
        this.copyPrice(tag);
        return of(null).pipe(
            tap(() => this.game.forceActive()),
            tap(() => this.mouse.click('right', point)),
            delay(100),
            tap(() => {
                this.keyboard.setKeyboardDelay(5);
                this.keyboard.keyTap(KeyCode.VK_KEY_V, ['control']);
            }),
            delay(50),
            tap(() => {
                this.keyboard.setKeyboardDelay(5);
                this.keyboard.keyTap(KeyCode.VK_RETURN);
            }),
            delay(75),
            tap(() => this.clipboard.writeText(text)),
        );
    }
}
