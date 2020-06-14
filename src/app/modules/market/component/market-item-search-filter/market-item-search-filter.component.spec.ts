import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketItemSearchFilterComponent } from './market-item-search-filter.component';


describe('MarketItemSearchFilterComponent', () => {
  let component: MarketItemSearchFilterComponent;
  let fixture: ComponentFixture<MarketItemSearchFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketItemSearchFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketItemSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
