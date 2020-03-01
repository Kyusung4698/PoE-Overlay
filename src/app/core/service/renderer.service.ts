import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { IpcRenderer } from 'electron';
import { from, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RendererService {
    private readonly ipcRenderer: IpcRenderer;

    constructor(
        private readonly ngZone: NgZone,
        electronProvider: ElectronProvider) {
        this.ipcRenderer = electronProvider.provideIpcRenderer();
    }

    public on(event: string): Observable<void> {
        const callback = new Subject<void>();
        this.ipcRenderer.on(event, () => {
            this.ngZone.run(() => callback.next());
        });
        return callback;
    }

    public open(route: string): Observable<void> {
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
}
