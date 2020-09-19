import { Item, ItemValue } from '../../item';
import { ItemSection } from './item-section';
import { ItemSectionType } from './item-section-type';

const AUGMENTED_PHRASE = ' (augmented)';

export abstract class ItemSectionParserService {
    public abstract parse(sections: ItemSection[], target: Item, ...options: any): ItemSection | ItemSection[];

    constructor(
        public readonly type: ItemSectionType,
        public readonly optional: boolean) { }

    protected parseItemValue(text: string): ItemValue {
        const augmented = text.includes(AUGMENTED_PHRASE);
        text = text.replace(AUGMENTED_PHRASE, '');

        const values = text.split('-');
        const value = values
            .map(x => x.split('/')[0])      // '1/3' -> 1
            .map(x => +x.replace('%', ''))  // '1%' -> 1
            .reduce((a, b) => a + b, 0) / values.length;

        const result: ItemValue = {
            text, value, augmented
        };
        return result;
    }
}
