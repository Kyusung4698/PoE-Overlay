import { from, Observable } from 'rxjs';
import { MessageBoxParams, WindowInfo } from './ow-types';

interface ConfirmedEvent {
    success: boolean;
    confirmed: boolean;
    error: string;
}

export class OWWindows {
    public static getCurrentWindow(): Observable<WindowInfo> {
        const promise = new Promise<WindowInfo>((resolve, reject) => {
            overwolf.windows.getCurrentWindow(result => {
                if (result?.success) {
                    resolve(result.window);
                } else {
                    reject(`Could not get current window. reason: ${result.error ?? JSON.stringify(result)}.`);
                }
            });
        });
        return from(promise);
    }

    public static displayMessageBox(params: MessageBoxParams): Observable<boolean> {
        const promise = new Promise<boolean>((resolve, reject) => {
            overwolf.windows.displayMessageBox(params, e => {
                const event = e as any as ConfirmedEvent;
                if (event.success) {
                    resolve(event.confirmed);
                } else {
                    reject(event.error);
                }
            });
        });
        return from(promise);
    }

    public static getMainWindow(): Window {
        return overwolf.windows.getMainWindow();
    }
}
