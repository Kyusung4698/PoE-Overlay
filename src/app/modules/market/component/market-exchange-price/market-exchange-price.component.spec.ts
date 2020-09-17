import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarketExchangePriceComponent } from './market-exchange-price.component';


describe('MarketExchangePriceComponent', () => {
  let component: MarketExchangePriceComponent;
  let fixture: ComponentFixture<MarketExchangePriceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarketExchangePriceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketExchangePriceComponent);
    component = fixture.componentInstance;
    component.price = {
      item: {
        stock: 1,
        amount: 1,
        currency: ''
      },
      exchange: {
        amount: 1,
        currency: ''
      },
      amount: 1
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
