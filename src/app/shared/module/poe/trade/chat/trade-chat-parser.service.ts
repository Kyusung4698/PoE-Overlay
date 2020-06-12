import { Injectable } from '@angular/core';
import { ParserResultType, TradeParserBase } from './trade-chat';

@Injectable({
    providedIn: 'root'
})
export class TradeChatParserService {
    public parse(line: string): TradeParserBase {
        return { parseType: ParserResultType.Ignored };
    }
}
