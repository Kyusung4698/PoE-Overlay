import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Remote } from 'electron';
import { Observable, Subject } from 'rxjs';
import { Dialog, DialogRefService, DialogType } from './dialog/dialog-ref.service';

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

    public retrieve(url: string): Observable<void> {
        const BrowserWindow = this.electron.BrowserWindow;
        const parent = this.electron.getCurrentWindow();
        const subject = new Subject<void>();
        const win = new BrowserWindow({
            parent,
            show: false
        });
        win.webContents.once('did-finish-load', () => {
            subject.next();
            subject.complete();
            win.close();
        });
        win.loadURL(url);
        return subject;
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

            const dialog: Dialog = {
                close: win.close.bind(win),
                type: DialogType.Browser
            };

            parent.setEnabled(false);
            this.dialogRef.add(dialog);
            win.on('minimize', () => {
                parent.setEnabled(true);
                this.dialogRef.remove(dialog);
            });
            const restore = () => {
                parent.setEnabled(false);
                this.dialogRef.remove(dialog);
                this.dialogRef.add(dialog);
            };
            win.on('restore', () => restore());
            win.on('maximize', () => restore());
            win.once('closed', () => {
                parent.setEnabled(true);
                this.dialogRef.remove(dialog);
            });
            win.once('ready-to-show', () => {
                win.webContents.zoomFactor = parent.webContents.zoomFactor;
                win.show();
            });
            win.loadURL(url);
        }
    }
}
