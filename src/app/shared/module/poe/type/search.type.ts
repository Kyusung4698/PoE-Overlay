import { Language } from './language.type';

export enum ItemSearchIndexed {
    AnyTime = 'any',
    UpToADayAgo = '1day',
    UpTo3DaysAgo = '3days',
    UpToAWeekAgo = '1week',
    UpTo2WeeksAgo = '2weeks',
    UpTo1MonthAgo = '1month',
    UpTo2MonthsAgo = '2months'
}

export class ItemSearchOptions {
    online?: boolean;
    indexed?: ItemSearchIndexed;
    leagueId?: string;
    language?: Language;
}
