import { Injectable } from '@angular/core';

const GAME_HEIGHT_TO_WINDOW_WIDTH_RATIO = 8 / 13;

// 1/1 = 1
// 2/1 = 2
// 3/2 = 1.5
// 5/3 = 1.6666666666666667
// 8/5 = 1.6
// 13/8 = 1.625
// 60/37 = 1.6216216216216217
// 73/45 = 1.6222222222222222
// 133/82 = 1.6219512195121952
// 339/209 = 1.6220095693779903
// 811/500 = 1.622

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    public calculateWidth(gameHeight: number): number {
        const width = Math.ceil(gameHeight * GAME_HEIGHT_TO_WINDOW_WIDTH_RATIO);
        console.log(width, gameHeight);
        return width;
    }
}
