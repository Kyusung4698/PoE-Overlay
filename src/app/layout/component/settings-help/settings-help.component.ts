import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-settings-help',
    templateUrl: './settings-help.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsHelpComponent {
    // constructor(private readonly browser: BrowserService) { }

    public openUrl(url: string): void {
        alert(url);
    }
}
