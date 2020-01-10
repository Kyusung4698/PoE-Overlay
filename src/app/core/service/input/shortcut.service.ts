import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { IpcRenderer } from 'electron';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShortcutService {
    private readonly ipcRenderer: IpcRenderer;

    constructor(
        private readonly ngZone: NgZone,
        electronProvider: ElectronProvider) {
          this.ipcRenderer = electronProvider.provideIpcRenderer();
    }

    public register(shortcut: string): Observable<void> {
        const callback = new Subject<void>();

        this.ipcRenderer.on('shortcut-' + shortcut, (event, arg) => {
            this.ngZone.run(() => callback.next());
        });
        this.ipcRenderer.sendSync('register-shortcut', shortcut);

        return callback;
    }

    public unregister(shortcut: string): void {
        // this.electron.globalShortcut.unregister(shortcut);
    }

    public unregisterAll(): void {
        // this.electron.globalShortcut.unregisterAll();
    }
}
