import { Injectable } from '@angular/core';
import { Asset, AssetService } from '@app/assets';
import { BaseItemTypeCategoryMap } from './base-item-type-category';

@Injectable({
    providedIn: 'root'
})
export class BaseItemTypeCategoriesProvider {

    constructor(private readonly asset: AssetService) { }

    public provide(): BaseItemTypeCategoryMap {
        const content = this.asset.get(Asset.BaseItemTypeCategories);
        return content.Default;
    }
}
