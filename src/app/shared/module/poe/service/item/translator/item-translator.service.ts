import { Injectable } from '@angular/core';
import { ItemsProvider } from '@shared/module/poe/provider';
import { Language } from '@shared/module/poe/type';
import { Item, ItemsMap } from '@shared/module/poe/type/item.type';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ItemTranslatorService {

    constructor(private readonly itemsProvider: ItemsProvider) { }

    public translate(item: Item, language: Language): Observable<Item> {
        if (item.language === language) {
            return of(item);
        }

        return this.translateNameType(item, language);
    }

    private translateNameType(originalItem: Item, language: Language): Observable<Item> {
        return forkJoin(
            this.itemsProvider.provide(originalItem.language),
            this.itemsProvider.provide(language)
        ).pipe(
            flatMap(maps => {
                const itemsMaps = maps[0];
                const translatedItemsMaps = maps[1];

                let nameTypeItemId = -1;
                let nameTypeMapId = -1;
                let typeItemId = -1;
                let typeMapId = -1;

                for (let mapId = 0; mapId < itemsMaps.length; mapId++) {
                    const items = itemsMaps[mapId].items;

                    for (let itemId = 0; itemId < items.length; ++itemId) {
                        const item = items[itemId];
                        if (item.nameType === originalItem.nameType) {
                            nameTypeItemId = itemId;
                            nameTypeMapId = mapId;
                            break;
                        }

                        if (!item.name && originalItem.type.indexOf(item.type) !== -1) {
                            typeItemId = itemId;
                            typeMapId = mapId;
                            break;
                        }
                    }

                    if (nameTypeItemId !== -1) {
                        break;
                    }
                }

                // no exact match => use type
                if (nameTypeItemId === -1) {
                    // no exact match AND no exact type match => can't translate
                    if (typeItemId === -1) {
                        return throwError(`ItemType: '${originalItem.type}:${Language[originalItem.language]}'
                        does not even exists in language: '${Language[language]}'.`);
                    }
                    return this.getItem(typeMapId, typeItemId, originalItem, translatedItemsMaps, language);
                }
                return this.getItem(nameTypeMapId, nameTypeItemId, originalItem, translatedItemsMaps, language);
            })
        );
    }

    private getItem(mapId: number, itemId: number, item: Item, maps: ItemsMap[], language: Language): Observable<Item> {
        if (!maps[mapId]) {
            return throwError(`Item: '${item.nameType}:${Language[item.language]}'
            does not exists in language: '${Language[language]}' for map: '${mapId}'`);
        }

        const translatedItem = maps[mapId].items[itemId];
        if (!translatedItem) {
            return throwError(`Item: '${item.nameType}:${Language[item.language]}'
            does not exists in language: '${Language[language]}'`);
        }

        return of({
            ...item,
            ...translatedItem
        });
    }
}
