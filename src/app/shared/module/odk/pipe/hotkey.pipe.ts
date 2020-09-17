import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { OnChangedEvent, OWHotkeys } from '@app/odk';

@Pipe({
    name: 'hotkey',
    pure: false
})
export class HotkeyPipe implements PipeTransform, OnDestroy {
    private binding: string;
    private name: string;

    constructor(private ref: ChangeDetectorRef) { }

    public ngOnDestroy(): void {
        OWHotkeys.onChanged.removeListener(this.onChange);
    }

    public transform(name: string): string {
        if (name === this.name) {
            return this.binding;
        }
        this.name = name;

        OWHotkeys.getHotkeyText(this.name).subscribe(text => {
            this.updateText(text);
        });
        OWHotkeys.onChanged.removeListener(this.onChange);
        OWHotkeys.onChanged.addListener(this.onChange);

        return this.binding;
    }

    private onChange = (event: OnChangedEvent) => {
        if (event.name === this.name && this.binding !== event.binding) {
            this.updateText(event.binding);
        }
    }

    private updateText(text: string): void {
        this.binding = text;
        this.ref.markForCheck();
    }
}
