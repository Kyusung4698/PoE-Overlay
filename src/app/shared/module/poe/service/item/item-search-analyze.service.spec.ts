import { async, TestBed } from '@angular/core/testing';
import { Item, Language } from '@shared/module/poe/type';
import { SharedModule } from '@shared/shared.module';
import { forkJoin } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { BaseItemTypesService } from '../base-item-types/base-item-types.service';
import { ContextService } from '../context.service';
import { CurrencyService } from '../currency/currency.service';
import { ItemSearchAnalyzeService } from './item-search-analyze.service';
import { ItemSearchService } from './item-search.service';

describe('ItemSearchAnalyzeService', () => {
    let sut: ItemSearchAnalyzeService;
    let contextService: ContextService;
    let searchService: ItemSearchService;
    let currencyService: CurrencyService;
    let baseItemTypesService: BaseItemTypesService;

    beforeEach((done => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ]
        }).compileComponents();
        sut = TestBed.inject<ItemSearchAnalyzeService>(ItemSearchAnalyzeService);

        contextService = TestBed.inject<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        }).subscribe(() => done());

        searchService = TestBed.inject<ItemSearchService>(ItemSearchService);
        currencyService = TestBed.inject<CurrencyService>(CurrencyService);
        baseItemTypesService = TestBed.inject<BaseItemTypesService>(BaseItemTypesService);
    }));

    it('should return items', (done) => {
        const requestedItem: Item = {
            typeId: baseItemTypesService.search('Topaz Ring')
        };

        forkJoin([
            searchService.search(requestedItem).pipe(
                flatMap(result => searchService.list(result, 10))
            ),
            currencyService.searchById('chaos')
        ]).subscribe(results => {
            sut.analyze(results[0], [results[1]]).subscribe(result => {
                expect(result.values.median).toBeGreaterThan(0);
                done();
            }, error => {
                done.fail(error);
            });
        }, error => {
            done.fail(error);
        });
    });
});
