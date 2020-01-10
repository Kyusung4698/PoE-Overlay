import { Injectable } from '@angular/core';
import { KeyboardService } from '@app/service';

@Injectable({
    providedIn: 'root'
})
export class ToolService {

    constructor(
        private readonly keyboard: KeyboardService) { }

    public command(command: string): void {
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
    }
}
