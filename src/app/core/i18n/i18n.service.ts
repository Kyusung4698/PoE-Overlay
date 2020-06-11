import { Injectable } from '@angular/core';
import { UiLanguage } from '@app/config';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class I18nService {

    constructor(private readonly translate: TranslateService) {
        this.translate.setDefaultLang(`${UiLanguage.English}`);
    }

    public use(language: UiLanguage): void {
        switch (language) {
            case UiLanguage.English:
                moment.locale('en');
                break;
            case UiLanguage.Portuguese:
                moment.locale('pt-br');
                break;
            case UiLanguage.Russian:
                moment.locale('ru');
                break;
            case UiLanguage.Thai:
                moment.locale('th');
                break;
            case UiLanguage.German:
                moment.locale('de');
                break;
            case UiLanguage.French:
                moment.locale('fr');
                break;
            case UiLanguage.Spanish:
                moment.locale('es');
                break;
            case UiLanguage.Korean:
                moment.locale('ko');
                break;
            case UiLanguage.SimplifiedChinese:
            case UiLanguage.TraditionalChinese:
                moment.locale('zh-cn');
                break;
            case UiLanguage.Polish:
                moment.locale('pl');
                break;
        }
        this.translate.use(`${language}`);
    }
}
