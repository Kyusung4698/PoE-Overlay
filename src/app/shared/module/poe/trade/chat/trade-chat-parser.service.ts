import { Injectable } from '@angular/core';
import { TradeChatParseResult } from './trade-chat';

@Injectable({
    providedIn: 'root'
})
export class TradeChatParserService {
    public parse(line: string): TradeChatParseResult {
        // TODO: @Hyve
        return {
            offer: {
                item: '123',
                seller: line
            }
        };
    }
}
