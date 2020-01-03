import { Injectable } from '@angular/core';
import { BaseItemTypeProvider } from '../../provider';
import { Language } from '../../type';
import { ContextService } from '../context.service';

@Injectable({
    providedIn: 'root'
})
export class BaseItemTypeService {
    constructor(
        private readonly context: ContextService,
        private readonly baseItemTypeProvider: BaseItemTypeProvider) { }

    public translate(id: string, language?: Language): string {
        language = language || this.context.get().language;

        const map = this.baseItemTypeProvider.provide(language);
        return map[id] || `untranslated: '${id}' for language: '${Language[language]}'`;
    }

    public search(text: string, language?: Language): string {
        language = language || this.context.get().language;

        const map = this.baseItemTypeProvider.provide(language);

        const hashKey = map[text];
        if (hashKey) {
            return hashKey;
        }

        for (const key in map) {
            if (map.hasOwnProperty(key) && !isNaN(+key)) {
                const localizedText = map[key];
                if (text.indexOf(localizedText) !== -1) {
                    return key;
                }
            }
        }

        return undefined;
    }
}
