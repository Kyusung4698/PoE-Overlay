import { Injectable } from '@angular/core';
import { ParserResultType, TradeChatParserService, TradeMessageBase } from '@shared/module/poe/trade/chat';
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
                data.messages.push(result as TradeMessageBase);
                this.window.data$.next(data);
                break;
            case ParserResultType.Whisper:
                break;
            case ParserResultType.PlayerJoinedArea:
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
