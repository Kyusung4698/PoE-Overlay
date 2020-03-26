import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider/electron.provider';
import { IpcRenderer } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    private readonly ipcRenderer: IpcRenderer;

    constructor(
        electronProvider: ElectronProvider) {
        this.ipcRenderer = electronProvider.provideIpcRenderer();
    }

    public info(message: string, ...args: any[]): void {
        this.ipcRenderer.sendSync('log', 'info', message, ...args);
    }

    public warn(message: string, ...args: any[]): void {
        this.ipcRenderer.sendSync('log', 'warn', message, ...args);
    }

    public error(message: string, ...args: any[]): void {
        this.ipcRenderer.sendSync('log', 'error', message, ...args);
    }
}