import { from, Observable } from 'rxjs';
import { mergeMap, shareReplay } from 'rxjs/operators';

interface Result {
    success: boolean;
    error?: string;
}

interface GetFromClipboardResult extends Result {
    content?: string;
}

interface ClipboardExtension {
    placeOnClipboard: (content: string, callback: (result: Result) => void) => void;
    getFromClipboard: (callback: (result: GetFromClipboardResult) => void) => void;
}

export class OWClipboard {
    private static extension$: Observable<ClipboardExtension>;

    public static placeOnClipboard(content: string): Observable<void> {
        return this.getExtension().pipe(
            mergeMap(extension => {
                const promise = new Promise<void>((resolve, reject) => {
                    extension.placeOnClipboard(content, result => {
                        if (result.success) {
                            resolve();
                        } else {
                            reject(result.error);
                        }
                    });
                });
                return from(promise);
            })
        );
    }

    public static getFromClipboard(): Observable<string> {
        return this.getExtension().pipe(
            mergeMap(extension => {
                const promise = new Promise<string>((resolve, reject) => {
                    extension.getFromClipboard(result => {
                        if (result.success) {
                            resolve(result.content);
                        } else {
                            reject(result.error);
                        }
                    });
                });
                return from(promise);
            })
        );
    }

    private static getExtension(): Observable<ClipboardExtension> {
        if (!this.extension$) {
            const promise = new Promise<ClipboardExtension>((resolve, reject) => {
                overwolf.extensions.current.getExtraObject('clipboard-plugin', result => {
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
