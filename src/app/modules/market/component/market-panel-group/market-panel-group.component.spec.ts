import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarketPanelGroupComponent } from './market-panel-group.component';


describe('MarketPanelGroupComponent', () => {
  let component: MarketPanelGroupComponent;
  let fixture: ComponentFixture<MarketPanelGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarketPanelGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPanelGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
