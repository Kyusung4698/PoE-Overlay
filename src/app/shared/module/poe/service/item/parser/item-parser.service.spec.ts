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
            'Rarity: Normal\n' +
            'Sapphire Flask\n' +
            '--------\n' +
            'Lasts 4.00 Seconds\n' +
            'Consumes 30 of 60 Charges on use\n' +
            'Currently has 0 Charges\n' +
            '+50% to Cold Resistance\n' +
            '20% less Cold Damage taken\n' +
            '--------\n' +
            'Requirements:\n' +
            'Level: 18\n' +
            '--------\n' +
            'Item Level: 29\n' +
            '--------\n' +
            'Right click to drink. Can only hold charges while in belt. Refills as you kill monsters.\n'
        ],
        [
            'Thousand Ribbons Simple Robe',
            'Rarity: Unique\n' +
            'Thousand Ribbons\n' +
            'Simple Robe\n' +
            '--------\n' +
            'Evasion Rating: 20 (augmented)\n' +
            'Energy Shield: 29 (augmented)\n' +
            '--------\n' +
            'Requirements:\n' +
            'Intelligence: 17\n' +
            '--------\n' +
            'Sockets: R B\n' +
            '--------\n' +
            'Item Level: 56\n' +
            '--------\n' +
            'Socketed Gems are Supported by Level 5 Elemental Proliferation\n' +
            'Adds 2 to 3 Fire Damage to Spells and Attacks\n' +
            'Adds 2 to 3 Cold Damage to Spells and Attacks\n' +
            'Adds 1 to 4 Lightning Damage to Spells and Attacks\n' +
            '+20 to Evasion Rating\n' +
            '+17 to maximum Energy Shield\n' +
            '+6 to maximum Life\n' +
            '+6 to maximum Mana\n' +
            '+9% to Fire Resistance\n' +
            '+10% to Cold Resistance\n' +
            '+9% to Lightning Resistance\n' +
            '--------\n' +
            'The night of a thousand ribbons\n' +
            'To remember the day of a thousand flames\n' +
            'When Sarn burned\n' +
            'And was born again\n' +
            '--------\n' +
            'Note: ~price 1 chaos\n'
        ]
    ];

    items.forEach(itemStringified => {
        it(`should parse item: '${itemStringified[0]}'`, () => {
            const item = sut.parse(itemStringified[1]);
            expect(item).toBeTruthy();
        });
    });
});
