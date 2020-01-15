import { async, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { ModsService } from './mods.service';

describe('ModsService', () => {
    let sut: ModsService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.get<ModsService>(ModsService);
    }));

    const modifiers = [

    ];
    it('should return search', () => {
        // sut.get('', )
        // expect(mods.length).toBe(modifiers.length);
    });
});
