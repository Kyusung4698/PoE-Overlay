import { from, Observable } from 'rxjs';

export class OWHotkeys {
    public static onChanged = overwolf.settings.hotkeys.onChanged;
    public static onPressed = overwolf.settings.hotkeys.onPressed;

    public static getHotkeyText(hotkeyId: string): Observable<string> {
        const promise = new Promise<string>(resolve => {
            overwolf.settings.getHotKey(hotkeyId, result => {
                if (!result || !result.success || !result.hotkey) {
                    resolve('unassigned');
                }
                resolve(result.hotkey);
            });
        });
        return from(promise);
    }
}
