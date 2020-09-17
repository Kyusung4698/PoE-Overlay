import { from, Observable, Subject } from 'rxjs';
import { map, mergeMap, shareReplay } from 'rxjs/operators';

interface Result {
    success: boolean;
    error?: string;
}

interface MouseWheelBlockedEvent {
    wheelUp: boolean;
    wheelDown: boolean;
    controlPressed: boolean;
    shiftPressed: boolean;
}

interface MouseWheelOptions {
    windowInfo: {
        winClassname: string;
        winTitle: string;
    };
    inputInfo: {
        wheelUp: boolean;
        wheelDown: boolean;
        controlPressed: boolean;
        shiftPressed: boolean;
    };
}

interface MouseWheelExtension {
    setOptions: (options: MouseWheelOptions, callback: (result: Result) => void) => void;
    sendKey: (virtualKeyCode: number, callback: (result: Result) => void) => void;
    start: (callback: (result: Result) => void) => void;
    stop: () => void;
    onMouseWheelBlocked: {
        addListener: (callback: (event: MouseWheelBlockedEvent) => void) => void;
    };
}

export class OWMouseWheel {
    private static extension$: Observable<MouseWheelExtension>;
    private static onMouseWheelBlocked$: Observable<MouseWheelBlockedEvent>;

    public static setOptions(options: MouseWheelOptions): Observable<void> {
        return this.getExtension().pipe(
            mergeMap(extension => {
                const promise = new Promise<void>((resolve, reject) => {
                    extension.setOptions(options, ({ success, error }) => {
                        if (success) {
                            resolve();
                        } else {
                            reject(error);
                        }
                    });
                });
                return from(promise);
            })
        );
    }

    public static start(): Observable<void> {
        return this.getExtension().pipe(
            mergeMap(extension => {
                const promise = new Promise<void>((resolve, reject) => {
                    extension.start(({ success, error }) => {
                        if (success) {
                            resolve();
                        } else {
                            reject(error);
                        }
                    });
                });
                return from(promise);
            })
        );
    }

    public static stop(): Observable<void> {
        return this.getExtension().pipe(
            map(extension => extension.stop())
        );
    }

    public static onMouseWheelBlocked(): Observable<MouseWheelBlockedEvent> {
        if (!this.onMouseWheelBlocked$) {
            this.onMouseWheelBlocked$ = this.getExtension().pipe(
                mergeMap(extension => {
                    const subject = new Subject<MouseWheelBlockedEvent>();
                    extension.onMouseWheelBlocked.addListener(event => {
                        subject.next(event);
                    });
                    return subject;
                }),
                shareReplay(1)
            );
        }
        return this.onMouseWheelBlocked$;
    }

    private static getExtension(): Observable<MouseWheelExtension> {
        if (!this.extension$) {
            const promise = new Promise<MouseWheelExtension>((resolve, reject) => {
                overwolf.extensions.current.getExtraObject('mousewheel-plugin', result => {
                    if (result.success) {
                        resolve(result.object);
                    } else {
                        reject(result.error);
                    }
                });
            });
            this.extension$ = from(promise).pipe(
                shareReplay(1)
            );
        }
        return this.extension$;
    }
}
