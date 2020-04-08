import { async, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { forkJoin } from 'rxjs';
import { Language } from '../../type';
import { ContextService } from '../context.service';
import { CurrencyConverterService } from './currency-converter.service';
import { CurrencyService } from './currency.service';

describe('CurrencyConverterService', () => {
    let sut: CurrencyConverterService;
    let contextService: ContextService;
    let currencyService: CurrencyService;

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.inject<CurrencyConverterService>(CurrencyConverterService);

        contextService = TestBed.inject<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        }).subscribe(() => done());

        currencyService = TestBed.inject<CurrencyService>(CurrencyService);
    });

    it(`should convert 'Chaos Orb' to 'Chaos Orb' equals to 1`, (done) => {
        currencyService.searchById('chaos').subscribe(currency => {
            sut.convert(currency, currency).subscribe(factor => {
                expect(factor).toBe(1);
                done();
            }, error => {
                done.fail(error);
            });
        }, error => {
            done.fail(error);
        });
    });

    it(`should convert 'Perandus Coin' to 'Perandus Coin' equals to 2`, (done) => {
        currencyService.searchById('p').subscribe(currency => {
            sut.convert(currency, currency).subscribe(factor => {
                expect(factor).toBe(1);
                done();
            }, error => {
                done.fail(error);
            });
        }, error => {
            done.fail(error);
        });
    });

    it(`should convert 'Ancient Orb' to 'Chaos Orb' greater than 1`, (done) => {
        forkJoin([
            currencyService.searchById('ancient-orb'),
            currencyService.searchById('chaos'),
        ]).subscribe(currencies => {
            sut.convert(currencies[0], currencies[1]).subscribe(factor => {
                expect(factor).toBeGreaterThan(1);
                done();
            }, error => {
                done.fail(error);
            });
        }, error => {
            done.fail(error);
        });
    });

    it(`should convert 'Ancient Orb' to 'Perandus Coin' greater than 1`, (done) => {
        forkJoin([
            currencyService.searchById('ancient-orb'),
            currencyService.searchById('p'),
        ]).subscribe(currencies => {
            sut.convert(currencies[0], currencies[1]).subscribe(factor => {
                expect(factor).toBeGreaterThan(1);
                done();
            }, error => {
                done.fail(error);
            });
        }, error => {
            done.fail(error);
        });
    });

    it(`should convert 'Perandus Coin' to 'Chaos Orb' less than 1`, (done) => {
        forkJoin([
            currencyService.searchById('p'),
            currencyService.searchById('chaos'),
        ]).subscribe(currencies => {
            sut.convert(currencies[0], currencies[1]).subscribe(factor => {
                expect(factor).toBeLessThan(1);
                done();
            }, error => {
                done.fail(error);
            });
        }, error => {
            done.fail(error);
        });
    });

    it(`should convert 'Perandus Coin' to 'Ancient Orb' less than 1`, (done) => {
        forkJoin([
            currencyService.searchById('p'),
            currencyService.searchById('ancient-orb'),
        ]).subscribe(currencies => {
            sut.convert(currencies[0], currencies[1]).subscribe(factor => {
                expect(factor).toBeLessThan(1);
                done();
            }, error => {
                done.fail(error);
            });
        }, error => {
            done.fail(error);
        });
    });
});
