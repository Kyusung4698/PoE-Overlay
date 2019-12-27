import { Injectable } from '@angular/core';
import { ItemsProvider } from '@shared/module/poe/provider/item/items.provider';
import { Item } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    constructor(
        private readonly itemsProvider: ItemsProvider) { }

    public getLabels(): Observable<string[]> {
        return this.itemsProvider.provide().pipe(
            map(itemsMap => itemsMap.map(x => x.label))
        );
    }

    public getTypesForLabel(label: string): Observable<string[]> {
        return this.itemsProvider.provide().pipe(
            map(itemsMap => [...new Set(itemsMap.find(x => x.label === label).items.map(x => x.type))])
        );
    }

    public getByType(type: string): Observable<Item[]> {
        return this.itemsProvider.provide().pipe(
            map(itemsMap => itemsMap.reduce((a, b) => a.concat(b.items.filter(item => item.type === type)), []))
        );
    }

    public getByNameType(nameType: string): Observable<Item> {
        return this.itemsProvider.provide().pipe(
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
