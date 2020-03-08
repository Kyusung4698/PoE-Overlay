export enum Language {
    English = 1,
    Portuguese = 2,
    Russian = 3,
    Thai = 4,
    German = 5,
    French = 6,
    Spanish = 7,
    Korean = 8,
}

export interface LanguageMap<TType> {
    [language: number]: TType;
}
