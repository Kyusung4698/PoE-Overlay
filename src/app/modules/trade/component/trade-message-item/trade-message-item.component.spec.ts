import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TradeMessageItemComponent } from './trade-message-item.component';


describe('TradeMessageItemComponent', () => {
  let component: TradeMessageItemComponent;
  let fixture: ComponentFixture<TradeMessageItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TradeMessageItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeMessageItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
