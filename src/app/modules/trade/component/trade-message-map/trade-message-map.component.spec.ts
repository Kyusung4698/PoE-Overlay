import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TradeMessageMapComponent } from './trade-message-map.component';


describe('TradeMessageMapComponent', () => {
  let component: TradeMessageMapComponent;
  let fixture: ComponentFixture<TradeMessageMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TradeMessageMapComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeMessageMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
