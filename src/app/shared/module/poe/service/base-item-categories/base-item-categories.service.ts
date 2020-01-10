import { Injectable } from '@angular/core';
import { BaseItemTypeCategoriesProvider } from '../../provider/base-item-type-categories.provider';
import { ItemCategory } from '../../type';

@Injectable({
    providedIn: 'root'
})
export class BaseItemCategoriesService {
    constructor(
        private readonly baseItemTypeCategoriesProvider: BaseItemTypeCategoriesProvider) { }

    public get(typeId: string): ItemCategory {
        const map = this.baseItemTypeCategoriesProvider.provide();
        return map[typeId];
    }
}
