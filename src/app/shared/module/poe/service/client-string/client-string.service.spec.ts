import { async, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { Language } from '../../type';
import { ContextService } from '../context.service';
import { ClientStringService } from './client-string.service';

describe('ItemParser', () => {
    let sut: ClientStringService;
    let contextService: ContextService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.get<ClientStringService>(ClientStringService);

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init();
    }));

    const languages: Language[] = [
        Language.English,
        Language.German,
        Language.French,
        Language.Korean,
        Language.Russian,
    ];
    const ids = [
        'ItemDisplayStringRarity',
        'ItemDisplayStringUnique'
    ];
    ids.forEach(id => {
        languages.forEach(language => {
            it(`should get text for id: '${id}' in '${Language[language]}'`, () => {
                const text = sut.get(id, language);
                expect(text.indexOf('untranslated') === -1).toBeTruthy();
            });
        });
    });
});
