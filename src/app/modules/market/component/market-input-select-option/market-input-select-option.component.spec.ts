import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketInputSelectOptionComponent } from './market-input-select-option.component';


describe('MarketInputSelectOptionComponent', () => {
  let component: MarketInputSelectOptionComponent;
  let fixture: ComponentFixture<MarketInputSelectOptionComponent>;

  beforeEach(async(() => {
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
