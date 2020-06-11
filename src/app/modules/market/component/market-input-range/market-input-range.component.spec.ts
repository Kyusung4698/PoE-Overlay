import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketInputRangeComponent } from './market-input-range.component';


describe('MarketInputRangeComponent', () => {
  let component: MarketInputRangeComponent;
  let fixture: ComponentFixture<MarketInputRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketInputRangeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketInputRangeComponent);
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
