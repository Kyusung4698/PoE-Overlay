import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarketInputBooleanComponent } from './market-input-boolean.component';


describe('MarketBooleanInputComponent', () => {
  let component: MarketInputBooleanComponent;
  let fixture: ComponentFixture<MarketInputBooleanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarketInputBooleanComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketInputBooleanComponent);
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
