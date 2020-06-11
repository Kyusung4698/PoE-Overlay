import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ContextService } from '../../context';
import { TradeStatic, TradeStaticGroup } from './trade-statics';
import { TradeStaticsProvider } from './trade-statics.provider';

const CACHE_SIZE = 1;

interface TradeStaticCache {
    ids: {
        [key: string]: TradeStatic
    };
    name: {
        [key: string]: TradeStatic
    };
}

interface TradeStaticsCache {
    [language: string]: Observable<TradeStaticCache>;
}

@Injectable({
    providedIn: 'root'
})
export class TradeStaticsService {
    private readonly cache: TradeStaticsCache = {};

    constructor(
        private readonly context: ContextService,
        private readonly items: TradeStaticsProvider) { }

    public get(language?: Language): Observable<TradeStaticGroup[]> {
        language = language || this.context.get().language;
        return this.items.provide(language);
    }

    public match(id: string, language?: Language): Observable<TradeStatic> {
        language = language || this.context.get().language;
        if (!this.cache[language]) {
            this.cache[language] = this.buildCache(language).pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache[language].pipe(
            map(cache => cache.ids[id])
        );
    }

    public find(name: string, language?: Language): Observable<TradeStatic> {
        language = language || this.context.get().language;
        if (!this.cache[language]) {
            this.cache[language] = this.buildCache(language).pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache[language].pipe(
            map(cache => cache.name[name])
        );
    }

    private buildCache(language: Language): Observable<TradeStaticCache> {
        return this.items.provide(language).pipe(
            map(groups => {
                const cache: TradeStaticCache = {
                    ids: {},
                    name: {}
                };
                groups.forEach(group => group.items.forEach(item => {
                    cache.ids[item.id] = item;
                    cache.name[item.name] = item;
                }));
                return cache;
            })
        );
    }
}
