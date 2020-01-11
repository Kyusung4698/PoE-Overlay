import { Injectable } from '@angular/core';
import { ItemCategory, Language } from '../../type';
import { BaseItemCategoriesService } from '../base-item-categories/base-item-categories.service';
import { BaseItemTypesService } from '../base-item-types/base-item-types.service';
import { ContextService } from '../context.service';
import { WordService } from '../word/word.service';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    constructor(
        private readonly context: ContextService,
        private readonly baseItemTypesService: BaseItemTypesService,
        private readonly baseItemCategoriesService: BaseItemCategoriesService,
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
            ? this.baseItemTypesService.translate(typeId, language) : '';
        return type;
    }

    public getCategory(typeId: string): ItemCategory {
        return this.baseItemCategoriesService.get(typeId);
    }
}
