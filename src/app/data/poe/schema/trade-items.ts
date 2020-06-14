import { TradeHttpResponse } from './trade';

export interface TradeItemsHttpResult {
    label: TradeItemsHttpResultLabel;
    entries: TradeItemsHttpEntry[];
}

export enum TradeItemsHttpResultLabel {
    Accessories = 'Accessories',
    Armour = 'Armour',
    Cards = 'Cards',
    Currency = 'Currency',
    Flasks = 'Flasks',
    Gems = 'Gems',
    Jewels = 'Jewels',
    Maps = 'Maps',
    Weapons = 'Weapons',
    Leaguestones = 'Leaguestones',
    Prophecies = 'Prophecies',
    ItemisedMonsters = 'Itemised Monsters',
}

export interface TradeItemsHttpEntry {
    name?: string;
    type: string;
    text: string;
    disc?: string;
    flags?: TradeItemsHttpEntryFlags;
}

export interface TradeItemsHttpEntryFlags {
    unique?: boolean;
    prophecy?: boolean;
}

export type TradeItemsHttpResponse = TradeHttpResponse<TradeItemsHttpResult>;
