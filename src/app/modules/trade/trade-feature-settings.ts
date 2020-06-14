import { FeatureSettings } from '@app/feature';

export interface TradeFeatureSettings extends FeatureSettings {
    tradeEnabled: boolean;
    tradeMessageWait: string;
    tradeMessageStillInterested: string;
    tradeMessageItemGone: string;
    tradeMessageThanks: string;
    tradeWindowPinned: boolean;
    tradeStashFactor: {
        [key: string]: number
    };
}
