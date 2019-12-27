import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Remote } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    private readonly electron: Remote;

    constructor(
        electronProvider: ElectronProvider) {
        this.electron = electronProvider.provideRemote();
    }

    public alwaysTop(): void {
        this.electron.getCurrentWindow().setAlwaysOnTop(true);
    }

    public disableInput(): void {
        this.electron.getCurrentWindow().setIgnoreMouseEvents(true, {
            forward: true
        });
    }

    public enableInput(): void {
        this.electron.getCurrentWindow().setIgnoreMouseEvents(false);
    }
}
