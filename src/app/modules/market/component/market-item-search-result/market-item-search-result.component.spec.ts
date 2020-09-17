import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MarketItemSearchResultComponent } from './market-item-search-result.component';

describe('MarketItemSearchResultComponent', () => {
  let component: MarketItemSearchResultComponent;
  let fixture: ComponentFixture<MarketItemSearchResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketItemSearchResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketItemSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
