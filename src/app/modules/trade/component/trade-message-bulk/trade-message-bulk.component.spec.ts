import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeMessageBulkComponent } from './trade-message-bulk.component';

describe('TradeMessageBulkComponent', () => {
  let component: TradeMessageBulkComponent;
  let fixture: ComponentFixture<TradeMessageBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeMessageBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeMessageBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
