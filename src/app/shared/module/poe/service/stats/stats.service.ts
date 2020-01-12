import { Injectable } from '@angular/core';
import { StatsProvider } from '../../provider/stats.provider';
import { ItemStat, Language, StatType } from '../../type';
import { ContextService } from '../context.service';

export interface StatsSearchResult {
    [text: string]: ItemStat;
}

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    constructor(
        private readonly context: ContextService,
        private readonly statsProvider: StatsProvider) { }

    public translate(stat: ItemStat, language?: Language): string {
        language = language || this.context.get().language;

        const stats = this.statsProvider.provide(stat.type);
        if (!stats[stat.tradeId] || !stats[stat.tradeId].text[language]) {
            return `untranslated: '${stat.type}.${stat.tradeId}' for language: '${Language[language]}'`;
        }

        let result = stats[stat.tradeId].text[language];
        // remove ^$
        result = result.slice(1, result.length - 1);
        // replace values
        for (const value of stat.values) {
            result = result.replace('(\\S*)', value);
        }
        // reverse escape string regex
        return result.replace(/\\[.*+?^${}()|[\]\\]/g, (value) => value.replace('\\', ''));
    }

    public search(text: string, language?: Language): ItemStat {
        return this.searchMultiple([text], language)[text];
    }

    public searchMultiple(texts: string[], language?: Language): StatsSearchResult {
        language = language || this.context.get().language;

        const result: StatsSearchResult = {};

        const unspecific = [];

        const implicitPhrase = ` (${StatType.Implicit})`;
        const implicits = [];
        const craftedPhrase = ` (${StatType.Crafted})`;
        const crafted = [];
        const fracturedPhrase = ` (${StatType.Fractured})`;
        const fractured = [];

        for (const text of texts) {
            if (text.indexOf(implicitPhrase) !== -1) {
                implicits.push(text.replace(implicitPhrase, ''));
            } else if (text.indexOf(craftedPhrase) !== -1) {
                crafted.push(text.replace(craftedPhrase, ''));
            } else if (text.indexOf(fracturedPhrase) !== -1) {
                fractured.push(text.replace(fracturedPhrase, ''));
            } else {
                unspecific.push(text);
            }
        }

        if (implicits.length > 0) {
            this.searchForType(implicits, StatType.Implicit, language, result);
        }

        if (crafted.length > 0) {
            this.searchForType(crafted, StatType.Crafted, language, result);
        }

        if (fractured.length > 0) {
            this.searchForType(fractured, StatType.Fractured, language, result);
        }

        // TODO:
        // fails if stat exists in enchant and explicit eg: uses remaining
        if (unspecific.length > 0) {
            this.searchForType(unspecific, StatType.Enchant, language, result);
        }

        if (unspecific.length > 0) {
            this.searchForType(unspecific, StatType.Explicit, language, result);
        }

        return result;
    }

    private searchForType(texts: string[], type: StatType, language: Language, result: StatsSearchResult): void {
        const stats = this.statsProvider.provide(type);
        for (const id in stats) {
            if (!stats.hasOwnProperty(id)) {
                continue;
            }

            const stat = stats[id];

            const value = (stat.text[language] || stat.text[Language.English]) || '';
            if (value.length <= 0) {
                continue;
            }

            const expr = new RegExp(value);
            for (let index = 0; index < texts.length; index++) {
                const text = texts[index];

                const test = expr.exec(text);
                if (!test) {
                    continue;
                }

                result[text] = {
                    id: stat.id,
                    mod: stat.mod,
                    type,
                    tradeId: id,
                    values: test.slice(1)
                };

                texts.splice(index, 1);
                break;
            }

            if (texts.length === 0) {
                break;
            }
        }
    }
}
