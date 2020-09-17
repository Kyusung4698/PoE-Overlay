import { Injectable } from '@angular/core';
import { ChatService } from '@shared/module/poe/chat';
import { EventService } from '@shared/module/poe/event';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CommandsFeatureSettings } from '../commands-feature-settings';

interface CommandContext {
    char?: string;
    latest_whisper?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CommandService {
    private readonly context: CommandContext = {};

    constructor(
        private readonly chat: ChatService,
        private readonly event: EventService) { }

    public execute(command: string, settings: CommandsFeatureSettings): Observable<void> {
        if (command.includes('@char')) {
            return this.event.getCharacter().pipe(
                mergeMap(character => {
                    const char = character?.name || settings.characterName;
                    if (!char?.length) {
                        return throwError('character name was not set.');
                    }
                    this.chat.send(command, {
                        ...this.context,
                        char
                    });
                    return of(null);
                })
            );
        } else {
            this.chat.send(command, this.context);
            return of(null);
        }
    }

    public onLogLineAdd(line: string): void {
        const message = this.chat.parse(line);
        if (message?.from) {
            this.context.latest_whisper = message.from;
        }
    }
}
