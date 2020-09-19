import { APP_UID } from '@app/config';
import { from, Observable } from 'rxjs';
import { SystemInfo } from './ow-types';

export class OWUtils {
    public static sendKeyStroke(key: string): void {
        overwolf.utils.sendKeyStroke(key);
    }

    public static openUrl(url: string, external: boolean): void {
        if (external) {
            return this.openUrlInDefaultBrowser(url);
        }
        return this.openUrlInOverwolfBrowser(url);
    }

    public static openSubscriptionPage(): void {
        overwolf.utils.openStore({
            page: overwolf.utils.enums.eStorePage.SubscriptionPage,
            uid: APP_UID
        });
    }

    public static openUrlInOverwolfBrowser(url: string): void {
        overwolf.utils.openUrlInOverwolfBrowser(url);
    }

    public static openUrlInDefaultBrowser(url: string): void {
        // TODO: Update types
        (overwolf.utils.openUrlInDefaultBrowser as any)(url, {
            skip_in_game_notification: true
        });
    }

    public static getSystemInformation(): Observable<SystemInfo> {
        const promise = new Promise<SystemInfo>((resolve, reject) => {
            overwolf.utils.getSystemInformation(result => {
                if (result.success) {
                    resolve(result.systemInfo);
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }
}
