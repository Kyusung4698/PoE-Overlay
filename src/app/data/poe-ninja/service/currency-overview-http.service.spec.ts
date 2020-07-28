import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { AssetService } from '@app/assets';
import { TradeLeaguesHttpLeague } from '@data/poe/schema';
import { CurrencyOverviewHttpService } from './currency-overview-http.service';

describe('CurrencyOverviewHttpService', () => {
  let sut: CurrencyOverviewHttpService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule
      ]
    }).compileComponents();
    sut = TestBed.inject<CurrencyOverviewHttpService>(CurrencyOverviewHttpService);
    const asset = TestBed.inject<AssetService>(AssetService);
    await asset.load().toPromise();
  });

  const leagueMap = {
    [TradeLeaguesHttpLeague.Standard]: 'standard',
    [TradeLeaguesHttpLeague.Hardcore]: 'hardcore',
    ['Harvest']: 'challenge',
    ['Hardcore Harvest']: 'challengehc',
  };

  Object.keys(leagueMap).forEach(key => {
    it(`getLeaguePath('${key}') should be '${leagueMap[key]}'`, () => {
      const result = sut.getLeaguePath(key);
      expect(result).toBe(leagueMap[key]);
    });
  });
});
