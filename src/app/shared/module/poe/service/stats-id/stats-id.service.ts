import { Injectable } from '@angular/core';
import { StatsIdProvider } from '../../provider/stats-id.provider';

export interface StatsIdResult {
    ids: string[];
}

@Injectable({
    providedIn: 'root'
})
export class StatsIdService {
    constructor(
        private readonly statsIdProvider: StatsIdProvider) { }

    public search(text: string): StatsIdResult {
        return this.searchMultiple([text])[0];
    }

    public searchMultiple(texts: string[]): StatsIdResult[] {
        const result: StatsIdResult[] = [];

        const valueMap = this.statsIdProvider.provide();
        for (const id in valueMap) {
            if (!valueMap.hasOwnProperty(id)) {
                continue;
            }

            let done = true;

            const value = valueMap[id];
            for (let index = 0; index < texts.length; index++) {
                if (result[index]) {
                    continue;
                }

                done = false;

                if (texts[index] === value) {
                    if (!result[index]) {
                        result[index] = {
                            ids: [id]
                        };
                    } else {
                        result[index].ids.push(id);
                    }

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
