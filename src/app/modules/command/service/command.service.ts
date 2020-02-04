import { Injectable } from '@angular/core';
import { ClipboardService, KeyboardService } from '@app/service';
import { Subject } from 'rxjs';
import { delay, map, tap, throttleTime } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CommandService {
    private readonly command$ = new Subject<string>();

    constructor(
        private readonly clipboard: ClipboardService,
        private readonly keyboard: KeyboardService) {
        this.init();
    }

    public command(command: string): void {
        this.command$.next(command);
    }

    private init(): void {
        this.command$.pipe(
            throttleTime(350),
            map(command => {
                const text = this.clipboard.readText();
                this.clipboard.writeText(command);
                this.keyboard.setKeyboardDelay(5);
                this.keyboard.keyTap('enter');
                this.keyboard.keyTap('v', ['control']);
                this.keyboard.keyTap('enter');
                return text;
            }),
            delay(200),
            tap(text => {
                this.clipboard.writeText(text);
            })
        ).subscribe();
    }


}
