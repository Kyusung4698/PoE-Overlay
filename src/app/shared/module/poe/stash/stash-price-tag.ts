export enum StashPriceTagType {
    Exact = '~price',
    Negotiable = '~b/o'
}

export interface StashPriceTag {
    amount: number;
    currency: string;
    type?: StashPriceTagType;
    count?: number;
}
