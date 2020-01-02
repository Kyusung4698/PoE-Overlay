import { Injectable } from '@angular/core';
import * as PoE from '@data/poe';
import { Item, ItemsMap, Language, LanguageMap } from '@shared/module/poe/type';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ItemsProvider {
    private readonly languageMap: LanguageMap<BehaviorSubject<ItemsMap[]>> = {};

    constructor(private readonly tradeHttpService: PoE.TradeHttpService) { }

    public provide(language: Language): Observable<ItemsMap[]> {
        const items = this.languageMap[language];
        if (items) {
            return items.pipe(
                filter(result => !!result),
                take(1));
        }
        this.languageMap[language] = new BehaviorSubject<ItemsMap[]>(undefined);
        return this.fetch(language);
    }

    private fetch(language: Language): Observable<ItemsMap[]> {
        return this.tradeHttpService.getItems(language).pipe(
            map(response => {
                return response.result.map(itemGroup => {
                    const result: ItemsMap = {
                        label: itemGroup.label,
                        items: itemGroup.entries.map(entry => {
                            const item: Item = {
                                language,
                                name: entry.name,
                                type: entry.type,
                                nameType: entry.text
                            };
                            return item;
                        })
                    };
                    return result;
                });
            }),
            tap(items => this.languageMap[language].next(items))
        );
    }
}
