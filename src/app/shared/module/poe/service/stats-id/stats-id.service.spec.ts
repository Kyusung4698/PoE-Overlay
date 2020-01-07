import { async, TestBed } from "@angular/core/testing";
import { SharedModule } from '@shared/shared.module';
import { StatsIdService } from './stats-id.service';

fdescribe('StatsIdService', () => {
    let sut: StatsIdService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.get<StatsIdService>(StatsIdService);
    }));

    const texts = [
        '#% increased Elemental Damage',
        '#% increased Lightning Damage',
        '#% increased Cold Damage',
        '#% increased Fire Damage',
        '#% increased Spell Damage',
    ];
    it('should return search', () => {
        const result = sut.searchMultiple(texts);
        expect(result.length).toBe(texts.length);
    });
});
