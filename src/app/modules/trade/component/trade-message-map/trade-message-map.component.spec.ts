import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeMessageMapComponent } from './trade-message-map.component';

describe('TradeMessageMapComponent', () => {
  let component: TradeMessageMapComponent;
  let fixture: ComponentFixture<TradeMessageMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeMessageMapComponent ]
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
