import { Injectable } from '@angular/core';
import { StatsProvider } from '../../provider/stats.provider';
import { ItemStat, Language, StatType } from '../../type';
import { ContextService } from '../context.service';

export interface StatsSearchResult {
    stat: ItemStat;
    text: StatsSearchText;
}

export interface StatsSearchText {
    value: string;
    section: number;
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
            result = result.replace('(\\S*)', value.text);
        }
        // reverse escape string regex
        return result.replace(/\\[.*+?^${}()|[\]\\]/g, (value) => value.replace('\\', ''));
    }

    public transform(stat: ItemStat, language?: Language): string[] {
        const stats = this.statsProvider.provide(stat.type);
        if (!stats[stat.tradeId] || !stats[stat.tradeId].text[language]) {
            return [`untranslated: '${stat.type}.${stat.tradeId}' for language: '${Language[language]}'`];
        }

        const result = stats[stat.tradeId].text[language];
        return result
            .slice(1, result.length - 1)
            .split('(\\S*)')
            .map(part => part.replace(/\\[.*+?^${}()|[\]\\]/g, (value) => value.replace('\\', '')));
    }

    public search(text: StatsSearchText, language?: Language): StatsSearchResult {
        return this.searchMultiple([text], language)[0];
    }

    public searchMultiple(texts: StatsSearchText[], language?: Language): StatsSearchResult[] {
        language = language || this.context.get().language;

        const results: StatsSearchResult[] = [];

        const unspecific: StatsSearchText[] = [];

        // TODO: Local Thingies

        const implicitPhrase = ` (${StatType.Implicit})`;
        const implicits: StatsSearchText[] = [];
        const craftedPhrase = ` (${StatType.Crafted})`;
        const crafteds: StatsSearchText[] = [];
        const fracturedPhrase = ` (${StatType.Fractured})`;
        const fractureds: StatsSearchText[] = [];

        for (const text of texts) {
            if (text.value.indexOf(implicitPhrase) !== -1) {
                const implicit = { section: text.section, value: text.value.replace(implicitPhrase, '') };
                implicits.push(implicit);
            } else if (text.value.indexOf(craftedPhrase) !== -1) {
                const crafted = { section: text.section, value: text.value.replace(craftedPhrase, '') };
                crafteds.push(crafted);
            } else if (text.value.indexOf(fracturedPhrase) !== -1) {
                const fractured = { section: text.section, value: text.value.replace(fracturedPhrase, '') };
                fractureds.push(fractured);
            } else {
                unspecific.push(text);
            }
        }

        if (implicits.length > 0) {
            this.searchForType(implicits, StatType.Implicit, language, results);
        }

        if (crafteds.length > 0) {
            this.searchForType(crafteds, StatType.Crafted, language, results);
        }

        if (fractureds.length > 0) {
            this.searchForType(fractureds, StatType.Fractured, language, results);
        }

        // TODO: add tests for this
        if (unspecific.length > 0) {
            const enchants: StatsSearchResult[] = [];
            this.searchForType([...unspecific], StatType.Enchant, language, enchants);

            const explicits: StatsSearchResult[] = [];
            this.searchForType([...unspecific], StatType.Explicit, language, explicits);

            const uniqueSections = [...new Set(unspecific.map(x => x.section))];
            uniqueSections.forEach(section => {
                const enchantsInSection = enchants.filter(x => x.text.section === section);
                const explicitsInSection = explicits.filter(x => x.text.section === section);
                if (enchantsInSection.length >= explicitsInSection.length) {
                    enchantsInSection.forEach(x => results.push(x));
                } else {
                    explicitsInSection.forEach(x => results.push(x));
                }
            });
        }

        return results;
    }

    private searchForType(texts: StatsSearchText[], type: StatType, language: Language, results: StatsSearchResult[]): void {
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
            for (let index = texts.length - 1; index >= 0; --index) {
                const text = texts[index];

                const test = expr.exec(text.value);
                if (!test) {
                    continue;
                }

                results.push({
                    text,
                    stat: {
                        id: stat.id,
                        mod: stat.mod,
                        type,
                        tradeId: id,
                        values: test.slice(1).map(x => ({ text: x }))
                    }
                });

                texts.splice(index, 1);
            }

            if (texts.length === 0) {
                break;
            }
        }
    }
}
