import { Injectable } from '@angular/core';
import { English, French, German, Korean, Portuguese, Russian, Spanish, Thai } from '../../../../../assets/poe/words.json';
import { Language, WordMap } from '../type';

@Injectable({
    providedIn: 'root'
})
export class WordProvider {
    public provide(language: Language): WordMap {
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
                throw new Error(`Could not map words to language: '${Language[language]}'.`);
        }
    }
}
