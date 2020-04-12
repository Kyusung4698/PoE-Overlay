import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { BrowserWindow, IpcRenderer } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private readonly ipcRenderer: IpcRenderer;
    private readonly window: BrowserWindow;

    constructor(
        electronProvider: ElectronProvider) {
        this.ipcRenderer = electronProvider.provideIpcRenderer();

        const electron = electronProvider.provideRemote();
        this.window = electron.getCurrentWindow();
    }

    public focus(): void {
        this.window.setAlwaysOnTop(false);
        this.window.setVisibleOnAllWorkspaces(false);

        this.ipcRenderer.sendSync('game-focus');

        this.window.setAlwaysOnTop(true, 'pop-up-menu', 1);
        this.window.setVisibleOnAllWorkspaces(true);
    }
}