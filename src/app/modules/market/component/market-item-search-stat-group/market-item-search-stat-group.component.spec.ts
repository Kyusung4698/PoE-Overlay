import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarketItemSearchStatGroupComponent } from './market-item-search-stat-group.component';


describe('MarketItemSearchStatGroupComponent', () => {
  let component: MarketItemSearchStatGroupComponent;
  let fixture: ComponentFixture<MarketItemSearchStatGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarketItemSearchStatGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketItemSearchStatGroupComponent);
    component = fixture.componentInstance;
    component.request = {
      query: {

      },
      sort: {

      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
