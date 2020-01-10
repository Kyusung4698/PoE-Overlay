import { Pipe, PipeTransform } from '@angular/core';
import { BaseItemTypesService } from '../service/base-item-types/base-item-types.service';
import { Language } from '../type';

@Pipe({
    name: 'baseItemType'
})
export class BaseItemTypePipe implements PipeTransform {
    constructor(private readonly baseItemTypesService: BaseItemTypesService) {
    }

    public transform(value: string, language: Language) {
        return this.baseItemTypesService.translate(value, language);
    }
}
