import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Language } from '@data/poe/schema';
import { BaseItemTypeService } from './base-item-type.service';
import { AssetService } from '@app/assets';

describe('BaseItemTypeService', () => {
    let sut: BaseItemTypeService;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpClientModule,
                BrowserModule
            ],
        }).compileComponents();
        sut = TestBed.inject<BaseItemTypeService>(BaseItemTypeService);
        const asset = TestBed.inject<AssetService>(AssetService);
        await asset.load().toPromise();
    });

    const languages: Language[] = [
        Language.English,
        Language.Portuguese,
        Language.Russian,
        Language.Thai,
        Language.German,
        Language.French,
        Language.Spanish,
        Language.Korean,
        Language.TraditionalChinese,
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

    it(`should find 'Blueprint: Bunker of Power'`, () => {
        const result = sut.search('Blueprint: Bunker of Power', Language.English);
        expect(result).toBe('HeistBlueprintControlBlocks');
    });
});
