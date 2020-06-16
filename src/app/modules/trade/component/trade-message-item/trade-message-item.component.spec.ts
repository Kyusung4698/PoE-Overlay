import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeMessageItemComponent } from './trade-message-item.component';

describe('TradeMessageItemComponent', () => {
  let component: TradeMessageItemComponent;
  let fixture: ComponentFixture<TradeMessageItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeMessageItemComponent ]
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
