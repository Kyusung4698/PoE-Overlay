import { Injectable } from '@angular/core';
import { ItemsProvider } from '@shared/module/poe/provider/item/items.provider';
import { Item, Language } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContextService } from '../context.service';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    constructor(
        private readonly context: ContextService,
        private readonly itemsProvider: ItemsProvider) { }

    public getLabels(language?: Language): Observable<string[]> {
        language = language || this.context.get().language;

        return this.itemsProvider.provide(language).pipe(
            map(itemsMap => itemsMap.map(x => x.label))
        );
    }

    public getTypesForLabel(label: string, language?: Language): Observable<string[]> {
        language = language || this.context.get().language;

        return this.itemsProvider.provide(language).pipe(
            map(itemsMap => [...new Set(itemsMap.find(x => x.label === label).items.map(x => x.type))])
        );
    }

    public getByType(type: string, language?: Language): Observable<Item[]> {
        language = language || this.context.get().language;

        return this.itemsProvider.provide(language).pipe(
            map(itemsMap => itemsMap.reduce((a, b) => a.concat(b.items.filter(item => item.type === type)), []))
        );
    }

    public getByNameType(nameType: string, language?: Language): Observable<Item> {
        language = language || this.context.get().language;

        return this.itemsProvider.provide(language).pipe(
            map(itemsMaps => {
                for (const itemsMap of itemsMaps) {
                    const item = itemsMap.items.find(x => x.nameType === nameType);
                    if (item !== undefined) {
                        return item;
                    }
                }
                return undefined;
            })
        );
    }
}
