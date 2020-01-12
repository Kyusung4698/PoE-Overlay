import { async, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { ContextService } from '..';
import { Language } from '../../type';
import { StatsService } from './stats.service';

fdescribe('StatsService', () => {
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

    const modifiers = [
        'Socketed Gems fire Projectiles in a circle',
        '-17 to all Attributes',
        '+6% to all Elemental Resistances',
        '67% increased Projectile Damage',
        '20% increased Light Radius',
        'Regenerate 0.9% of Life per second while moving',
        '0.29% of Physical Attack Damage Leeched as Mana',
        '+20% Chance to Block Attack Damage while wielding a Staff (implicit)',
        '+21% to Lightning Resistance (crafted)',
        '+12% to Global Critical Strike Multiplier (fractured)',
        `Adds 33 to 50 Cold Damage if you've been Hit Recently`, // enchanted
        'Adds 10 to 17 Cold Damage to Wand Attacks', // explicit
    ];
    it('should return search', () => {
        const result = sut.searchMultiple(modifiers, Language.English);
        console.log(JSON.stringify(result, null, '\t'));
        const mods = Object.getOwnPropertyNames(result);
        expect(mods.length).toBe(modifiers.length);
    });
});
