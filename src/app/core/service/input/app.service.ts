import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { VisibleFlag } from '@app/type/app.type';
import { IpcRenderer, Remote } from 'electron';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { DialogsService } from './dialogs.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private readonly electron: Remote;
    private readonly ipcRenderer: IpcRenderer;
    private readonly activeChange$ = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly ngZone: NgZone,
        private readonly dialogs: DialogsService,
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
            this.dialogs.dialogCountChange()
        ]).pipe(
            map(([game, dialogCount]) => {
                let result = VisibleFlag.None;
                if (game) {
                    result |= VisibleFlag.Game;
                }
                if (dialogCount > 0) {
                    result |= VisibleFlag.Dialog;
                }
                return result;
            }),
            debounceTime(250));
    }

    public triggerVisibleChange(): void {
        this.activeChange$.next(this.activeChange$.value);
    }

    public quit(): void {
        this.electron.app.quit();
    }
}
