import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '@data/poe/schema';
import { ItemStat } from '../item';
import { StatsService } from './stats.service';

@Pipe({
    name: 'statTransform'
})
export class StatTransformPipe implements PipeTransform {
    constructor(private readonly statsService: StatsService) { }

    public transform(stat: ItemStat, language: Language): string[] {
        return this.statsService.transform(stat, language);
    }
}
