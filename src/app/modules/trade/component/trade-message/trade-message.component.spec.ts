import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeMessageComponent } from './trade-message.component';

describe('TradeMessageComponent', () => {
  let component: TradeMessageComponent;
  let fixture: ComponentFixture<TradeMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
