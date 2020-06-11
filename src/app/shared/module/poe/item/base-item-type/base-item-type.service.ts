import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { ContextService } from '../../context';
import { BaseItemTypeMap } from './base-item-type';
import { BaseItemTypesProvider } from './base-item-types.provider';

interface CacheEntry {
    key: string;
    exp: RegExp;
}

@Injectable({
    providedIn: 'root'
})
export class BaseItemTypeService {
    private readonly cache: {
        [language: string]: CacheEntry[]
    } = {};

    constructor(
        private readonly context: ContextService,
        private readonly baseItemTypesProvider: BaseItemTypesProvider) { }

    public translate(id: string, language?: Language): string {
        language = language || this.context.get().language;

        const types = this.baseItemTypesProvider.provide(language);
        const type = types.ids[id];
        if (!type) {
            return `untranslated: '${id}' for language: '${Language[language]}'`;
        }

        // reverse escape string regex
        return type.replace(/\\[.*+?^${}()|[\]\\]/g, (value) => value.replace('\\', ''));
    }

    public search(type: string, language?: Language): string {
        language = language || this.context.get().language;

        const types = this.baseItemTypesProvider.provide(language);

        const valueKey = type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const hashId = types.values[valueKey];
        if (hashId) {
            return hashId;
        }

        this.initCache(language, types);

        let maxScore = Number.MIN_VALUE;
        let maxId: string;

        const entries = this.cache[language];
        entries.forEach(entry => {
            const match = entry.exp.exec(type);
            if (match) {
                const val = types.ids[entry.key].split(' ').length * 10;
                const len = types.ids[entry.key].length;
                const pos = type.length / 2 - Math.abs(type.length / 2 - (match.index + len / 2));

                const score = val + pos + len;
                if (score > maxScore) {
                    maxScore = score;
                    maxId = entry.key;
                }
            }
        });
        return maxId;
    }

    private initCache(language: Language, types: BaseItemTypeMap): void {
        if (!this.cache[language]) {
            this.cache[language] = Object.getOwnPropertyNames(types.ids)
                .map(key => {
                    const entry: CacheEntry = {
                        key,
                        exp: new RegExp('(?<=\\s|^)' + types.ids[key] + '(?=\\s|$)')
                    };
                    return entry;
                });
        }
    }
}
