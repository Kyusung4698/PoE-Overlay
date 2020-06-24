import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../../item';
import { ItemClipboardParserService } from '../../item/clipboard';
import { ItemProcessorService } from '../../item/processor';
import { TradeFetchEntryItem } from './trade-fetch';

@Pipe({
    name: 'tradeFetchItem'
})
export class TradeFetchItemPipe implements PipeTransform {

    constructor(
        private readonly parser: ItemClipboardParserService,
        private readonly processor: ItemProcessorService) { }

    public transform(fetchItem: TradeFetchEntryItem): Item {
        const item = this.parser.parse(fetchItem.text, null,
            fetchItem.hashes.reduce((filter, key) => {
                filter[key] = true;
                return filter;
            }, {})
        );
        if (item) {
            this.processor.process(item, { normalizeQuality: true });
        } else {
            console.warn(`Could not parse item for market. ${fetchItem.text}`);
        }
        return item;
    }
}
