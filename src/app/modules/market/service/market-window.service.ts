import { Injectable } from '@angular/core';
import { WindowName } from '@app/config';
import { OWGames, OWWindow } from '@app/odk';
import { WindowService } from '@shared/module/poe/window';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MarketWindowService {
    private readonly window: OWWindow;

    constructor(private readonly poeWindow: WindowService) {
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
                        const width = this.poeWindow.calculateWidth(height);
                        return this.window.changeSize(width * 2, height).pipe(
                            flatMap(() => this.window.changePosition(0, 0))
                        );
                    })
                );
            })
        );
    }
}
