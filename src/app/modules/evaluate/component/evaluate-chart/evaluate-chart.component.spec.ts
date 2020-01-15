import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { EvaluateChartComponent } from './evaluate-chart.component';


describe('EvaluateChartComponent', () => {
  let component: EvaluateChartComponent;
  let fixture: ComponentFixture<EvaluateChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [EvaluateChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateChartComponent);
    component = fixture.componentInstance;
    component.result = {
      url: '',
      items: [],
      total: 0
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
