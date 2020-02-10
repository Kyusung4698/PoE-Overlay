import { async, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { MapsService } from './maps.service';

describe('MapsService', () => {
    let sut: MapsService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.inject<MapsService>(MapsService);
    }));

    it('should get map', () => {
        const map = sut.get('MapAtlasQuay');
        expect(map).toBeTruthy();
    });
});
