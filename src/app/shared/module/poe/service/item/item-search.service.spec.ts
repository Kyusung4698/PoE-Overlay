import { async, TestBed } from '@angular/core/testing';
import { Item, Language } from '@shared/module/poe/type';
import { SharedModule } from '@shared/shared.module';
import { BaseItemTypeService } from '../base-item-type/base-item-type.service';
import { ContextService } from '../context.service';
import { ItemSearchService } from './item-search.service';

describe('ItemSearchService', () => {
    let sut: ItemSearchService;
    let contextService: ContextService;
    let baseItemTypeService: BaseItemTypeService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.get<ItemSearchService>(ItemSearchService);

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        });
        baseItemTypeService = TestBed.get<BaseItemTypeService>(BaseItemTypeService);
    }));

    it('should return items', (done) => {
        const requestedItem: Item = {
            typeId: baseItemTypeService.search('Topaz Ring')
        };

        sut.search(requestedItem).subscribe(result => {
            expect(result.items.length).toBeGreaterThan(0);
            done();
        }, error => {
            done.fail(error);
        });
    });
});
