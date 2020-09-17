import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarketInfiniteScrollComponent } from './market-infinite-scroll.component';


describe('MarketInfiniteScrollComponent', () => {
  let component: MarketInfiniteScrollComponent;
  let fixture: ComponentFixture<MarketInfiniteScrollComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarketInfiniteScrollComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketInfiniteScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
