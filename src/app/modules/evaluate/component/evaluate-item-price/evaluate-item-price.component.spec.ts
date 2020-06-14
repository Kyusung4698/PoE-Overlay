import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateItemPriceComponent } from './evaluate-item-price.component';

describe('EvaluateItemPriceComponent', () => {
  let component: EvaluateItemPriceComponent;
  let fixture: ComponentFixture<EvaluateItemPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateItemPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateItemPriceComponent);
    component = fixture.componentInstance;
    component.item = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
