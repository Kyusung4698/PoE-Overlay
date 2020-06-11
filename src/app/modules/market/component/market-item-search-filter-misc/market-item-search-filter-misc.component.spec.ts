import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketItemSearchFilterMiscComponent } from './market-item-search-filter-misc.component';

describe('MarketItemSearchFilterMiscComponent', () => {
  let component: MarketItemSearchFilterMiscComponent;
  let fixture: ComponentFixture<MarketItemSearchFilterMiscComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketItemSearchFilterMiscComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketItemSearchFilterMiscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
