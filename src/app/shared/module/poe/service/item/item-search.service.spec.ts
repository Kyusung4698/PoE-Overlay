import { async, TestBed } from '@angular/core/testing';
import { Item, Language } from '@shared/module/poe/type';
import { SharedModule } from '@shared/shared.module';
import { BaseItemTypesService } from '../base-item-types/base-item-types.service';
import { ContextService } from '../context.service';
import { ItemSearchService } from './item-search.service';

describe('ItemSearchService', () => {
    let sut: ItemSearchService;
    let contextService: ContextService;
    let baseItemTypesService: BaseItemTypesService;

    beforeEach((done => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ]
        }).compileComponents();
        sut = TestBed.inject<ItemSearchService>(ItemSearchService);

        contextService = TestBed.inject<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        }).subscribe(() => done());
        baseItemTypesService = TestBed.inject<BaseItemTypesService>(BaseItemTypesService);
    }));

    it('should return items', (done) => {
        const requestedItem: Item = {
            typeId: baseItemTypesService.search('Topaz Ring')
        };

        sut.search(requestedItem).subscribe(result => {
            expect(result.hits.length).toBeGreaterThan(0);
            done();
        }, error => {
            done.fail(error);
        });
    });

    it('should list items from search', (done) => {
        const requestedItem: Item = {
            typeId: baseItemTypesService.search('Topaz Ring')
        };

        sut.search(requestedItem).subscribe(result => {
            expect(result.hits.length).toBeGreaterThan(0);

            sut.list(result, 10).subscribe(listings => {
                expect(listings.length).toBe(Math.min(result.hits.length, 10));

                done();
            }, error => done.fail(error));
        }, error => done.fail(error));
    })
});
