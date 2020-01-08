import { async, TestBed } from '@angular/core/testing';
import { Item, Language } from '@shared/module/poe/type';
import { SharedModule } from '@shared/shared.module';
import { forkJoin } from 'rxjs';
import { ContextService } from '../context.service';
import { CurrencyService } from '../currency/currency.service';
import { ItemSearchEvaluateService } from './item-search-evaluate.service';
import { ItemSearchService } from './item-search.service';
import { BaseItemTypeService } from '../base-item-type/base-item-type.service';

describe('ItemSearchEvaluateService', () => {
    let sut: ItemSearchEvaluateService;
    let contextService: ContextService;
    let searchService: ItemSearchService;
    let currencyService: CurrencyService;
    let baseItemTypeService: BaseItemTypeService;


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
        baseItemTypeService = TestBed.get<BaseItemTypeService>(BaseItemTypeService);
    }));

    it('should return items', (done) => {
        const requestedItem: Item = {
            typeId: baseItemTypeService.search('Topaz Ring')
        };

        forkJoin(
            searchService.search(requestedItem),
            currencyService.searchById('chaos')
        ).subscribe(results => {
            sut.evaluate(results[0], results[1]).subscribe(result => {
                expect(result.targetCurrencyMedian).toBeGreaterThan(0);
                done();
            }, error => {
                done.fail(error);
            });
        }, error => {
            done.fail(error);
        });
    });
});
