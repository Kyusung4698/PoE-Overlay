import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarketInputSelectOptionComponent } from './market-input-select-option.component';


describe('MarketInputSelectOptionComponent', () => {
  let component: MarketInputSelectOptionComponent;
  let fixture: ComponentFixture<MarketInputSelectOptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarketInputSelectOptionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketInputSelectOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
