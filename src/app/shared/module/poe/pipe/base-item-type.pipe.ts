import { Pipe, PipeTransform } from '@angular/core';
import { BaseItemTypeService } from '../service';
import { Language } from '../type';

@Pipe({
    name: 'baseItemType'
})
export class BaseItemTypePipe implements PipeTransform {
    constructor(private readonly baseItemTypeService: BaseItemTypeService) {
    }

    public transform(value: string, language: Language) {
        return this.baseItemTypeService.translate(value, language);
    }
}
