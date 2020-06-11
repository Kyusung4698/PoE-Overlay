import { UiLanguage } from '@app/config';
import { TranslateLoader } from '@ngx-translate/core';
import { from, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export class AppTranslationsLoader implements TranslateLoader {
    public getTranslation(lang: string): Observable<any> {
        const id = +lang;
        switch (id) {
            case UiLanguage.English:
                return from(import('./../assets/i18n/english.json')).pipe(map(data => data.default));
            case UiLanguage.Portuguese:
                return from(import('./../assets/i18n/portuguese.json')).pipe(map(data => data.default));
            case UiLanguage.Russian:
                return from(import('./../assets/i18n/russian.json')).pipe(map(data => data.default));
            case UiLanguage.Thai:
                return from(import('./../assets/i18n/thai.json')).pipe(map(data => data.default));
            case UiLanguage.German:
                return from(import('./../assets/i18n/german.json')).pipe(map(data => data.default));
            case UiLanguage.French:
                return from(import('./../assets/i18n/french.json')).pipe(map(data => data.default));
            case UiLanguage.Spanish:
                return from(import('./../assets/i18n/spanish.json')).pipe(map(data => data.default));
            case UiLanguage.Korean:
                return from(import('./../assets/i18n/korean.json')).pipe(map(data => data.default));
            case UiLanguage.SimplifiedChinese:
                return from(import('./../assets/i18n/simplified-chinese.json')).pipe(map(data => data.default));
            case UiLanguage.TraditionalChinese:
                return from(import('./../assets/i18n/traditional-chinese.json')).pipe(map(data => data.default));
            case UiLanguage.Polish:
                return from(import('./../assets/i18n/polish.json')).pipe(map(data => data.default));
            default:
                return throwError(`Could not map lang: '${lang}' to file.`);
        }
    }
}
