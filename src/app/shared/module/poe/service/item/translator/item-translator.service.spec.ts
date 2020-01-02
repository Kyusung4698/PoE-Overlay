import { async, TestBed } from '@angular/core/testing';
import { Item, Language } from '@shared/module/poe/type';
import { SharedModule } from '@shared/shared.module';
import { ItemTranslatorService } from '../..';
import { ContextService } from '../../context.service';

describe('ItemTranslatorService', () => {
    let sut: ItemTranslatorService;
    let contextService: ContextService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.get<ItemTranslatorService>(ItemTranslatorService);

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        });
    }));

    const testCases: {
        item: Item,
        nameType: string,
    }[] = [
        {
            item: {
                name: 'Herr der Splitter',
                type: 'Schlangenstab',
                language: Language.German,
            },
            nameType: 'Sire of Shards Serpentine Staff'
        },
        {
            item: {
                type: 'Haubert en chaînes du Prodige',
                language: Language.French,
            },
            nameType: 'Chain Hauberk'
        },
        {
            item: {
                type: 'Orbe du chaos',
                language: Language.French,
            },
            nameType: 'Chaos Orb'
        },
        {
            item: {
                name: 'Lanière cadavérique',
                type: 'Ceinture en cuir',
                language: Language.French,
            },
            nameType: 'Leather Belt'
        }
    ];

    testCases.forEach(testCase => {
        const item = testCase.item;
        const expected = testCase.nameType;
        it(`should translate item: ${item.name || '-'}, ${item.type || '-'}, ${Language[item.language]} to: '${expected}'`, (done) => {
            sut.translate(item, Language.English).subscribe(result => {
                expect(result.nameType).toBe(expected);
                done();
            }, error => {
                done.fail(error);
            });
        });
    });


    const errorTestCases: {
        item: Item
    }[] = [
        {
            item: {
                name: 'Herr der Splitter',
                type: 'Schlangenstab',
                language: Language.French,
            }
        },
    ];

    errorTestCases.forEach(testCase => {
        const item = testCase.item;
        it(`should not translate item: ${item.name || '-'}, ${item.type || '-'}, ${Language[item.language]}`, (done) => {
            sut.translate(item, Language.English).subscribe(() => {
                done.fail('item was translated.');
            }, () => {
                expect(true).toBeTruthy();
                done();
            });
        });
    });
});
