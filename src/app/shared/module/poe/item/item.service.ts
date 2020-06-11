import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { ContextService } from '../context';
import { BaseItemCategoryService, BaseItemTypeService, ItemCategory } from './base-item-type';
import { WordService } from './word';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    constructor(
        private readonly context: ContextService,
        private readonly baseItemTypeService: BaseItemTypeService,
        private readonly baseItemCategoryService: BaseItemCategoryService,
        private readonly wordService: WordService) { }

    public getNameType(nameId: string, typeId: string, language?: Language): string {
        language = language || this.context.get().language;

        return (`${this.getName(nameId, language) || ''} ${this.getType(typeId, language) || ''}`).trim();
    }

    public getName(nameId: string, language?: Language): string {
        language = language || this.context.get().language;

        const name = nameId
            ? this.wordService.translate(nameId, language) : '';
        return name;
    }

    public getType(typeId: string, language?: Language): string {
        language = language || this.context.get().language;

        const type = typeId
            ? this.baseItemTypeService.translate(typeId, language) : '';
        return type;
    }

    public getCategory(typeId: string): ItemCategory {
        return this.baseItemCategoryService.get(typeId);
    }
}
