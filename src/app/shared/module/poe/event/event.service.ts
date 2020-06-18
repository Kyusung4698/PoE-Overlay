import { Injectable } from '@angular/core';
import { OWGamesEvents } from '@app/odk';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface EventInfo {
    match_info: {
        current_zone: string;
        opened_page: string;
    };
    me: {
        character_name: string;
        character_level: string;
    };
}

export interface CharacterEvent {
    name?: string;
    level?: number;
}

export interface MatchEvent {
    zone?: string;
    page?: string;
}

const HIDEOUTS = [
    'Hideout',
    'Refúgio',
    'убежище',
    'Hideout',
    'Versteck',
    'Repaire',
    'Guarida',
    '은신처에',
];

@Injectable({
    providedIn: 'root'
})
export class EventService {
    public getCharacter(): Observable<CharacterEvent> {
        return OWGamesEvents.getInfo<EventInfo>().pipe(
            map(info => {
                const event: CharacterEvent = {};
                if (info?.me?.character_name?.length > 2) {
                    const name = info.me.character_name;
                    event.name = name.slice(1, name.length - 1);
                }
                if (info?.me?.character_level?.length > 2) {
                    const level = info.me.character_level;
                    event.level = +level.slice(1, level.length - 1);
                }
                return event;
            })
        );
    }

    public getMatch(): Observable<MatchEvent> {
        return OWGamesEvents.getInfo<EventInfo>().pipe(
            map(info => {
                const event: MatchEvent = {};
                if (info?.match_info?.current_zone?.length > 2) {
                    const zone = info.match_info.current_zone;
                    event.zone = zone.slice(1, zone.length - 1);
                }
                if (info?.match_info?.opened_page?.length > 2) {
                    const page = info.match_info.opened_page;
                    event.page = page.slice(1, page.length - 1);
                }
                return event;
            })
        );
    }

    public isHideout(): Observable<boolean> {
        return this.getMatch().pipe(
            map(match => match?.zone || ''),
            map(zone => HIDEOUTS.some(hideout => zone.includes(hideout))),
            catchError(() => of(false))
        );
    }
}
