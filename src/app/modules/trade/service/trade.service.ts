import { Injectable } from '@angular/core';
import { TradeChatParserService, TradeParserBase, ParserResultType, TradeMessageBase } from '@shared/module/poe/trade/chat';
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

        let result : TradeParserBase = this.parser.parse(line);
        switch(result.parseType)
        {
            case ParserResultType.TradeItem:
            case ParserResultType.TradeBulk:
            case ParserResultType.TradeMap:
                data.tradeList.push(<TradeMessageBase>result);
                this.window.data$.next(data);
                break;
            case ParserResultType.Whisper:
                break;
            case ParserResultType.PlayerJoinedArea:
                break;
        }

        if (data.tradeList.length) {
            return this.window.restore();
        }
        return this.window.close();
    }
}
