import { Injectable } from '@angular/core';
import { ChatService } from '@shared/module/poe/chat';
import { EventService } from '@shared/module/poe/event';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CommandService {

    constructor(
        private readonly chat: ChatService,
        private readonly event: EventService) { }

    public execute(command: string): Observable<void> {
        if (command.includes('@char')) {
            return this.event.getCharacter().pipe(
                map(character => {
                    if (character?.name?.length) {
                        command = command.replace('@char', character.name);
                    }
                    return this.chat.send(command);
                })
            );
        } else {
            this.chat.send(command);
            return of(null);
        }
    }
}
