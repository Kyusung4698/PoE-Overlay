import { Language, TradeSearchHttpQuery } from '@data/poe/schema';
import { Item } from '../../../item';

export interface TradeSearchFilterService {
    add(item: Item, language: Language, query: TradeSearchHttpQuery): void;
}
