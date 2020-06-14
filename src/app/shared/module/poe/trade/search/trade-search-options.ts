import { Language } from '@data/poe/schema';

export interface TradeSearchOptions {
    online?: boolean;
    indexed?: TradeSearchIndexed;
    language?: Language;
    leagueId?: string;
}

export enum TradeSearchIndexed {
    AnyTime = 'any',
    UpToADayAgo = '1day',
    UpTo3DaysAgo = '3days',
    UpToAWeekAgo = '1week',
    UpTo2WeeksAgo = '2weeks',
    UpTo1MonthAgo = '1month',
    UpTo2MonthsAgo = '2months'
}
