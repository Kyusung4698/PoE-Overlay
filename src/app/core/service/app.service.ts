import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { VisibleFlag } from '@app/type/app.type';
import { IpcRenderer, Remote } from 'electron';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogRefService } from './dialog/dialog-ref.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private readonly electron: Remote;
    private readonly ipcRenderer: IpcRenderer;
    private readonly activeChange$ = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly ngZone: NgZone,
        private readonly dialogRef: DialogRefService,
        electronProvider: ElectronProvider) {
        this.electron = electronProvider.provideRemote();
        this.ipcRenderer = electronProvider.provideIpcRenderer();
    }

    public visibleChange(): Observable<VisibleFlag> {
        this.ipcRenderer.on('active-change', (event, arg) => {
            this.ngZone.run(() => this.activeChange$.next(arg));
        });
        this.ipcRenderer.sendSync('register-active-change');
        return combineLatest([
            this.activeChange$,
            this.dialogRef.dialogCountChange()
        ]).pipe(map(([game, dialogCount]) => {
            let result = VisibleFlag.None;
            if (game) {
                result |= VisibleFlag.Game;
            }
            if (dialogCount > 0) {
                result |= VisibleFlag.Dialog;
            }
            return result;
        }));
    }

    public triggerVisibleChange(): void {
        this.activeChange$.next(this.activeChange$.value);
    }

    public version(): string {
        return this.electron.app.getVersion();
    }

    public quit(): void {
        this.electron.app.quit();
    }

    /**
     * Electron's suggested way of relaunching the application.
     *
     * https://www.electronjs.org/docs/api/app#apprelaunchoptions
     */
    public relaunch(): void {
        this.electron.app.relaunch();
        this.electron.app.quit();
    }
}
