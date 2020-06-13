import { Injectable } from '@angular/core';
import { TradeChatParserService, ParserResultType, TradeMessageBase, Whisper, PlayerJoinedArea, TradeDirection } from '@shared/module/poe/trade/chat';
import { Observable } from 'rxjs';
import { TradeWindowService } from './trade-window.service';

@Injectable({
    providedIn: 'root'
})
export class TradeService {

    constructor(
        private readonly window: TradeWindowService,
        private readonly parser: TradeChatParserService) { }

    public onLogLineAdd(line: string): Observable<void> {
        const data = this.window.data$.get();

        const result = this.parser.parse(line);
        switch (result.parseType) {
            case ParserResultType.TradeItem:
            case ParserResultType.TradeBulk:
            case ParserResultType.TradeMap:
                let ignore: boolean = false;
                let tradeMessage: TradeMessageBase = result as TradeMessageBase;
                for (var i = 0; i < data.messages.length && !ignore; i++) {
                    if (
                        data.messages[i].tradeDirection === tradeMessage.tradeDirection &&
                        data.messages[i].name === tradeMessage.name &&
                        data.messages[i].message === tradeMessage.message
                    )
                    {
                        data.messages[i].timeReceived = new Date;
                        ignore = true;
                    }
                }
                if (!ignore)
                {
                    data.messages.push(tradeMessage);
                    this.window.data$.next(data);
                }
                break;
            case ParserResultType.Whisper:
                let whisper: Whisper = result as Whisper;
                for (var i = 0; i < data.messages.length; i++) {
                    if (data.messages[i].name === tradeMessage.name)
                    {
                        data.messages[i].extendedMessage.push((tradeMessage.tradeDirection == TradeDirection.Incoming ? "<--| " : "-->| ") + tradeMessage.message.trim())
                        this.window.data$.next(data);
                    }
                }
                break;
            case ParserResultType.PlayerJoinedArea:
                let playerJoined: PlayerJoinedArea = result as PlayerJoinedArea;
                for (var i = 0; i < data.messages.length; i++) {
                    if (data.messages[i].name === playerJoined.name)
                    {
                        data.messages[i].joined = true;
                        this.window.data$.next(data);
                    }
                }
                break;
            case ParserResultType.Ignored:
                break;
        }

        if (data.messages.length) {
            return this.window.restore();
        }
        return this.window.close();
    }
}
