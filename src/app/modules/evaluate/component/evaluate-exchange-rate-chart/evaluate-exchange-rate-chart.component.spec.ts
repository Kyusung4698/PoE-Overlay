import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { EvaluateExchangeRateChartComponent } from './evaluate-exchange-rate-chart.component';


describe('EvaluateExchangeRateChartComponent', () => {
  let component: EvaluateExchangeRateChartComponent;
  let fixture: ComponentFixture<EvaluateExchangeRateChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [EvaluateExchangeRateChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateExchangeRateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
