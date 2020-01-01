import { async, TestBed } from '@angular/core/testing';
import { forkJoin } from 'rxjs';
import { ContextService } from '../context.service';
import { CurrencyConverterService } from './currency-converter.service';
import { CurrencyService } from './currency.service';
import { SharedModule } from '@shared/shared.module';

describe('CurrencyConverter', () => {
    let sut: CurrencyConverterService;
    let contextService: ContextService;
    let currencyService: CurrencyService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
        }).compileComponents();
        sut = TestBed.get<CurrencyConverterService>(CurrencyConverterService);

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init();

        currencyService = TestBed.get<CurrencyService>(CurrencyService);
    }));

    it(`should convert 'Chaos Orb' to 'Chaos Orb' equals to 1`, (done) => {
        currencyService.get('chaos').subscribe(currency => {
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

    it(`should convert 'Perandus Coin' to 'Perandus Coin' equals to 1`, (done) => {
        currencyService.get('p').subscribe(currency => {
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
        forkJoin(
            currencyService.get('ancient-orb'),
            currencyService.get('chaos'),
        ).subscribe(currencies => {
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
        forkJoin(
            currencyService.get('ancient-orb'),
            currencyService.get('p'),
        ).subscribe(currencies => {
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
        forkJoin(
            currencyService.get('p'),
            currencyService.get('chaos'),
        ).subscribe(currencies => {
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
        forkJoin(
            currencyService.get('p'),
            currencyService.get('ancient-orb'),
        ).subscribe(currencies => {
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
