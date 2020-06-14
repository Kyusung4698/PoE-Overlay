import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketItemSearchFilterTradeComponent } from './market-item-search-filter-trade.component';

describe('MarketItemSearchFilterTradeComponent', () => {
  let component: MarketItemSearchFilterTradeComponent;
  let fixture: ComponentFixture<MarketItemSearchFilterTradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketItemSearchFilterTradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketItemSearchFilterTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
