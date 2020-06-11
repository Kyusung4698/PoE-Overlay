import { TradeHttpResponse } from './trade';

export enum TradeStaticHttpResultId {
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

export interface TradeStaticHttpResultEntry {
    id: string;
    text: string;
    image?: string;
}

export interface TradeStaticHttpResult {
    id: TradeStaticHttpResultId;
    label?: string;
    entries: TradeStaticHttpResultEntry[];
}

export type TradeStaticHttpResponse = TradeHttpResponse<TradeStaticHttpResult>;
