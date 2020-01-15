import { Pipe, PipeTransform } from '@angular/core';
import { StatsService } from '../service';
import { ItemStat, Language } from '../type';

@Pipe({
    name: 'stat'
})
export class StatPipe implements PipeTransform {
    constructor(private readonly statsService: StatsService) { }

    public transform(stat: ItemStat, language: Language) {
        return this.statsService.translate(stat, language);
    }
}
