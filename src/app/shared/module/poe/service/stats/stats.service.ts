import { Injectable } from '@angular/core';
import { StatsLocalProvider } from '../../provider/stats-local.provider';
import { StatsProvider } from '../../provider/stats.provider';
import { ItemStat, Language, StatType } from '../../type';
import { ContextService } from '../context.service';

export interface StatsSearchResult {
    stat: ItemStat;
    match: StatsSectionText;
}

export interface StatsSearchOptions {
    'minimum_added_physical_damage maximum_added_physical_damage'?: boolean;    // -
    'minimum_added_fire_damage maximum_added_fire_damage'?: boolean;            // -
    'minimum_added_cold_damage maximum_added_cold_damage'?: boolean;            // -
    'minimum_added_lightning_damage maximum_added_lightning_damage'?: boolean;  // -
    'minimum_added_chaos_damage maximum_added_chaos_damage'?: boolean;          // -
    'attack_speed_+%'?: boolean;                                                // -
    'base_physical_damage_reduction_rating'?: boolean;                          // -
    'physical_damage_reduction_rating_+%'?: boolean;                            // -
    'base_evasion_rating'?: boolean;                                            // -
    'evasion_rating_+%'?: boolean;                                              // -
    'evasion_and_energy_shield_+%'?: boolean;                                   // -
    'armour_and_evasion_+%'?: boolean;                                          // -
    'armour_and_evasion_and_energy_shield_+%'?: boolean;                        // -
    'armour_and_energy_shield_+%'?: boolean;                                    // -
    'energy_shield'?: boolean;                                                  // -
    'energy_shield_+%'?: boolean;                                               // -
    'accuracy_rating'?: boolean;                                                // -
    'poison_on_hit_%'?: boolean;                                                // -
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

    public transform(stat: ItemStat, language?: Language): string[] {
        const stats = this.statsProvider.provide(stat.type);
        if (!stats[stat.tradeId] || !stats[stat.tradeId].text[language] || !stats[stat.tradeId].text[language][stat.predicate]) {
            return [`untranslated: '${stat.type}.${stat.tradeId}' for language: '${Language[language]}'`];
        }

        const result = stats[stat.tradeId].text[language][stat.predicate];
        return result
            .slice(1, result.length - 1)
            .split(VALUE_PLACEHOLDER)
            .map(part => part.replace(REVERSE_REGEX, (value) => value.replace('\\', '')));
    }

    public search(text: string, options?: StatsSearchOptions, language?: Language): StatsSearchResult {
        return this.searchMultiple([text], options, language)[0];
    }

    public searchMultiple(texts: string[], options?: StatsSearchOptions, language?: Language): StatsSearchResult[] {
        language = language || this.context.get().language;
        options = options || {};

        const { implicitsSearch, enchantsSearch, explicitsSearch } = this.buildSearch(texts);

        // TODO: Local Thingies

        const results: StatsSearchResult[] = [];
        if (implicitsSearch.sections.length > 0) {
            this.executeSearch(implicitsSearch, options, language, results);
        }

        if (enchantsSearch.sections.length > 0) {
            const enchants: StatsSearchResult[] = [];
            this.executeSearch(enchantsSearch, options, language, enchants);

            const explicits: StatsSearchResult[] = [];
            this.executeSearch(explicitsSearch, options, language, explicits);

            this.mergeEnchantsAndExplicits(texts, enchants, explicits, results);
        } else {
            this.executeSearch(explicitsSearch, options, language, results);
        }

        return results;
    }

    private executeSearch(
        search: StatsSectionsSearch,
        options: StatsSearchOptions,
        language: Language,
        results: StatsSearchResult[]): void {
        for (const type of search.types) {

            const stats = this.statsProvider.provide(type);
            const locals = this.statsLocalProvider.provide(type);
            for (const tradeId in stats) {
                if (!stats.hasOwnProperty(tradeId)) {
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

                        if (locals[stat.id]) {
                            // item has local stat
                            if (options[stat.id]) {
                                if (stat.mod !== 'local' && !!locals[stat.id].localId) {
                                    continue;
                                }
                            } else {
                                // check if there even is a global stat if not then use this
                                if (stat.mod === 'local' && !!locals[stat.id].globalId) {
                                    continue;
                                }
                            }
                        }

                        const text = test[0];
                        results.push({
                            match: { index: section.index, text },
                            stat: {
                                id: stat.id, predicate,
                                mod: stat.mod, negated: stat.negated,
                                type, tradeId,
                                values: test.slice(1).map(x => ({ text: x }))
                            }
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
        enchantsSearch: StatsSectionsSearch,
        explicitsSearch: StatsSectionsSearch
    } {
        const implicitPhrase = ` (${StatType.Implicit})`;
        const implicitsSearch: StatsSectionsSearch = {
            types: [StatType.Implicit],
            sections: []
        };
        const enchantsSearch: StatsSectionsSearch = {
            types: [StatType.Enchant],
            sections: [],
        };
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
                if (hasCrafteds || hasFractureds) {
                    explicitsSearch.sections.push(section);
                } else {
                    // text did not have any marks so they can be enchants
                    enchantsSearch.sections.push({ ...section });
                    // or explicits
                    explicitsSearch.sections.push(section);
                }
            }
        });
        return { implicitsSearch, enchantsSearch, explicitsSearch };
    }

    private mergeEnchantsAndExplicits(
        texts: string[],
        enchants: StatsSearchResult[],
        explicits: StatsSearchResult[],
        results: StatsSearchResult[]): void {
        texts.forEach((_, index) => {
            const enchantsInSection = enchants.filter(x => x.match.index === index);
            const explicitsInSection = explicits.filter(x => x.match.index === index);
            if (enchantsInSection.length >= explicitsInSection.length) {
                enchantsInSection.forEach(x => results.push(x));
            } else {
                explicitsInSection.forEach(x => results.push(x));
            }
        });
    }
}
