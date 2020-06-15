import { Injectable } from '@angular/core';
import { ChatService } from '@shared/module/poe/chat';
import { EventService } from '@shared/module/poe/event';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CommandService {

    constructor(
        private readonly chat: ChatService,
        private readonly event: EventService) { }

    public execute(command: string): Observable<void> {
        // TODO: Error handling
        return this.event.getCharacter().pipe(
            tap(character => {
                if (character?.name.length) {
                    command = command.replace('@char', character.name);
                }
                this.chat.send(command);
            }),
            map(() => null)
        );
    }
}
