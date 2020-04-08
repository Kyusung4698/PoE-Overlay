import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { IpcRenderer } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private readonly ipcRenderer: IpcRenderer;

    constructor(
        electronProvider: ElectronProvider) {
        this.ipcRenderer = electronProvider.provideIpcRenderer();
    }

    public focus(): void {
        this.ipcRenderer.sendSync('game-focus');
    }
}