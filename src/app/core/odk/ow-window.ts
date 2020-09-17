import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

type WindowInfo = overwolf.windows.WindowInfo;
type WindowIdResultCallback = overwolf.CallbackFunction<overwolf.windows.WindowIdResult>;

function resultCallback(
    resolve: () => void,
    reject: (reason?: any) => void): WindowIdResultCallback {
    return result => {
        if (result.success) {
            resolve();
        } else {
            reject(result.error);
        }
    };
}

export enum WindowState {
    Closed = 'closed',
    Maximized = 'maximized',
    Minimized = 'minimized',
    Hidden = 'hidden',
    Normal = 'normal'
}

export class OWWindow {
    constructor(private name?: string) { }

    public assureObtained(): Observable<void> {
        return this.obtain().pipe(map(() => null));
    }

    public minimize(): Observable<void> {
        return this.obtain().pipe(
            mergeMap(window => this.minimizeInternal(window.id))
        );
    }

    public maximize(): Observable<void> {
        return this.obtain().pipe(
            mergeMap(window => this.maximizeInternal(window.id))
        );
    }

    public restore(): Observable<void> {
        return this.obtain().pipe(
            mergeMap(window => this.restoreInternal(window.id))
        );
    }

    public close(): Observable<void> {
        return this.obtain().pipe(
            mergeMap(window => this.closeInternal(window.id))
        );
    }

    public toggle(close: boolean = false): Observable<boolean> {
        return this.obtain().pipe(
            mergeMap(window => this.getStateInternal(window.id)),
            mergeMap(state => {
                if (state === WindowState.Closed || state === WindowState.Minimized) {
                    return this.restore().pipe(map(() => true));
                }
                return (close ? this.close() : this.minimize()).pipe(
                    map(() => false));
            })
        );
    }

    public dragMove(): void {
        overwolf.windows.dragMove(this.name);
    }

    public changeSize(width: number, height: number): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.changeSize(this.name, width, height, result => {
                if (result.success) {
                    resolve();
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }

    public changePosition(left: number, top: number): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.changePosition(this.name, left, top, result => {
                if (result.success) {
                    resolve();
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }

    public bringToFront(grabFocus = false): Observable<void> {
        return this.obtain().pipe(
            mergeMap(window => this.bringToFrontInternal(window.id, grabFocus))
        );
    }

    public sendToBack(): Observable<void> {
        return this.obtain().pipe(
            mergeMap(window => this.sendToBackInternal(window.id))
        );
    }

    public getState(): Observable<WindowState> {
        return this.obtain().pipe(
            mergeMap(window => this.getStateInternal(window.id))
        );
    }

    private obtain(): Observable<WindowInfo> {
        const promise = new Promise<WindowInfo>((resolve, reject) => {
            const process = (result: overwolf.windows.WindowResult): void => {
                if (result.success && result.window) {
                    this.name = result.window.name;
                    resolve(result.window);
                } else {
                    reject(result.error);
                }
            };
            if (this.name) {
                overwolf.windows.obtainDeclaredWindow(this.name, process);
            } else {
                overwolf.windows.getCurrentWindow(process);
            }
        });
        return from(promise);
    }

    private minimizeInternal(id: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.minimize(id, resultCallback(resolve, reject));
        });
        return from(promise);
    }

    private maximizeInternal(id: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.maximize(id, resultCallback(resolve, reject));
        });
        return from(promise);
    }

    private restoreInternal(id: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.restore(id, resultCallback(resolve, reject));
        });
        return from(promise);
    }

    private closeInternal(id: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.close(id, resultCallback(resolve, reject));
        });
        return from(promise);
    }

    private bringToFrontInternal(id: string, grabFocus: boolean): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.bringToFront(id, grabFocus, resultCallback(resolve, reject));
        });
        return from(promise);
    }

    private sendToBackInternal(id: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.windows.sendToBack(id, resultCallback(resolve, reject));
        });
        return from(promise);
    }

    private getStateInternal(id: string): Observable<WindowState> {
        const promise = new Promise<WindowState>((resolve, reject) => {
            overwolf.windows.getWindowState(id, result => {
                if (result.success) {
                    resolve(result.window_state as WindowState);
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }
}
