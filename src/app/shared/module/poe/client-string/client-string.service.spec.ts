import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { AssetService } from '@app/assets';
import { Language } from '@data/poe/schema';
import { ClientStringService } from './client-string.service';

describe('ClientStringService', () => {
    let sut: ClientStringService;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpClientModule,
                BrowserModule
            ],
        }).compileComponents();
        sut = TestBed.inject<ClientStringService>(ClientStringService);
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

    const ids = [
        'ItemDisplayStringRarity',
        'ItemDisplayStringUnique'
    ];
    ids.forEach(id => {
        languages.forEach(language => {
            it(`should get text for id: '${id}' in '${Language[language]}'`, () => {
                const text = sut.translate(id, language);
                expect(text.indexOf('untranslated') === -1).toBeTruthy();
            });
        });
    });

    const invalidIds = [
        'ItemDisplayStringRarity1',
    ];

    invalidIds.forEach(id => {
        languages.forEach(language => {
            it(`should not get text for id: '${id}' in '${Language[language]}'`, () => {
                const text = sut.translate(id, language);
                expect(text.indexOf('untranslated') !== -1).toBeTruthy();
            });
        });
    });
});
