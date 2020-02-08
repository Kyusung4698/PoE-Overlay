import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { EvaluateExchangeRateComponent } from './evaluate-exchange-rate.component';
import { EvaluateExchangeRateChartComponent } from '../evaluate-exchange-rate-chart/evaluate-exchange-rate-chart.component';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';


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
      declarations: [EvaluateExchangeRateComponent, EvaluateExchangeRateChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateExchangeRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
