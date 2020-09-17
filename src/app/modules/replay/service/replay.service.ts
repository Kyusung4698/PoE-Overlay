import { Injectable } from '@angular/core';
import { OWGames, OWReplay } from '@app/odk';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ReplayWindowService } from './replay-window.service';

@Injectable({
    providedIn: 'root'
})
export class ReplayService {
    private started = false;

    constructor(private readonly window: ReplayWindowService) { }

    public start(): Observable<boolean> {
        if (this.started) {
            return of(false);
        }
        this.started = true;
        return this.turnOn().pipe(
            map(() => true),
            catchError(error => {
                this.started = false;
                return throwError(error);
            })
        );
    }

    public stop(): Observable<boolean> {
        if (!this.started) {
            return of(false);
        }
        this.started = false;
        return this.turnOff().pipe(
            map(() => true),
            catchError(error => {
                this.started = true;
                return throwError(error);
            })
        );
    }

    public capture(pastDuration: number, futureDuration: number): Observable<void> {
        return OWReplay.capture(
            Math.max(pastDuration * 1000, 1),
            Math.max(futureDuration * 1000, 1)
        ).pipe(
            mergeMap(url => OWGames.getRunningGameInfo().pipe(
                mergeMap(({ width, height }) => this.window.open({
                    url,
                    gameWidth: width,
                    gameHeight: height
                }))
            ))
        );
    }

    private turnOn(): Observable<void> {
        const settings = {
            highlights: {
                enable: false,
                requiredHighlights: null
            },
            settings: {
                video: {
                    buffer_length: 15 * 1000
                },
                audio: {
                    mic: {
                        enable: false
                    },
                    game: {
                        enable: true,
                        volume: 100
                    }
                },
                peripherals: {
                    capture_mouse_cursor: 'gameOnly'
                },
                max_quota_gb: 2
            }
        };
        return OWReplay.turnOn(settings);
    }

    private turnOff(): Observable<void> {
        return OWReplay.turnOff();
    }
}
