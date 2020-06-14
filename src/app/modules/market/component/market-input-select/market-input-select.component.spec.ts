import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketInputSelectComponent } from './market-input-select.component';


describe('MarketInputSelectComponent', () => {
  let component: MarketInputSelectComponent;
  let fixture: ComponentFixture<MarketInputSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketInputSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketInputSelectComponent);
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
