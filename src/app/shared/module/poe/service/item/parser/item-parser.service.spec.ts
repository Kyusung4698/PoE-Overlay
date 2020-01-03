import { async, TestBed } from '@angular/core/testing';
import { Language } from '@shared/module/poe/type';
import { SharedModule } from '@shared/shared.module';
import { ContextService } from '../../context.service';
import { ItemParserService } from './item-parser.service';

describe('ItemParserService', () => {
    let sut: ItemParserService;
    let contextService: ContextService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.get<ItemParserService>(ItemParserService);

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        });
    }));

    const items: string[][] = [
        [
            'Sapphire Flask',
            `
            Rarity: Normal
            Sapphire Flask
            --------
            Lasts 4.00 Seconds
            Consumes 30 of 60 Charges on use
            Currently has 0 Charges
            +50% to Cold Resistance
            20% less Cold Damage taken
            --------
            Requirements:
            Level: 18
            --------
            Item Level: 29
            --------
            Right click to drink. Can only hold charges while in belt. Refills as you kill monsters.

            Rarity: Normal
            Sacrifice at Noon
            --------
            The light without pales in comparison to the light within.
            --------
            Can be used in a personal Map Device.
            `
        ],
        [
            'Thousand Ribbons Simple Robe',
            `
            Rarity: Unique
            Thousand Ribbons
            Simple Robe
            --------
            Evasion Rating: 20 (augmented)
            Energy Shield: 29 (augmented)
            --------
            Requirements:
            Intelligence: 17
            --------
            Sockets: R B
            --------
            Item Level: 56
            --------
            Socketed Gems are Supported by Level 5 Elemental Proliferation
            Adds 2 to 3 Fire Damage to Spells and Attacks
            Adds 2 to 3 Cold Damage to Spells and Attacks
            Adds 1 to 4 Lightning Damage to Spells and Attacks
            +20 to Evasion Rating
            +17 to maximum Energy Shield
            +6 to maximum Life
            +6 to maximum Mana
            +9% to Fire Resistance
            +10% to Cold Resistance
            +9% to Lightning Resistance
            --------
            The night of a thousand ribbons
            To remember the day of a thousand flames
            When Sarn burned
            And was born again
            --------
            Note: ~price 1 chaos
            `
        ]
    ];

    items.forEach(itemStringified => {
        it(`should parse item: '${itemStringified[0]}'`, () => {
            const item = sut.parse(itemStringified[1]);
            expect(item).toBeTruthy();
        });
    });
});
