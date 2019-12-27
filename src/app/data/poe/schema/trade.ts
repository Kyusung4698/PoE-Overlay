export interface TradeResponse<TResult> {
    result: TResult[];
}

export interface TradeItemsResult {
    label: TradeItemsResultLabel;
    entries: TradeItemsEntry[];
}

export enum TradeItemsResultLabel {
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

export interface TradeItemsEntry {
    name?: string;
    type: string;
    text: string;
    disc?: string;
    flags?: TradeItemsEntryFlags;
}

export interface TradeItemsEntryFlags {
    unique?: boolean;
    prophecy?: boolean;
}

export interface TradeLeaguesResult {
    id: string;
    text: string;
}

export interface TradeStaticResult {
    id: TradeStaticResultId;
    label?: string;
    entries: TradeStaticResultEntry[];
}

export interface TradeStaticResultEntry {
    id: string;
    text: string;
    image?: string;
}

export enum TradeStaticResultId {
    Currency = 'Currency',
    Fragments = 'Fragments',
    Catalysts = 'Catalysts',
    Oils = 'Oils',
    Incubators = 'Incubators',
    Scarabs = 'Scarabs',
    DelveResonators = 'DelveResonators',
    DelveFossils = 'DelveFossils',
    Vials = 'Vials',
    Nets = 'Nets',
    Leaguestones = 'Leaguestones',
    Essences = 'Essences',
    Cards = 'Cards',
    MapsTier1 = 'MapsTier1',
    MapsTier2 = 'MapsTier2',
    MapsTier3 = 'MapsTier3',
    MapsTier4 = 'MapsTier4',
    MapsTier5 = 'MapsTier5',
    MapsTier6 = 'MapsTier6',
    MapsTier7 = 'MapsTier7',
    MapsTier8 = 'MapsTier8',
    MapsTier9 = 'MapsTier9',
    MapsTier10 = 'MapsTier10',
    MapsTier11 = 'MapsTier11',
    MapsTier12 = 'MapsTier12',
    MapsTier13 = 'MapsTier13',
    MapsTier14 = 'MapsTier14',
    MapsTier15 = 'MapsTier15',
    MapsTier16 = 'MapsTier16',
    MapsBlighted = 'MapsBlighted',
    Misc = 'Misc',
}

export interface TradeStatsResult {
    label: TradeStatsResultLabel;
    entries: TradeStatsResultResultEntry[];
}

export enum TradeStatsResultLabel {
    Pseudo = 'Pseudo',
    Explicit = 'Explicit',
    Implicit = 'Implicit',
    Fractured = 'Fractured',
    Enchant = 'Enchant',
    Crafted = 'Crafted',
    Veiled = 'Veiled',
    Monster = 'Monster',
    Delve = 'Delve',
}

export interface TradeStatsResultResultEntry {
    id: string;
    text: string;
    type: string;
}
