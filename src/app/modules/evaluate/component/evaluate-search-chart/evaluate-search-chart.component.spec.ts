import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { EvaluateSearchChartComponent } from './evaluate-search-chart.component';


describe('EvaluateSearchChartComponent', () => {
  let component: EvaluateSearchChartComponent;
  let fixture: ComponentFixture<EvaluateSearchChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [EvaluateSearchChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateSearchChartComponent);
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
