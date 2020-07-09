import { Injectable } from '@angular/core';
import { TradeChatParserService, TradeExchangeMessage, TradeMessage, TradeParserType, TradePlayerJoinedArea, TradeWhisperDirection } from '@shared/module/poe/trade/chat';
import { TradeFilter } from '../trade-feature-settings';
import { TradeWindowData, TradeWindowService } from './trade-window.service';

@Injectable({
    providedIn: 'root'
})
export class TradeService {

    constructor(
        private readonly window: TradeWindowService,
        private readonly parser: TradeChatParserService) { }

    public set(message: TradeExchangeMessage): void {
        const data = this.window.data$.get();
        data.messages = [message];
        this.window.data$.next(data);
    }

    public clear(): void {
        const data = this.window.data$.get();
        data.messages = [];
        this.window.data$.next(data);
    }

    public onLogLineAdd(line: string, filter: TradeFilter): void {
        const data = this.window.data$.get();
        if (this.processRemoved(data)) {
            this.window.data$.next(data);
        }

        const result = this.parser.parse(line);
        switch (result.type) {
            case TradeParserType.TradeItem:
            case TradeParserType.TradeBulk:
            case TradeParserType.TradeMap:
                const message = result as TradeExchangeMessage;
                const { direction } = message;
                const shouldProcess = direction === TradeWhisperDirection.Incoming
                    || (direction === TradeWhisperDirection.Outgoing && filter === TradeFilter.IncomingOutgoing);
                if (shouldProcess) {
                    if (!this.processMessage(message, data.messages)) {
                        data.messages.push(message);
                    }
                    this.window.data$.next(data);
                }
                break;
            case TradeParserType.Whisper:
                if (this.processWhisper(result as TradeMessage, data.messages)) {
                    this.window.data$.next(data);
                }
                break;
            case TradeParserType.PlayerJoinedArea:
                const { name } = result as TradePlayerJoinedArea;
                if (this.processPlayerJoined(name, data.messages)) {
                    this.window.data$.next(data);
                }
                break;
            case TradeParserType.Ignored:
                break;
        }
    }

    private processMessage(newMessage: TradeExchangeMessage, messages: TradeExchangeMessage[]): boolean {
        for (const message of messages) {
            if (newMessage.direction === message.direction &&
                newMessage.name === message.name &&
                newMessage.message === message.message) {
                message.timeReceived = new Date();
                return true;
            }
        }
        return false;
    }

    private processWhisper(whisper: TradeMessage, messages: TradeExchangeMessage[]): boolean {
        let shouldUpdate = false;
        for (const message of messages) {
            if (message.name === whisper.name) {
                message.whispers$.next([...message.whispers$.value, whisper]);
                shouldUpdate = true;
            }
        }
        return shouldUpdate;
    }

    private processPlayerJoined(name: string, messages: TradeExchangeMessage[]): boolean {
        let shouldUpdate = false;
        for (const message of messages) {
            if (message.name === name) {
                message.joined$.next(true);
                shouldUpdate = true;
            }
        }
        return shouldUpdate;
    }

    private processRemoved(data: TradeWindowData): boolean {
        let needUpdate = false;

        while (data.removed.length) {
            const message = data.removed.pop();
            const index = data.messages.indexOf(message);
            if (index !== -1) {
                data.messages.splice(index, 1);
                needUpdate = true;
            }
        }
        return needUpdate;
    }
}
