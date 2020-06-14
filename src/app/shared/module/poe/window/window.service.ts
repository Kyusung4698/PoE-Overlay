import { Injectable } from '@angular/core';

const GAME_HEIGHT_TO_WINDOW_WIDTH_RATIO = 8 / 13;

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    public calculateWidth(gameHeight: number): number {
        const width = Math.ceil(gameHeight * GAME_HEIGHT_TO_WINDOW_WIDTH_RATIO);
        return width;
    }
}
