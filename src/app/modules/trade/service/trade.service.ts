import { Injectable } from '@angular/core';
import { TradeChatParserService } from '@shared/module/poe/trade/chat';
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

        const { offer, request } = this.parser.parse(line);
        if (offer || request) {
            if (offer) {
                data.offers.push(offer);
            }
            if (request) {
                data.requests.push(request);
            }
            this.window.data$.next(data);
        }

        if (data.offers.length || data.requests.length) {
            return this.window.restore();
        }
        return this.window.close();
    }
}
