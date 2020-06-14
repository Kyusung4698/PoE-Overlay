import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketInfiniteScrollComponent } from './market-infinite-scroll.component';

describe('MarketInfiniteScrollComponent', () => {
  let component: MarketInfiniteScrollComponent;
  let fixture: ComponentFixture<MarketInfiniteScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketInfiniteScrollComponent ]
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
