import { Pipe, PipeTransform } from '@angular/core';
import { StatsService } from '../service';
import { ItemStat, Language } from '../type';

@Pipe({
    name: 'statTransform'
})
export class StatTransformPipe implements PipeTransform {
    constructor(private readonly statsService: StatsService) { }

    public transform(stat: ItemStat, language: Language) {
        return this.statsService.transform(stat, language);
    }
}
