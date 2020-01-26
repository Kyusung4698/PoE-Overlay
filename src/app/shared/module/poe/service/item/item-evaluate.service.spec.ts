import { async, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { flatMap } from 'rxjs/operators';
import { ContextService } from '..';
import { Item, ItemCategory, Language } from '../../type';
import { CurrencyService } from '../currency/currency.service';
import { ItemEvaluateService } from './item-evaluate.service';

describe('ItemEvaluateService', () => {
    let sut: ItemEvaluateService;
    let contextService: ContextService;
    let currencyService: CurrencyService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.get<ItemEvaluateService>(ItemEvaluateService);

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        });
        currencyService = TestBed.get<CurrencyService>(CurrencyService);
    }));

    it('should get value for item', (done) => {
        const item: Item = {
            category: ItemCategory.Prophecy,
            typeId: 'KillingRareStealsMods',
        };

        currencyService.searchById('chaos').pipe(
            flatMap(chaos => sut.evaluate(item, [chaos]))
        ).subscribe(result => {
            expect(result).toBeTruthy();
            done();
        }, error => {
            done.fail(error);
        });
    });
});
