import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketItemSearchFilterTypeComponent } from './market-item-search-filter-type.component';

describe('MarketItemSearchFilterTypeComponent', () => {
  let component: MarketItemSearchFilterTypeComponent;
  let fixture: ComponentFixture<MarketItemSearchFilterTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketItemSearchFilterTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketItemSearchFilterTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
