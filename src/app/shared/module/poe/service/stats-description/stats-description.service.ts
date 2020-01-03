import { Injectable } from '@angular/core';
import { StatsDescriptionProvider } from '../../provider';
import { Language } from '../../type';
import { ContextService } from '../context.service';

export interface StatsDescriptionSearchResult {
    key: string;
    values: string[];
    predicate: string;
}

@Injectable({
    providedIn: 'root'
})
export class StatsDescriptionService {
    constructor(
        private readonly context: ContextService,
        private readonly statsDescriptionProvider: StatsDescriptionProvider) { }

    public translate(key: string, predicate: string, values: string[], language?: Language): string {
        language = language || this.context.get().language;

        const keyMap = this.statsDescriptionProvider.provide(language);
        if (!keyMap[key] || !keyMap[key][predicate]) {
            return `untranslated: '${key}:${predicate}' for language: '${Language[language]}'`;
        }

        let result = keyMap[key][predicate];
        // remove ^$
        result = result.slice(1, result.length - 1);
        // replace values
        for (const value of values) {
            result = result.replace('(-?[\\d]+)', value);
        }
        // reverse escape string regex
        return result.replace(/\\[.*+?^${}()|[\]\\]/g, (value) => value.replace('\\', ''));
    }

    public search(text: string, language?: Language): StatsDescriptionSearchResult {
        return this.searchMultiple([text], language)[0];
    }

    public searchMultiple(texts: string[], language?: Language): StatsDescriptionSearchResult[] {
        language = language || this.context.get().language;

        const result: StatsDescriptionSearchResult[] = [];

        const keyMap = this.statsDescriptionProvider.provide(language);
        for (const key in keyMap) {
            if (!keyMap.hasOwnProperty(key)) {
                continue;
            }

            let done = true;

            const predicateMap = keyMap[key];
            for (const predicate in predicateMap) {
                if (!predicateMap.hasOwnProperty(predicate)) {
                    continue;
                }

                let predicateFound = false;

                const value = predicateMap[predicate];
                const expr = new RegExp(value);
                for (let index = 0; index < texts.length; index++) {
                    if (result[index]) {
                        continue;
                    }

                    done = false;

                    const test = expr.exec(texts[index]);
                    if (test) {
                        result[index] = {
                            key,
                            predicate,
                            values: test.slice(1)
                        };
                        predicateFound = true;
                        break;
                    }
                }

                if (done || predicateFound) {
                    break;
                }
            }

            if (done) {
                break;
            }
        }

        return result;
    }
}
