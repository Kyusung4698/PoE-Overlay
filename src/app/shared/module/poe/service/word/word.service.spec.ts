import { async, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { Language } from '../../type';
import { ContextService } from '../context.service';
import { WordService } from './word.service';

describe('WordService', () => {
    let sut: WordService;
    let contextService: ContextService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.inject<WordService>(WordService);

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
