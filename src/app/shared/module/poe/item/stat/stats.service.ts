import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { ContextService } from '../../context';
import { ItemStat } from '../item';
import { Stat, StatType } from './stat';
import { StatsLocalProvider } from './stats-local.provider';
import { StatsProvider } from './stats.provider';

export interface StatsSearchResult {
    stat: ItemStat;
    match: StatsSectionText;
}

export interface StatsSearchOptions {
    base_chance_to_poison_on_hit__?: boolean;
    local_minimum_added_physical_damagelocal_maximum_added_physical_damage?: boolean;
    local_minimum_added_fire_damagelocal_maximum_added_fire_damage?: boolean;
    local_minimum_added_cold_damagelocal_maximum_added_cold_damage?: boolean;
    local_minimum_added_lightning_damagelocal_maximum_added_lightning_damage?: boolean;
    local_minimum_added_chaos_damagelocal_maximum_added_chaos_damage?: boolean;
    local_attack_speed___?: boolean;
    base_physical_damage_reduction_rating?: boolean;
    local_physical_damage_reduction_rating___?: boolean;
    base_evasion_rating?: boolean;
    local_evasion_rating___?: boolean;
    base_maximum_energy_shield?: boolean;
    local_accuracy_rating?: boolean;
}

export interface StatsSearchFilter {
    [tradeId: string]: boolean;
}

interface StatsSectionText {
    index: number;
    text: string;
}

interface StatsSectionsSearch {
    types: StatType[];
    sections: StatsSectionText[];
}

const REVERSE_REGEX = /\\[.*+?^${}()|[\]\\]/g;
const VALUE_PLACEHOLDER = '(\\S+)';
const TYPE_PLACEHOLDER_REGEX = / \(implicit\)| \(fractured\)| \(crafted\)| \(enchant\)/;

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    private readonly cache: {
        [key: string]: RegExp
    } = {};

    constructor(
        private readonly context: ContextService,
        private readonly statsProvider: StatsProvider,
        private readonly statsLocalProvider: StatsLocalProvider) { }

    public translate(stat: Stat, predicate: string, language?: Language): string {
        language = language || this.context.get().language;

        if (!stat.text[language] || !stat.text[language][predicate]) {
            return `untranslated: '${stat.id}' for language: '${Language[language]}'`;
        }

        const result = stat.text[language][predicate];
        return result
            .slice(1, result.length - 1)
            .split(VALUE_PLACEHOLDER)
            .map(part => part.replace(REVERSE_REGEX, (value) => value.replace('\\', '')).replace(TYPE_PLACEHOLDER_REGEX, ''))
            .join('#');
    }

    public transform(stat: ItemStat, language?: Language): string[] {
        language = language || this.context.get().language;

        const stats = this.statsProvider.provide(stat.type);
        if (!stats[stat.tradeId] || !stats[stat.tradeId].text[language] || !stats[stat.tradeId].text[language][stat.predicate]) {
            return [`untranslated: '${stat.type}.${stat.tradeId}' for language: '${Language[language]}'`];
        }

        const result = stats[stat.tradeId].text[language][stat.predicate];
        return result
            .slice(1, result.length - 1)
            .split(VALUE_PLACEHOLDER)
            .map(part => part.replace(REVERSE_REGEX, (value) => value.replace('\\', '')).replace(TYPE_PLACEHOLDER_REGEX, ''));
    }

    public search(
        texts: string[],
        options?: StatsSearchOptions,
        filter?: StatsSearchFilter,
        language?: Language
    ): StatsSearchResult[] {
        language = language || this.context.get().language;
        options = options || {};

        const { implicitsSearch, explicitsSearch } = this.buildSearch(texts);

        const results: StatsSearchResult[] = [];
        if (implicitsSearch.sections.length > 0) {
            this.executeSearch(implicitsSearch, options, filter, language, results);
        }

        if (explicitsSearch.sections.length > 0) {
            this.executeSearch(explicitsSearch, options, filter, language, results);
        }

        return results;
    }

    private executeSearch(
        search: StatsSectionsSearch,
        options: StatsSearchOptions,
        filter: StatsSearchFilter,
        language: Language,
        results: StatsSearchResult[]): void {
        for (const type of search.types) {

            const stats = this.statsProvider.provide(type);
            const locals = this.statsLocalProvider.provide(type);
            for (const tradeId in stats) {
                if (!stats.hasOwnProperty(tradeId)) {
                    continue;
                }
                if (filter && !filter[`${type}.${tradeId}`]) {
                    continue;
                }

                const stat = stats[tradeId];

                const predicates = stat.text[language];
                for (const predicate in predicates) {
                    if (!predicates.hasOwnProperty(predicate)) {
                        continue;
                    }

                    const value = predicates[predicate];
                    if (value.length <= 0) {
                        continue;
                    }

                    const key = `${type}_${tradeId}_${predicate}`;
                    const expr = this.cache[key] || (this.cache[key] = new RegExp(value, 'm'));
                    for (let index = search.sections.length - 1; index >= 0; --index) {
                        const section = search.sections[index];

                        const test = expr.exec(section.text);
                        if (!test) {
                            continue;
                        }

                        const getKey = (id: string) => {
                            return id.split(' ').join('').split('%').join('_').split('+').join('_');
                        };

                        const localKey = getKey(stat.id || '');
                        if (locals[localKey]) {
                            let optId = locals[localKey];
                            if (stat.mod === 'local') {
                                // global to local optId
                                optId = locals[optId];
                            }

                            // item has local stat
                            if ((options[optId] && stat.mod !== 'local') ||
                                (!options[optId] && stat.mod === 'local')) {
                                continue;
                            }
                        }

                        const text = test[0];
                        const itemStat: ItemStat = {
                            id: stat.id, mod: stat.mod,
                            option: stat.option,
                            negated: stat.negated,
                            predicate,
                            type, tradeId,
                            values: test.slice(1).map(x => ({
                                text: x,
                                value: undefined
                            }))
                        };
                        results.push({
                            stat: itemStat,
                            match: { index: section.index, text },
                        });

                        const length = section.text.length;
                        if (section.text[expr.lastIndex] === '\n') {
                            section.text = section.text.replace(`${text}\n`, '');
                        }
                        if (section.text.length === length) {
                            section.text = section.text.replace(`${text}`, '');
                        }
                        if (section.text.trim().length === 0) {
                            search.sections.splice(index, 1);
                        }
                    }
                }

                if (search.sections.length === 0) {
                    return;
                }
            }
        }
    }

    private buildSearch(texts: string[]): {
        implicitsSearch: StatsSectionsSearch,
        explicitsSearch: StatsSectionsSearch
    } {
        const implicitPhrase = ` (${StatType.Implicit})`;
        const implicitsSearch: StatsSectionsSearch = {
            types: [StatType.Implicit],
            sections: []
        };
        const enchantPhrase = ` (${StatType.Enchant})`;
        const craftedPhrase = ` (${StatType.Crafted})`;
        const fracturedPhrase = ` (${StatType.Fractured})`;
        const explicitsSearch: StatsSectionsSearch = {
            types: [StatType.Explicit],
            sections: [],
        };
        texts.forEach((text, index) => {
            const section: StatsSectionText = {
                index,
                text,
            };
            if (text.indexOf(implicitPhrase) !== -1) {
                // implicits have there own section
                implicitsSearch.sections.push(section);
            } else {
                const hasEnchants = text.indexOf(enchantPhrase) !== -1;
                if (hasEnchants) {
                    if (explicitsSearch.types.indexOf(StatType.Enchant) === -1) {
                        explicitsSearch.types.push(StatType.Enchant);
                    }
                }

                const hasCrafteds = text.indexOf(craftedPhrase) !== -1;
                if (hasCrafteds) {
                    if (explicitsSearch.types.indexOf(StatType.Crafted) === -1) {
                        explicitsSearch.types.push(StatType.Crafted);
                    }
                }

                const hasFractureds = text.indexOf(fracturedPhrase) !== -1;
                if (hasFractureds) {
                    if (explicitsSearch.types.indexOf(StatType.Fractured) === -1) {
                        explicitsSearch.types.push(StatType.Fractured);
                    }
                }
                explicitsSearch.sections.push(section);
            }
        });
        return { implicitsSearch, explicitsSearch };
    }
}
