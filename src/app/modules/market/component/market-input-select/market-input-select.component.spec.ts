import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarketInputSelectComponent } from './market-input-select.component';


describe('MarketInputSelectComponent', () => {
  let component: MarketInputSelectComponent;
  let fixture: ComponentFixture<MarketInputSelectComponent>;

  beforeEach(waitForAsync(() => {
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
