import { Injectable } from '@angular/core';
import * as PoE from '@data/poe';
import { Item, ItemsMap } from '@shared/module/poe/type';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ItemsProvider {
    private items: BehaviorSubject<ItemsMap[]>;

    constructor(private readonly tradeHttpService: PoE.TradeHttpService) { }

    public provide(): Observable<ItemsMap[]> {
        if (this.items) {
            return this.items.pipe(
                filter(items => !!items),
                take(1));
        }
        this.items = new BehaviorSubject<ItemsMap[]>(undefined);
        return this.fetch();
    }

    private fetch(): Observable<ItemsMap[]> {
        return this.tradeHttpService.getItems().pipe(
            map(response => {
                return response.result.map(itemGroup => {
                    const result: ItemsMap = {
                        label: itemGroup.label,
                        items: itemGroup.entries.map(entry => {
                            const item: Item = {
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
            tap(items => this.items.next(items))
        );
    }
}
