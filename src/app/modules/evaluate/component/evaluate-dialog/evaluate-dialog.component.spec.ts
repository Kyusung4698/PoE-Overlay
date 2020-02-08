import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ElectronProvider } from '@app/provider';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ContextService } from '@shared/module/poe/service';
import { Language } from '@shared/module/poe/type';
import { SharedModule } from '@shared/shared.module';
import { EvaluateExchangeRateChartComponent } from '../evaluate-exchange-rate-chart/evaluate-exchange-rate-chart.component';
import { EvaluateExchangeRateComponent } from '../evaluate-exchange-rate/evaluate-exchange-rate.component';
import { EvaluateSearchChartComponent } from '../evaluate-search-chart/evaluate-search-chart.component';
import { EvaluateSearchTableComponent } from '../evaluate-search-table/evaluate-search-table.component';
import { EvaluateSearchComponent } from '../evaluate-search/evaluate-search.component';
import { EvaluateDialogComponent } from './evaluate-dialog.component';

class ElectronProviderFake {
    public provideRemote(): Electron.Remote {
        return null;
    }

    public provideIpcRenderer(): Electron.IpcRenderer {
        return null;
    }
}

describe('EvaluateDialogComponent', () => {
    let component: EvaluateDialogComponent;
    let fixture: ComponentFixture<EvaluateDialogComponent>;
    let contextService: ContextService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: () => new TranslateFakeLoader()
                    }
                })
            ],
            declarations: [
                EvaluateDialogComponent,
                EvaluateExchangeRateComponent,
                EvaluateExchangeRateChartComponent,
                EvaluateSearchChartComponent,
                EvaluateSearchTableComponent,
                EvaluateSearchComponent,
            ],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        language: Language.English,
                        item: {},
                        settings: {
                            evaluateCurrencyIds: []
                        }
                    }
                },
                { provide: ElectronProvider, useClass: ElectronProviderFake },
                { provide: MatDialogRef, useValue: null },
            ]
        })
            .compileComponents();

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EvaluateDialogComponent);

        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
