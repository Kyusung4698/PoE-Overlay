import { Pipe, PipeTransform } from '@angular/core';
import { StatsDescriptionService } from '../service';
import { ItemMod, Language } from '../type';

@Pipe({
    name: 'statsDescription'
})
export class StatsDescriptionPipe implements PipeTransform {
    constructor(private readonly statsDescription: StatsDescriptionService) {
    }

    public transform(item: ItemMod, language: Language) {
        return this.statsDescription.translate(item.key, item.predicate, item.values, language);
    }
}
