import { Injectable } from '@angular/core';
import { BaseItemTypesProvider } from '../../provider';
import { Language } from '../../type';
import { ContextService } from '../context.service';

@Injectable({
    providedIn: 'root'
})
export class BaseItemTypesService {
    private readonly cache: {
        [language: string]: {
            [key: string]: RegExp
        }
    } = {};
    private keys: {
        [language: string]: string[]
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

        // reverse escape string regex
        return name.replace(/\\[.*+?^${}()|[\]\\]/g, (value) => value.replace('\\', ''));
    }

    public search(name: string, language?: Language): string {
        language = language || this.context.get().language;

        const map = this.baseItemTypeProvider.provide(language);

        const nameKey = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const hashKey = map[nameKey];
        if (hashKey) {
            return hashKey;
        }

        if (!this.cache[language]) {
            this.cache[language] = {};
        }

        if (!this.keys[language]) {
            this.keys[language] = Object.getOwnPropertyNames(map)
                .filter(key => key[0] !== `\\`);
        }

        const cache = this.cache[language];
        const keys = this.keys[language];

        let maxScore = Number.MIN_VALUE;
        let maxKey;
        for (const key of keys) {
            const expr = cache[key] || (cache[key] = new RegExp('(?<=[\\s,.:;"\']|^)' + map[key] + '(?=[\\s,.:;"\']|$)'));
            const match = expr.exec(name);
            if (match) {
                const score = map[key].split(' ').length * 10 - match.index;
                if (score > maxScore) {
                    maxScore = score;
                    maxKey = key;
                }
            }
        }
        return maxKey;
    }
}
