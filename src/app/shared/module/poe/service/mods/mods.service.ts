import { Injectable } from '@angular/core';
import { ModsProvider } from '../../provider/mods.provider';

@Injectable({
    providedIn: 'root'
})
export class ModsService {

    constructor(private readonly modsProvider: ModsProvider) { }

    public get(statId: string, values: string[]): string[] {
        const modsMap = this.modsProvider.provide();

        const mod = modsMap[statId];
        if (!mod) {
            return undefined;
        }

        const result: string[] = [];
        const parsedValues = values.map(value => this.parseValue(value));

        for (const key in mod) {
            if (mod.hasOwnProperty(key)) {

                if (key.startsWith('Unique')) {
                    continue;
                }

                const minMaxValues = mod[key];
                if (minMaxValues.length !== values.length) {
                    continue;
                }

                const inrange = minMaxValues.every((value, index) => {
                    return parsedValues[index] >= value.min && parsedValues[index] <= value.max;
                });
                if (inrange) {
                    result.push(key);
                }
            }
        }

        return result;
    }

    private parseValue(value: string): number {
        return +value.replace('%', '');
    }
}
