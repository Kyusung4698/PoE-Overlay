import { from, Observable } from 'rxjs';

export class OWGamesEvents {
    public static getInfo<TInfo>(): Observable<TInfo> {
        const promise = new Promise<TInfo>((resolve, reject) => {
            overwolf.games.events.getInfo(result => {
                if (result.success) {
                    resolve(result.res as TInfo);
                } else {
                    reject(result.error || (result as any).reason);
                }
            });
        });
        return from(promise);
    }

    public static setRequiredFeatures(features: string[]): Observable<string[]> {
        const promise = new Promise<string[]>((resolve, reject) => {
            overwolf.games.events.setRequiredFeatures(features, result => {
                if (result.success) {
                    resolve(result.supportedFeatures);
                } else {
                    reject(result.error || (result as any).reason);
                }
            });
        });
        return from(promise);
    }
}
