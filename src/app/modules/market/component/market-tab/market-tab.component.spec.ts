import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarketTabComponent } from './market-tab.component';


describe('MarketTabComponent', () => {
  let component: MarketTabComponent;
  let fixture: ComponentFixture<MarketTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarketTabComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
