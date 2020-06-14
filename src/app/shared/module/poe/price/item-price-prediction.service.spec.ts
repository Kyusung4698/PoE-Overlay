import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Item } from '../item';
import { ItemPricePredictionService } from './item-price-prediction.service';

describe('ItemPricePredictionService', () => {
    let sut: ItemPricePredictionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpClientModule,
                BrowserModule
            ]
        }).compileComponents();
        sut = TestBed.inject<ItemPricePredictionService>(ItemPricePredictionService);
    });

    it('should return items', (done) => {
        const requestedItem: Item = {
            content:
                'Rarity: Rare\n' +
                'Victory Corona\n' +
                'Steel Circlet\n' +
                '--------\n' +
                'Energy Shield: 46\n' +
                '--------\n' +
                'Requirements:\n' +
                'Level: 60\n' +
                'Str: 96\n' +
                'Int: 125\n' +
                '--------\n' +
                'Sockets: R-B-B-B \n' +
                '--------\n' +
                'Item Level: 47\n' +
                '--------\n' +
                '+25 to Intelligence\n' +
                '+29 to maximum Mana\n' +
                '+6% to Fire Resistance\n' +
                '+7% to Lightning Resistance\n'
        };

        sut.predict(requestedItem, ['chaos'], 'Standard').subscribe(result => {
            expect(result.min).toBeGreaterThan(0);
            expect(result.max).toBeGreaterThan(0);
            done();
        }, error => {
            done.fail(error);
        });
    });
});
