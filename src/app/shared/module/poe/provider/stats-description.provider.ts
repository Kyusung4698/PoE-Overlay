import { Injectable } from '@angular/core';
import { English, French, German, Korean, Portuguese, Russian, Spanish, Thai } from '../../../../../assets/poe/stats-description.json';
import { Language, StatsDescriptionMap } from '../type';

@Injectable({
    providedIn: 'root'
})
export class StatsDescriptionProvider {
    public provide(language: Language): StatsDescriptionMap {
        switch (language) {
            case Language.English:
                return English;
            case Language.Portuguese:
                return Portuguese;
            case Language.Russian:
                return Russian;
            case Language.Thai:
                return Thai;
            case Language.German:
                return German;
            case Language.French:
                return French;
            case Language.Spanish:
                return Spanish;
            case Language.Korean:
                return Korean;
            default:
                throw new Error(`Could not map stats description to language: '${Language[language]}'.`);
        }
    }
}
