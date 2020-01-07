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
    id?: string;
    text?: string;
    type?: string;
}

export interface FilterValueOption {
    min?: number;
    max?: number;
}

export interface FilterOption {
    option?: string;
}

export interface FilterGroup<TFilter> {
    filters?: TFilter;
}

export interface StatsFilter {
    id?: string;
    value?: FilterValueOption;
    disabled?: boolean;
}

export interface StatsGroup {
    type?: string;
    filters?: StatsFilter[];
}

export interface TypeFilters {
    category?: FilterOption;
    rarity?: FilterOption;
}

export interface WeaponFilters {
    damage?: FilterValueOption;
    crit?: FilterValueOption;
    pdps?: FilterValueOption;
    aps?: FilterValueOption;
    dps?: FilterValueOption;
    edps?: FilterValueOption;
}

export interface ArmourFilters {
    ar?: FilterValueOption;
    ev?: FilterValueOption;
    es?: FilterValueOption;
    block?: FilterValueOption;
}

export interface FilterSocketValueOption extends FilterValueOption {
    r?: number;
    g?: number;
    b?: number;
    w?: number;
}

export interface SocketFilters {
    sockets?: FilterSocketValueOption;
    links?: FilterSocketValueOption;
}

export interface ReqFilters {
    lvl?: FilterValueOption;
    str?: FilterValueOption;
    dex?: FilterValueOption;
    int?: FilterValueOption;
}

export interface MapFilters {
    map_tier?: FilterValueOption;
    map_packsize?: FilterValueOption;
    map_iiq?: FilterValueOption;
    map_iir?: FilterValueOption;
    map_shaped?: FilterOption;
    map_elder?: FilterOption;
    map_blighted?: FilterOption;
    map_series?: FilterOption;
}

export interface MiscFilters {
    quality?: FilterValueOption;
    ilvl?: FilterValueOption;
    gem_level?: FilterValueOption;
    gem_level_progress?: FilterValueOption;
    shaper_item?: FilterOption;
    elder_item?: FilterOption;
    crusader_item?: FilterOption;
    redeemer_item?: FilterOption;
    hunter_item?: FilterOption;
    warlord_item?: FilterOption;
    fractured_item?: FilterOption;
    synthesised_item?: FilterOption;
    alternate_art?: FilterOption;
    identified?: FilterOption;
    corrupted?: FilterOption;
    mirrored?: FilterOption;
    crafted?: FilterOption;
    veiled?: FilterOption;
    enchanted?: FilterOption;
    talisman_tier?: FilterValueOption;
}

export interface TradeFilters {
    price?: FilterOption;
}

export interface TradeFilterGroup extends FilterGroup<TradeFilters> {
    disabled?: boolean;
}

export interface Filters {
    type_filters?: FilterGroup<TypeFilters>;
    weapon_filters?: FilterGroup<WeaponFilters>;
    armour_filters?: FilterGroup<ArmourFilters>;
    socket_filters?: FilterGroup<SocketFilters>;
    req_filters?: FilterGroup<ReqFilters>;
    map_filters?: FilterGroup<MapFilters>;
    misc_filters?: FilterGroup<MiscFilters>;
    trade_filters?: TradeFilterGroup;
}

export interface Query {
    status?: FilterOption;
    name?: string;
    type?: string;
    stats?: StatsGroup[];
    filters?: Filters;
}

export interface Sort {
    price?: string;
}

export interface TradeSearchRequest {
    query: Query;
    sort: Sort;
}

export interface TradeSearchResponse extends TradeResponse<string> {
    id: string;
    url: string;
    total: number;
}

export interface TradeFetchResultPrice {
    type: string;
    amount: number;
    currency: string;
}

export interface TradeFetchResultListing {
    price: TradeFetchResultPrice;
}

export interface TradeFetchResult {
    listing: TradeFetchResultListing;
}