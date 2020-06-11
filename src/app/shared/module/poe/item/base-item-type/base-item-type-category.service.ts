import { Injectable } from '@angular/core';
import { BaseItemTypeCategoriesProvider } from './base-item-type-categories.provider';
import { ItemCategory } from './base-item-type-category';

@Injectable({
    providedIn: 'root'
})
export class BaseItemCategoryService {
    constructor(
        private readonly baseItemTypeCategoriesProvider: BaseItemTypeCategoriesProvider) { }

    public get(typeId: string): ItemCategory {
        const categories = this.baseItemTypeCategoriesProvider.provide();
        return categories[typeId];
    }
}
