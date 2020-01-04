import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Rectangle } from '@app/type';
import { IpcRenderer, Remote } from 'electron';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    private readonly electron: Remote;
    private readonly ipcRenderer: IpcRenderer;

    constructor(
        electronProvider: ElectronProvider) {
        this.electron = electronProvider.provideRemote();
        this.ipcRenderer = electronProvider.provideIpcRenderer();
    }

    public getBounds(): Rectangle {
        const bounds = this.electron.getCurrentWindow().getBounds();
        return bounds;
    }

    public close(): void {
        return this.electron.getCurrentWindow().close();
    }

    public quit(): void {
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
            height: 800,
            backgroundColor: '#0F0F0F'
        });
        win.loadURL(url);
    }

    public openRoute(route: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            this.ipcRenderer.send('open-route', route);

            this.ipcRenderer.once('open-route-reply', (_, result) => {
                if (result === 'closed') {
                    resolve();
                } else {
                    reject(result);
                }
            });
        });
        return from(promise);
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
