import { Injectable } from '@angular/core';

export enum CurrencySelectStrategy {
    MinWithAtleast1
}

@Injectable({
    providedIn: 'root'
})
export class CurrencySelectService {
    public select(values: number[][], strategy: CurrencySelectStrategy): number {
        switch (strategy) {
            case CurrencySelectStrategy.MinWithAtleast1:
                return this.minWithAtleast1(values);
            default:
                throw new Error(`${strategy} unknown.`);
        }
    }

    private minWithAtleast1(values: number[][]): number {
        let groupMinIndex = -1;
        let groupMaxIndex = -1;
        let groupMin = Number.MAX_SAFE_INTEGER;
        let groupMax = Number.MIN_SAFE_INTEGER;
        for (let i = 0; i < values.length; i++) {
            let min = Number.MAX_SAFE_INTEGER;
            let max = Number.MIN_SAFE_INTEGER;
            for (const value of values[i]) {
                if (value < min) {
                    min = value;
                }
                if (value > max) {
                    max = value;
                }
            }
            if (min > 1) { // atleast 1
                if (min < groupMin) { // sort by lowest value
                    groupMinIndex = i;
                    groupMin = min;
                }
            } else {
                if (max > groupMax) { // sort by highest value
                    groupMaxIndex = i;
                    groupMax = max;
                }
            }
        }
        const index = groupMinIndex === -1 ? groupMaxIndex : groupMinIndex;
        return index;
    }
}
