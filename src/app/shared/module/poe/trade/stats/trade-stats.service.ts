import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ContextService } from '../../context';
import { TradeStat, TradeStatGroup } from './trade-stats';
import { TradeStatsProvider } from './trade-stats.provider';

interface TradeItemStatsMap {
    [language: string]: Observable<TradeStat[]>;
}

@Injectable({
    providedIn: 'root'
})
export class TradeStatsService {
    private statsMap: TradeItemStatsMap = {};

    constructor(
        private readonly context: ContextService,
        private readonly stats: TradeStatsProvider) { }

    public get(language?: Language): Observable<TradeStatGroup[]> {
        language = language || this.context.get().language;
        return this.stats.provide(language);
    }

    public find(id: string, language?: Language): Observable<TradeStat> {
        language = language || this.context.get().language;
        if (!this.statsMap[language]) {
            this.statsMap[language] = this.stats.provide(language).pipe(
                map(groups => groups.reduce((a, b) => a.concat(b.items), [])),
                shareReplay(1)
            );
        }
        return this.statsMap[language].pipe(
            map(stats => stats.find(x => x.id === id))
        );
    }
}
