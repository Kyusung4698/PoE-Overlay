import { TranslateLoader } from '@ngx-translate/core';
import { Language } from '@shared/module/poe/type';
import { Observable, of, throwError } from 'rxjs';
import English from '../assets/i18n/english.json';
import French from '../assets/i18n/french.json';
import German from '../assets/i18n/german.json';
import Korean from '../assets/i18n/korean.json';
import Portuguese from '../assets/i18n/portuguese.json';
import Russian from '../assets/i18n/russian.json';
import Spanish from '../assets/i18n/spanish.json';
import Thai from '../assets/i18n/thai.json';

export class AppTranslationsLoader implements TranslateLoader {
    public getTranslation(lang: string): Observable<any> {
        const id = +lang;
        switch (id) {
            case Language.English:
                return of(English);
            case Language.Portuguese:
                return of(Portuguese);
            case Language.Russian:
                return of(Russian);
            case Language.Thai:
                return of(Thai);
            case Language.German:
                return of(German);
            case Language.French:
                return of(French);
            case Language.Spanish:
                return of(Spanish);
            case Language.Korean:
                return of(Korean);
            default:
                return throwError(`Could not map lang: '${lang}' to file.`);
        }
    }
}
