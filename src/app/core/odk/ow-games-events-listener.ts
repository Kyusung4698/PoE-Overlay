import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, mergeMap, retryWhen } from 'rxjs/operators';
import { OWGamesEvents } from './ow-games-events';
import { InfoUpdatesEvent, NewGameEvents } from './ow-types';

const REQUIRED_FEATURES_RETRY_COUNT = 10;
const REQUIRED_FEATURES_RETRY_DELAY = 1000 * 3;

export interface OWGamesEventListenerDelegate {
    onInfoUpdates(event: InfoUpdatesEvent): void;
    onNewEvents(event: NewGameEvents): void;
}

export class OWGamesEventsListener {
    constructor(
        private readonly delegate: OWGamesEventListenerDelegate,
        private readonly requiredFeatures: string[]) { }

    public start(passive: boolean): Observable<boolean> {
        this.unregisterEvents();
        this.registerEvents();
        if (passive) {
            return of(true);
        }
        return this.setRequiredFeatures();
    }

    public stop(): void {
        this.unregisterEvents();
    }

    private setRequiredFeatures(): Observable<boolean> {
        return of(null).pipe(
            mergeMap(() => OWGamesEvents.setRequiredFeatures(this.requiredFeatures)),
            retryWhen(errors => errors.pipe(
                mergeMap((error, count) => {
                    if (error !== 'Provider did not set features yet.'
                        && count >= REQUIRED_FEATURES_RETRY_COUNT) {
                        return throwError(error);
                    }
                    return of(error).pipe(
                        delay(REQUIRED_FEATURES_RETRY_DELAY)
                    );
                })
            )),
            map(features => !!features?.length),
            catchError(error => {
                console.error(`Could not set required features: ${JSON.stringify(this.requiredFeatures)}, `
                    + `error: ${error?.message ?? JSON.stringify(error)}`);
                return of(false);
            })
        );
    }

    private onInfoUpdates = (event: InfoUpdatesEvent): void => {
        this.delegate.onInfoUpdates(event);
    }

    private onNewEvents = (event: NewGameEvents): void => {
        this.delegate.onNewEvents(event);
    }

    private registerEvents(): void {
        overwolf.games.events.onInfoUpdates2.addListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.addListener(this.onNewEvents);
    }

    private unregisterEvents(): void {
        overwolf.games.events.onInfoUpdates2.removeListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.removeListener(this.onNewEvents);
    }
}
