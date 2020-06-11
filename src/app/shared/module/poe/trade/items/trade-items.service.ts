import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { Observable } from 'rxjs';
import { ContextService } from '../../context';
import { TradeItemGroup } from './trade-items';
import { TradeItemsProvider } from './trade-items.provider';

@Injectable({
    providedIn: 'root'
})
export class TradeItemsService {
    constructor(
        private readonly context: ContextService,
        private readonly items: TradeItemsProvider) { }

    public get(language?: Language): Observable<TradeItemGroup[]> {
        language = language || this.context.get().language;
        return this.items.provide(language);
    }
}
