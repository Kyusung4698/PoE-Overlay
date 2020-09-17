import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarketTabGroupComponent } from './market-tab-group.component';


describe('MarketTabGroupComponent', () => {
  let component: MarketTabGroupComponent;
  let fixture: ComponentFixture<MarketTabGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarketTabGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketTabGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
