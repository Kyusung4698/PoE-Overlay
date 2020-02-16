import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Point } from '@app/type';
import { BrowserWindow, IpcRenderer, Screen } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class MouseService {
    private readonly screen: Screen;
    private readonly window: BrowserWindow;
    private readonly ipcRenderer: IpcRenderer;

    constructor(
        electronProvider: ElectronProvider) {
        const remote = electronProvider.provideRemote();
        this.screen = remote.screen;
        this.window = remote.getCurrentWindow();
        this.ipcRenderer = electronProvider.provideIpcRenderer();
    }

    public click(button: 'left' | 'right' | 'middle', position?: Point): void {
        this.ipcRenderer.sendSync('click-at', button, position);
    }

    public position(raw: boolean = false): Point {
        if (raw) {
            return this.ipcRenderer.sendSync('mouse-pos');
        }

        const { zoomFactor } = this.window.webContents;
        const point = this.screen.getCursorScreenPoint();
        point.x *= 1 / zoomFactor;
        point.y *= 1 / zoomFactor;
        return point;
    }
}
