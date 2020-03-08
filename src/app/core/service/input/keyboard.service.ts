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

    public setKeyboardDelay(delay: number): void {
        this.ipcRenderer.sendSync('set-keyboard-delay', delay);
    }

    public keyTap(key: string, modifiers: string[] = []): void {
        this.ipcRenderer.sendSync('key-tap', key, modifiers);
    }

    public keyToggle(key: string, down: boolean, modifiers: string[] = []): void {
        this.ipcRenderer.sendSync('key-toggle', key, down ? 'down' : 'up', modifiers);
    }
}
