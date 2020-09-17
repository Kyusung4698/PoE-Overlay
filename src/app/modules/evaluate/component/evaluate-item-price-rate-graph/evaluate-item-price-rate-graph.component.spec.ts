import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EvaluateItemPriceRateGraphComponent } from './evaluate-item-price-rate-graph.component';


describe('EvaluateItemPriceRateGraphComponent', () => {
  let component: EvaluateItemPriceRateGraphComponent;
  let fixture: ComponentFixture<EvaluateItemPriceRateGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluateItemPriceRateGraphComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateItemPriceRateGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
