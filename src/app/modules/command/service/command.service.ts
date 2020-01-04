import { Injectable } from '@angular/core';
import { ClipboardService, KeyboardService } from '@app/service';

@Injectable({
    providedIn: 'root'
})
export class CommandService {

    constructor(
        private readonly clipboard: ClipboardService,
        private readonly keyboard: KeyboardService) { }

    public command(command: string): void {
        this.keyboard.setKeyboardDelay(5);
        this.keyboard.keyTap('enter');
        this.clipboard.writeText(command);
        this.keyboard.keyTap('v', ['control']);
        this.keyboard.keyTap('enter');
    }
}
