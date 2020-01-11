import { ItemCategory } from './item.type';

export interface ClientStringMap {
    [id: string]: string;
}

export interface WordMap {
    [id: string]: string;
}

export interface StatsDescriptionMap {
    [keys: string]: {
        [predicate: string]: string;
    };
}

export interface StatsIdMap {
    [id: string]: string;
}

export interface BaseItemTypeMap {
    [id: string]: string;
}

export interface BaseItemTypeCategoryMap {
    [id: string]: ItemCategory;
}
