import { UiLanguage } from '@app/type';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of, throwError } from 'rxjs';
import English from '../assets/i18n/english.json';
import French from '../assets/i18n/french.json';
import German from '../assets/i18n/german.json';
import Korean from '../assets/i18n/korean.json';
import Polish from '../assets/i18n/polish.json';
import Portuguese from '../assets/i18n/portuguese.json';
import Russian from '../assets/i18n/russian.json';
import SimplifiedChinese from '../assets/i18n/simplified-chinese.json';
import Spanish from '../assets/i18n/spanish.json';
import Thai from '../assets/i18n/thai.json';
import TraditionalChinese from '../assets/i18n/traditional-chinese.json';

export class AppTranslationsLoader implements TranslateLoader {
    public getTranslation(lang: string): Observable<any> {
        const id = +lang;
        switch (id) {
            case UiLanguage.English:
                return of(English);
            case UiLanguage.Portuguese:
                return of(Portuguese);
            case UiLanguage.Russian:
                return of(Russian);
            case UiLanguage.Thai:
                return of(Thai);
            case UiLanguage.German:
                return of(German);
            case UiLanguage.French:
                return of(French);
            case UiLanguage.Spanish:
                return of(Spanish);
            case UiLanguage.Korean:
                return of(Korean);
            case UiLanguage.SimplifiedChinese:
                return of(SimplifiedChinese);
            case UiLanguage.TraditionalChinese:
                return of(TraditionalChinese);
            case UiLanguage.Polish:
                return of(Polish);
            default:
                return throwError(`Could not map lang: '${lang}' to file.`);
        }
    }
}
