import { Injectable } from '@angular/core';
import { Asset, AssetService } from '@app/assets';
import { Language } from '@data/poe/schema';
import { BaseItemTypeMap } from './base-item-type';

@Injectable({
    providedIn: 'root'
})
export class BaseItemTypesProvider {

    constructor(private readonly asset: AssetService) { }

    public provide(language: Language): BaseItemTypeMap {
        const content = this.asset.get(Asset.BaseItemTypes);
        switch (language) {
            case Language.English:
                return content.English;
            case Language.Portuguese:
                return content.Portuguese;
            case Language.Russian:
                return content.Russian;
            case Language.Thai:
                return content.Thai;
            case Language.German:
                return content.German;
            case Language.French:
                return content.French;
            case Language.Spanish:
                return content.Spanish;
            case Language.Korean:
                return content.Korean;
            // case Language.SimplifiedChinese:
            //     return SimplifiedChinese;
            case Language.TraditionalChinese:
                return content.TraditionalChinese;
            default:
                throw new Error(`Could not map words to language: '${Language[language]}'.`);
        }
    }
}
