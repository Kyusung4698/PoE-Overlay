import { async, TestBed } from '@angular/core/testing';
import { Item } from '@shared/module/poe/type';
import { forkJoin } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { ContextService } from '../context.service';
import { CurrencyService } from '../currency/currency-service';
import { ItemSearchEvaluateService } from './item-search-evaluate.service';
import { ItemSearchService } from './item-search.service';

describe('ItemSearchEvaluate', () => {
    let sut: ItemSearchEvaluateService;
    let contextService: ContextService;
    let searchService: ItemSearchService;
    let currencyService: CurrencyService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ],
        }).compileComponents();
        sut = TestBed.get<ItemSearchEvaluateService>(ItemSearchEvaluateService);

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init();

        searchService = TestBed.get<ItemSearchService>(ItemSearchService);
        currencyService = TestBed.get<CurrencyService>(CurrencyService);
    }));

    it('should return items', (done) => {
        const requestedItem: Item = {
            nameType: 'Horror Coil Topaz Ring'
        };

        forkJoin(
            searchService.search(requestedItem),
            currencyService.getForId('chaos')
        ).subscribe(results => {
            sut.evaluate(results[0], results[1]).subscribe(result => {
                console.log(result.targetCurrencyAvg);
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
