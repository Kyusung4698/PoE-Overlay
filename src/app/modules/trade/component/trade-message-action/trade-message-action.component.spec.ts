import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeMessageActionComponent } from './trade-message-action.component';

describe('TradeMessageActionComponent', () => {
  let component: TradeMessageActionComponent;
  let fixture: ComponentFixture<TradeMessageActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeMessageActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeMessageActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
