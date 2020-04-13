import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatePricePredictionComponent } from './evaluate-price-prediction.component';

describe('EvaluatePricePredictionComponent', () => {
  let component: EvaluatePricePredictionComponent;
  let fixture: ComponentFixture<EvaluatePricePredictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluatePricePredictionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluatePricePredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
