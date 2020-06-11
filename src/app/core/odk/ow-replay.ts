import { from, Observable } from 'rxjs';

export class OWReplay {
    public static turnOn(settings: any): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.media.replays.turnOn(settings, result => {
                if (result.success) {
                    resolve();
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }

    public static turnOff(): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.media.replays.turnOff(result => {
                if (result.success) {
                    resolve();
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }

    public static getHighlightsFeatures(gameId: number): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.media.replays.getHighlightsFeatures(gameId, result => {
                console.log(result);
                if (result.success) {
                    resolve();
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }

    public static capture(pastDuration: number, futureDuration: number): Observable<string> {
        const promise = new Promise<string>((resolve, reject) => {
            overwolf.media.replays.capture(pastDuration, futureDuration, result => {
                console.log('finished', result);
                if (result.success) {
                    resolve(result.url);
                } else {
                    reject(result.error);
                }
            }, result => {
                console.log('called', result, pastDuration, futureDuration);
                if (!result.success) {
                    reject(result);
                }
            });
        });
        return from(promise);
    }
}
