import { Injectable } from '@angular/core';
import { OWGamesEvents } from '@app/odk';
import { ChatService } from '@shared/module/poe/chat';
import { EventInfo } from '@shared/module/poe/poe-event-info';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CommandService {

    constructor(private readonly chat: ChatService) { }

    public execute(command: string): Observable<void> {
        // TODO: Error handling
        return OWGamesEvents.getInfo<EventInfo>().pipe(
            tap(info => {
                if (info?.me?.character_name?.length > 2) {
                    command = command.replace('@char', info.me.character_name.slice(1, info.me.character_name.length - 1));
                }
                this.chat.send(command);
            }),
            map(() => null)
        );
    }
}
