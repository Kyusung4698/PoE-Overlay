import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Language } from '@data/poe/schema';
import { ContextFactory } from './context.factory';

describe('ContextFactory', () => {
    let sut: ContextFactory;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpClientModule,
                BrowserModule
            ],
        }).compileComponents();
        sut = TestBed.inject<ContextFactory>(ContextFactory);
    });

    it(`should reset invalid league id`, async () => {
        const invalid = 'invalid';
        const context = await sut.create({
            language: Language.English,
            leagueId: invalid
        }).toPromise();
        expect(context.leagueId).not.toEqual(invalid);
    });
});
