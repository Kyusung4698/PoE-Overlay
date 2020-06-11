import { from, Observable } from 'rxjs';
import { RunningGameInfo } from './ow-types';

export enum OWGameClassId {
    PathOfExile = 7212,
    CSGO = 7764
}

export class OWGames {

    public static onMouseUp = overwolf.games.inputTracking.onMouseUp;

    public static getRunningGameInfo(): Observable<RunningGameInfo> {
        const promise = new Promise<RunningGameInfo>(resolve => {
            overwolf.games.getRunningGameInfo(resolve);
        });
        return from(promise);
    }

    public static classIdFromGameId(gameId: number): OWGameClassId {
        const classId = Math.floor(gameId / 10);
        return classId;
    }
}
