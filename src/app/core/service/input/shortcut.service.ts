import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { VisibleFlag } from '@app/type/app.type';
import { IpcRenderer, Remote } from 'electron';
import { Observable, Subject } from 'rxjs';

export interface Shortcut {
    accelerator: string;
    passive: boolean;
    active: VisibleFlag;
    callback: Subject<void>;
}

@Injectable({
    providedIn: 'root'
})
export class ShortcutService {
    private readonly ipcRenderer: IpcRenderer;
    private readonly remote: Remote;
    private readonly shortcuts: Shortcut[] = [];

    constructor(
        private readonly ngZone: NgZone,
        electronProvider: ElectronProvider) {
        this.ipcRenderer = electronProvider.provideIpcRenderer();

        this.remote = electronProvider.provideRemote();
    }

    public add(accelerator: string, passive: boolean = false, active: VisibleFlag = VisibleFlag.Game): Observable<void> {
        this.remove(accelerator);

        const shortcut: Shortcut = {
            accelerator,
            passive,
            active,
            callback: new Subject<void>(),
        };
        this.shortcuts.push(shortcut);

        return shortcut.callback;
    }

    public remove(accelerator: string): void {
        const index = this.shortcuts.findIndex(x => x.accelerator === accelerator);
        const shortcut = this.shortcuts[index];
        if (shortcut) {
            this.unregisterShortcut(shortcut);
            this.shortcuts.splice(index, 1);
        }
    }

    public check(flag: VisibleFlag): void {
        this.shortcuts.forEach(shortcut => {
            this.unregisterShortcut(shortcut);
            if ((flag & shortcut.active) === shortcut.active) {
                this.registerShortcut(shortcut);
            }
        });
    }

    public reset(): void {
        while (this.shortcuts.length > 0) {
            const shortcut = this.shortcuts.pop();
            this.unregisterShortcut(shortcut);
        }
    }

    private registerShortcut(shortcut: Shortcut): void {
        if (shortcut.passive) {
            this.ipcRenderer.on(`shortcut-${shortcut.accelerator}`, () => {
                this.ngZone.run(() => shortcut.callback.next());
            });
            this.ipcRenderer.sendSync('register-shortcut', shortcut.accelerator);
        } else {
            this.remote.globalShortcut.register(shortcut.accelerator, () => {
                this.ngZone.run(() => shortcut.callback.next());
            });
        }
    }

    private unregisterShortcut(shortcut: Shortcut): void {
        if (shortcut.passive) {
            this.ipcRenderer.removeAllListeners(`shortcut-${shortcut.accelerator}`);
            this.ipcRenderer.sendSync('unregister-shortcut', shortcut.accelerator);
        } else {
            this.remote.globalShortcut.unregister(shortcut.accelerator);
        }
    }
}
