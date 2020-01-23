import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
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

    public visibleChange(): Observable<boolean> {
        this.ipcRenderer.on('active-change', (event, arg) => {
            this.ngZone.run(() => this.activeChange$.next(arg));
        });
        this.ipcRenderer.sendSync('register-active-change');
        return combineLatest(
            this.activeChange$,
            this.dialogs.dialogCountChange()
        ).pipe(
            map(results => results[0] || results[1] > 0),
            debounceTime(250),
            distinctUntilChanged());
    }

    public quit(): void {
        this.electron.app.quit();
    }
}
