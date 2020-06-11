import { Injectable } from '@angular/core';
import { WindowName } from '@app/config';
import { OWGames, OWWindow } from '@app/odk';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MarketWindowService {
    private readonly window: OWWindow;

    constructor() {
        this.window = new OWWindow(WindowName.Market);
    }

    public toggle(): Observable<void> {
        return this.window.toggle().pipe(
            flatMap(visible => {
                if (!visible) {
                    return of(null);
                }
                return OWGames.getRunningGameInfo().pipe(
                    flatMap(({ height }) => {
                        const width = Math.round(height / 1.622);
                        return this.window.changeSize(width * 2, height).pipe(
                            flatMap(() => this.window.changePosition(0, 0))
                        );
                    })
                );
            })
        );
    }
}
