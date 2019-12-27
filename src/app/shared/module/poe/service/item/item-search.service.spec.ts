import { async, TestBed } from '@angular/core/testing';
import { Item } from '@shared/module/poe/type';
import { AppModule } from 'src/app/app.module';
import { ContextService } from '../context.service';
import { ItemSearchService } from './item-search.service';

describe('ItemSearchService', () => {
    let sut: ItemSearchService;
    let contextService: ContextService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ],
        }).compileComponents();
        sut = TestBed.get<ItemSearchService>(ItemSearchService);

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init();
    }));

    // it('should return items', (done) => {
    //     const requestedItem: Item = {
    //         nameType: 'Horror Coil Topaz Ring'
    //     };

    //     sut.search(requestedItem).subscribe(result => {
    //         expect(result.items.length).toBeGreaterThan(0);
    //         done();
    //     }, error => {
    //         done.fail(error);
    //     });
    // })
});
