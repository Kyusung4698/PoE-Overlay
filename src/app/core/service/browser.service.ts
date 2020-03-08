import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Remote } from 'electron';
import { DialogRefService } from './dialog/dialog-ref.service';

@Injectable({
    providedIn: 'root'
})
export class BrowserService {
    private readonly electron: Remote;

    constructor(
        private readonly dialogRef: DialogRefService,
        electronProvider: ElectronProvider) {
        this.electron = electronProvider.provideRemote();
    }

    public open(url: string, external: boolean = false): void {
        if (external) {
            this.electron.shell.openExternal(url);
        } else {
            const parent = this.electron.getCurrentWindow();
            const [width, height] = parent.getSize();

            const BrowserWindow = this.electron.BrowserWindow;
            const win = new BrowserWindow({
                center: true,
                parent,
                autoHideMenuBar: true,
                width: Math.round(Math.min(height * 1.3, width * 0.7)),
                height: Math.round(height * 0.7),
                backgroundColor: '#0F0F0F',
                show: false
            });

            const close = win.close.bind(win);

            parent.setEnabled(false);
            this.dialogRef.add(close);
            win.on('minimize', () => {
                parent.setEnabled(true);
                this.dialogRef.remove(close);
            });
            const restore = () => {
                parent.setEnabled(false);
                this.dialogRef.remove(close);
                this.dialogRef.add(close);
            };
            win.on('restore', () => restore());
            win.on('maximize', () => restore());
            win.once('closed', () => {
                parent.setEnabled(true);
                this.dialogRef.remove(close);
            });
            win.once('ready-to-show', () => {
                win.webContents.zoomFactor = parent.webContents.zoomFactor;
                win.show();
            });
            win.loadURL(url);
        }
    }
}
