import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { IpcRenderer } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class KeyboardService {
    private readonly ipcRenderer: IpcRenderer;

    constructor(electronProvider: ElectronProvider) {
        this.ipcRenderer = electronProvider.provideIpcRenderer();
    }

    public keyTap(key: string, modifiers: string[] = []): void {
        this.ipcRenderer.sendSync('keyTap', key, modifiers);
    }
}
