import { Injectable } from '@angular/core';
import { TradeParserBase } from './trade-chat';

@Injectable({
    providedIn: 'root'
})
export class TradeChatParserService {
    public parse(line: string): TradeParserBase {
        return null;
    }
}
