export interface FilterValueOption {
    option?: string | number;
    min?: number;
    max?: number;
}

export interface FilterOption {
    option?: string;
}

export interface FilterGroup<TFilter> {
    filters?: TFilter;
}

export enum Language {
    English = 1,
    Portuguese = 2,
    Russian = 3,
    Thai = 4,
    German = 5,
    French = 6,
    Spanish = 7,
    Korean = 8,
    // SimplifiedChinese = 9,
    TraditionalChinese = 10,
}

export interface TradeHttpResponse<TResult> {
    result: TResult[];
}
