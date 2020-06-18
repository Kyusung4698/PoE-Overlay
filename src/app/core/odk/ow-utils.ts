import { APP_UID } from '@app/config';
import { from, Observable } from 'rxjs';
import { SystemInfo } from './ow-types';

export class OWUtils {
    public static sendKeyStroke(key: string): void {
        overwolf.utils.sendKeyStroke(key);
    }

    public static placeOnClipboard(content: string): void {
        overwolf.utils.placeOnClipboard(content);
    }

    public static getFromClipboard(): Observable<string> {
        const promise = new Promise<string>((resolve) => {
            overwolf.utils.getFromClipboard(content => {
                resolve(content);
            });
        });
        return from(promise);
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
        overwolf.utils.openUrlInDefaultBrowser(url);
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
