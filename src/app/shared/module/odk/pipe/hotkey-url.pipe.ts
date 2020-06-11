import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
    name: 'hotkeyUrl'
})
export class HotkeyUrlPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) { }

    public transform(value: string): SafeUrl {
        const url = `overwolf://settings/games-overlay?hotkey=${encodeURIComponent(value)}`;
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }
}
