import { async, TestBed } from '@angular/core/testing';
import { Item, Language } from '@shared/module/poe/type';
import { SharedModule } from '@shared/shared.module';
import { forkJoin } from 'rxjs';
import { BaseItemTypesService } from '../base-item-types/base-item-types.service';
import { ContextService } from '../context.service';
import { CurrencyService } from '../currency/currency.service';
import { ItemSearchEvaluateService } from './item-search-evaluate.service';
import { ItemSearchService } from './item-search.service';

describe('ItemSearchEvaluateService', () => {
    let sut: ItemSearchEvaluateService;
    let contextService: ContextService;
    let searchService: ItemSearchService;
    let currencyService: CurrencyService;
    let baseItemTypesService: BaseItemTypesService;

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
        baseItemTypesService = TestBed.get<BaseItemTypesService>(BaseItemTypesService);
    }));

    it('should return items', (done) => {
        const requestedItem: Item = {
            typeId: baseItemTypesService.search('Topaz Ring')
        };

        forkJoin(
            searchService.search(requestedItem),
            currencyService.searchById('chaos')
        ).subscribe(results => {
            sut.evaluate(results[0], [results[1]]).subscribe(result => {
                expect(result.median).toBeGreaterThan(0);
                done();
            }, error => {
                done.fail(error);
            });
        }, error => {
            done.fail(error);
        });
    });
});
