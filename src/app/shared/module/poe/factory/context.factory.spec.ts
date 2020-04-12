import { TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { ContextFactory } from '.';
import { Language } from '../type';

describe('ContextFactory', () => {
    let sut: ContextFactory;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ]
        }).compileComponents();
        sut = TestBed.inject<ContextFactory>(ContextFactory);
    });

    it(`should reset invalid league id`, (done) => {
        const invalid = 'invalid';
        sut.create({
            language: Language.English,
            leagueId: invalid
        }).subscribe(context => {
            expect(context.leagueId).not.toEqual(invalid);
            done();
        }, () => done());
    });
});
