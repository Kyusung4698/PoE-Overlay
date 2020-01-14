import { ItemCategory } from './item.type';
import { Stat } from './stat.type';

export interface ClientStringMap {
    [id: string]: string;
}

export interface WordMap {
    [id: string]: string;
}

export interface BaseItemTypeMap {
    [id: string]: string;
}

export interface BaseItemTypeCategoryMap {
    [id: string]: ItemCategory;
}

export interface StatMap {
    [id: string]: Stat;
}

export interface ModValue {
    min: number;
    max: number;
}

export interface ModsMap {
    [statId: string]: {
        [modId: string]: ModValue[]
    };
}