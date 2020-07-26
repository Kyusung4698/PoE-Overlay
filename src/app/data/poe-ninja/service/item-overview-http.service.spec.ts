import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { AssetService } from '@app/assets';
import { ItemOverviewHttpService } from './item-overview-http.service';
import { TradeLeaguesHttpLeague } from '@data/poe/schema';



fdescribe('ItemOverviewHttpService', () => {
  let sut: ItemOverviewHttpService;

  beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpClientModule,
                BrowserModule
            ]
        }).compileComponents();
        sut = TestBed.inject<ItemOverviewHttpService>(ItemOverviewHttpService);
        const asset = TestBed.inject<AssetService>(AssetService);
        await asset.load().toPromise();
    });

  const leagueMap = {
      [TradeLeaguesHttpLeague.Standard]: 'standard',
      [TradeLeaguesHttpLeague.HardCore]: 'hardcore',
      ['Harvest']: 'challenge',
      ['Hardcore Harvest']: 'challengehc',
  };

  Object.keys(leagueMap).forEach(key => {
      it(`getLeaguePath('${key}') should be '${leagueMap[key]}'`, () => {
        const result = sut["getLeaguePath"](key);
        expect(result).toBe(leagueMap[key]);
      });
    }
  );
});
