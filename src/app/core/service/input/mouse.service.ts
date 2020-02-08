import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Point } from '@app/type';
import { IpcRenderer, Remote } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class MouseService {
    private readonly electron: Remote;
    private readonly ipcRenderer: IpcRenderer;

    constructor(
        electronProvider: ElectronProvider) {
        this.electron = electronProvider.provideRemote();
        this.ipcRenderer = electronProvider.provideIpcRenderer();
    }

    public click(button: 'left' | 'right' | 'middle', position?: Point): void {
        this.ipcRenderer.sendSync('click-at', button, position);
    }

    public position(raw: boolean = false): Point {
        return raw
            ? this.ipcRenderer.sendSync('mouse-pos')
            : this.electron.screen.getCursorScreenPoint();
    }
}
