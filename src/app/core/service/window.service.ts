import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Rectangle } from '@app/type';
import { BrowserWindow, Point } from 'electron';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    private readonly window: BrowserWindow;

    constructor(
        private readonly ngZone: NgZone,
        electronProvider: ElectronProvider) {
        const electron = electronProvider.provideRemote();
        this.window = electron.getCurrentWindow();
    }

    public on(event: 'show'): Observable<void> {
        const callback = new Subject<void>();
        this.window.on(event, () => {
            this.ngZone.run(() => callback.next());
        });
        return callback;
    }

    public removeAllListeners(): void {
        this.window.removeAllListeners();
    }

    public getBounds(): Rectangle {
        const bounds = this.window.getBounds();
        return bounds;
    }

    public hide(): void {
        this.window.hide();
    }

    public show(): void {
        this.window.show();
    }

    public close(): void {
        this.window.close();
    }

    public getZoom(): number {
        return this.window.webContents.zoomFactor;
    }

    public setZoom(zoom: number): void {
        this.window.webContents.zoomFactor = zoom;
    }

    public disableInput(): void {
        this.window.setIgnoreMouseEvents(true);
    }

    public enableInput(): void {
        this.window.setIgnoreMouseEvents(false);
    }

    public convertToLocal(point: Point): Point {
        const bounds = this.window.getBounds();
        const local = {
            ...point
        };
        local.x -= bounds.x;
        local.x = Math.min(Math.max(local.x, 0), bounds.width);
        local.y -= bounds.y;
        local.y = Math.min(Math.max(local.y, 0), bounds.height);
        return local;
    }

    public convertToLocalScaled(local: Point): Point{
        const point = {
            ...local
        };

        const { zoomFactor } = this.window.webContents;
        point.x *= 1 / zoomFactor;
        point.y *= 1 / zoomFactor;
        return point;
    }
}
