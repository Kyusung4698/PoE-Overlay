import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Remote } from 'electron';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShortcutService {
    private readonly electron: Remote;

    constructor(
        private readonly ngZone: NgZone,
        electronProvider: ElectronProvider) {
        this.electron = electronProvider.provideRemote();
    }

    public register(shortcut: string): Observable<void> {
        const callback = new Subject<void>();
        this.electron.globalShortcut.register(shortcut, () => {
            this.ngZone.run(() => callback.next());
        });
        return callback;
    }

    public unregister(shortcut: string): void {
        this.electron.globalShortcut.unregister(shortcut);
    }

    public unregisterAll(): void {
        this.electron.globalShortcut.unregisterAll();
    }
}
