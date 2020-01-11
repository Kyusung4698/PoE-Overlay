import { async, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { ContextService } from '..';
import { Language } from '../../type';
import { StatsDescriptionService } from './stats-description.service';

describe('StatsDescriptionService', () => {
    let sut: StatsDescriptionService;
    let contextService: ContextService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.get<StatsDescriptionService>(StatsDescriptionService);

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        });
    }));

    const modifiers = [
        'Socketed Gems are Supported by Level 5 Elemental Proliferation',
        'Adds 2 to 3 Fire Damage to Spells and Attacks',
        'Adds 2 to 3 Cold Damage to Spells and Attacks',
        'Adds 1 to 4 Lightning Damage to Spells and Attacks',
        '+20 to Evasion Rating',
        '+17 to maximum Energy Shield',
        '+6 to maximum Life',
        '+6 to maximum Mana',
        '+9% to Fire Resistance',
        '+10% to Cold Resistance',
        '+9% to Lightning Resistance',
        'Socketed Gems fire 4 additional Projectiles',
        'Socketed Gems fire Projectiles in a circle',
        '+17 to all Attributes',
        '+6% to all Elemental Resistances',
        '67% increased Projectile Damage',
        '20% increased Light Radius',
        'Regenerate 0.9% of Life per second while moving',
        '0.29% of Physical Attack Damage Leeched as Mana',
    ];
    it('should return search', () => {
        const result = sut.searchMultiple(modifiers, Language.English);
        expect(result.length).toBe(modifiers.length);
    });
});
