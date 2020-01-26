import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { EvaluateAreaChartComponent } from './evaluate-area-chart.component';


describe('EvaluateAreaChartComponent', () => {
  let component: EvaluateAreaChartComponent;
  let fixture: ComponentFixture<EvaluateAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [EvaluateAreaChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
