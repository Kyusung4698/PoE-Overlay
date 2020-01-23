import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Remote } from 'electron';
import { DialogsService } from './dialogs.service';

@Injectable({
    providedIn: 'root'
})
export class BrowserService {
    private readonly electron: Remote;

    constructor(
        private readonly dialogs: DialogsService,
        electronProvider: ElectronProvider) {
        this.electron = electronProvider.provideRemote();
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
            this.dialogs.add(close);
            win.once('closed', () => this.dialogs.remove(close));
            win.loadURL(url);
        }
    }
}
