import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Point } from '@app/type';
import { IpcRenderer } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class MouseService {
    private readonly ipcRenderer: IpcRenderer;

    constructor(
        electronProvider: ElectronProvider) {
        this.ipcRenderer = electronProvider.provideIpcRenderer();
    }

    public click(button: 'left' | 'right' | 'middle', position?: Point): void {
        this.ipcRenderer.sendSync('click-at', button, position);
    }

    public position(): Point {
        return this.ipcRenderer.sendSync('mouse-pos');
    }
}
