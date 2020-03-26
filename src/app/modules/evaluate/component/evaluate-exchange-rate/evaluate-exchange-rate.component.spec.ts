import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectronProvider } from '@app/provider';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { EvaluateExchangeRateChartComponent } from '../evaluate-exchange-rate-chart/evaluate-exchange-rate-chart.component';
import { EvaluateExchangeRateComponent } from './evaluate-exchange-rate.component';
import { Subject } from 'rxjs';

class ElectronProviderFake {
  public provideRemote(): Electron.Remote {
    return null;
  }

  public provideIpcRenderer(): Electron.IpcRenderer {
    return null;
  }
}

describe('EvaluateExchangeRateComponent', () => {
  let component: EvaluateExchangeRateComponent;
  let fixture: ComponentFixture<EvaluateExchangeRateComponent>;

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
      declarations: [EvaluateExchangeRateComponent, EvaluateExchangeRateChartComponent],
      providers: [
        { provide: ElectronProvider, useClass: ElectronProviderFake }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateExchangeRateComponent);
    component = fixture.componentInstance;
    component.optionsChange = new Subject();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
