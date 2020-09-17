import { Injectable } from '@angular/core';
import { OWClipboard } from '@app/odk';
import { OWUtils } from '@app/odk/ow-utils';
import { Subject } from 'rxjs';
import { concatMap, delay, distinctUntilChanged, map, mergeMap, tap, windowTime } from 'rxjs/operators';

const MESSAGE_REGEXP = /@((?<from>from|de|von|от кого|จาก)|(?<to>to|à|an|para|кому|ถึง)) (<.*?> )*(?<player>.*?):(?<message>.*)/;

interface ChatEvent {
    message: string;
    send: boolean;
}

export interface ChatMessage {
    from?: string;
    to?: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private readonly queue$ = new Subject<ChatEvent>();

    constructor() {
        this.init();
    }

    public parse(line: string): ChatMessage {
        const result = new RegExp(MESSAGE_REGEXP, 'gi').exec(line);
        if (!result) {
            return undefined;
        }
        const { groups } = result;
        const { from, to, player, message } = groups;
        return {
            from: from ? player : undefined,
            to: to ? player : undefined,
            message
        };
    }

    public send(text: string, context?: any): void {
        const message = this.generateMessage(undefined, text, context);
        this.queue$.next({ message, send: true });
    }

    public invite(name: string): void {
        const message = this.generateMessage('/invite', name);
        this.queue$.next({ message, send: true });
    }

    public trade(name: string): void {
        const message = this.generateMessage('/tradewith', name);
        this.queue$.next({ message, send: true });
    }

    public whisper(name: string, text?: string, context?: any): void {
        const message = this.generateMessage(`@${name}`, text, context);
        const hasText = !!text?.length;
        this.queue$.next({ message: hasText ? message : `${message} `, send: hasText });
    }

    public kick(name: string): void {
        const message = this.generateMessage('/kick', name);
        this.queue$.next({ message, send: true });
    }

    public hideout(name: string): void {
        const message = this.generateMessage('/hideout', name);
        this.queue$.next({ message, send: true });
    }

    public whois(name: string): void {
        const message = this.generateMessage('/whois', name);
        this.queue$.next({ message, send: true });
    }

    private init(): void {
        this.queue$.pipe(
            windowTime(350),
            concatMap(source => source.pipe(
                distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))
            )),
            mergeMap(event => OWClipboard.getFromClipboard().pipe(
                mergeMap(text => OWClipboard.placeOnClipboard(event.message).pipe(
                    map(() => text)
                )),
                delay(10),
                tap(() => OWUtils.sendKeyStroke('Enter')),
                delay(30),
                tap(() => OWUtils.sendKeyStroke('Ctrl+V')),
                delay(10),
                tap(() => {
                    if (event.send) {
                        OWUtils.sendKeyStroke('Enter');
                    }
                }),
                delay(200),
                mergeMap(text => OWClipboard.placeOnClipboard(text)),
                delay(10),
            ), 1)
        ).subscribe();
    }

    private generateMessage(command?: string, template?: string, context?: any): string {
        let message = template;
        if (context && template) {
            Object.getOwnPropertyNames(context).forEach(key => {
                message = message.split(`@${key}`).join(context[key]);
            });
        }
        return [command, message].filter(x => x?.length).join(' ');
    }
}
