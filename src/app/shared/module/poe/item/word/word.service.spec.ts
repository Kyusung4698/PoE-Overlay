import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { AssetService } from '@app/assets';
import { Language } from '@data/poe/schema';
import { WordService } from './word.service';

describe('WordService', () => {
    let sut: WordService;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpClientModule,
                BrowserModule
            ]
        }).compileComponents();
        sut = TestBed.inject<WordService>(WordService);
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
        'Vix Lunaris',
        `Mèche de l'âme`
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
});
