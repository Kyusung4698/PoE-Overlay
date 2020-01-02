import { async, TestBed } from '@angular/core/testing';
import { Item, Language } from '@shared/module/poe/type';
import { SharedModule } from '@shared/shared.module';
import { forkJoin } from 'rxjs';
import { ContextService } from '../context.service';
import { CurrencyService } from '../currency/currency.service';
import { ItemSearchEvaluateService } from './item-search-evaluate.service';
import { ItemSearchService } from './item-search.service';

describe('ItemSearchEvaluateService', () => {
    let sut: ItemSearchEvaluateService;
    let contextService: ContextService;
    let searchService: ItemSearchService;
    let currencyService: CurrencyService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.get<ItemSearchEvaluateService>(ItemSearchEvaluateService);

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        });

        searchService = TestBed.get<ItemSearchService>(ItemSearchService);
        currencyService = TestBed.get<CurrencyService>(CurrencyService);
    }));

    it('should return items', (done) => {
        const requestedItem: Item = {
            language: Language.English,
            name: 'Horror Coil',
            type: 'Topaz Ring',
            nameType: 'Horror Coil Topaz Ring'
        };

        forkJoin(
            searchService.search(requestedItem),
            currencyService.get('chaos')
        ).subscribe(results => {
            sut.evaluate(results[0], results[1]).subscribe(result => {
                expect(result.targetCurrencyAvg).toBeGreaterThan(0);
                done();
            }, error => {
                done.fail(error);
            });
        }, error => {
            done.fail(error);
        });
    });
});
