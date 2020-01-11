import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Remote } from 'electron';

export type DialogCloseFn = () => void;

@Injectable({
    providedIn: 'root'
})
export class DialogShortcutService {
    private remote: Remote;
    private dialogs: DialogCloseFn[] = [];

    constructor(
        private readonly ngZone: NgZone,
        electronProvider: ElectronProvider) {
        this.remote = electronProvider.provideRemote();
    }

    public init(): void {
        this.checkShortcut();
    }

    public register(close: DialogCloseFn): void {
        this.dialogs.push(close);
        this.checkShortcut();
    }

    public unregister(close: DialogCloseFn): void {
        const index = this.dialogs.indexOf(close);
        if (index !== -1) {
            this.dialogs.splice(index, 1);
        }
        this.checkShortcut();
    }

    private checkShortcut(): void {
        if (this.dialogs.length > 0) {
            this.remote.globalShortcut.register('escape', () => {
                if (this.dialogs.length > 0) {
                    this.ngZone.run(() => this.dialogs.pop()());
                }
            });
        } else {
            this.remote.globalShortcut.unregister('escape');
        }
    }
}
