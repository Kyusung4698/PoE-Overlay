import { Injectable } from '@angular/core';
import { KeyboardService } from '@app/service';
import { BehaviorSubject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ToolService {
    private readonly command$ = new BehaviorSubject<string>('');

    constructor(
        private readonly keyboard: KeyboardService) {
        this.init();
    }

    public command(command: string): void {
        this.command$.next(command);
    }

    private init(): void {
        this.command$.pipe(
            throttleTime(25)
        ).subscribe(command => {
            this.keyboard.setKeyboardDelay(5);
            switch (command) {
                case 'storage-left':
                    this.keyboard.keyTap('left');
                    break;
                case 'storage-right':
                    this.keyboard.keyTap('right');
                    break;
                default:
                    break;
            }
        });
    }
}
