import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeMessagesComponent } from './trade-messages.component';

describe('TradeMessagesComponent', () => {
  let component: TradeMessagesComponent;
  let fixture: ComponentFixture<TradeMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
