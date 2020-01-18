import { Injectable } from '@angular/core';
import { BaseItemTypesProvider } from '../../provider';
import { Language } from '../../type';
import { ContextService } from '../context.service';

@Injectable({
    providedIn: 'root'
})
export class BaseItemTypesService {
    private readonly cache: {
        [key: string]: RegExp
    } = {};

    constructor(
        private readonly context: ContextService,
        private readonly baseItemTypeProvider: BaseItemTypesProvider) { }

    public translate(id: string, language?: Language): string {
        language = language || this.context.get().language;

        const map = this.baseItemTypeProvider.provide(language);
        const name = map[id];
        if (!name) {
            return `untranslated: '${id}' for language: '${Language[language]}'`;
        }

        // remove \\b#\\b
        const result = name.slice(2, name.length - 2);
        // reverse escape string regex
        return result.replace(/\\[.*+?^${}()|[\]\\]/g, (value) => value.replace('\\', ''));
    }

    public search(name: string, language?: Language): string {
        language = language || this.context.get().language;

        const map = this.baseItemTypeProvider.provide(language);

        const hashKey = map[`\\b${name}\\b`];
        if (hashKey) {
            return hashKey;
        }

        for (const key in map) {
            if (map.hasOwnProperty(key) && key[0] !== '\\') {
                const text = map[key];

                const expr = this.cache[key] || (this.cache[key] = new RegExp(text));
                if (expr.test(name)) {
                    return key;
                }
            }
        }
        return undefined;
    }
}
