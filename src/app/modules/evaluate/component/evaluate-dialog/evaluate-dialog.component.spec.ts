import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ElectronProvider } from '@app/provider';
import { ContextService } from '@shared/module/poe/service';
import { Language } from '@shared/module/poe/type';
import { SharedModule } from '@shared/shared.module';
import { EvaluateAreaChartComponent } from '../evaluate-area-chart/evaluate-area-chart.component';
import { EvaluateChartComponent } from '../evaluate-chart/evaluate-chart.component';
import { EvaluateSearchComponent } from '../evaluate-search/evaluate-search.component';
import { EvaluateComponent } from '../evaluate/evaluate.component';
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
            imports: [SharedModule],
            declarations: [
                EvaluateDialogComponent,
                EvaluateComponent,
                EvaluateSearchComponent,
                EvaluateAreaChartComponent,
                EvaluateChartComponent
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
                { provide: ElectronProvider, useClass: ElectronProviderFake }
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
