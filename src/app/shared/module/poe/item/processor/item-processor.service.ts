import { Injectable } from '@angular/core';
import { Item } from '../item';
import { ItemDamageProcessorService } from './item-damage-processor.service';
import { ItemPseudoProcessorService } from './item-pseudo-processor.service';
import { ItemQualityProcessorService } from './item-quality-processor.service';

export interface ItemProcessorOptions {
    normalizeQuality: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ItemProcessorService {
    constructor(
        private readonly itemQualityProcessorService: ItemQualityProcessorService,
        private readonly itemDamageProcessorService: ItemDamageProcessorService,
        private readonly itemPseudoProcessorService: ItemPseudoProcessorService) { }

    public process(item: Item, options: ItemProcessorOptions): void {
        this.itemQualityProcessorService.process(item, options.normalizeQuality);
        this.itemDamageProcessorService.process(item);
        this.itemPseudoProcessorService.process(item);
    }
}
