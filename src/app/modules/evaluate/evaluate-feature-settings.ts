import { FeatureSettings } from '@app/feature';
import { Language } from '@data/poe/schema';
import { TradeSearchIndexed } from '@shared/module/poe/trade';

export const EVALUATE_QUERY_DEBOUNCE_TIME_MAX = 100;
export const EVALUATE_QUERY_DEBOUNCE_TIME_FACTOR = 100;
export const EVALUATE_QUERY_FETCH_COUNT_MAX = 100;

export enum EvaluateItemSearchLayout {
    Graph = 1,
    List = 2,
}

export interface EvaluateFeatureSettings extends FeatureSettings {
    evaluateCurrencies: string[];
    evaluateCurrenciesOriginal: boolean;
    evaluateTranslateLanguage: Language;
    evaluateItemSearchHorizontal: boolean;
    evaluateItemSearchLayout: EvaluateItemSearchLayout;
    evaluateItemSearchQueryInitial: boolean;
    evaluateItemSearchQueryDebounceTime: number;
    evaluateItemSearchQueryFetchCount: number;
    evaluateItemSearchFilterOnlineOnly: boolean;
    evaluateItemSearchFilterIndexed: TradeSearchIndexed;
    evaluateItemSearchPropertyMinRange: number;
    evaluateItemSearchPropertyMaxRange: number;
    evaluateItemSearchPropertyAttack: boolean;
    evaluateItemSearchPropertyDefense: boolean;
    evaluateItemSearchPropertyNormalizeQuality: boolean;
    evaluateItemSearchPropertyItemLevel: boolean;
    evaluateItemSearchPropertyItemType: boolean;
    evaluateItemSearchPropertyMiscs: boolean;
    evaluateItemSearchPropertyLinks: number;
    evaluateItemSearchStatMinRange: number;
    evaluateItemSearchStatMaxRange: number;
    evaluateItemSearchStatUniqueAll: boolean;
    evaluateItemSearchStats: any;
}
