import { async, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { ContextService } from '..';
import { Language } from '../../type';
import { StatsService } from './stats.service';

describe('StatsService', () => {
    let sut: StatsService;
    let contextService: ContextService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.get<StatsService>(StatsService);

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        });
    }));

    [
        [
            // implicit
            '+2 to Level of Socketed Curse Gems (implicit)\n',
            // explicit
            'Grants Level 20 Death Aura Skill\n' +
            '+42 to all Attributes\n' +
            '13% increased Attack Speed\n' +
            '183% increased Armour\n' +
            '+67 to maximum Life\n' +
            '1% of Attack Damage Leeched as Life\n' +
            'You take 450 Chaos Damage per second for 3 seconds on Kill\n' +
            'Gore Footprints\n'
        ]
    ].forEach((texts, index) => {
        it(`should return search for item: '${index}'`, () => {
            const result = sut.searchMultiple(texts, {}, Language.English);
            // console.log(JSON.stringify(result, null, '\t'));
            expect(result.length).toBe(9);
        });
    });
});
