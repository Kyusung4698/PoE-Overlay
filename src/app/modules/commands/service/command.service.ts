import { Injectable } from '@angular/core';
import { ChatService } from '@shared/module/poe/chat';
import { EventService } from '@shared/module/poe/event';
import { Observable, of, throwError } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { CommandsFeatureSettings } from '../commands-feature-settings';

@Injectable({
    providedIn: 'root'
})
export class CommandService {

    constructor(
        private readonly chat: ChatService,
        private readonly event: EventService) { }

    public execute(command: string, settings: CommandsFeatureSettings): Observable<void> {
        if (command.includes('@char')) {
            return this.event.getCharacter().pipe(
                flatMap(character => {
                    if (character?.name?.length) {
                        command = command.replace('@char', character.name);
                    } else {
                        if (settings.characterName?.length) {
                            command = command.replace('@char', settings.characterName);
                        } else {
                            return throwError('character name was not set.');
                        }
                    }
                    this.chat.send(command);
                    return of(null);
                })
            );
        } else {
            this.chat.send(command);
            return of(null);
        }
    }
}
