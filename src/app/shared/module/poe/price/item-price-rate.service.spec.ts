import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { AssetService } from '@app/assets';
import { Item } from '../item';
import { ItemCategory } from '../item/base-item-type';
import { ItemPriceRateService } from './item-price-rate.service';

describe('ItemPriceRateService', () => {
    let sut: ItemPriceRateService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpClientModule,
                BrowserModule
            ]
        }).compileComponents();
        sut = TestBed.inject<ItemPriceRateService>(ItemPriceRateService);
        const asset = TestBed.inject<AssetService>(AssetService);
        await asset.load().toPromise();
    });

    it('should get rate for item', (done) => {
        const item: Item = {
            category: ItemCategory.Prophecy,
            typeId: 'KillingRareStealsMods',
        };

        sut.get(item, ['chaos'], 'Standard').subscribe(result => {
            expect(result).toBeTruthy();
            done();
        }, error => {
            done.fail(error);
        });
    });
});
