import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeMessageMapTierComponent } from './trade-message-map-tier.component';

describe('TradeMessageMapTierComponent', () => {
  let component: TradeMessageMapTierComponent;
  let fixture: ComponentFixture<TradeMessageMapTierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeMessageMapTierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeMessageMapTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
