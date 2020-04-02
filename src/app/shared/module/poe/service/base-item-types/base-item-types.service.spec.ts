import { async, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { Language } from '../../type';
import { ContextService } from '../context.service';
import { BaseItemTypesService } from './base-item-types.service';


describe('BaseItemTypeService', () => {
    let sut: BaseItemTypesService;
    let contextService: ContextService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.inject<BaseItemTypesService>(BaseItemTypesService);

        contextService = TestBed.inject<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        });
    }));

    const languages: Language[] = [
        Language.English,
        Language.German,
        Language.French,
        Language.Korean,
        Language.Russian,
    ];
    const texts = [
        'Orbe du chaos',
        `Pierre à aiguiser de forgeron`,
    ];
    texts.forEach(text => {
        languages.forEach(language => {
            it(`should search for text: '${text}' in French and translate in '${Language[language]}'`, () => {
                const id = sut.search(text, Language.French);
                expect(id).toBeTruthy();
                const localizedText = sut.translate(id, language);
                expect(localizedText.indexOf('untranslated') === -1).toBeTruthy();
            });
        });
    });

    it(`should find 'Blighted Port Map'`, () => {
        const result = sut.search('Blighted Port Map', Language.English);
        expect(result).toBe('MapAtlasQuay');
    });

    it(`should find 'Port Map'`, () => {
        const result = sut.search('Port Map', Language.English);
        expect(result).toBe('MapAtlasQuay');
    });

    it(`should find 'Vaal Summon Skeletons'`, () => {
        const result = sut.search('Vaal Summon Skeletons', Language.English);
        expect(result).toBe('SkillGemVaalSummonSkeletons');
    });

    it(`should find 'Fingerless Silk Gloves'`, () => {
        const result = sut.search('Fingerless Silk Gloves of Expulsion', Language.English);
        expect(result).toBe('GlovesAtlasInt');
    });

    it(`should find 'Silk Gloves'`, () => {
        const result = sut.search('Silk Gloves', Language.English);
        expect(result).toBe('GlovesInt3');
    });

    it(`should find 'The Shaper's Amber Amulet of Expulsion`, () => {
        const result = sut.search('The Shaper\'s Amber Amulet of Expulsion', Language.English);
        expect(result).toBe('Amulet3');
    });

    it(`should find 'Titan's Arcade Map of Temporal Chains`, () => {
        const result = sut.search('Titan\'s Arcade Map of Temporal Chains', Language.English);
        expect(result).toBe('MapTier2_7');
    });    
});
