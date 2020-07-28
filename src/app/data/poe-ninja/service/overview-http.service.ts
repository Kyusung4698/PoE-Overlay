import { TradeLeaguesHttpLeague } from '@data/poe/schema';

export abstract class OverviewHttpService {
    public getLeaguePath(leagueId: string): string {
        switch (leagueId) {
            case TradeLeaguesHttpLeague.Standard:
                return 'standard';
            case TradeLeaguesHttpLeague.Hardcore:
                return 'hardcore';
            default:
                const exp = new RegExp(`${TradeLeaguesHttpLeague.Hardcore} .*`);
                if (exp.exec(leagueId)) {
                    return 'challengehc';
                }
                return 'challenge';
        }
    }
}
