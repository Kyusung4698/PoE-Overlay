import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '@data/poe/schema';
import { BaseItemTypeService } from './base-item-type.service';

@Pipe({
    name: 'baseItemType'
})
export class BaseItemTypePipe implements PipeTransform {
    constructor(private readonly baseItemTypesService: BaseItemTypeService) {
    }

    public transform(value: string, language: Language): string {
        return this.baseItemTypesService.translate(value, language);
    }
}
