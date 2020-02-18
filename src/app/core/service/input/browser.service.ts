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
            const parent = this.electron.getCurrentWindow();

            const BrowserWindow = this.electron.BrowserWindow;
            const win = new BrowserWindow({
                center: true,
                parent,
                autoHideMenuBar: true,
                width: 1400,
                height: 800,
                backgroundColor: '#0F0F0F',
                show: false
            });

            const close = win.close.bind(win);

            parent.setEnabled(false);
            this.dialogs.add(close);
            win.on('minimize', () => {
                parent.setEnabled(true);
                this.dialogs.remove(close);
            });
            const restore = () => {
                parent.setEnabled(false);
                this.dialogs.remove(close);
                this.dialogs.add(close);
            };
            win.on('restore', () => restore());
            win.on('maximize', () => restore());
            win.once('closed', () => {
                parent.setEnabled(true);
                this.dialogs.remove(close);
            });
            win.once('ready-to-show', () => {
                win.webContents.zoomFactor = parent.webContents.zoomFactor;
                win.show();
            });
            win.loadURL(url);
        }
    }
}
