import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarketItemSearchFilterTypeComponent } from './market-item-search-filter-type.component';


describe('MarketItemSearchFilterTypeComponent', () => {
  let component: MarketItemSearchFilterTypeComponent;
  let fixture: ComponentFixture<MarketItemSearchFilterTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarketItemSearchFilterTypeComponent]
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
