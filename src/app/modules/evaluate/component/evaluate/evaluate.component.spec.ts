import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { EvaluateComponent } from './evaluate.component';
import { EvaluateAreaChartComponent } from '../evaluate-area-chart/evaluate-area-chart.component';


describe('EvaluateComponent', () => {
  let component: EvaluateComponent;
  let fixture: ComponentFixture<EvaluateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [EvaluateComponent, EvaluateAreaChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
