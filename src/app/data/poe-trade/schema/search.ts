/* tslint:disable */
export class SearchForm {
    type = '';
    league = '';
    base = '';
    name = '';
    dmg_min = '';
    dmg_max = '';
    aps_min = '';
    aps_max = '';
    crit_min = '';
    crit_max = '';
    dps_min = '';
    dps_max = '';
    edps_min = '';
    edps_max = '';
    pdps_min = '';
    pdps_max = '';
    armour_min = '';
    armour_max = '';
    evasion_min = '';
    evasion_max = '';
    shield_min = '';
    shield_max = '';
    block_min = '';
    block_max = '';
    sockets_min = '';
    sockets_max = '';
    link_min = '';
    link_max = '';
    sockets_r = '';
    sockets_g = '';
    sockets_b = '';
    sockets_w = '';
    linked_r = '';
    linked_g = '';
    linked_b = '';
    linked_w = '';
    rlevel_min = '';
    rlevel_max = '';
    rstr_min = '';
    rstr_max = '';
    rdex_min = '';
    rdex_max = '';
    rint_min = '';
    rint_max = '';
    mod_name = [];
    mod_min = [];
    mod_max = [];
    mod_weight = [];
    group_type = '';
    group_min = '';
    group_max = '';
    group_count = '';
    q_min = '';
    q_max = '';
    level_min = '';
    level_max = '';
    ilvl_min = '';
    ilvl_max = '';
    rarity = '';
    progress_min = '';
    progress_max = '';
    sockets_a_min = '';
    sockets_a_max = '';
    map_series = '';
    altart = '';
    identified = '';
    corrupted = '';
    crafted = '';
    enchanted = '';
    fractured = '';
    synthesised = '';
    mirrored = '';
    veiled = '';
    shaper = '';
    elder = '';
    crusader = '';
    redeemer = '';
    hunter = '';
    warlord = '';
    seller = '';
    thread = '';
    online = '';
    capquality = '';
    buyout_min = '';
    buyout_max = '';
    buyout_currency = '';
    has_buyout = '';
    exact_currency = '';
}
/* tslint:enable */

export interface SearchResponse {
    items: SearchItem[];
    url: string;
}

export interface SearchItem {
    value: string;
}
