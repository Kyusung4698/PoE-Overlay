import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { IpcRenderer, Remote, Session } from 'electron';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private readonly electron: Remote;
    private readonly ipcRenderer: IpcRenderer;

    constructor(
        private readonly ngZone: NgZone,
        private readonly logger: LoggerService,
        electronProvider: ElectronProvider) {
        this.electron = electronProvider.provideRemote();
        this.ipcRenderer = electronProvider.provideIpcRenderer();
    }

    public registerEvents(): void {
        this.ipcRenderer.on('session-clear', () => {
            this.ngZone.run(() => this.clear().subscribe());
        });
        this.clear().subscribe();
    }

    public clear(): Observable<void> {
        const tasks = [
            this.clearCache(),
            this.clearHostResolverCache()
        ];

        return forkJoin(tasks).pipe(
            map(() => null)
        );
    }

    public clearCache(): Observable<void> {
        const session = this.getSession();
        if (!session) {
            this.logger.warn('Could not clear cache because session was null or undefined.');
            return of(null);
        }
        this.logger.info('Session cache has been cleared.');
        return from(session.clearCache());
    }

    public clearHostResolverCache(): Observable<void> {
        const session = this.getSession();
        if (!session) {
            this.logger.warn('Could not clear cache because session was null or undefined.');
            return of(null);
        }
        this.logger.info('Session host resolver cache has been cleared.');
        return from(session.clearHostResolverCache());
    }

    private getSession(): Session {
        return this.electron.session?.defaultSession;
    }
}