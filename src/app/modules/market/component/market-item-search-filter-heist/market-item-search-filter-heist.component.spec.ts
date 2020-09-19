import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketItemSearchFilterHeistComponent } from './market-item-search-filter-heist.component';

describe('MarketItemSearchFilterHeistComponent', () => {
  let component: MarketItemSearchFilterHeistComponent;
  let fixture: ComponentFixture<MarketItemSearchFilterHeistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketItemSearchFilterHeistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketItemSearchFilterHeistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
