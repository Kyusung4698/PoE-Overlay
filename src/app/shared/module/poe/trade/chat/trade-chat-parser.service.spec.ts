import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { AssetService } from '@app/assets';
import { TradeChatParserService } from '.';
import { TradeParserType } from './trade-chat';

describe('TradeChatParserService', () => {
    let sut: TradeChatParserService;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpClientModule,
                BrowserModule
            ],
        }).compileComponents();
        sut = TestBed.inject<TradeChatParserService>(TradeChatParserService);
        const asset = TestBed.inject<AssetService>(AssetService);
        await asset.load().toPromise();
    });

    const logs = [
        // tslint:disable:max-line-length
        `2020/06/04 16:17:19 325004765 acf [INFO Client 3172] @To MamaBetra: Hi, I'd like to buy your 34 Orb of Alchemy for my 10 Chaos Orb in Standard.`,
        `2020/06/04 16:16:57 324981828 acf [INFO Client 3172] @To Ana_Ivanovic: Hi, I would like to buy your Chimeric Vise Fingerless Silk Gloves listed for 1 chaos in Standard (stash tab "mapz"; position: left 3, top 13)`,
        `2020/06/04 16:16:57 324981828 acf [INFO Client 3172] @To Ana_Ivanovic: Hi, I would like to buy your Chimeric Vise Fingerless Silk Gloves listed for 1 chaos in Standard (stash tab "mapz"; position: left 3, top 13) offer 2c`
        // tslint:enable:max-line-length
    ];

    logs.forEach(log => {
        it(`should not get result for log: '${log.slice(0, 30)}'`, () => {
            const result = sut.parse(log);
            expect(result.type !== TradeParserType.Ignored).toBeTruthy();
        });
    });
});
