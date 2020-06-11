import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { HotKeyChangedEvent, OWHotkeys } from '@app/odk';

@Pipe({
    name: 'hotkey',
    pure: false
})
export class HotkeyPipe implements PipeTransform, OnDestroy {
    private text: string;
    private hotkey: string;

    constructor(private ref: ChangeDetectorRef) { }

    public ngOnDestroy(): void {
        OWHotkeys.onChanged.removeListener(this.onChange);
    }

    public transform(hotkey: string): string {
        if (hotkey === this.hotkey) {
            return this.text;
        }
        this.hotkey = hotkey;

        OWHotkeys.getHotkeyText(this.hotkey).subscribe(text => {
            this.updateText(text);
        });
        OWHotkeys.onChanged.removeListener(this.onChange);
        OWHotkeys.onChanged.addListener(this.onChange);

        return this.text;
    }

    private onChange = (event: HotKeyChangedEvent) => {
        if (event.source === this.hotkey && this.text !== event.hotkey) {
            this.updateText(event.hotkey);
        }
    }

    private updateText(text: string): void {
        this.text = text;
        this.ref.markForCheck();
    }
}
