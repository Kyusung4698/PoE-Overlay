import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Rectangle } from '@app/type';
import { Remote } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    private readonly electron: Remote;

    constructor(
        electronProvider: ElectronProvider) {
        this.electron = electronProvider.provideRemote();
    }

    public getBounds(): Rectangle {
        const bounds = this.electron.getCurrentWindow().getBounds();
        return bounds;
    }

    public quit(): void{
        this.electron.app.quit();
    }

    public open(url: string): void {
        const BrowserWindow = this.electron.BrowserWindow;
        const win = new BrowserWindow({
            center: true,
            modal: true,
            parent: this.electron.getCurrentWindow(),
            autoHideMenuBar: true,
            width: 1000,
            height: 800
        });
        win.loadURL(url);
    }

    public disableInput(): void {
        this.electron.getCurrentWindow().setIgnoreMouseEvents(true, {
            forward: true
        });
    }

    public enableInput(): void {
        this.electron.getCurrentWindow().setIgnoreMouseEvents(false);
    }
}
