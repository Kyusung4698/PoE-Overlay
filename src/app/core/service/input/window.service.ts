import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Rectangle } from '@app/type';
import { Remote } from 'electron';
import { Observable, Subject } from 'rxjs';
import { DialogShortcutService } from './dialog-shortcut.service';

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    private readonly electron: Remote;

    constructor(
        private readonly ngZone: NgZone,
        private readonly dialogShortcut: DialogShortcutService,
        electronProvider: ElectronProvider) {
        this.electron = electronProvider.provideRemote();
    }

    public on(event: 'show'): Observable<void> {
        const window = this.electron.getCurrentWindow();
        const callback = new Subject<void>();
        window.on(event, () => {
            this.ngZone.run(() => callback.next());
        });

        return callback;
    }

    public removeAllListeners(): void {
        const window = this.electron.getCurrentWindow();
        window.removeAllListeners();
    }

    public getBounds(): Rectangle {
        const bounds = this.electron.getCurrentWindow().getBounds();
        return bounds;
    }

    public hide(): void {
        this.electron.getCurrentWindow().hide();
    }

    public close(): void {
        this.electron.getCurrentWindow().close();
    }

    public quit(): void {
        this.electron.app.quit();
    }

    public open(url: string, external: boolean = false): void {
        if (external) {
            this.electron.shell.openExternal(url);
        } else {
            const BrowserWindow = this.electron.BrowserWindow;
            const win = new BrowserWindow({
                center: true,
                modal: true,
                parent: this.electron.getCurrentWindow(),
                autoHideMenuBar: true,
                width: 1000,
                height: 800,
                backgroundColor: '#0F0F0F'
            });
            const close = win.close.bind(win);
            this.dialogShortcut.register(close);
            win.once('closed', () => this.dialogShortcut.unregister(close));
            win.loadURL(url);
        }
    }

    public disableInput(): void {
        const window = this.electron.getCurrentWindow();
        window.setIgnoreMouseEvents(true);
    }

    public enableInput(): void {
        const window = this.electron.getCurrentWindow();
        window.setIgnoreMouseEvents(false);
    }
}
