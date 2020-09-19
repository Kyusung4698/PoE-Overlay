import { FilterGroup, FilterOption, FilterValueOption, TradeHttpResponse } from './trade';

export interface TradeSearchHttpStatsFilter {
    id?: string;
    value?: FilterValueOption;
    disabled?: boolean;
}

export interface TradeSearchHttpStatsGroup {
    type?: string;
    filters?: TradeSearchHttpStatsFilter[];
}

export interface TradeSearchHttpTypeFilters {
    category?: FilterOption;
    rarity?: FilterOption;
}

export interface TradeSearchHttpWeaponFilters {
    damage?: FilterValueOption;
    crit?: FilterValueOption;
    pdps?: FilterValueOption;
    aps?: FilterValueOption;
    dps?: FilterValueOption;
    edps?: FilterValueOption;
}

export interface TradeSearchHttpArmourFilters {
    ar?: FilterValueOption;
    ev?: FilterValueOption;
    es?: FilterValueOption;
    block?: FilterValueOption;
}

export interface TradeSearchHttpFilterSockets extends FilterValueOption {
    r?: number;
    g?: number;
    b?: number;
    w?: number;
}

export type TradeSearchHttpFilterLinks = TradeSearchHttpFilterSockets;

export interface TradeSearchHttpSocketFilters {
    sockets?: TradeSearchHttpFilterSockets;
    links?: TradeSearchHttpFilterLinks;
}

export interface TradeSearchHttpReqFilters {
    lvl?: FilterValueOption;
    str?: FilterValueOption;
    dex?: FilterValueOption;
    int?: FilterValueOption;
}

export interface TradeSearchHttpMapFilters {
    map_tier?: FilterValueOption;
    map_packsize?: FilterValueOption;
    map_iiq?: FilterValueOption;
    map_iir?: FilterValueOption;
    map_shaped?: FilterOption;
    map_elder?: FilterOption;
    map_blighted?: FilterOption;
    map_series?: FilterOption;
}

export interface TradeSearchHttpHeistFilters {
    heist_wings?: FilterValueOption;
    heist_max_wings?: FilterValueOption;
    heist_escape_routes?: FilterValueOption;
    heist_max_escape_routes?: FilterValueOption;
    heist_reward_rooms?: FilterValueOption;
    heist_max_reward_rooms?: FilterValueOption;
    area_level?: FilterValueOption;
    heist_lockpicking?: FilterValueOption;
    heist_brute_force?: FilterValueOption;
    heist_perception?: FilterValueOption;
    heist_demolition?: FilterValueOption;
    heist_counter_thaumaturgy?: FilterValueOption;
    heist_trap_disarmament?: FilterValueOption;
    heist_agility?: FilterValueOption;
    heist_deception?: FilterValueOption;
    heist_engineering?: FilterValueOption;
}

export interface TradeSearchHttpMiscFilters {
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

export interface TradeSearchHttpFilters {
    price?: FilterOption;
    sale_type?: FilterOption;
    indexed?: FilterOption;
}

export interface TradeSearchHttpFilterGroup extends FilterGroup<TradeSearchHttpFilters> {
    disabled?: boolean;
}

export interface TradeSearchHttpFilters {
    type_filters?: FilterGroup<TradeSearchHttpTypeFilters>;
    weapon_filters?: FilterGroup<TradeSearchHttpWeaponFilters>;
    armour_filters?: FilterGroup<TradeSearchHttpArmourFilters>;
    socket_filters?: FilterGroup<TradeSearchHttpSocketFilters>;
    req_filters?: FilterGroup<TradeSearchHttpReqFilters>;
    map_filters?: FilterGroup<TradeSearchHttpMapFilters>;
    heist_filters?: FilterGroup<TradeSearchHttpHeistFilters>;
    misc_filters?: FilterGroup<TradeSearchHttpMiscFilters>;
    trade_filters?: TradeSearchHttpFilterGroup;
}

export interface TradeSearchHttpQuery {
    status?: FilterOption;
    name?: string;
    term?: string;
    type?: string;
    stats?: TradeSearchHttpStatsGroup[];
    filters?: TradeSearchHttpFilters;
}

export interface TradeSearchHttpSort {
    price?: string;
}

export interface TradeSearchHttpRequest {
    query: TradeSearchHttpQuery;
    sort: TradeSearchHttpSort;
}

export interface TradeSearchHttpResponse extends TradeHttpResponse<string> {
    id: string;
    url: string;
    total: number;
}
