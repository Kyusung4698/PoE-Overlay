import { Injectable } from '@angular/core';
import { Default } from '../../../../../assets/poe/base-item-type-categories.json';
import { BaseItemTypeCategoryMap } from '../type';

@Injectable({
    providedIn: 'root'
})
export class BaseItemTypeCategoriesProvider {
    public provide(): BaseItemTypeCategoryMap {
        return Default as BaseItemTypeCategoryMap;
    }
}
