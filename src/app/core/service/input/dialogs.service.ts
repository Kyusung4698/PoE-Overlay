import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Remote } from 'electron';
import { BehaviorSubject, Observable } from 'rxjs';

export type DialogCloseFn = () => void;

@Injectable({
    providedIn: 'root'
})
export class DialogsService {
    private readonly remote: Remote;
    private readonly dialogs: DialogCloseFn[] = [];
    private readonly dialogCountChange$ = new BehaviorSubject<number>(0);

    constructor(
        private readonly ngZone: NgZone,
        electronProvider: ElectronProvider) {
        this.remote = electronProvider.provideRemote();
    }

    public registerShortcuts(): void {
        if (this.dialogs.length > 0) {
            this.register();
        }
    }

    public unregisterShortcuts(): void {
        this.unregister();
    }

    public dialogCountChange(): Observable<number> {
        return this.dialogCountChange$;
    }

    public add(close: DialogCloseFn): void {
        this.dialogs.push(close);
        this.check();
    }

    public remove(close: DialogCloseFn): void {
        const index = this.dialogs.indexOf(close);
        if (index !== -1) {
            this.dialogs.splice(index, 1);
        }
        this.check();
    }

    private check(): void {
        if (this.dialogs.length > 0) {
            this.register();
        } else {
            this.unregister();
        }

        if (this.dialogCountChange$.value !== this.dialogs.length) {
            this.dialogCountChange$.next(this.dialogs.length);
        }
    }

    private register(): void {
        this.remote.globalShortcut.register('escape', () => {
            if (this.dialogs.length > 0) {
                this.close();
            }
        });
        this.remote.globalShortcut.register('space', () => {
            while (this.dialogs.length > 0) {
                this.close();
            }
        });
    }

    private unregister(): void {
        this.remote.globalShortcut.unregister('escape');
        this.remote.globalShortcut.unregister('space');
    }

    private close(): void {
        this.ngZone.run(() => {
            this.dialogs.pop()();
            this.dialogCountChange$.next(this.dialogs.length);
        });
    }
}
