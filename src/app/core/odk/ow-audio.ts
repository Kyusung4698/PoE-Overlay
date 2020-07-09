import { from, Observable } from 'rxjs';

export class OWAudio {

    public static create(url: string): Observable<string> {
        const promise = new Promise<string>((resolve, reject) => {
            overwolf.media.audio.create(url, result => {
                if (result.success) {
                    resolve(result.id);
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }

    public static play(id: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.media.audio.play(id, result => {
                if (result.success) {
                    resolve();
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }

    public static stop(id: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.media.audio.stopById(id, result => {
                if (result.success) {
                    resolve();
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }

    public static resume(id: string): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.media.audio.resumeById(id, result => {
                if (result.success) {
                    resolve();
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }

    public static setVolume(volume: number): Observable<void> {
        const promise = new Promise<void>((resolve, reject) => {
            overwolf.media.audio.setVolume(volume, result => {
                if (result.success) {
                    resolve();
                } else {
                    reject(result.error);
                }
            });
        });
        return from(promise);
    }
}
