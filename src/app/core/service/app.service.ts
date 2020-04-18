import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { AppUpdateState, VisibleFlag } from '@app/type/app.type';
import { IpcRenderer, Remote } from 'electron';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogRefService, DialogType } from './dialog/dialog-ref.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private readonly electron: Remote;
    private readonly ipcRenderer: IpcRenderer;

    private readonly activeChange$ = new BehaviorSubject<boolean>(false);
    private readonly focusChange$ = new BehaviorSubject<boolean>(false);

    private readonly updateState$ = new BehaviorSubject<AppUpdateState>(AppUpdateState.None);

    constructor(
        private readonly ngZone: NgZone,
        private readonly dialogRef: DialogRefService,
        electronProvider: ElectronProvider) {
        this.electron = electronProvider.provideRemote();
        this.ipcRenderer = electronProvider.provideIpcRenderer();
    }

    public registerEvents(autoDownload: boolean): void {
        this.ipcRenderer.on('app-update-available', () => {
            this.ngZone.run(() => this.updateState$.next(AppUpdateState.Available));
        });
        this.ipcRenderer.on('app-update-downloaded', () => {
            this.ngZone.run(() => this.updateState$.next(AppUpdateState.Downloaded));
        });
        this.ipcRenderer.on('app-relaunch', () => {
            this.ngZone.run(() => this.relaunch());
        });
        this.ipcRenderer.on('app-quit', () => {
            this.ngZone.run(() => this.quit());
        });
        this.ipcRenderer.sendSync('app-download-init', autoDownload);
    }

    public updateAutoDownload(autoDownload: boolean): void {
        this.ipcRenderer.sendSync('app-download-auto', autoDownload);
    }

    public updateStateChange(): Observable<AppUpdateState> {
        return this.updateState$;
    }

    public visibleChange(): Observable<VisibleFlag> {
        this.ipcRenderer.on('game-active-change', (_, arg) => {
            this.ngZone.run(() => this.activeChange$.next(arg));
        });
        this.ipcRenderer.sendSync('game-send-active-change');

        const window = this.electron.getCurrentWindow();
        window.on('focus', () => this.ngZone.run(() => this.focusChange$.next(true)));
        window.on('blur', () => this.ngZone.run(() => this.focusChange$.next(false)));

        return combineLatest([
            this.activeChange$,
            this.focusChange$,
            this.dialogRef.dialogsChange()
        ]).pipe(map(([game, focus, dialogs]) => {
            let result = VisibleFlag.None;
            if (game) {
                result |= VisibleFlag.Game;
            }
            if (focus) {
                result |= VisibleFlag.Overlay;
            }

            if (dialogs.length > 0) {
                const dialog = dialogs[dialogs.length - 1];
                switch (dialog.type) {
                    case DialogType.Dialog:
                        result |= VisibleFlag.Dialog;
                        break;
                    case DialogType.Browser:
                        result |= VisibleFlag.Browser;
                        break;
                    default: break;
                }
            }
            return result;
        }));
    }

    public isAutoLaunchEnabled(): Observable<boolean> {
        const subject = new Subject<boolean>();
        this.ipcRenderer.once('app-auto-launch-enabled-result', (_, enabled) => {
            this.ngZone.run(() => {
                subject.next(enabled);
                subject.complete();
            });
        });
        this.ipcRenderer.send('app-auto-launch-enabled');
        return subject;
    }

    public updateAutoLaunchEnabled(enabled: boolean): Observable<boolean> {
        const subject = new Subject<boolean>();
        this.ipcRenderer.once('app-auto-launch-change-result', (_, success) => {
            this.ngZone.run(() => {
                subject.next(success);
                subject.complete();
            });
        });
        this.ipcRenderer.send('app-auto-launch-change', enabled);
        return subject;
    }

    public triggerVisibleChange(): void {
        this.activeChange$.next(this.activeChange$.value);
    }

    public version(): string {
        return this.ipcRenderer.sendSync('app-version');
    }

    public quit(): void {
        if (this.updateState$.value === AppUpdateState.Downloaded) {
            this.ipcRenderer.send('app-quit-and-install', false);
        } else {
            this.electron.app.exit();
        }
    }

    /**
     * Electron's suggested way of relaunching the application.
     *
     * https://www.electronjs.org/docs/api/app#apprelaunchoptions
     */
    public relaunch(): void {
        if (this.updateState$.value === AppUpdateState.Downloaded) {
            this.ipcRenderer.send('app-quit-and-install', true);
        } else {
            this.electron.app.relaunch();
            this.electron.app.exit();
        }
    }
}
